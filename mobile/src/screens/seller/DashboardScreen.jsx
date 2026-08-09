import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import { sellerClient } from "../../api/client";
import { formatDate, formatIDR } from "../../utils/format";
import AppButton from "../../components/AppButton";
import Icon from "../../components/Icon";
import PageHeading from "../../components/PageHeading";
import Panel from "../../components/Panel";
import Screen from "../../components/Screen";
import SellerHeader from "../../components/SellerHeader";
import StatusBadge from "../../components/StatusBadge";
import { ErrorState, Spinner } from "../../components/states";
import { useSellerAuth } from "../../context/SellerAuthContext";

// Mirrors web/src/seller/pages/DashboardPage.jsx.
export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, logout } = useSellerAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([sellerClient.get("/seller/products"), sellerClient.get("/seller/orders")])
      .then(([p, o]) => {
        setProducts(p.data.data);
        setOrders(o.data.data);
      })
      .catch(() => setError("Gagal memuat dashboard."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLogout = () => {
    logout();
    navigation.navigate("MainTabs");
  };

  const listedProducts = products.filter((product) => product.isActive);
  const outOfStock = listedProducts.filter((product) => product.stock <= 0).length;
  const activeRevenue = orders
    .filter((o) => String(o.status || "").toUpperCase() !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = orders.filter((o) =>
    ["PENDING", "PAID"].includes(String(o.status || "").toUpperCase())
  ).length;

  const stats = [
    { label: "Produk Terdaftar", value: listedProducts.length, icon: "products" },
    { label: "Stok Habis", value: outOfStock, icon: "warning" },
    { label: "Total Pesanan", value: orders.length, icon: "orders" },
    { label: "Pesanan Menunggu", value: pendingCount, icon: "clock" },
    { label: "Total Pendapatan", value: formatIDR(activeRevenue), icon: "money" },
  ];

  return (
    <Screen scroll edges={["left", "right"]}>
      <SellerHeader user={user} onLogout={handleLogout} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <PageHeading
            title="Dashboard"
            action={
              <AppButton
                title="Tambah Produk"
                variant="primary"
                size="sm"
                icon="plus"
                onPress={() =>
                  navigation.navigate("ProductsTab", { screen: "ProductForm" })
                }
              />
            }
          />

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <Panel key={stat.label} style={styles.statCard}>
                <View style={styles.statRow}>
                  <View style={styles.statIcon}>
                    <Icon name={stat.icon} size={18} color={theme.colors.greenDark} />
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statValue} numberOfLines={1}>
                      {stat.value}
                    </Text>
                    <Text style={styles.statLabel} numberOfLines={1}>
                      {stat.label}
                    </Text>
                  </View>
                </View>
              </Panel>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Pesanan Terbaru</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Lihat semua pesanan"
                onPress={() => navigation.navigate("OrdersTab")}
                style={styles.moreLink}
              >
                <Text style={styles.moreText}>Lihat semua</Text>
                <Icon name="arrowRight" size={14} color={theme.colors.greenDark} />
              </Pressable>
            </View>

            {orders.length === 0 ? (
              <Text style={styles.emptyOrders}>Belum ada pesanan masuk.</Text>
            ) : (
              <View style={styles.miniList}>
                {orders.slice(0, 5).map((order) => (
                  <Panel key={order._id} style={styles.miniOrder}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Pesanan ${order.customer?.name || "Pembeli"}`}
                      onPress={() => navigation.navigate("OrdersTab")}
                    >
                      <View style={styles.miniRow}>
                        <Text style={styles.miniName} numberOfLines={1}>
                          {order.customer?.name || "Pembeli"}
                        </Text>
                        <Text style={styles.miniAmount}>{formatIDR(order.totalPrice)}</Text>
                      </View>
                      <View style={styles.miniSubRow}>
                        <Text style={styles.miniDate}>{formatDate(order.createdAt)}</Text>
                        <StatusBadge status={order.status} />
                      </View>
                    </Pressable>
                  </Panel>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md + 2,
    marginTop: theme.spacing.md + 2,
  },
  statCard: {
    width: "47%",
    padding: theme.spacing.md + 2,
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  statCol: {
    flex: 1,
  },
  statValue: {
    fontSize: 21,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: theme.spacing.md + 2,
    marginTop: theme.spacing.xl,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  moreLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 40,
  },
  moreText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.greenDark,
  },
  emptyOrders: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  miniList: {
    gap: 10,
  },
  miniOrder: {
    padding: theme.spacing.md + 2,
  },
  miniRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  miniName: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.ink,
    flexShrink: 1,
  },
  miniAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  miniSubRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  miniDate: {
    fontSize: 12,
    color: theme.colors.muted,
  },
});
