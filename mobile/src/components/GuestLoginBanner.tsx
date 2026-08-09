import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Lock, LogIn, UserPlus, ShieldAlert, Store, ShoppingBag } from "lucide-react-native";
import { colors, spacing, borderRadius, shadows } from "../theme";

interface GuestLoginBannerProps {
  title?: string;
  description?: string;
  role?: "customer" | "seller";
  badgeText?: string;
  onLogin: () => void;
  onRegister: () => void;
}

export const GuestLoginBanner: React.FC<GuestLoginBannerProps> = ({
  title,
  description,
  role = "customer",
  badgeText,
  onLogin,
  onRegister,
}) => {
  const isSeller = role === "seller";
  const defaultTitle = isSeller ? "Akses Toko Diperlukan" : "Belum Login";
  const defaultDescription = isSeller
    ? "Silakan login sebagai Seller / Toko untuk mengakses dan mengelola fitur toko Anda."
    : "Silakan login atau daftar akun pembeli untuk menikmati fitur lengkap marketplace.";
  const defaultBadge = badgeText || (isSeller ? "Akun Seller Diperlukan" : "Pengguna Tamu");

  const IconComponent = isSeller ? Store : ShoppingBag;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Hero Circle Icon */}
        <View style={styles.iconCircle}>
          <IconComponent size={32} color={colors.storefront.greenDark} />
          <View style={styles.lockBadgeMini}>
            <Lock size={12} color={colors.white} />
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.badgeContainer}>
          <ShieldAlert size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>{defaultBadge}</Text>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{title || defaultTitle}</Text>
        <Text style={styles.description}>{description || defaultDescription}</Text>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={onLogin}
          >
            <LogIn size={18} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>
              {isSeller ? "Masuk sebagai Seller" : "Masuk ke Akun"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={onRegister}
          >
            <UserPlus size={18} color={colors.storefront.greenDark} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryButtonText}>
              {isSeller ? "Daftar Toko Baru" : "Daftar Akun Baru"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.hero,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.lineLight,
    ...shadows.card,
  },
  iconCircle: {
    position: "relative",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.green,
  },
  lockBadgeMini: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.storefront.greenDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  badgeText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.storefront.ink,
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  primaryButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.storefront.greenLight,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  secondaryButtonText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 14,
  },
});
