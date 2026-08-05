import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ArrowLeft,
  ShoppingBag,
  Store,
  Zap,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from "lucide-react-native";
import { RootStackParamList } from "../navigation/types";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { AddToCartSuccessModal } from "../components/AddToCartSuccessModal";
import { colors, spacing, borderRadius, commonStyles, shadows } from "../theme";
import { addToCart, getCart } from "../utils/cartStorage";

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetail"
>;
type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

interface ProductDetailScreenProps {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

export const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const insets = useSafeAreaInsets();
  const { product } = route.params;
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [gatedActionName, setGatedActionName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cart = await getCart();
        const total = cart.items ? cart.items.length : 0;
        setCartCount(total);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
    fetchCartCount();
  }, []);

  const handleAddToCartPress = async () => {
    try {
      const updatedCart = await addToCart(product, 1);
      const total = updatedCart.items ? updatedCart.items.length : 0;
      setCartCount(total);
      setCartModalVisible(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNowPress = async () => {
    try {
      await addToCart(product, 1);
      navigation.navigate("Cart");
    } catch (error) {
      console.error("Error buying product:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Header Bar with Safe Area Top Padding */}
      <View
        style={[
          styles.topHeader,
          { paddingTop: Math.max(insets.top + spacing.xs, spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.backButtonPill}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={18} color={colors.storefront.ink} />
          <Text style={styles.backButtonText}>Katalog</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Detail Produk
        </Text>

        <TouchableOpacity
          style={styles.cartIconButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Cart")}
        >
          <ShoppingBag size={20} color={colors.storefront.ink} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        </View>

        {/* Product Meta Info Card */}
        <View style={styles.metaCard}>
          <View style={styles.categoryBadgeRow}>
            <View style={styles.categoryBadge}>
              <Tag size={12} color={colors.storefront.muted} style={{ marginRight: 4 }} />
              <Text style={styles.categoryBadgeText}>{product.category}</Text>
            </View>

            <View style={styles.stockBadge}>
              <CheckCircle2 size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
              <Text style={styles.stockBadgeText}>
                Stok Tersedia: {product.stock}
              </Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>

          <Text style={styles.productPrice}>
            Rp {product.price.toLocaleString("id-ID")}
          </Text>

          <View style={styles.divider} />

          {/* Seller Store Card */}
          <View style={styles.sellerCard}>
            <View style={styles.storeIconContainer}>
              <Store size={22} color={colors.storefront.greenDark} />
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerLabel}>Penjual Terdaftar Marketplace</Text>
              <Text style={styles.sellerStoreName}>{product.sellerStoreName}</Text>
            </View>
          </View>
        </View>

        {/* Product Description Card */}
        <View style={styles.descriptionCard}>
          <View style={styles.descHeaderRow}>
            <ShieldCheck size={18} color={colors.storefront.greenDark} style={{ marginRight: 6 }} />
            <Text style={styles.sectionHeaderTitle}>Deskripsi Produk & Jaminan</Text>
          </View>
          <Text style={styles.descriptionText}>
            {product.description ||
              "Produk berkualitas tinggi yang dijual langsung oleh toko resmi di platform Storefront Marketplace. Garansi kualitas, keaslian barang, dan transaksi aman."}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar with Dynamic Safe Inset Padding */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.85}
          onPress={handleAddToCartPress}
        >
          <ShoppingBag size={18} color={colors.storefront.greenDark} style={{ marginRight: 6 }} />
          <Text style={styles.cartButtonText}>+ Keranjang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowButton}
          activeOpacity={0.85}
          onPress={handleBuyNowPress}
        >
          <Zap size={18} color={colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.buyNowButtonText}>Beli Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Gated Auth BottomSheet Modal */}
      <AuthPromptModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        actionText={gatedActionName}
        onLoginPress={() => {
          setAuthModalVisible(false);
          navigation.navigate("Login");
        }}
        onRegisterPress={() => {
          setAuthModalVisible(false);
          navigation.navigate("Register");
        }}
      />

      {/* Add To Cart Success Sheet */}
      <AddToCartSuccessModal
        visible={cartModalVisible}
        product={product}
        onClose={() => setCartModalVisible(false)}
        onViewCart={() => navigation.navigate("Cart")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
    ...shadows.subtle,
    zIndex: 10,
  },
  backButtonPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    gap: 4,
  },
  backButtonText: {
    color: colors.storefront.ink,
    fontWeight: "700",
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.storefront.ink,
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.xs,
  },
  cartIconButton: {
    position: "relative",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.storefront.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
  },
  scrollContent: {
    padding: spacing.xl,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  metaCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  categoryBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  categoryBadgeText: {
    color: colors.storefront.muted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  stockBadgeText: {
    color: colors.storefront.greenDark,
    fontSize: 11,
    fontWeight: "800",
  },
  productTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.storefront.ink,
    lineHeight: 25,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.storefront.lineLight,
    marginVertical: spacing.md,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenSubtle,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.muted,
    textTransform: "uppercase",
  },
  sellerStoreName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  descHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    lineHeight: 21,
  },
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.storefront.lineLight,
    ...shadows.floating,
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: "center",
  },
  cartButtonText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 14,
  },
  buyNowButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    ...shadows.button,
  },
  buyNowButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
});
