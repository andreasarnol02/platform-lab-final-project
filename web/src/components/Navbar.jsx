import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MarketplaceIcon from "./MarketplaceIcon";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
  };

  return (
    <header className="navbar commerce-navbar">
      <div className="commerce-ribbon">
        <div className="container commerce-ribbon-inner">
          <span><MarketplaceIcon name="store" size={13} /> Temukan produk dari berbagai toko</span>
          <span className="commerce-ribbon-right">Marketplace lokal <i>&middot;</i> Pusat bantuan</span>
        </div>
      </div>
      <div className="navbar-inner container commerce-navbar-main">
        <Link to="/" className="navbar-brand commerce-brand">
          <span className="commerce-brand-mark">m</span>
          <span>market<span className="brand-accent">place</span></span>
        </Link>

        <form className="commerce-search" onSubmit={handleSearch}>
          <MarketplaceIcon name="search" size={20} />
          <input
            type="search"
            placeholder="Cari laptop, sneakers, kopi..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari produk"
          />
          <kbd>Cmd K</kbd>
        </form>

        <div className="navbar-actions commerce-navbar-actions">
          <Link to="/cart" className="cart-link commerce-cart-link" aria-label="Keranjang">
            <MarketplaceIcon name="bag" size={22} />
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>

          {user ? (
            <div className="navbar-user commerce-user">
              <Link to="/profile" className="commerce-user-link">
                <span className="commerce-avatar">{user.name?.[0] || "A"}</span>
                <span>{user.name?.split(" ")[0] || user.email}</span>
                <MarketplaceIcon name="chevron" size={14} />
              </Link>
              <Link to="/orders" className="commerce-order-link">Pesanan</Link>
              <button className="commerce-logout" onClick={handleLogout}>Keluar</button>
            </div>
          ) : (
            <div className="navbar-user commerce-auth-links">
              <Link to="/login">Masuk</Link>
              <Link to="/register" className="commerce-auth-cta">Daftar</Link>
            </div>
          )}
        </div>
      </div>
      <nav className="container commerce-subnav">
        <div>
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/products">Semua produk</NavLink>
          <NavLink to="/products?category=Elektronik">Elektronik</NavLink>
          <NavLink to="/products?category=Fashion">Fashion</NavLink>
          <NavLink to="/products?category=Makanan">Makanan</NavLink>
        </div>
        <a href="/seller/register">
          <MarketplaceIcon name="store" size={16} /> Buka toko gratis <MarketplaceIcon name="arrowRight" size={15} />
        </a>
      </nav>
    </header>
  );
}
