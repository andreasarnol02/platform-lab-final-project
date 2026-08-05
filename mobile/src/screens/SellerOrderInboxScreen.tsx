import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  User,
  ShoppingBag,
} from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { Order, OrderStatus } from "../types";
import { getOrdersBySeller, updateOrderStatus } from "../utils/orderStorage";
import { getSellerData } from "../utils/storage";
import { CustomAlertModal, ModalType } from "../components/CustomAlertModal";
import { colors, spacing, borderRadius, shadows } from "../theme";

type SellerOrderInboxNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SellerOrderInbox"
>;
type SellerOrderInboxRouteProp = RouteProp<
  RootStackParamList,
  "SellerOrderInbox"
>;

interface Props {
  navigation: SellerOrderInboxNavigationProp;
  route: SellerOrderInboxRouteProp;
}

export const SellerOrderInboxScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"ALL" | OrderStatus>("ALL");

  const [currentSellerId, setCurrentSellerId] = useState<string>("sell_001");
  const [storeName, setStoreName] = useState<string>("Toko Penjual");

  // Custom Alert Modal State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
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
    onConfirm: () => void = () => {}
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const loadSellerOrders = async () => {
    setLoading(true);
    try {
      const seller = await getSellerData();
      const sId = route.params?.sellerId || seller?.id || "sell_001";
      setCurrentSellerId(sId);
      if (seller?.storeName) {
        setStoreName(seller.storeName);
      }

      const sellerOrdersList = await getOrdersBySeller(sId);
      setOrders(sellerOrdersList);
    } catch (error) {
      console.error("Error loading seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSellerOrders();
    });
    loadSellerOrders();
    return unsubscribe;
  }, [navigation]);

  const handleAdvanceStatus = async (order: Order, nextStatus: OrderStatus) => {
    const actionLabel =
      nextStatus === "PROCESSED" ? "Memproses Pesanan" : "Mengirim Pesanan";

    try {
      const updatedAllOrders = await updateOrderStatus(order.id, nextStatus);
      const filteredSellerOrders = updatedAllOrders.filter(
        (o) => o.sellerId === currentSellerId
      );
      setOrders(filteredSellerOrders);

      showAlert(
        "success",
        "Status Diperbarui",
        `Pesanan #${order.id} telah berhasil diubah statusnya menjadi ${nextStatus}.`
      );
    } catch (error) {
      console.error(`Error advancing order status:`, error);
      showAlert("danger", "Gagal Memperbarui", "Terjadi kesalahan saat memperbarui status pesanan.");
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedTab === "ALL") return true;
    return o.status === selectedTab;
  });

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case "PAID":
        return {
          bg: colors.storefront.greenSubtle,
          text: colors.storefront.greenDark,
          label: "Dibayar Pembeli",
        };
      case "PROCESSED":
        return {
          bg: colors.status.pendingBg,
          text: colors.status.pendingText,
          label: "Sedang Diproses",
        };
      case "SHIPPED":
        return {
          bg: "#E0F2FE",
          text: "#0369A1",
          label: "Dalam Pengiriman",
        };
      case "COMPLETED":
        return {
          bg: colors.status.completedBg,
          text: colors.status.completedText,
          label: "Pesanan Selesai",
        };
      case "CANCELLED":
        return {
          bg: colors.status.cancelledBg,
          text: colors.status.cancelledText,
          label: "Dibatalkan",
        };
      default:
        return {
          bg: colors.storefront.lineLight,
          text: colors.storefront.muted,
          label: status,
        };
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const badge = getStatusBadgeStyle(item.status);

    return (
      <View style={styles.orderCard}>
        {/* Order Header Info */}
        <View style={styles.orderHeaderRow}>
          <View>
            <Text style={styles.orderIdText}>Pesanan #{item.id}</Text>
            <Text style={styles.orderDateText}>
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* Customer Info Row */}
        <View style={styles.customerInfoBox}>
          <View style={styles.infoLine}>
            <User size={14} color={colors.storefront.inkSoft} style={{ marginRight: 6 }} />
            <Text style={styles.infoLineText}>
              Pembeli: <Text style={styles.boldText}>{item.customerName}</Text>
            </Text>
          </View>

          <View style={styles.infoLine}>
            <MapPin size={14} color={colors.storefront.muted} style={{ marginRight: 6 }} />
            <Text style={styles.infoLineText} numberOfLines={1}>
              {item.shippingAddress}
            </Text>
          </View>

          <View style={styles.infoLine}>
            <CreditCard size={14} color={colors.storefront.muted} style={{ marginRight: 6 }} />
            <Text style={styles.infoLineText}>{item.paymentMethod}</Text>
          </View>
        </View>

        {/* Ordered Items List */}
        <View style={styles.itemsListContainer}>
          {item.items.map((prod, index) => (
            <View key={index} style={styles.itemRow}>
              {prod.imageUrl ? (
                <Image source={{ uri: prod.imageUrl }} style={styles.itemImage} />
              ) : (
                <View style={styles.itemImagePlaceholder}>
                  <ShoppingBag size={20} color={colors.storefront.muted} />
                </View>
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {prod.name}
                </Text>
                <Text style={styles.itemQtyPrice}>
                  {prod.quantity} x Rp {prod.price.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Footer & Action Progression */}
        <View style={styles.orderFooterRow}>
          <View>
            <Text style={styles.totalLabel}>Total Transaksi</Text>
            <Text style={styles.totalAmount}>
              Rp {item.totalPrice.toLocaleString("id-ID")}
            </Text>
          </View>

          {/* Status Cycle Progression Buttons */}
          <View>
            {item.status === "PAID" && (
              <TouchableOpacity
                style={styles.processButton}
                activeOpacity={0.85}
                onPress={() => handleAdvanceStatus(item, "PROCESSED")}
              >
                <PackageCheck size={16} color={colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.processButtonText}>Proses Pesanan</Text>
              </TouchableOpacity>
            )}

            {item.status === "PROCESSED" && (
              <TouchableOpacity
                style={styles.shipButton}
                activeOpacity={0.85}
                onPress={() => handleAdvanceStatus(item, "SHIPPED")}
              >
                <Truck size={16} color={colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.shipButtonText}>Kirim Pesanan</Text>
              </TouchableOpacity>
            )}

            {item.status === "SHIPPED" && (
              <View style={styles.inTransitBadge}>
                <Truck size={14} color="#0369A1" style={{ marginRight: 4 }} />
                <Text style={styles.inTransitText}>Dalam Pengiriman</Text>
              </View>
            )}

            {item.status === "COMPLETED" && (
              <View style={styles.completedBadge}>
                <CheckCircle2 size={14} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
                <Text style={styles.completedText}>Selesai</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>Kotak Masuk Pesanan</Text>
          <Text style={styles.headerSubtitle}>{storeName}</Text>
        </View>

        <View style={{ width: 70 }} />
      </View>

      {/* Filter Tabs Horizontal Scroll */}
      <View style={styles.tabContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { key: "ALL", label: "Semua" },
            { key: "PAID", label: "Perlu Diproses" },
            { key: "PROCESSED", label: "Perlu Dikirim" },
            { key: "SHIPPED", label: "Dikirim" },
            { key: "COMPLETED", label: "Selesai" },
          ]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabChip,
                selectedTab === item.key && styles.tabChipActive,
              ]}
              onPress={() => setSelectedTab(item.key as any)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabChipText,
                  selectedTab === item.key && styles.tabChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.tabsContent}
        />
      </View>

      {/* Main Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.storefront.green} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PackageCheck size={48} color={colors.storefront.muted} style={{ marginBottom: spacing.md }} />
          <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
          <Text style={styles.emptySubtitle}>
            Tidak ada transaksi pesanan masuk untuk status filter yang dipilih.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxl) },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Custom Alert Modal */}
      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
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
  tabContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
    paddingVertical: spacing.xs,
  },
  tabsContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  tabChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.storefront.bg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  tabChipActive: {
    backgroundColor: colors.storefront.green,
    borderColor: colors.storefront.green,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
  },
  tabChipTextActive: {
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
  },
  listContainer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  orderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  orderDateText: {
    fontSize: 11,
    color: colors.storefront.muted,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  customerInfoBox: {
    backgroundColor: colors.storefront.bg,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: 4,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLineText: {
    fontSize: 12,
    color: colors.storefront.inkSoft,
    flex: 1,
  },
  boldText: {
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  itemsListContainer: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.storefront.lineLight,
    marginRight: spacing.sm,
  },
  itemImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.storefront.lineLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.storefront.ink,
  },
  itemQtyPrice: {
    fontSize: 12,
    color: colors.storefront.muted,
  },
  orderFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.storefront.lineLight,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.muted,
    textTransform: "uppercase",
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
  processButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    ...shadows.button,
  },
  processButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },
  shipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0284C7",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    ...shadows.button,
  },
  shipButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },
  inTransitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  inTransitText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0369A1",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.status.completedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  completedText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
});
