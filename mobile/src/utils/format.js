// Manual formatting helpers. No Intl / toLocaleString (Hermes quirks).

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const pad = (n) => String(n).padStart(2, "0");

// Adds "." thousand separators to a digit string ("250000" -> "250.000").
const addThousandSeparators = (digits) =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// "Rp 250.000" — 0 decimals, manual thousand separators.
export const formatIDR = (value) => {
  const num = Math.round(Number(value) || 0);
  const negative = num < 0;
  const formatted = addThousandSeparators(String(Math.abs(num)));
  return `${negative ? "-" : ""}Rp ${formatted}`;
};

// Strips non-digits then adds "." thousand separators (for live inputs).
export const formatIDRInput = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return addThousandSeparators(digits);
};

// id-ID short date + time: "9 Agu 2026, 14.05".
export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day} ${month} ${year}, ${hours}.${minutes}`;
};

// "#" + last 8 chars of the order id, uppercased.
export const formatInvoiceId = (order) =>
  "#" + String(order?._id || "").slice(-8).toUpperCase();

// Avatar initial: first char of the name, uppercased, "A" fallback.
export const getInitial = (name) => String(name?.[0] || "A").toUpperCase();
