import { useState } from "react";
import { useNavigate } from "react-router";
import client from "../api/client";
import { useCart } from "../context/CartContext";
import MarketplaceIcon from "../components/MarketplaceIcon";
import { formatIDR } from "../utils/format";
import { trackEvent } from "../utils/analytics";

export default function CheckoutPage() {
  const { items, totalPrice, clearLocal } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingAddress: "",
    paymentMethod: "Transfer",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="state-box">
        <div className="state-icon"><MarketplaceIcon name="bag" size={32} /></div>
        <h3>Keranjang kosong</h3>
        <p>Tidak ada item untuk di-checkout.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/products")}>
          Mulai Belanja
        </button>
      </div>
    );
  }

  const groups = items.reduce((acc, item) => {
    const store = item.product.seller?.storeName || "Toko";
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await client.post("/orders", form);
      clearLocal();
      const count = Array.isArray(data.data) ? data.data.length : 1;
      trackEvent("checkout_completed", {
        currency: "IDR",
        value: totalPrice,
        order_count: count,
      });
      navigate("/orders", {
        state: {
          success: `Pesanan berhasil dibuat (${count} invoice per toko).`,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Checkout gagal. Coba lagi.");
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h1>Checkout</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Alamat pengiriman *</span>
          <textarea
            name="shippingAddress"
            rows={3}
            required
            placeholder="Nama, jalan, kota, kode pos"
            value={form.shippingAddress}
            onChange={(e) =>
              setForm({ ...form, shippingAddress: e.target.value })
            }
          />
        </label>

        <div className="field">
          <span>Metode pembayaran</span>
          <div className="radio-group">
            <label className="radio-card">
              <input
                type="radio"
                name="paymentMethod"
                value="Transfer"
                checked={form.paymentMethod === "Transfer"}
                onChange={() =>
                  setForm({ ...form, paymentMethod: "Transfer" })
                }
              />
              <span><MarketplaceIcon name="shield" size={17} /> Transfer Bank</span>
            </label>
            <label className="radio-card">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={form.paymentMethod === "COD"}
                onChange={() => setForm({ ...form, paymentMethod: "COD" })}
              />
              <span><MarketplaceIcon name="store" size={17} /> COD (Bayar di tempat)</span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
          {submitting
            ? "Memproses pesanan..."
            : `Bayar ${formatIDR(totalPrice)}`}
        </button>
      </form>

      <aside className="cart-summary">
        <h2>Rincian Pesanan</h2>
        {Object.entries(groups).map(([store, storeItems]) => (
          <div className="checkout-group" key={store}>
            <h3>{store}</h3>
            {storeItems.map((item) => (
              <div className="summary-row" key={item.product._id}>
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  {formatIDR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="summary-row total">
          <span>Total</span>
          <strong>{formatIDR(totalPrice)}</strong>
        </div>
        <p className="muted">
          Simulasi pembayaran — tidak ada uang sungguhan yang dipindahkan.
        </p>
      </aside>
    </div>
  );
}
