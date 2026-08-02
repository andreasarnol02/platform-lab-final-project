import { useCallback, useEffect, useState } from "react";
import client from "../api/client";
import SellerIcon from "../components/SellerIcon";
import StatusBadge from "../components/StatusBadge";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { formatIDR, formatDate } from "../utils/format";

const TRANSITION_PRESENTATION = {
  PAID: { label: "Tandai Dibayar", tone: "primary" },
  PROCESSED: { label: "Tandai Diproses", tone: "primary" },
  SHIPPED: { label: "Tandai Dikirim", tone: "primary" },
  COMPLETED: { label: "Tandai Selesai", tone: "primary" },
  CANCELLED: { label: "Batalkan", tone: "danger" },
};

const getTransitionActions = (allowedTransitions) =>
  (Array.isArray(allowedTransitions) ? allowedTransitions : [])
    .filter(Boolean)
    .map((status) => {
      const normalizedStatus = String(status).toUpperCase();
      return {
        status: normalizedStatus,
        label: TRANSITION_PRESENTATION[normalizedStatus]?.label || normalizedStatus,
        tone: TRANSITION_PRESENTATION[normalizedStatus]?.tone || "primary",
      };
    });

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/seller/orders")
      .then(({ data }) => setOrders(data.data))
      .catch(() => setError("Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [load]);

  const handleStatus = async (order, nextStatus) => {
    try {
      await client.put(`/seller/orders/${order._id}/status`, {
        status: nextStatus,
      });
      setNotice(
        `Pesanan #${order._id.slice(-8).toUpperCase()} diperbarui.`
      );
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="orders-page">
      <div className="page-head">
        <h1>Pesanan Masuk</h1>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}

      {orders.length === 0 ? (
        <EmptyState
          icon={<SellerIcon name="orders" size={32} />}
          title="Belum ada pesanan"
          message="Pesanan untuk produkmu akan muncul di sini."
        />
      ) : (
        <div className="seller-order-list">
          {orders.map((order) => {
            const actions = getTransitionActions(order.allowedTransitions);
            return (
              <div className="seller-order" key={order._id}>
                <div className="seller-order-head">
                  <div>
                    <strong>
                      #{order._id.slice(-8).toUpperCase()}
                    </strong>
                    <span className="muted">
                      {" "}
                      · {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="seller-order-info">
                  <p className="muted">
                    {order.customer?.name || "Pembeli"} ·{" "}
                    {order.customer?.email || ""}
                  </p>
                  <p className="muted">{order.shippingAddress}</p>
                  <p className="muted">{order.paymentMethod}</p>
                </div>

                <div className="seller-order-items">
                  {order.items.map((item) => (
                    <div className="seller-order-line" key={item._id}>
                      <span className="muted">
                        {item.name || item.product?.name || "Produk"}
                      </span>
                      <span>
                        {item.quantity} × {formatIDR(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="seller-order-foot">
                  <strong>Total: {formatIDR(order.totalPrice)}</strong>
                  {actions.length > 0 && (
                    <div className="cell-actions">
                      {actions.map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          className={`btn btn-sm ${
                            action.tone === "danger"
                              ? "btn-ghost text-danger"
                              : "btn-primary"
                          }`}
                          onClick={() => handleStatus(order, action.status)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
