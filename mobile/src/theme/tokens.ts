/**
 * Tokopedia Green Palette Design System Tokens
 * Single source of truth for colors, typography, spacing, and elevation.
 */

export const colors = {
  tokopedia: {
    green: "#00A86B",
    greenDark: "#007D5A",
    greenLight: "#E3F6ED",
    ink: "#172522",
    inkSoft: "#50645B",
    muted: "#71817C",
    line: "#E5ECE8",
    bg: "#F5F9F7",
    danger: "#D32F2F",
  },
  status: {
    pendingBg: "#FEF3C7",
    pendingText: "#92400E",
    paidBg: "#DBEAFE",
    paidText: "#1E40AF",
    processedBg: "#CCFBF1",
    processedText: "#115E59",
    shippedBg: "#F3E8FF",
    shippedText: "#6B21A8",
    completedBg: "#D1FAE5",
    completedText: "#065F46",
    cancelledBg: "#FEE2E2",
    cancelledText: "#991B1B",
  },
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F3F4F6",
  gray600: "#4B5563",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16,
  hero: 20,
  full: 9999,
};

export const typography = {
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.tokopedia.ink,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.tokopedia.ink,
  },
  body: {
    fontSize: 14,
    color: colors.tokopedia.ink,
  },
  bodySoft: {
    fontSize: 14,
    color: colors.tokopedia.inkSoft,
  },
  caption: {
    fontSize: 12,
    color: colors.tokopedia.muted,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  price: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: colors.tokopedia.greenDark,
  },
};
