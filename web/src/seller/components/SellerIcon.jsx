import {
  ArrowLeft,
  Banknote,
  ClipboardList,
  Clock3,
  Grid2X2,
  LogOut,
  Package,
  Plus,
  Store,
  TriangleAlert,
} from "lucide-react";

const ICONS = {
  dashboard: Grid2X2,
  products: Package,
  orders: ClipboardList,
  plus: Plus,
  store: Store,
  arrowLeft: ArrowLeft,
  logout: LogOut,
  package: Package,
  warning: TriangleAlert,
  money: Banknote,
  clock: Clock3,
};

export default function SellerIcon({ name, size = 18, strokeWidth = 1.9, ...props }) {
  const Icon = ICONS[name] || Store;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
}
