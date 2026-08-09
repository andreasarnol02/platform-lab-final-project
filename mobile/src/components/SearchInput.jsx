import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";

// Mirrors the web .commerce-search input.
export default function SearchInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Cari laptop, sneakers, kopi...",
  autoFocus,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Icon name="search" size={20} color={theme.colors.muted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel="Cari produk"
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText?.("")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian"
          style={styles.clear}
        >
          <Icon name="close" size={16} color={theme.colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F5F8F6",
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  containerFocused: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.white,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.ink,
    paddingVertical: 0,
  },
  clear: {
    padding: 4,
  },
});
