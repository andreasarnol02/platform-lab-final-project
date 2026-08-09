import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

// Standard page title row: title (pageTitle token) + optional action node
// (e.g. an AppButton) aligned to the right.
export default function PageHeading({ title, action, style }) {
  return (
    <View style={[styles.row, style]}>
      <Text style={theme.typography.pageTitle}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 8,
  },
});
