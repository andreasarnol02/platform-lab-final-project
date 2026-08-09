import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import { getErrorMessage, sellerClient } from "../../api/client";
import { formatDate, formatIDR, formatInvoiceId } from "../../utils/format";
import { getItemName } from "../../utils/product";
import AppButton from "../../components/AppButton";
import { EmptyState, ErrorState, Spinner } from "../../components/states";
import PageHeading from "../../components/PageHeading";
import Panel from "../../components/Panel";
import Screen from "../../components/Screen";
import SellerHeader from "../../components/SellerHeader";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";
import { useSellerAuth } from "../../context/SellerAuthContext";

// Mirrors web/src/seller/pages/OrdersPage.jsx.
const TRANSITION_PRESENTATION = {
  PAID: { label: "Tandai Dibayar", tone: "primary" },
  PROCESSED: { label: "Tandai Diproses", tone: "primary" },
  SHIPPED: { label: "Tandai Dikirim", tone: "primary" },
  COMPLETED: { label: "Tandai Selesai", tone: "primary" },
  CANCELLED: { label: "Batalkan", tone: "danger" },
};

const getTransitionActions = (allowedTransitions) =>
  (Array.isArray(allowedTransitions) ? allowedTransitions : [])
    .filter(Boolean)
    .map((status) => {
      const normalizedStatus = String(status).toUpperCase();
      return {
        status: normalizedStatus,
        label: TRANSITION_PRESENTATION[normalizedStatus]?.label || normalizedStatus,
        tone: TRANSITION_PRESENTATION[normalizedStatus]?.tone || "primary",
      };
    });

// Mirrors web/src/seller/pages/OrdersPage.jsx.
// The cancel action button uses AppButton variant="ghost" with
// titleColor={theme.colors.danger} (previously mirrored web
// `.btn-ghost.btn-sm.text-danger` — ghost variant + danger title color).
export default function SellerOrdersScreen() {
  const navigation = useNavigation();
  const { user, logout } = useSellerAuth();
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    sellerClient
      .get("/seller/orders")
      .then(({ data }) => setOrders(data.data))
      .catch(() => setError("Gagal memuat pesanan."))
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

  const handleStatus = (order, nextStatus) => {
    sellerClient
      .put(`/seller/orders/${order._id}/status`, { status: nextStatus })
      .then((res) => {
        const updated = res.data.data;
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id ? updated : o))
        );
        toast(`Pesanan ${formatInvoiceId(order)} diperbarui.`);
      })
      .catch((err) => toast(getErrorMessage(err), { tone: "error" }));
  };

  return (
    <Screen scroll edges={["left", "right"]}>
      <SellerHeader user={user} onLogout={handleLogout} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <PageHeading title="Pesanan Masuk" />

          {orders.length === 0 ? (
            <EmptyState
              icon="orders"
              title="Belum ada pesanan"
              message="Pesanan untuk produkmu akan muncul di sini."
            />
          ) : (
            <View style={styles.list}>
              {orders.map((order) => {
                const actions = getTransitionActions(order.allowedTransitions);
                return (
                  <Panel key={order._id} style={styles.orderCard}>
                    <View style={styles.orderHead}>
                      <View style={styles.orderHeadCol}>
                        <Text style={styles.invoiceText}>
                          Invoice {formatInvoiceId(order)}
                        </Text>
                        <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                      </View>
                      <StatusBadge status={order.status} />
                    </View>

                    <Text style={styles.customerLine}>
                      {order.customer?.name || "Pembeli"} · {order.customer?.email || ""}
                    </Text>
                    <Text style={styles.address}>{order.shippingAddress}</Text>
                    <Text style={styles.payment}>{order.paymentMethod}</Text>

                    <View style={styles.items}>
                      {order.items.map((item) => (
                        <View key={item._id} style={styles.itemLine}>
                          <Text style={styles.itemName}>
                            {getItemName(item)}
                          </Text>
                          <Text style={styles.itemQty}>
                            {item.quantity} × {formatIDR(item.price)}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.orderFoot}>
                      <Text style={styles.totalLabel}>Total:</Text>
                      <Text style={styles.totalValue}>{formatIDR(order.totalPrice)}</Text>
                    </View>

                    {actions.length > 0 ? (
                      <View style={styles.actions}>
                        {actions.map((action) =>
                          action.tone === "danger" ? (
                            <AppButton
                              key={action.status}
                              variant="ghost"
                              titleColor={theme.colors.danger}
                              title={action.label}
                              size="sm"
                              onPress={() => handleStatus(order, action.status)}
                            />
                          ) : (
                            <AppButton
                              key={action.status}
                              title={action.label}
                              variant="primary"
                              size="sm"
                              onPress={() => handleStatus(order, action.status)}
                            />
                          )
                        )}
                      </View>
                    ) : null}
                  </Panel>
                );
              })}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md + 2,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md + 2,
  },
  orderCard: {
    gap: theme.spacing.md,
  },
  orderHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  orderHeadCol: {
    flex: 1,
    gap: 2,
  },
  invoiceText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  orderDate: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  customerLine: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  address: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  payment: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  items: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    borderStyle: "dashed",
    marginTop: 2,
    paddingTop: 2,
  },
  itemLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 6,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.muted,
  },
  itemQty: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  orderFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: 10,
  },
});
