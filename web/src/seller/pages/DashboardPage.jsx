import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import client from "../api/client";
import StatusBadge from "../components/StatusBadge";
import SellerIcon from "../components/SellerIcon";
import { Spinner, ErrorState } from "../components/states";
import { formatIDR, formatDate } from "../utils/format";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([client.get("/seller/products"), client.get("/seller/orders")])
      .then(([p, o]) => {
        setProducts(p.data.data);
        setOrders(o.data.data);
      })
      .catch(() => setError("Gagal memuat dashboard."))
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

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const listedProducts = products.filter((product) => product.isActive);
  const outOfStock = listedProducts.filter((product) => product.stock <= 0).length;
  const activeRevenue = orders
    .filter((o) => String(o.status || "").toUpperCase() !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = orders.filter((o) =>
    ["PENDING", "PAID"].includes(String(o.status || "").toUpperCase())
  ).length;

  const stats = [
    { label: "Produk Terdaftar", value: listedProducts.length, icon: "products" },
    { label: "Stok Habis", value: outOfStock, icon: "warning" },
    { label: "Total Pesanan", value: orders.length, icon: "orders" },
    { label: "Pesanan Menunggu", value: pendingCount, icon: "clock" },
    { label: "Total Pendapatan", value: formatIDR(activeRevenue), icon: "money" },
  ];

  return (
    <div className="dashboard">
      <div className="page-head">
        <h1>Dashboard</h1>
          <Link to="/seller/products/new" className="btn btn-primary">
          <SellerIcon name="plus" size={16} /> Tambah Produk
        </Link>
      </div>

      <div className="stats-row">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-icon"><SellerIcon name={stat.icon} size={19} /></span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Pesanan Terbaru</h2>
          <Link to="/seller/orders" className="link-more">
            Lihat semua →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="muted">Belum ada pesanan masuk.</p>
        ) : (
          <div className="mini-order-list">
            {orders.slice(0, 5).map((order) => (
              <div className="mini-order" key={order._id}>
                <div>
                  <strong>
                    {order.customer?.name || "Pembeli"} ·{" "}
                    {formatIDR(order.totalPrice)}
                  </strong>
                  <p className="muted">{formatDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
