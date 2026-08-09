import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import { getProductImage } from "../utils/product";
import { formatIDR } from "../utils/format";

// Mirrors web/src/components/ProductCard.jsx (commerce direction) for a
// 2-column mobile grid. Width is left to the caller via `style`.
export default function ProductCard({ product, onPress, style }) {
  const image = getProductImage(product);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel={product?.name || "Produk"}
    >
      <View style={styles.imageWrap}>
        <ProductImage src={image} alt={product?.name} style={styles.image} />
        {product?.stock <= 0 && (
          <View style={styles.badgeOut}>
            <Text style={styles.badgeOutText}>Habis</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.category} numberOfLines={1}>
          {product?.category || "Pilihan"}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product?.name}
        </Text>
        <Text style={styles.price}>{formatIDR(product?.price)}</Text>
        <View style={styles.meta}>
          <View style={styles.metaLeft}>
            <Icon name="store" size={12} color={theme.colors.muted} />
            <Text style={styles.storeName} numberOfLines={1}>
              {product?.seller?.storeName || "Toko"}
            </Text>
          </View>
          <Text style={styles.stock}>
            {product?.stock > 0 ? `${product.stock} stok` : "Habis"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.line,
    shadowColor: "#172522",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: theme.colors.greenLight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeOut: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E24D3E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    zIndex: 1,
  },
  badgeOutText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "bold",
  },
  body: {
    padding: 12,
  },
  category: {
    color: theme.colors.greenDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  name: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
    marginBottom: 6,
  },
  price: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  storeName: {
    color: theme.colors.muted,
    fontSize: 11,
    flexShrink: 1,
  },
  stock: {
    color: theme.colors.muted,
    fontSize: 11,
  },
});
