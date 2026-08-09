import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";

const VARIANT_STYLES = {
  primary: { backgroundColor: theme.colors.green },
  ghost: { backgroundColor: "transparent" },
  light: { backgroundColor: theme.colors.white },
  outlineLight: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  outlineDanger: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  danger: { backgroundColor: theme.colors.danger },
};

const TEXT_STYLES = {
  primary: theme.colors.white,
  ghost: theme.colors.greenDark,
  light: theme.colors.greenDark,
  outlineLight: theme.colors.white,
  outlineDanger: theme.colors.danger,
  danger: theme.colors.white,
};

const SIZE_STYLES = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13, iconSize: 14 },
  md: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 14, iconSize: 16 },
  lg: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16, iconSize: 18 },
};

export default function AppButton({
  title,
  variant = "primary",
  size = "md",
  block,
  onPress,
  disabled,
  loading,
  icon,
  style,
  titleColor,
}) {
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;
  const textColor = titleColor || TEXT_STYLES[variant] || TEXT_STYLES.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        VARIANT_STYLES[variant],
        block && styles.block,
        pressed && (variant === "ghost" ? styles.pressedGhost : styles.pressedOpacity),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={sizeStyle.iconSize} color={textColor} /> : null}
          <Text style={[styles.label, { color: textColor, fontSize: sizeStyle.fontSize }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    minHeight: 40,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontWeight: "600",
  },
  block: {
    alignSelf: "stretch",
  },
  pressedGhost: {
    backgroundColor: theme.colors.greenLight,
  },
  pressedOpacity: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
