const LABELS = {
  PENDING: "Menunggu",
  PAID: "Dibayar",
  PROCESSED: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toUpperCase();

  return (
    <span className={`status-badge status-${normalizedStatus.toLowerCase()}`}>
      {LABELS[normalizedStatus] || status}
    </span>
  );
}
