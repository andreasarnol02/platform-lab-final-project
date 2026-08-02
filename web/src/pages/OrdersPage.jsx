import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import client from "../api/client";
import MarketplaceIcon from "../components/MarketplaceIcon";
import StatusBadge from "../components/StatusBadge";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { formatIDR, formatDate } from "../utils/format";

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice] = useState(location.state?.success || "");

  useEffect(() => {
    client
      .get("/orders")
      .then(({ data }) => setOrders(data.data))
      .catch(() => setError("Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="orders-page">
      <h1>Riwayat Pesanan</h1>

      {notice && <div className="alert alert-success">{notice}</div>}

      {orders.length === 0 ? (
        <EmptyState
          icon={<MarketplaceIcon name="bag" size={32} />}
          title="Belum ada pesanan"
          message="Pesanan yang kamu buat akan muncul di sini."
        >
          <Link to="/products" className="btn btn-primary">
            Mulai Belanja
          </Link>
        </EmptyState>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <Link to={`/orders/${order._id}`} className="order-card" key={order._id}>
              <div className="order-card-head">
                <div>
                  <p className="order-id">
                    Invoice #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="order-card-items">
                {order.items.map((item) => (
                  <span key={item._id}>
                    {item.name || item.product?.name || "Produk"} × {item.quantity}
                  </span>
                ))}
              </div>
              <div className="order-card-foot">
                <span>{order.paymentMethod}</span>
                <strong>{formatIDR(order.totalPrice)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
