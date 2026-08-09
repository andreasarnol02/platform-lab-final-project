import { StyleSheet, View } from "react-native";
import { theme } from "../theme";

// White card with the design-system shadow.
export default function Panel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    padding: 16,
    ...theme.shadow,
  },
});
