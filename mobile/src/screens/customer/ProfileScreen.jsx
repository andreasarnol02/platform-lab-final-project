import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import Panel from "../../components/Panel";
import AppButton from "../../components/AppButton";
import { Spinner } from "../../components/states";
import { getInitial } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import RequireLogin from "./RequireLogin";

const FIELDS = [
  { key: "name", label: "Nama", getValue: (u) => u?.name },
  { key: "email", label: "Email", getValue: (u) => u?.email },
  { key: "phone", label: "No. HP", getValue: (u) => u?.phone },
  { key: "address", label: "Alamat", getValue: (u) => u?.address },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, booting, logout, refreshProfile } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refreshProfile().catch(() => {});
    }, [refreshProfile])
  );

  if (booting) return <Spinner />;
  if (!user) {
    return (
      <RequireLogin
        title="Masuk untuk melihat profil"
        message="Login untuk melihat informasi akunmu."
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={theme.typography.pageTitle}>Profil Saya</Text>

      <Panel style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
          </View>
          <View style={styles.avatarCol}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {FIELDS.map((field) => (
          <View key={field.key} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={styles.fieldValue}>{field.getValue(user) || "—"}</Text>
          </View>
        ))}

        <AppButton
          variant="outlineDanger"
          block
          title="Keluar dari Akun"
          style={styles.logout}
          onPress={() => {
            logout();
            navigation.replace("Login");
          }}
        />
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: 14,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    gap: 14,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.greenDark,
  },
  avatarCol: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  email: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  fieldLabel: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  fieldValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    color: theme.colors.inkSoft,
  },
  logout: {
    marginTop: 2,
  },
});
