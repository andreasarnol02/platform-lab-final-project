import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "./tokens";

/**
 * Reusable StyleSheet Presets for Tokopedia Mobile UI
 */
export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.tokopedia.bg,
  },
  scrollContainer: {
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.tokopedia.line,
    shadowColor: colors.tokopedia.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeGreen: {
    backgroundColor: colors.tokopedia.greenLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  badgeGreenText: {
    color: colors.tokopedia.greenDark,
    fontWeight: "700",
    fontSize: 12,
  },
  buttonPrimary: {
    backgroundColor: colors.tokopedia.green,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.tokopedia.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonPrimaryText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.tokopedia.line,
    marginVertical: spacing.sm,
  },
});
