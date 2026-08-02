import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
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
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Pendaftaran gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Daftar sebagai Pembeli</h1>
        <p className="auth-sub">Buat akun untuk mulai berbelanja.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Nama lengkap</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Nama kamu"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="nama@email.com"
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

        <label className="field">
          <span>Alamat (opsional)</span>
          <textarea
            name="address"
            rows={2}
            placeholder="Alamat pengiriman"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Memproses..." : "Daftar"}
        </button>

        <p className="auth-alt">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
        <p className="auth-alt">
          Ingin menjual?{" "}
          <a href="/seller/register">
            Daftar sebagai Seller
          </a>
        </p>
      </form>
    </div>
  );
}
