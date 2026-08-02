import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/seller/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <span className="seller-brand-mark">m</span>
          marketplace <span className="brand-accent">seller</span>
        </div>
        <h1>Masuk ke Toko</h1>
        <p className="auth-sub">Kelola produk dan pesanan tokomu.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="toko@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Memproses..." : "Masuk"}
        </button>

        <p className="auth-alt">
          Belum punya toko? <Link to="/seller/register">Daftar sebagai seller</Link>
        </p>
        <p className="auth-alt">
          Ingin berbelanja?{" "}
          <a href="/">
            Kunjungi storefront
          </a>
        </p>
      </form>
    </div>
  );
}
