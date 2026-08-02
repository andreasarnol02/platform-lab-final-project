import { Link } from "react-router";
import MarketplaceIcon from "./MarketplaceIcon";

export const CATEGORIES = [
  { label: "Elektronik", icon: "phone", tone: "mint" },
  { label: "Fashion", icon: "shirt", tone: "peach" },
  { label: "Kecantikan", icon: "spark", tone: "lavender" },
  { label: "Makanan", icon: "food", tone: "yellow" },
  { label: "Rumah", icon: "home", tone: "blue" },
  { label: "Hobi", icon: "heart", tone: "rose" },
  { label: "Lainnya", icon: "grid", tone: "gray" },
];

export default function CategoryRow() {
  return (
    <div className="commerce-category-row">
      {CATEGORIES.map((category) => (
        <Link
          to={`/products?category=${category.label}`}
          className="commerce-category"
          key={category.label}
        >
          <span className={`commerce-category-icon commerce-tone-${category.tone}`}>
            <MarketplaceIcon name={category.icon} size={21} />
          </span>
          <span>{category.label}</span>
        </Link>
      ))}
    </div>
  );
}
