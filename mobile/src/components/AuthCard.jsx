import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import BrandMark from "./BrandMark";

// Shared auth shell: centered white card with brand mark, optional seller
// pill, title, subtitle, error box, form children and footer alt-links.
export default function AuthCard({
  title,
  subtitle,
  error,
  sellerPill,
  children,
  footer,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.brandWrap}>
        <BrandMark showWordmark />
      </View>

      {sellerPill ? (
        <View style={styles.sellerPill}>
          <Text style={styles.sellerPillText}>{sellerPill}</Text>
        </View>
      ) : null}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {children}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
    marginTop: 16,
    padding: 24,
    borderRadius: 18,
    gap: 14,
    backgroundColor: theme.colors.white,
    ...theme.shadow,
  },
  brandWrap: {
    alignItems: "center",
  },
  sellerPill: {
    backgroundColor: "rgba(0,168,107,0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "center",
  },
  sellerPillText: {
    color: theme.colors.greenDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: theme.colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#FDECEA",
    borderWidth: 1,
    borderColor: "#F5C6C2",
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.danger,
  },
  footer: {
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
});
