import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import client from "../api/client";
import CategoryRow from "../components/CategoryRow";
import MarketplaceIcon from "../components/MarketplaceIcon";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { ErrorState, Spinner } from "../components/states";
import { formatIDR } from "../utils/format";
import { getProductImage } from "../utils/product";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/products")
      .then(({ data }) => setProducts(data.data))
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const featured = products.slice(0, 8);
  const heroProduct = products[0];

  return (
    <div className="commerce-home">
      <section className="commerce-hero">
        <div className="commerce-hero-copy">
          <span className="commerce-eyebrow">MARKETPLACE LOKAL</span>
          <h1>Temukan yang<br /><em>kamu butuhkan.</em></h1>
          <p>Jelajahi produk dari berbagai toko dan temukan barang yang cocok untukmu.</p>
          <div className="commerce-hero-actions">
            <Link to="/products" className="commerce-button commerce-button-dark">Mulai belanja <MarketplaceIcon name="arrowRight" size={16} /></Link>
            <Link to="/products" className="commerce-text-button">Lihat semua produk <MarketplaceIcon name="arrowRight" size={15} /></Link>
          </div>
          <div className="commerce-hero-proof">
            <span><strong>{products.length}</strong> produk tersedia</span>
            <span><strong>IDR</strong> harga ditampilkan dalam rupiah</span>
          </div>
        </div>
        <div className="commerce-hero-visual">
          {heroProduct ? (
            <div className="commerce-hero-product-card">
              <div className="commerce-hero-product-image">
                <ProductImage src={getProductImage(heroProduct)} alt={heroProduct.name} />
              </div>
              <div className="commerce-hero-product-label">
                <span>{heroProduct.category || "Produk"}</span>
                <strong>{heroProduct.name}</strong>
                <div>
                  <small>{formatIDR(heroProduct.price)}</small>
                  <small>{heroProduct.seller?.storeName || "Toko marketplace"}</small>
                </div>
              </div>
            </div>
          ) : (
            <div className="commerce-hero-empty"><MarketplaceIcon name="bag" size={46} /></div>
          )}
        </div>
      </section>

      <section className="commerce-category-panel">
        <div className="commerce-section-label"><span>KATEGORI PILIHAN</span><Link to="/products">Lihat semua <MarketplaceIcon name="arrowRight" size={14} /></Link></div>
        <CategoryRow />
      </section>

      <section className="commerce-products-section">
        <div className="commerce-section-heading">
          <div><span className="commerce-eyebrow">DIPILIH UNTUKMU</span><h2>Temukan yang kamu suka</h2></div>
          <Link to="/products" className="commerce-heading-link">Lihat semua <MarketplaceIcon name="arrowRight" size={15} /></Link>
        </div>
        {featured.length === 0 ? <p className="muted">Belum ada produk.</p> : <div className="commerce-product-grid">{featured.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>

      {products.length > 0 && (
        <section className="commerce-seller-banner">
          <div><span className="commerce-eyebrow"><MarketplaceIcon name="store" size={14} /> UNTUK PEMILIK USAHA</span><h2>Punya produk untuk dijual?</h2><p>Jadikan marketplace ini rumah baru untuk tokomu.</p></div>
          <a href="/seller/register" className="commerce-button commerce-button-light">Buka toko gratis <MarketplaceIcon name="arrowRight" size={16} /></a>
        </section>
      )}

      <section className="commerce-info-row">
        <div><span className="commerce-info-icon"><MarketplaceIcon name="store" size={19} /></span><span><strong>Berbagai toko</strong><small>Lihat penjual di setiap produk</small></span></div>
        <div><span className="commerce-info-icon"><MarketplaceIcon name="tag" size={19} /></span><span><strong>Harga dalam IDR</strong><small>Harga tampil dalam rupiah</small></span></div>
        <div><span className="commerce-info-icon"><MarketplaceIcon name="package" size={19} /></span><span><strong>Pesanan per toko</strong><small>Checkout dipisah berdasarkan penjual</small></span></div>
      </section>
    </div>
  );
}
