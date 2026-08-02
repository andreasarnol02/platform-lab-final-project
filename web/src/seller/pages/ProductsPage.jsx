import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import client from "../api/client";
import SellerIcon from "../components/SellerIcon";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { formatIDR } from "../utils/format";
import ProductImage from "../../components/ProductImage";
import { getProductImage } from "../../utils/product";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/seller/products")
      .then(({ data }) => setProducts(data.data))
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    try {
      await client.delete(`/products/${product._id}`);
      setNotice("Produk dihapus.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus produk.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="products-page">
      <div className="page-head">
        <h1>Produk Saya</h1>
        <Link to="/seller/products/new" className="btn btn-primary">
          <SellerIcon name="plus" size={16} /> Tambah Produk
        </Link>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}

      {products.length === 0 ? (
        <EmptyState
          icon={<SellerIcon name="products" size={32} />}
          title="Belum ada produk"
          message="Tambahkan produk pertamamu agar tampil di storefront."
        >
          <Link to="/seller/products/new" className="btn btn-primary">
            <SellerIcon name="plus" size={16} /> Tambah Produk
          </Link>
        </EmptyState>
      ) : (
        <div className="seller-table">
          <div className="seller-table-row head">
            <span>Produk</span>
            <span>Kategori</span>
            <span>Harga</span>
            <span>Stok</span>
            <span>Aksi</span>
          </div>
          {products.map((product) => {
            const image = getProductImage(product);
            return (
              <div className="seller-table-row" key={product._id}>
                <span className="cell-product">
                  <ProductImage src={image} alt={product.name} placeholderClassName="cell-thumb" />
                  <span className="cell-name">
                    {product.name}
                    {!product.isActive && (
                      <span className="badge-offline">Nonaktif</span>
                    )}
                  </span>
                </span>
                <span>{product.category}</span>
                <span>{formatIDR(product.price)}</span>
                <span className={product.stock <= 0 ? "text-danger" : ""}>
                  {product.stock}
                </span>
                <span className="cell-actions">
                  <Link
                    to={`/seller/products/${product._id}/edit`}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-danger"
                    onClick={() => handleDelete(product)}
                  >
                    Hapus
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-16">
        <button type="button" className="link-more" onClick={() => navigate("/seller/dashboard")}>
          ← Kembali ke dashboard
        </button>
      </div>
    </div>
  );
}
