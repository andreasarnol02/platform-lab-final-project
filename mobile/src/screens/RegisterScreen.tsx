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

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert("Input Wajib", "Silakan masukkan nama lengkap Anda.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      Alert.alert("Input Tidak Valid", "Masukkan alamat email yang valid.");
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert(
        "Kata Sandi Lemah",
        "Kata sandi minimal harus terdiri dari 6 karakter."
      );
      return;
    }

    setLoading(true);

    try {
      // Simulate Customer Registration & JWT Token Issuance
      const mockToken = `cust_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newCustomer = {
        id: `cust_${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        phone: phone.trim() || "081234567890",
        address: address.trim() || "Alamat Pengiriman Utama",
        createdAt: new Date().toISOString(),
      };

      await setCustomerToken(mockToken);
      await setUserRole("customer");
      await setCustomerData(newCustomer);

      Alert.alert(
        "Pendaftaran Berhasil",
        `Selamat datang, ${trimmedName}! Akun Anda telah berhasil dibuat.`,
        [
          {
            text: "Mulai Belanja",
            onPress: () => {
              navigation.replace("Home");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Gagal Mendaftar", "Terjadi kesalahan. Silakan coba beberapa saat lagi.");
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
            <Text style={styles.headerTitle}>Daftar Akun Pelanggan</Text>
          </View>

          {/* Welcome Title */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Buat Akun Baru</Text>
            <Text style={styles.welcomeSubtitle}>
              Isi data diri di bawah untuk mulai berbelanja produk berkualitas.
            </Text>
          </View>

          {/* Registration Form */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap *</Text>
              <TextInput
                style={styles.input}
                placeholder="contoh: Budi Santoso"
                placeholderTextColor={colors.storefront.muted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="contoh: budi@email.com"
                placeholderTextColor={colors.storefront.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Handphone</Text>
              <TextInput
                style={styles.input}
                placeholder="contoh: 081234567890"
                placeholderTextColor={colors.storefront.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat Pengiriman</Text>
              <TextInput
                style={[styles.input, { height: 72, paddingTop: spacing.sm }]}
                placeholder="Alamat lengkap pengiriman barang"
                placeholderTextColor={colors.storefront.muted}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kata Sandi (Min. 6 Karakter) *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      borderRightWidth: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  ]}
                  placeholder="Buat kata sandi aman"
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
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Mendaftarkan..." : "Daftar Akun"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerPrompt}>
            <Text style={styles.footerText}>Sudah memiliki akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
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
    marginBottom: spacing.xl,
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
  loginLink: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.green,
  },
});
