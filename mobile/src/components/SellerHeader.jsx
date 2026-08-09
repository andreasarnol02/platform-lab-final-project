import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";
import BrandMark from "./BrandMark";
import Icon from "./Icon";

// Mirrors the web seller Layout header: forest green bar with the brand
// mark, "Seller" pill, logout action, and store/owner info line below.
export default function SellerHeader({ user, onLogout }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.row}>
        <View style={styles.brand}>
          <BrandMark size={28} dark showWordmark wordmarkDark />
          <View style={styles.sellerPill}>
            <Text style={styles.sellerPillText}>Seller</Text>
          </View>
        </View>
        <Pressable
          onPress={onLogout}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Keluar"
          style={styles.logout}
        >
          <Icon name="logout" size={18} color="#A3C4B5" />
        </Pressable>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.storeName} numberOfLines={1}>
          {user?.storeName || "Toko Saya"}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {user?.ownerName || user?.email || ""}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: theme.colors.forest,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    height: 56,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sellerPill: {
    backgroundColor: "rgba(196, 241, 214, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(177, 224, 199, 0.27)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sellerPillText: {
    color: "#B7E6CA",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  logout: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 10,
    paddingTop: 2,
  },
  storeName: {
    color: "#E9F7EF",
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },
  sub: {
    color: "#7FA695",
    fontSize: 11,
    flexShrink: 1,
  },
});
