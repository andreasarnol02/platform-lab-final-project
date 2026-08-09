import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../../theme";
import Panel from "../../components/Panel";
import AppButton from "../../components/AppButton";
import StatusBadge from "../../components/StatusBadge";
import { Spinner, ErrorState, EmptyState } from "../../components/states";
import { formatIDR, formatDate, formatInvoiceId } from "../../utils/format";
import { getItemName } from "../../utils/product";
import { customerClient } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import RequireLogin from "./RequireLogin";

export default function OrdersScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, booting } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(route.params?.success || "");

  // Consume the success notice so it does not reappear on later visits.
  useEffect(() => {
    if (route.params?.success) {
      setNotice(route.params.success);
      navigation.setParams({ success: undefined });
    }
  }, [route.params?.success, navigation, setNotice]);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    customerClient
      .get("/orders")
      .then(({ data }) => setOrders(data.data))
      .catch(() => setError("Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (booting) return <Spinner />;
  if (!user) {
    return (
      <RequireLogin
        title="Masuk untuk melihat pesanan"
        message="Login untuk melihat riwayat pesananmu."
      />
    );
  }
  if (loading && orders.length === 0) return <Spinner />;
  if (error && orders.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <FlatList
      style={styles.flex}
      data={orders}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.head}>
          <Text style={theme.typography.pageTitle}>Riwayat Pesanan</Text>
          {notice ? (
            <View style={styles.successAlert}>
              <Text style={styles.successText}>{notice}</Text>
            </View>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          icon="bag"
          title="Belum ada pesanan"
          message="Pesanan yang kamu buat akan muncul di sini."
        >
          <AppButton title="Mulai Belanja" onPress={() => navigation.navigate("CatalogTab")} />
        </EmptyState>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate("OrderDetail", { id: item._id })}
          style={({ pressed }) => [pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Invoice ${formatInvoiceId(item)}`}
        >
          <Panel style={styles.card}>
            <View style={styles.cardHead}>
              <View>
                <Text style={styles.invoice}>Invoice {formatInvoiceId(item)}</Text>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            <View style={styles.itemsWrap}>
              {(item.items || []).map((line, index) => (
                <Text
                  key={line._id || `${item._id}-${index}`}
                  style={styles.itemPill}
                >
                  {getItemName(line)} × {line.quantity}
                </Text>
              ))}
            </View>
            <View style={styles.cardFoot}>
              <Text style={styles.payment}>{item.paymentMethod}</Text>
              <Text style={styles.total}>{formatIDR(item.totalPrice)}</Text>
            </View>
          </Panel>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  list: {
    padding: 14,
    gap: 12,
    paddingBottom: 32,
  },
  head: {
    gap: 10,
  },
  successAlert: {
    backgroundColor: "#EFFBF2",
    borderWidth: 1,
    borderColor: "#B7E3C1",
    borderRadius: 10,
    padding: 12,
  },
  successText: {
    fontSize: 13,
    color: theme.colors.greenDark,
    fontWeight: "600",
  },
  card: {
    gap: 12,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  invoice: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  date: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  itemsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  itemPill: {
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: theme.colors.inkSoft,
  },
  cardFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  payment: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  total: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  pressed: {
    opacity: 0.92,
  },
});
