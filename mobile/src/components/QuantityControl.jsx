import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";

const BUTTON_SIZES = { sm: 32, md: 40, lg: 44 };

// Mirrors the web .qty-control (44px buttons there; md defaults to 40 per the
// design-system touch target ≥40px, sm stays at 32).
export default function QuantityControl({
  value,
  min = 1,
  max = Infinity,
  onChange,
  size = "md",
  disabled,
}) {
  const btnSize = BUTTON_SIZES[size] || 40;
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => canDecrease && onChange?.(value - 1)}
        disabled={!canDecrease}
        accessibilityRole="button"
        accessibilityLabel="Kurangi jumlah"
        style={[styles.button, { width: btnSize, height: btnSize }, !canDecrease && styles.disabledBtn]}
      >
        <Icon name="minus" size={16} color={theme.colors.ink} />
      </Pressable>
      <Text style={styles.count}>{value}</Text>
      <Pressable
        onPress={() => canIncrease && onChange?.(value + 1)}
        disabled={!canIncrease}
        accessibilityRole="button"
        accessibilityLabel="Tambah jumlah"
        style={[styles.button, { width: btnSize, height: btnSize }, !canIncrease && styles.disabledBtn]}
      >
        <Icon name="plus" size={16} color={theme.colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  count: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
    minWidth: 32,
    textAlign: "center",
  },
});
