import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";
import AppButton from "./AppButton";

// Mirrors web/src/components/states.jsx.
export function Spinner({ label = "Memuat..." }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={theme.colors.green} size="large" />
      <Text style={styles.message}>{label}</Text>
    </View>
  );
}

export function EmptyState({ icon = "grid", title, message, children }) {
  return (
    <View style={styles.box}>
      <View style={styles.iconTile}>
        <Icon name={icon} size={26} color={theme.colors.greenDark} />
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children}
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <EmptyState icon="shield" title="Terjadi kesalahan" message={message}>
      {onRetry ? (
        <AppButton title="Coba lagi" variant="primary" size="sm" onPress={onRetry} />
      ) : null}
    </EmptyState>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.ink,
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
    lineHeight: 19,
  },
});
