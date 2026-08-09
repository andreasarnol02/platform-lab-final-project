import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows } from "./tokens";

/**
 * Storefront Green Palette Reusable StyleSheet Presets for Storefront Mobile UI
 */
export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  scrollContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  badgeGreen: {
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  badgeGreenText: {
    color: colors.storefront.greenDark,
    fontWeight: "700",
    fontSize: 11,
  },
  buttonPrimary: {
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  buttonPrimaryText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.storefront.line,
    marginVertical: spacing.md,
  },
});
