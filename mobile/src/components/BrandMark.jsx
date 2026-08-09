import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

// Replicates the web .commerce-brand-mark + .navbar-brand:
// a rotated green square with a white lowercase "m", optional wordmark.
export default function BrandMark({
  size = 31,
  markSize,
  dark = false,
  showWordmark = false,
  wordmarkDark,
}) {
  const markFontSize = markSize ?? Math.round(size * 0.645); // web: 20px on 31px mark
  const wordmarkFontSize = Math.round(size * 0.645);
  const wordDark = wordmarkDark != null ? wordmarkDark : dark;

  const marketColor = wordDark ? theme.colors.white : theme.colors.ink;
  const placeColor = wordDark ? theme.colors.ribbonTextSoft : theme.colors.greenDark;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.32), // web: 10px on 31px
          },
        ]}
      >
        <Text style={[styles.markText, { fontSize: markFontSize, lineHeight: size }]}>m</Text>
      </View>
      {showWordmark ? (
        <Text
          style={[
            styles.wordmark,
            { color: marketColor, fontSize: wordmarkFontSize, letterSpacing: -0.045 * wordmarkFontSize },
          ]}
        >
          market<Text style={{ color: placeColor }}>place</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mark: {
    backgroundColor: theme.colors.green,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-7deg" }],
  },
  markText: {
    color: theme.colors.white,
    fontWeight: "900",
    textAlign: "center",
  },
  wordmark: {
    fontWeight: "800",
  },
});
