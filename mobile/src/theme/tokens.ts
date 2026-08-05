/**
 * Storefront Green Palette Design Tokens
 * Premium, high-contrast tokens tailored for modern React Native UI.
 */

export const colors = {
  storefront: {
    green: "#00A86B",
    greenDark: "#007D5A",
    greenLight: "#E3F6ED",
    greenSubtle: "#F0FDF6",
    ink: "#0F1715",
    inkSoft: "#3A4D46",
    muted: "#6B7C75",
    line: "#E2ECE7",
    lineLight: "#F0F4F2",
    bg: "#F7FAF8",
    danger: "#D32F2F",
    warning: "#D97706",
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
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray600: "#4B5563",
  overlay: "rgba(15, 23, 21, 0.6)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const borderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  hero: 28,
  full: 9999,
};

export const shadows = {
  subtle: {
    shadowColor: colors.storefront.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: colors.storefront.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  floating: {
    shadowColor: colors.storefront.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    shadowColor: colors.storefront.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const typography = {
  headerTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: colors.storefront.ink,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800" as const,
    color: colors.storefront.ink,
    letterSpacing: -0.2,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.storefront.ink,
  },
  body: {
    fontSize: 14,
    color: colors.storefront.ink,
    lineHeight: 20,
  },
  bodySoft: {
    fontSize: 14,
    color: colors.storefront.inkSoft,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: colors.storefront.muted,
    lineHeight: 16,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 0.2,
  },
  price: {
    fontSize: 16,
    fontWeight: "900" as const,
    color: colors.storefront.greenDark,
    letterSpacing: -0.3,
  },
};
