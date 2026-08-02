import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import SellerIcon from "./SellerIcon";

const NAV = [
  { to: "/seller/dashboard", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/seller/products", label: "Produk Saya", icon: "products" },
  { to: "/seller/orders", label: "Pesanan Masuk", icon: "orders" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  return (
    <div className="seller-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="seller-brand-mark">m</span>
          market<span className="brand-accent">place</span>
          <small>Seller</small>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <SellerIcon name={item.icon} size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <strong>{user?.storeName}</strong>
            <span>{user?.ownerName}</span>
            <small>{user?.email}</small>
          </div>
          <button type="button" className="btn btn-ghost btn-sm btn-block sidebar-logout" onClick={handleLogout}>
            <SellerIcon name="logout" size={16} />
            Keluar
          </button>
        </div>
      </aside>

      <main className="seller-main">
        <Outlet />
      </main>
    </div>
  );
}
