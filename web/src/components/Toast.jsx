import { useEffect } from "react";
import MarketplaceIcon from "./MarketplaceIcon";

export default function Toast({ message, tone = "success", onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`commerce-toast commerce-toast-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <span className="commerce-toast-icon"><MarketplaceIcon name={tone === "error" ? "spark" : "shield"} size={17} /></span>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Tutup notifikasi">&times;</button>
    </div>
  );
}
