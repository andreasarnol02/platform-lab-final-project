import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

// Mirrors web/src/components/ProductImage.jsx: renders the image or a
// green "m" placeholder when there is no src or the image fails to load.
const findFontSize = (s) => {
  if (!s) return undefined;
  if (Array.isArray(s)) {
    for (const item of s) {
      const f = findFontSize(item);
      if (f != null) return f;
    }
    return undefined;
  }
  return s.fontSize;
};

export default function ProductImage({ src, alt, style, placeholderStyle, imageStyle }) {
  const [failed, setFailed] = useState(false);
  const placeholderFontSize = findFontSize(placeholderStyle);

  if (!src || failed) {
    return (
      <View
        style={[styles.fallback, style, placeholderStyle]}
        accessible
        accessibilityLabel={alt || "Gambar produk"}
      >
        <Text
          style={[
            styles.fallbackText,
            placeholderFontSize ? { fontSize: placeholderFontSize } : null,
          ]}
        >
          m
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={[style, imageStyle]}
      resizeMode="cover"
      onError={() => setFailed(true)}
      accessible
      accessibilityLabel={alt || "Gambar produk"}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  fallbackText: {
    color: theme.colors.green,
    fontSize: 40,
    fontWeight: "900",
  },
});
