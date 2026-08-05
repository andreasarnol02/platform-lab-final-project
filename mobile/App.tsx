import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CONFIG from "./src/services/config";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "./src/data/mockData";
import { getUserRole, setUserRole, setCustomerToken, getCustomerToken } from "./src/utils/storage";
import { UserRole } from "./src/types";
import { colors, spacing, borderRadius, typography, commonStyles } from "./src/theme";

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>(null);
  const [savedToken, setSavedToken] = useState<string | null>(null);

  useEffect(() => {
    const loadStorage = async () => {
      await setCustomerToken("mock_jwt_customer_token_xyz123");
      await setUserRole("customer");
      const role = await getUserRole();
      const token = await getCustomerToken();
      setActiveRole(role);
      setSavedToken(token);
    };
    loadStorage();
  }, []);

  const handleRoleToggle = async (role: UserRole) => {
    await setUserRole(role);
    setActiveRole(role);
  };

  const getOrderStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bg: colors.status.pendingBg, text: colors.status.pendingText };
      case "PAID":
        return { bg: colors.status.paidBg, text: colors.status.paidText };
      case "PROCESSED":
        return { bg: colors.status.processedBg, text: colors.status.processedText };
      case "SHIPPED":
        return { bg: colors.status.shippedBg, text: colors.status.shippedText };
      case "COMPLETED":
        return { bg: colors.status.completedBg, text: colors.status.completedText };
      default:
        return { bg: colors.status.cancelledBg, text: colors.status.cancelledText };
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header Badge */}
        <View style={styles.headerContainer}>
          <View style={commonStyles.badgeGreen}>
            <Text style={commonStyles.badgeGreenText}>
              {CONFIG.APP_NAME} • Tokopedia Design System
            </Text>
          </View>
          <Text style={typography.headerTitle}>
            Data Architecture & Theme Demo
          </Text>
        </View>

        {/* Storage Helper Verification Card */}
        <View style={commonStyles.card}>
          <Text style={styles.cardHeaderTitle}>
            AsyncStorage Helper Verification
          </Text>

          <View style={styles.infoRow}>
            <Text style={typography.body}>Active USER_ROLE</Text>
            <View style={commonStyles.badgeGreen}>
              <Text style={commonStyles.badgeGreenText}>
                {activeRole ? activeRole.toUpperCase() : "NONE"}
              </Text>
            </View>
          </View>

          <View style={styles.tokenBox}>
            <Text style={typography.caption}>CUSTOMER_JWT_TOKEN</Text>
            <Text style={styles.tokenText}>{savedToken || "No token saved"}</Text>
          </View>

          {/* Role Switcher buttons */}
          <Text style={[typography.caption, { marginBottom: spacing.sm }]}>
            Switch Active Role:
          </Text>
          <View style={styles.roleButtonRow}>
            <TouchableOpacity
              onPress={() => handleRoleToggle("customer")}
              style={[
                styles.roleButton,
                activeRole === "customer" ? styles.roleButtonActive : styles.roleButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  activeRole === "customer" ? styles.roleButtonTextActive : styles.roleButtonTextInactive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRoleToggle("seller")}
              style={[
                styles.roleButton,
                activeRole === "seller" ? styles.roleButtonActive : styles.roleButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  activeRole === "seller" ? styles.roleButtonTextActive : styles.roleButtonTextInactive,
                ]}
              >
                Seller
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mock Product Catalog Preview */}
        <View style={commonStyles.card}>
          <View style={commonStyles.rowBetween}>
            <Text style={styles.cardHeaderTitle}>
              Mock Products ({MOCK_PRODUCTS.length} items)
            </Text>
            <Text style={commonStyles.badgeGreenText}>Dual-Role Sellers</Text>
          </View>

          {MOCK_PRODUCTS.slice(0, 3).map((prod) => (
            <View key={prod.id} style={styles.productRow}>
              <View style={commonStyles.rowBetween}>
                <Text style={[typography.body, { fontWeight: "700", flex: 1 }]} numberOfLines={1}>
                  {prod.name}
                </Text>
                <Text style={typography.price}>
                  Rp {prod.price.toLocaleString("id-ID")}
                </Text>
              </View>
              <View style={[commonStyles.rowBetween, { marginTop: spacing.xs }]}>
                <Text style={typography.caption}>{prod.sellerStoreName}</Text>
                <View style={commonStyles.badgeGreen}>
                  <Text style={commonStyles.badgeGreenText}>Stok: {prod.stock}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Mock Orders Lifecycle Preview */}
        <View style={commonStyles.card}>
          <Text style={styles.cardHeaderTitle}>
            Mock Orders Cycle ({MOCK_ORDERS.length} orders)
          </Text>

          {MOCK_ORDERS.map((ord) => {
            const statusStyle = getOrderStatusStyle(ord.status);
            return (
              <View key={ord.id} style={styles.orderRow}>
                <View>
                  <Text style={[typography.body, { fontWeight: "700" }]}>
                    {ord.id} • {ord.customerName}
                  </Text>
                  <Text style={typography.caption}>{ord.sellerStoreName}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
                    {ord.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Phase Status Banner */}
        <View style={commonStyles.buttonPrimary}>
          <Text style={commonStyles.buttonPrimaryText}>
            Tokopedia Theme Module Active ✨
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.tokopedia.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.tokopedia.line,
    marginBottom: spacing.md,
  },
  tokenBox: {
    backgroundColor: colors.tokopedia.bg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  tokenText: {
    fontSize: 12,
    color: colors.tokopedia.inkSoft,
    fontFamily: "monospace",
    marginTop: spacing.xs,
  },
  roleButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: colors.tokopedia.green,
  },
  roleButtonInactive: {
    backgroundColor: colors.gray100,
  },
  roleButtonText: {
    fontWeight: "700",
    fontSize: 12,
  },
  roleButtonTextActive: {
    color: colors.white,
  },
  roleButtonTextInactive: {
    color: colors.tokopedia.ink,
  },
  productRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.tokopedia.line,
  },
  orderRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.tokopedia.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
