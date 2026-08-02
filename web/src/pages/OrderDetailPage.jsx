import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import client from "../api/client";
import MarketplaceIcon from "../components/MarketplaceIcon";
import StatusBadge from "../components/StatusBadge";
import { Spinner, ErrorState } from "../components/states";
import { formatIDR, formatDate } from "../utils/format";
import ProductImage from "../components/ProductImage";
import { getProductImage } from "../utils/product";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setError("Pesanan tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="order-detail">
      <Link to="/orders" className="link-more commerce-back-link">
        <MarketplaceIcon name="arrowRight" size={15} /> Kembali ke pesanan
      </Link>

      <div className="order-detail-head">
        <div>
          <h1>Invoice #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="muted">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="order-detail-grid">
        <div className="panel">
          <h3>Item Pesanan</h3>
          <div className="order-lines">
            {order.items.map((item) => (
              <div className="order-line" key={item._id}>
                <div className="order-line-img">
                  <ProductImage
                    src={getProductImage(item.product)}
                    alt={item.name || item.product?.name || "Produk"}
                  />
                </div>
                <div className="order-line-info">
                   <p>{item.name || item.product?.name || "Produk"}</p>
                  <span className="muted">
                     {formatIDR(item.price)} × {item.quantity}
                  </span>
                </div>
                <strong>{formatIDR(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatIDR(order.totalPrice)}</strong>
          </div>
        </div>

        <div className="panel">
          <h3>Detail Pengiriman</h3>
          <p className="muted">{order.shippingAddress}</p>

          <h3 className="mt">Pembayaran</h3>
          <p className="muted">{order.paymentMethod}</p>

          <h3 className="mt">Status</h3>
          <StatusBadge status={order.status} />
        </div>
      </div>
    </div>
  );
}
