import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MarketplaceIcon from "../components/MarketplaceIcon";
import { EmptyState, Spinner } from "../components/states";
import { formatIDR } from "../utils/format";
import ProductImage from "../components/ProductImage";
import { getProductImage } from "../utils/product";

export default function CartPage() {
  const { items, loading, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<MarketplaceIcon name="bag" size={32} />}
        title="Keranjangmu kosong"
        message="Yuk tambahkan produk favoritmu."
      >
        <Link to="/products" className="btn btn-primary">
          Mulai Belanja
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        <h1>Keranjang ({items.length} produk)</h1>
        {items.map((item) => {
          const product = item.product;
          const image = getProductImage(product);
          const max = product.stock;
          return (
            <div className="cart-item" key={product._id}>
              <div className="cart-item-img">
                <ProductImage src={image} alt={product.name} />
              </div>
              <div className="cart-item-info">
                <Link to={`/products/${product._id}`} className="cart-item-name">
                  {product.name}
                </Link>
                <p className="cart-item-store">
                  {product.seller?.storeName || "Toko"}
                </p>
                <p className="cart-item-price">{formatIDR(product.price)}</p>
                {max <= 0 && <p className="muted">Stok habis — hapus dari keranjang</p>}
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(product._id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(product._id, Math.min(max, item.quantity + 1))
                    }
                    disabled={item.quantity >= max}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-ghost btn-sm text-danger"
                  onClick={() => removeItem(product._id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="cart-summary">
        <h2>Ringkasan</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatIDR(totalPrice)}</strong>
        </div>
        <p className="muted">Ongkir dihitung di langkah berikutnya (flat).</p>
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={() => navigate("/checkout")}
        >
          Lanjut ke Pembayaran
        </button>
        <Link to="/products" className="btn btn-ghost btn-block">
          Lanjut Belanja
        </Link>
      </aside>
    </div>
  );
}
