import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ArrowLeft,
  Store,
  Clock,
  CreditCard,
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  PackageOpen,
} from "lucide-react-native";
import { RootStackParamList } from "../navigation/types";
import { Order, OrderStatus } from "../types";
import { colors, spacing, borderRadius, shadows } from "../theme";
import { getOrders } from "../utils/orderStorage";

type OrderHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OrderHistory"
>;

interface Props {
  navigation: OrderHistoryScreenNavigationProp;
}

/** Render lifecycle status badge using Lucide icons & Tokopedia design tokens (C7 & BR-3) */
const renderStatusBadge = (status: OrderStatus) => {
  let bg = colors.status.pendingBg;
  let text = colors.status.pendingText;
  let label = "MENUNGGU PEMBAYARAN";
  let IconComponent = Clock;

  switch (status) {
    case "PENDING":
      bg = colors.status.pendingBg;
      text = colors.status.pendingText;
      label = "MENUNGGU PEMBAYARAN";
      IconComponent = Clock;
      break;
    case "PAID":
      bg = colors.status.paidBg;
      text = colors.status.paidText;
      label = "DIBAYAR";
      IconComponent = CreditCard;
      break;
    case "PROCESSED":
      bg = colors.status.processedBg;
      text = colors.status.processedText;
      label = "DIPROSES SELLER";
      IconComponent = PackageCheck;
      break;
    case "SHIPPED":
      bg = colors.status.shippedBg;
      text = colors.status.shippedText;
      label = "DIKIRIM";
      IconComponent = Truck;
      break;
    case "COMPLETED":
      bg = colors.status.completedBg;
      text = colors.status.completedText;
      label = "SELESAI";
      IconComponent = CheckCircle2;
      break;
    case "CANCELLED":
      bg = colors.status.cancelledBg;
      text = colors.status.cancelledText;
      label = "DIBATALKAN";
      IconComponent = AlertCircle;
      break;
  }

  return (
    <View style={[styles.badgeContainer, { backgroundColor: bg }]}>
      <IconComponent size={12} color={text} style={{ marginRight: 4 }} />
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

export const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading order history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadOrders();
    });
    loadOrders();
    return unsubscribe;
  }, [navigation]);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    return (
      <View style={styles.orderCard}>
        {/* Card Header: Store info & Status Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.storeInfo}>
            <Store
              size={18}
              color={colors.storefront.greenDark}
              style={{ marginRight: 6 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{item.sellerStoreName}</Text>
              <Text style={styles.orderDate}>{formattedDate}</Text>
            </View>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        {/* Product Items List */}
        {item.items.map((orderProduct, index) => (
          <View
            key={`${orderProduct.productId}_${index}`}
            style={styles.productRow}
          >
            <Image
              source={{
                uri:
                  orderProduct.imageUrl ||
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
              }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={2}>
                {orderProduct.name}
              </Text>
              <Text style={styles.productMeta}>
                {orderProduct.quantity} barang × Rp{" "}
                {orderProduct.price.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        ))}

        {/* Payment & Shipping Summary */}
        <View style={styles.orderMetaRow}>
          <View style={styles.metaLine}>
            <CreditCard size={13} color={colors.storefront.inkSoft} />
            <Text style={styles.metaText}>
              Metode Pembayaran: {item.paymentMethod}
            </Text>
          </View>
          <View style={styles.metaLine}>
            <MapPin size={13} color={colors.storefront.inkSoft} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.shippingAddress}
            </Text>
          </View>
        </View>

        {/* Card Footer: Order Total */}
        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Total Pembayaran:</Text>
          <Text style={styles.totalPrice}>
            Rp {item.totalPrice.toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, spacing.xs) },
      ]}
    >
      {/* Sticky Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.storefront.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.storefront.green} />
          <Text style={styles.loadingText}>Memuat riwayat transaksi...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <PackageOpen size={48} color={colors.storefront.green} />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Transaksi</Text>
          <Text style={styles.emptySubtitle}>
            Anda belum memiliki riwayat pesanan. Mulai berbelanja sekarang!
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.85}
          >
            <Text style={styles.shopButtonText}>Mulai Belanja</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxl) },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.storefront.inkSoft,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.storefront.muted,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.button,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  listContent: {
    padding: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.xs,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  orderDate: {
    fontSize: 11,
    color: colors.storefront.muted,
    marginTop: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.gray100,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.storefront.ink,
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 12,
    color: colors.storefront.muted,
  },
  orderMetaRow: {
    backgroundColor: colors.storefront.bg,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    gap: 4,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: colors.storefront.inkSoft,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.storefront.lineLight,
    paddingTop: spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
});
