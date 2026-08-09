// Design tokens mirroring web/src/styles/global.css and
// web/src/seller/styles/global.css (customer + seller, commerce direction).
// Single source of truth for colors, spacing, radii, typography and shadows.

export const theme = {
  colors: {
    green: "#00A86B",
    greenDark: "#007D5A",
    greenLight: "#E3F6ED",
    ink: "#172522",
    inkSoft: "#50645B",
    muted: "#71817C",
    line: "#E5ECE8",
    bg: "#F5F9F7",
    white: "#FFFFFF",
    danger: "#D32F2F",
    forest: "#143D31", // seller dark green
    ribbonText: "#D9EFE6",
    ribbonTextSoft: "#A9CFC1",
    amber: "#F9A825",
    status: {
      PENDING: { bg: "#FFF8E1", text: "#8A6D00" },
      PAID: { bg: "#E3F2FD", text: "#0D47A1" },
      PROCESSED: { bg: "#E8F5E9", text: "#2E7D32" },
      SHIPPED: { bg: "#EDE7F6", text: "#5E35B1" },
      COMPLETED: { bg: "#E3F6ED", text: "#007D5A" },
      CANCELLED: { bg: "#FDECEA", text: "#D32F2F" },
    },
    categoryTones: {
      mint: { bg: "#DFF6ED", text: "#008D67" },
      peach: { bg: "#FFEADF", text: "#D16E4B" },
      lavender: { bg: "#EEE8FB", text: "#7A5CC3" },
      yellow: { bg: "#FFF4C9", text: "#BE8A00" },
      blue: { bg: "#E2EFFA", text: "#4081B7" },
      rose: { bg: "#FAE6EE", text: "#BB5B7E" },
      gray: { bg: "#EDF1EF", text: "#72817B" },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    giant: 48,
    massive: 56,
  },
  radii: {
    small: 8,
    card: 14,
    hero: 20,
    pill: 999,
  },
  typography: {
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 22,
      xxxl: 30,
    },
    fontWeight: {
      regular: "400",
      medium: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.65,
    },
    // Eyebrow / section label: uppercase + textTransform applied at call sites.
    eyebrow: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.4,
    },
    // Page heading title.
    pageTitle: {
      fontSize: 30,
      fontWeight: "800",
      letterSpacing: -0.5,
      color: "#172522",
    },
  },
  // Web: 0 12px 28px rgba(23, 37, 34, 0.09)
  shadow: {
    shadowColor: "#172522",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 28,
    elevation: 8,
  },
};

export default theme;
