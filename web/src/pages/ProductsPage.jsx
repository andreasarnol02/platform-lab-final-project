import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import client from "../api/client";
import MarketplaceIcon from "../components/MarketplaceIcon";
import ProductCard from "../components/ProductCard";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { CATEGORIES } from "../components/CategoryRow";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/products", { params: { search: search || undefined, category: category || undefined } })
      .then(({ data }) => {
        setProducts(data.data);
        setPagination(data.pagination || null);
      })
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = CATEGORIES.map(({ label }) => label);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  return (
    <div className="catalog commerce-catalog">
      <div className="commerce-page-heading">
        <div>
          <span className="commerce-eyebrow"><MarketplaceIcon name="grid" size={14} /> KATALOG MARKETPLACE</span>
          <h1>Temukan yang kamu suka</h1>
          <p>Jelajahi produk dari berbagai toko.</p>
        </div>
           {!loading && <span className="commerce-result-count">{pagination?.total ?? products.length} produk</span>}
      </div>

      <div className="catalog-toolbar commerce-catalog-toolbar">
        <div className="commerce-filter-summary">
          <span>
            {search ? <>Hasil pencarian untuk <strong>"{search}"</strong></> : category ? <>Kategori <strong>{category}</strong></> : "Semua produk"}
          </span>
          {(search || category) && (
             <button className="commerce-clear-filter" type="button" onClick={clearFilters}>
              Hapus filter
            </button>
          )}
        </div>
      </div>

      <div className="catalog-body">
        <aside className="filter-side">
          <h3>Kategori</h3>
          <button
            type="button"
            className={`filter-chip ${category === "" ? "active" : ""}`}
            onClick={() => setParam("category", "")}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${category === cat ? "active" : ""}`}
              onClick={() => setParam("category", cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <div className="catalog-results">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<MarketplaceIcon name="search" size={30} />}
              title="Produk tidak ditemukan"
              message="Coba kata kunci atau kategori lain."
            />
          ) : (
            <div className="product-grid commerce-product-grid">
               {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
