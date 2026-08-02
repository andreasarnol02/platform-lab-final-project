import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MarketplaceIcon from "../components/MarketplaceIcon";
import { Spinner, ErrorState } from "../components/states";
import Toast from "../components/Toast";
import ProductImage from "../components/ProductImage";
import { getProductImage } from "../utils/product";
import { trackEvent } from "../utils/analytics";
import { formatIDR } from "../utils/format";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setLoading(true);
    client
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setError("Produk tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    if (quantity > product.stock) {
      setNotice({ message: "Melebihi stok tersedia.", tone: "error" });
      return;
    }
    setAdding(true);
    setNotice(null);
    try {
      await addItem(product._id, quantity);
      trackEvent("add_to_cart", {
        currency: "IDR",
        value: product.price * quantity,
        items: [{ item_id: product._id, item_name: product.name, quantity }],
      });
      setNotice({ message: "Berhasil ditambahkan ke keranjang.", tone: "success" });
    } catch (err) {
      setNotice({
        message: err.response?.data?.message || "Gagal menambahkan.",
        tone: "error",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  const image = getProductImage(product);
  const outOfStock = product.stock <= 0;

  return (
    <div className="detail commerce-detail">
      <div className="detail-image commerce-detail-image">
        <ProductImage src={image} alt={product.name} placeholderClassName="img-placeholder large commerce-img-placeholder" />
      </div>

      <div className="detail-info">
        <nav className="breadcrumb">
          <Link to="/products">Katalog</Link>
          <span>/</span>
          <span>{product.category}</span>
        </nav>

        <h1>{product.name}</h1>
        <p className="detail-store">
          Dijual oleh <strong>{product.seller?.storeName || "Toko"}</strong>
        </p>

        <div className="commerce-seller-summary">
          <span className="commerce-seller-avatar">
            {(product.seller?.storeName || "T")[0].toUpperCase()}
          </span>
          <span>
            <small>Informasi toko</small>
            <strong>{product.seller?.storeName || "Toko"}</strong>
            <em>{product.seller?.ownerName ? `Pemilik: ${product.seller.ownerName}` : "Seller marketplace"}</em>
          </span>
        </div>

        <div className="detail-price">{formatIDR(product.price)}</div>

        <section className="commerce-detail-description">
          <h2>Deskripsi produk</h2>
          <p className="detail-desc">{product.description}</p>
        </section>

        <div className="detail-stock">
          {outOfStock ? (
            <span className="badge-out">Stok habis</span>
          ) : (
            <span className="badge-ok">
              Stok tersedia: {product.stock}
            </span>
          )}
        </div>

        {!outOfStock && (
          <div className="detail-buy">
            <span className="commerce-quantity-label">Jumlah</span>
            <div className="qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary btn-lg commerce-detail-cta"
              onClick={handleAddToCart}
              disabled={adding}
            >
              <MarketplaceIcon name="bag" size={18} />
              {adding ? "Menambahkan..." : "Tambah ke Keranjang"}
            </button>
          </div>
        )}

        <div className="commerce-detail-facts">
          <div><span>Kategori</span><strong>{product.category}</strong></div>
          <div><span>Ketersediaan</span><strong>{outOfStock ? "Stok habis" : `${product.stock} unit`}</strong></div>
          <div><span>Penjual</span><strong>{product.seller?.ownerName || "Seller marketplace"}</strong></div>
        </div>

        <div className="commerce-assurance-row">
          <span><MarketplaceIcon name="shield" size={16} /> Pembayaran aman</span>
          <span><MarketplaceIcon name="store" size={16} /> Stok real-time</span>
        </div>

        {!user && (
          <p className="muted">
            <Link to={`/login?redirect=/products/${id}`}>Masuk</Link> dulu
            untuk menambahkan ke keranjang.
          </p>
        )}
      </div>
      {notice && <Toast {...notice} onClose={() => setNotice(null)} />}
    </div>
  );
}
