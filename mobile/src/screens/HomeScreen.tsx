import React, { useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { MOCK_PRODUCTS } from "../data/mockData";
import { Product } from "../types";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { colors, spacing, borderRadius, typography, shadows } from "../theme";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const CATEGORIES = ["Semua", "Elektronik", "Fashion", "Rumah", "Cemilan"];
const { width } = Dimensions.get("window");
const cardWidth = (width - spacing.xl * 2 - spacing.md) / 2;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [gatedActionName, setGatedActionName] = useState("");

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerStoreName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProtectedAction = (actionName: string) => {
    setGatedActionName(actionName);
    setAuthModalVisible(true);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.88}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.categoryBadgeOverlay}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={typography.price}>
          Rp {item.price.toLocaleString("id-ID")}
        </Text>

        <View style={styles.sellerRow}>
          <Text style={styles.sellerName} numberOfLines={1}>
            🏬 {item.sellerStoreName}
          </Text>
        </View>

        <View style={styles.cardFooterRow}>
          <View style={styles.stockPill}>
            <Text style={styles.stockPillText}>Stok: {item.stock}</Text>
          </View>

          <TouchableOpacity
            style={styles.quickAddButton}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              handleProtectedAction(`Tambah "${item.name}" ke Keranjang`);
            }}
          >
            <Text style={styles.quickAddButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Sticky Header with Safe Top Padding */}
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

          <View style={styles.guestModePill}>
            <Text style={styles.guestModePillText}>Guest Mode 👁️</Text>
          </View>
        </View>

        {/* Real-time Search Input */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk atau nama toko penjual..."
            placeholderTextColor={colors.storefront.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
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
            <Text style={styles.bannerTagText}>Jaminan Bebas Ongkir 🚚</Text>
          </View>
          <Text style={styles.bannerTitle}>Produk Pilihan dari Penjual Resmi</Text>
          <Text style={styles.bannerSubtitle}>
            Transaksi terverifikasi dengan jaminan kualitas Storefront Green.
          </Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={typography.sectionTitle}>
            Katalog Produk ({filteredProducts.length})
          </Text>
          {selectedCategory !== "Semua" && (
            <Text style={styles.activeCategoryLabel}>
              Kategori: {selectedCategory}
            </Text>
          )}
        </View>

        {/* Grid Catalog or Empty State */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
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
    borderBottomColor: colors.storefront.line,
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
  guestModePill: {
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  guestModePillText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 11,
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
  searchIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.storefront.ink,
    paddingVertical: spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.storefront.muted,
    padding: spacing.xs,
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
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    overflow: "hidden",
    ...shadows.card,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 125,
    backgroundColor: colors.gray100,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadgeOverlay: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: "rgba(15, 23, 21, 0.75)",
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  categoryBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  productDetails: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.ink,
    lineHeight: 16,
    marginBottom: spacing.xs,
    height: 32,
  },
  sellerRow: {
    marginBottom: spacing.xs,
  },
  sellerName: {
    fontSize: 10,
    color: colors.storefront.muted,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  stockPill: {
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  stockPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.greenDark,
  },
  quickAddButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.storefront.green,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.button,
  },
  quickAddButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginTop: -2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
});
