import { Link } from "react-router";
import MarketplaceIcon from "../components/MarketplaceIcon";

export default function NotFoundPage() {
  return (
    <div className="state-box">
      <div className="state-icon"><MarketplaceIcon name="map" size={36} /></div>
      <h3>Halaman tidak ditemukan</h3>
      <p>Halaman yang kamu cari tidak ada.</p>
      <Link to="/" className="btn btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
