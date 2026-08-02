import {
  ArrowRight,
  ChevronDown,
  Grid2X2,
  Heart,
  House,
  Map,
  Package,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tag,
  Utensils,
  Zap,
} from "lucide-react";

const ICONS = {
  arrowRight: ArrowRight,
  bag: ShoppingBag,
  bolt: Zap,
  chevron: ChevronDown,
  food: Utensils,
  grid: Grid2X2,
  heart: Heart,
  home: House,
  map: Map,
  phone: Smartphone,
  search: Search,
  shield: ShieldCheck,
  shirt: Shirt,
  spark: Sparkles,
  star: Star,
  store: Store,
  tag: Tag,
  package: Package,
};

export default function MarketplaceIcon({ name, size = 18, strokeWidth = 1.9, ...props }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
}
