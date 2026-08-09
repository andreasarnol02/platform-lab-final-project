import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Switch,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  Tag,
  RotateCw,
} from "lucide-react-native";
import { ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { Product } from "../types";
import {
  getProductsBySeller,
  toggleProductActive,
  deleteProduct,
} from "../utils/productStorage";
import { getSellerData, getSellerToken } from "../utils/storage";
import { CustomAlertModal, ModalType } from "../components/CustomAlertModal";
import { GuestLoginBanner } from "../components/GuestLoginBanner";
import { colors, spacing, borderRadius, shadows } from "../theme";

type SellerProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SellerProductList"
>;
type SellerProductListRouteProp = RouteProp<
  RootStackParamList,
  "SellerProductList"
>;

interface Props {
  navigation: SellerProductListNavigationProp;
  route: SellerProductListRouteProp;
}

export const SellerProductListScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerToken, setSellerTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK"
  >("ALL");

  const [currentSellerId, setCurrentSellerId] = useState<string>("sell_001");
  const [storeName, setStoreName] = useState<string>("Toko Penjual");

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlert = (
    type: ModalType,
    title: string,
    message: string,
    onConfirm: () => void = () => {},
    confirmText = "Mengerti",
    cancelText?: string
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  const loadSellerProducts = async (isRefetch = false) => {
    if (!isRefetch) setLoading(true);
    try {
      const token = await getSellerToken();
      setSellerTokenState(token);
      const seller = await getSellerData();
      const sId = route.params?.sellerId || seller?.id || "sell_001";
      setCurrentSellerId(sId);
      if (seller?.storeName) {
        setStoreName(seller.storeName);
      }

      const sellerProds = await getProductsBySeller(sId);
      setProducts(sellerProds);
    } catch (error) {
      console.error("Error loading seller products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSellerProducts(true);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSellerProducts();
    });
    loadSellerProducts();
    return unsubscribe;
  }, [navigation]);

  const handleToggleActive = async (productId: string) => {
    const updatedList = await toggleProductActive(productId);
    const filtered = updatedList.filter((p) => p.sellerId === currentSellerId);
    setProducts(filtered);
  };

  const handleDeleteProduct = (product: Product) => {
    showAlert(
      "warning",
      "Hapus Produk",
      `Apakah Anda yakin ingin menghapus "${product.name}" dari katalog toko?`,
      async () => {
        const updated = await deleteProduct(product.id);
        const filtered = updated.filter((p) => p.sellerId === currentSellerId);
        setProducts(filtered);
        showAlert("success", "Produk Dihapus", "Produk telah berhasil dihapus.");
      },
      "Hapus Produk",
      "Batal"
    );
  };

  // Filter & Search Products Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === "ACTIVE") return p.isActive && p.stock > 0;
    if (selectedFilter === "INACTIVE") return !p.isActive;
    if (selectedFilter === "OUT_OF_STOCK") return p.stock === 0;
    return true;
  });

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productCardHeader}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <View style={styles.categoryBadge}>
            <Tag size={10} color={colors.storefront.greenDark} style={{ marginRight: 3 }} />
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>

          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.productPrice}>
            Rp {item.price.toLocaleString("id-ID")}
          </Text>

          <View style={styles.stockRow}>
            <Package
              size={14}
              color={
                item.stock === 0
                  ? colors.status.cancelledText
                  : item.stock <= 5
                  ? colors.status.pendingText
                  : colors.storefront.muted
              }
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.stockText,
                item.stock === 0
                  ? styles.outOfStockText
                  : item.stock <= 5
                  ? styles.lowStockText
                  : null,
              ]}
            >
              {item.stock === 0
                ? "Stok Habis!"
                : `Stok: ${item.stock} unit`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActionsRow}>
        <View style={styles.activeToggleWrapper}>
          <Text style={styles.activeLabel}>
            Status: {item.isActive ? "Aktif" : "Non-aktif"}
          </Text>
          <Switch
            value={item.isActive}
            onValueChange={() => handleToggleActive(item.id)}
            trackColor={{ false: colors.storefront.line, true: colors.storefront.greenLight }}
            thumbColor={item.isActive ? colors.storefront.green : "#f4f3f4"}
          />
        </View>

        <View style={styles.actionButtonsGroup}>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("AddEditProduct", { product: item })}
          >
            <Edit3 size={15} color={colors.storefront.ink} style={{ marginRight: 4 }} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.8}
            onPress={() => handleDeleteProduct(item)}
          >
            <Trash2 size={15} color={colors.storefront.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.topHeader,
          { paddingTop: Math.max(insets.top + spacing.xs, spacing.md) },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonPill}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.storefront.ink} />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Katalog Produk Toko</Text>
          <Text style={styles.headerSubtitle}>{storeName}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={styles.refreshHeaderButton}
            activeOpacity={0.7}
            onPress={handleRefresh}
          >
            <RotateCw size={18} color={colors.storefront.ink} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addHeaderButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AddEditProduct")}
          >
            <Plus size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.storefront.muted} style={{ marginRight: spacing.xs }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk toko..."
            placeholderTextColor={colors.storefront.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterChipsRow}>
          {[
            { key: "ALL", label: "Semua" },
            { key: "ACTIVE", label: "Aktif" },
            { key: "INACTIVE", label: "Non-aktif" },
            { key: "OUT_OF_STOCK", label: "Stok Habis" },
          ].map((chip) => (
            <TouchableOpacity
              key={chip.key}
              style={[
                styles.filterChip,
                selectedFilter === chip.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(chip.key as any)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === chip.key && styles.filterChipTextActive,
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.storefront.green} />
        </View>
      ) : !sellerToken ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.storefront.green]}
              tintColor={colors.storefront.green}
            />
          }
        >
          <GuestLoginBanner
            title="Akses Toko Diperlukan"
            description="Silakan login sebagai Seller / Toko untuk mengelola katalog produk toko Anda."
            role="seller"
            onLogin={() => navigation.navigate("Login")}
            onRegister={() => navigation.navigate("Register")}
          />
        </ScrollView>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={48} color={colors.storefront.muted} style={{ marginBottom: spacing.md }} />
          <Text style={styles.emptyTitle}>Belum Ada Produk</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `Tidak ditemukan produk dengan kata kunci "${searchQuery}"`
              : "Toko Anda belum memiliki produk. Klik tombol di bawah untuk menambah produk baru."}
          </Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => navigation.navigate("AddEditProduct")}
            activeOpacity={0.85}
          >
            <Plus size={18} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.emptyAddButtonText}>Tambah Produk Baru</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxl) },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.storefront.green]}
              tintColor={colors.storefront.green}
            />
          }
        />
      )}

      {/* Alert Modal */}
      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerTitleGroup: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.storefront.inkSoft,
  },
  addHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.storefront.green,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.button,
  },
  refreshHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.storefront.bg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    padding: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.bg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 40,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.storefront.ink,
  },
  filterChipsRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.storefront.bg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  filterChipActive: {
    backgroundColor: colors.storefront.green,
    borderColor: colors.storefront.green,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.storefront.muted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.button,
  },
  emptyAddButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  listContainer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  productCardHeader: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.storefront.lineLight,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginBottom: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.greenDark,
  },
  productName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.storefront.greenDark,
    marginBottom: 4,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
  },
  lowStockText: {
    color: colors.status.pendingText,
  },
  outOfStockText: {
    color: colors.status.cancelledText,
    fontWeight: "800",
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.storefront.lineLight,
  },
  activeToggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
    marginRight: spacing.xs,
  },
  actionButtonsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.ink,
  },
  deleteButton: {
    backgroundColor: colors.white,
    padding: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
});
