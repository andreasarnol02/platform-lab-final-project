import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import AppButton from "../../components/AppButton";
import { EmptyState } from "../../components/states";

// Guard shown on protected customer screens when the user is not logged in.
export default function RequireLogin({ title, message }) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrap}>
      <EmptyState icon="bag" title={title} message={message}>
        <AppButton
          title="Masuk"
          onPress={() => navigation.navigate("Login", { redirect: "back" })}
        />
      </EmptyState>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
  },
});
