import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import AppButton from "../../components/AppButton";
import { EmptyState } from "../../components/states";

export default function NotFoundScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.wrap}>
      <EmptyState
        icon="map"
        title="Halaman tidak ditemukan"
        message="Halaman yang kamu cari tidak ada."
      >
        <AppButton title="Kembali ke Beranda" onPress={() => navigation.navigate("HomeTab")} />
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
