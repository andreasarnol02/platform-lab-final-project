import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

// Mirrors web/src/components/StatusBadge.jsx + the .status-* CSS classes.
export const STATUS_LABELS = {
  PENDING: "Menunggu",
  PAID: "Dibayar",
  PROCESSED: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const FALLBACK_PALETTE = { bg: "#EDF1EF", text: "#72817B" };

export default function StatusBadge({ status }) {
  const normalized = String(status || "").toUpperCase();
  const palette = theme.colors.status[normalized] || FALLBACK_PALETTE;

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.text }]}>
        {STATUS_LABELS[normalized] || status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
