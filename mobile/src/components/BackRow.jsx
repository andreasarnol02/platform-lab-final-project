import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import Icon from "./Icon";

// Shared back row: icon-only (no label) or icon + label.
// Renders nothing when there is no screen to go back to.
export default function BackRow({ label, onPress, style }) {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) return null;

  return (
    <Pressable
      style={[styles.row, style]}
      onPress={() => (onPress ? onPress() : navigation.goBack())}
      accessibilityRole="button"
      accessibilityLabel={label || "Kembali"}
      hitSlop={8}
    >
      <Icon name="arrowLeft" size={16} color={theme.colors.greenDark} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.greenDark,
  },
});
