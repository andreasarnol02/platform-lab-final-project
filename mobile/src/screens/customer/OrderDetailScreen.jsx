import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";
import Screen from "../../components/Screen";
import Panel from "../../components/Panel";
import BackRow from "../../components/BackRow";
import StatusBadge from "../../components/StatusBadge";
import ProductImage from "../../components/ProductImage";
import { Spinner, ErrorState } from "../../components/states";
import { formatIDR, formatDate, formatInvoiceId } from "../../utils/format";
import { getItemName, getProductImage } from "../../utils/product";
import { customerClient } from "../../api/client";

export default function OrderDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    customerClient
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setError("Pesanan tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <Screen bg={theme.colors.bg} contentContainerStyle={styles.content}>
      <BackRow label="Kembali ke pesanan" />

      <View style={styles.head}>
        <Text style={styles.title}>Invoice {formatInvoiceId(order)}</Text>
        <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        <View style={styles.badgeWrap}>
          <StatusBadge status={order.status} />
        </View>
      </View>

      <Panel style={styles.panel}>
        <Text style={styles.panelTitle}>Item Pesanan</Text>
        {(order.items || []).map((item, index) => (
          <View key={item._id || `${order._id}-${index}`}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.line}>
              <ProductImage
                src={getProductImage(item.product)}
                alt={getItemName(item)}
                style={styles.lineImage}
              />
              <View style={styles.lineCol}>
                <Text style={styles.lineName} numberOfLines={2}>
                  {getItemName(item)}
                </Text>
                <Text style={styles.lineMeta}>
                  {formatIDR(item.price)} × {item.quantity}
                </Text>
              </View>
              <Text style={styles.lineTotal}>
                {formatIDR(item.price * item.quantity)}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatIDR(order.totalPrice)}</Text>
        </View>
      </Panel>

      <Panel style={styles.panel}>
        <Text style={styles.panelTitle}>Detail Pengiriman</Text>
        <Text style={styles.panelText}>{order.shippingAddress}</Text>
      </Panel>

      <Panel style={styles.panel}>
        <Text style={styles.panelTitle}>Pembayaran</Text>
        <Text style={styles.panelText}>{order.paymentMethod}</Text>
      </Panel>

      <Panel style={styles.panel}>
        <Text style={styles.panelTitle}>Status</Text>
        <StatusBadge status={order.status} />
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 16,
  },
  head: {
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  date: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  badgeWrap: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  panel: {
    gap: 10,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  panelText: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 21,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  lineImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  lineCol: {
    flex: 1,
    gap: 2,
  },
  lineName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  lineMeta: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  lineTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: theme.colors.inkSoft,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
});
