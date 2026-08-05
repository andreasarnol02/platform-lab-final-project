import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ShoppingBag,
  ClipboardList,
  User,
  Search,
  X,
  Store,
  Plus,
  Truck,
  Sparkles,
} from "lucide-react-native";
import { RootStackParamList } from "../navigation/types";
import { Product } from "../types";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { AddToCartSuccessModal } from "../components/AddToCartSuccessModal";
import { colors, spacing, borderRadius, typography, shadows } from "../theme";
import { getProducts } from "../utils/productStorage";
import { getCart, addToCart } from "../utils/cartStorage";
import { getCustomerToken, getCustomerData } from "../utils/storage";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const CATEGORIES = ["Semua", "Elektronik", "Fashion", "Rumah", "Cemilan"];
const { width } = Dimensions.get("window");
const cardWidth = (width - spacing.xl * 2 - spacing.md) / 2;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [gatedActionName, setGatedActionName] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [customerToken, setCustomerTokenState] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  const loadInitialData = async () => {
    try {
      const prodList = await getProducts();
      const cart = await getCart();
      const token = await getCustomerToken();
      const user = await getCustomerData();

      setProducts(prodList);
      setCustomerTokenState(token);
      if (user) setCustomerName(user.name);

      const totalItemsCount = cart.items ? cart.items.length : 0;
      setCartCount(totalItemsCount);
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadInitialData();
    });
    loadInitialData();
    return unsubscribe;
  }, [navigation]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerStoreName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (product: Product) => {
    try {
      const updatedCart = await addToCart(product, 1);
      const totalItemsCount = updatedCart.items ? updatedCart.items.length : 0;
      setCartCount(totalItemsCount);
      setAddedProduct(product);
      setCartModalVisible(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.cardCategoryTag}>
          <Text style={styles.cardCategoryTagText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.productPrice}>
          Rp {item.price.toLocaleString("id-ID")}
        </Text>

        <View style={styles.sellerRow}>
          <Store
            size={13}
            color={colors.storefront.greenDark}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.sellerName} numberOfLines={1}>
            {item.sellerStoreName}
          </Text>
        </View>

        <View style={styles.cardFooterRow}>
          <View style={styles.stockPill}>
            <Text style={styles.stockPillText}>Stok: {item.stock}</Text>
          </View>

          <TouchableOpacity
            style={styles.addToCartPill}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
          >
            <Plus size={14} color={colors.white} style={{ marginRight: 2 }} />
            <Text style={styles.addToCartPillText}>Beli</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Sticky Header with Dynamic Safe Area Top Padding */}
      <View
        style={[
          styles.stickyHeader,
          { paddingTop: Math.max(insets.top + spacing.xs, spacing.md) },
        ]}
      >
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brandTitle}>storefront</Text>
            <Text style={styles.brandSubtitle}>ETALASE MARKETPLACE</Text>
          </View>

          {/* Action Header Icons (Cart, Orders, Auth) */}
          <View style={styles.headerActions}>
            {/* Orders History Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("OrderHistory")}
              activeOpacity={0.7}
            >
              <ClipboardList size={18} color={colors.storefront.ink} />
            </TouchableOpacity>

            {/* Cart Icon with Counter Badge */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("Cart")}
              activeOpacity={0.7}
            >
              <ShoppingBag size={18} color={colors.storefront.ink} />
              {cartCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile / Auth Button */}
            {customerToken ? (
              <TouchableOpacity
                style={styles.userProfilePill}
                onPress={() => navigation.navigate("OrderHistory")}
                activeOpacity={0.85}
              >
                <User
                  size={14}
                  color={colors.storefront.greenDark}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.userProfileText}>
                  {customerName ? customerName.split(" ")[0] : "Saya"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginPill}
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.85}
              >
                <Text style={styles.loginPillText}>Masuk</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Real-time Search Input */}
        <View style={styles.searchContainer}>
          <Search
            size={16}
            color={colors.storefront.muted}
            style={{ marginRight: spacing.xs }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk atau nama toko penjual..."
            placeholderTextColor={colors.storefront.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={colors.storefront.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Scroll Content with Safe Bottom Padding */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxl) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Promo Hero Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTag}>
            <Truck size={12} color={colors.white} style={{ marginRight: 4 }} />
            <Text style={styles.bannerTagText}>Jaminan Bebas Ongkir</Text>
          </View>
          <Text style={styles.bannerTitle}>
            Produk Pilihan dari Penjual Resmi
          </Text>
          <Text style={styles.bannerSubtitle}>
            Transaksi terverifikasi dengan jaminan kualitas Storefront Green.
          </Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={typography.sectionTitle}>
              Katalog Produk ({filteredProducts.length})
            </Text>
          </View>
          {selectedCategory !== "Semua" && (
            <Text style={styles.activeCategoryLabel}>
              Kategori: {selectedCategory}
            </Text>
          )}
        </View>

        {/* Grid Catalog or Empty State */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Search
              size={36}
              color={colors.storefront.muted}
              style={{ marginBottom: spacing.sm }}
            />
            <Text style={styles.emptyTitle}>Produk Tidak Ditemukan</Text>
            <Text style={typography.caption}>
              Coba gunakan kata kunci lain atau pilih kategori berbeda.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridColumnWrapper}
          />
        )}
      </ScrollView>

      {/* Gated Auth Modal */}
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
        product={addedProduct}
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
  stickyHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
    ...shadows.subtle,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.storefront.green,
    letterSpacing: -0.6,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.storefront.muted,
    letterSpacing: 0.8,
    marginTop: -2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconButton: {
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
  badgeCount: {
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
  badgeCountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
  },
  userProfilePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  userProfileText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 12,
  },
  loginPill: {
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  loginPillText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.bg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.storefront.ink,
    paddingVertical: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  categoryScroll: {
    marginBottom: spacing.md,
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  categoryContainer: {
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  categoryChipActive: {
    backgroundColor: colors.storefront.green,
    borderColor: colors.storefront.green,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  bannerCard: {
    backgroundColor: colors.storefront.greenDark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  bannerTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs - 1,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: spacing.xs,
  },
  bannerTagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: colors.storefront.greenLight,
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeCategoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.storefront.greenDark,
  },
  gridColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    overflow: "hidden",
    ...shadows.card,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 135,
    backgroundColor: colors.storefront.bg,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  cardCategoryTag: {
    position: "absolute",
    top: spacing.xs + 2,
    left: spacing.xs + 2,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.storefront.lineLight,
  },
  cardCategoryTagText: {
    color: colors.storefront.inkSoft,
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  productDetails: {
    padding: spacing.md,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.storefront.ink,
    lineHeight: 18,
    marginBottom: spacing.xs,
    minHeight: 36,
    letterSpacing: -0.2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.storefront.greenDark,
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sellerName: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.storefront.inkSoft,
    flex: 1,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.storefront.lineLight,
  },
  stockPill: {
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  stockPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.greenDark,
  },
  addToCartPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    ...shadows.button,
  },
  addToCartPillText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
});
