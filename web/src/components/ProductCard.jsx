import { Link } from "react-router";
import { formatIDR } from "../utils/format";
import MarketplaceIcon from "./MarketplaceIcon";
import ProductImage from "./ProductImage";
import { getProductImage } from "../utils/product";

export default function ProductCard({ product }) {
  const image = getProductImage(product);

  return (
    <Link to={`/products/${product._id}`} className="product-card commerce-product-card">
      <div className="product-card-image commerce-product-image">
        <ProductImage src={image} alt={product.name} loading="lazy" />
        {product.stock <= 0 && (
          <span className="badge-out commerce-product-badge">Habis</span>
        )}
      </div>
      <div className="product-card-body commerce-product-body">
        <span className="commerce-product-category">{product.category || "Pilihan"}</span>
        <h3 className="product-card-name commerce-product-name">{product.name}</h3>
        <p className="product-card-price commerce-product-price">{formatIDR(product.price)}</p>
        <div className="commerce-product-meta">
          <span><MarketplaceIcon name="store" size={12} /> {product.seller?.storeName || "Toko"}</span>
          <span>{product.stock > 0 ? `${product.stock} stok` : "Habis"}</span>
        </div>
      </div>
    </Link>
  );
}
