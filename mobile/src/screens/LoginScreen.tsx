import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { colors, spacing, borderRadius, shadows } from "../theme";
import {
  setCustomerToken,
  setUserRole,
  setCustomerData,
} from "../utils/storage";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Input Tidak Lengkap", "Silakan masukkan alamat email Anda.");
      return;
    }
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      Alert.alert("Format Salah", "Masukkan alamat email yang valid.");
      return;
    }
    if (!password) {
      Alert.alert("Input Tidak Lengkap", "Silakan masukkan kata sandi Anda.");
      return;
    }

    setLoading(true);

    try {
      // Simulate JWT Token Authentication
      const mockToken = `cust_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const customerProfile = {
        id: `cust_${Date.now()}`,
        name: trimmedEmail.split("@")[0] || "Pelanggan",
        email: trimmedEmail,
        phone: "081234567890",
        address: "Jl. Sudirman No. 45, Jakarta",
        createdAt: new Date().toISOString(),
      };

      await setCustomerToken(mockToken);
      await setUserRole("customer");
      await setCustomerData(customerProfile);

      Alert.alert("Berhasil Login", "Selamat datang kembali di Tokopedia Marketplace!", [
        {
          text: "OK",
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace("Home");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Gagal Login", "Terjadi kesalahan saat masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Masuk Akun</Text>
          </View>

          {/* Welcome Banner */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Selamat Datang Pelanggan</Text>
            <Text style={styles.welcomeSubtitle}>
              Masuk untuk menikmati pengalaman belanja mudah di berbagai toko marketplace.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat Email</Text>
              <TextInput
                style={styles.input}
                placeholder="contoh: nama@email.com"
                placeholderTextColor={colors.storefront.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                  placeholder="Masukkan kata sandi Anda"
                  placeholderTextColor={colors.storefront.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.togglePasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.togglePasswordText}>
                    {showPassword ? "Sembunyikan" : "Tampilkan"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Memproses..." : "Masuk Sekarang"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Register Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={styles.footerText}>Belum memiliki akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  scrollContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.hero,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    ...shadows.subtle,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.storefront.ink,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  welcomeSection: {
    marginBottom: spacing.xxl,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.storefront.inkSoft,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.storefront.ink,
    backgroundColor: colors.storefront.bg,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  togglePasswordButton: {
    height: 48,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.storefront.lineLight,
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: colors.storefront.line,
  },
  togglePasswordText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.greenDark,
  },
  submitButton: {
    height: 50,
    backgroundColor: colors.storefront.green,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    ...shadows.button,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  footerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.storefront.muted,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.green,
  },
});
