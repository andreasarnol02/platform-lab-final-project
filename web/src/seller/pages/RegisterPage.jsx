import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate("/seller/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Pendaftaran gagal. Coba lagi.");
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
        <h1>Buka Toko Gratis</h1>
        <p className="auth-sub">Mulai jualan di marketplace kami.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Nama toko</span>
          <input
            type="text"
            name="storeName"
            required
            placeholder="Toko Andaku"
            value={form.storeName}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Nama pemilik</span>
          <input
            type="text"
            name="ownerName"
            required
            placeholder="Nama kamu"
            value={form.ownerName}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
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
            minLength={6}
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>No. HP (opsional)</span>
          <input
            type="tel"
            name="phone"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Memproses..." : "Daftar"}
        </button>

        <p className="auth-alt">
          Sudah punya toko? <Link to="/seller/login">Masuk</Link>
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
