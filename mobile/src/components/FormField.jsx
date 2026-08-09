import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

// Shared TextInput style factory for the design system input look.
// Callers manage focus state and pass it to their own TextInput.
export const inputStyle = (focused, hasError) => ({
  height: 44,
  borderWidth: 1,
  borderColor: hasError
    ? theme.colors.danger
    : focused
      ? theme.colors.green
      : theme.colors.line,
  borderRadius: 10,
  paddingHorizontal: 12,
  fontSize: 14,
  backgroundColor: theme.colors.white,
  color: theme.colors.ink,
});

// Field wrapper: label row (required "*") + children + error text.
export default function FormField({ label, required, error, containerStyle, children }) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.inkSoft,
  },
  required: {
    color: theme.colors.greenDark,
  },
  error: {
    fontSize: 12,
    color: theme.colors.danger,
  },
});
