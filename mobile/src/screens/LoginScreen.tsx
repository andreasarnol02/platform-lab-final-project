import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, Store, LogIn } from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { CustomAlertModal, ModalType } from "../components/CustomAlertModal";
import { colors, spacing, borderRadius, shadows } from "../theme";
import {
  setCustomerToken,
  setSellerToken,
  setUserRole,
  setCustomerData,
  setSellerData,
} from "../utils/storage";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<"customer" | "seller">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom Alert Modal State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlert = (
    type: ModalType,
    title: string,
    message: string,
    onConfirm: () => void = () => {},
    confirmText = "Mengerti"
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      confirmText,
      onConfirm,
    });
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showAlert("warning", "Input Tidak Lengkap", "Silakan masukkan alamat email Anda.");
      return;
    }
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      showAlert("warning", "Format Salah", "Masukkan alamat email yang valid.");
      return;
    }
    if (!password) {
      showAlert("warning", "Input Tidak Lengkap", "Silakan masukkan kata sandi Anda.");
      return;
    }

    setLoading(true);

    try {
      if (selectedRole === "customer") {
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

        showAlert(
          "success",
          "Berhasil Login Pelanggan",
          "Selamat datang kembali di Storefront Marketplace!",
          () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace("Home");
            }
          },
          "Mulai Belanja"
        );
      } else {
        const mockToken = `seller_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sellerProfile = {
          id: `seller_${Date.now()}`,
          storeName: `${trimmedEmail.split("@")[0]} Official Store`,
          ownerName: trimmedEmail.split("@")[0] || "Pemilik Toko",
          email: trimmedEmail,
          phone: "081298765432",
          createdAt: new Date().toISOString(),
        };

        await setSellerToken(mockToken);
        await setUserRole("seller");
        await setSellerData(sellerProfile);

        showAlert(
          "success",
          "Berhasil Login Penjual",
          "Selamat datang di Dashboard Penjual Storefront!",
          () => {
            navigation.replace("Profile");
          },
          "Ke Dashboard Toko"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert("danger", "Gagal Login", "Terjadi kesalahan saat masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Header Bar with Safe Top Padding */}
      <View
        style={[
          styles.topHeader,
          { paddingTop: Math.max(insets.top + spacing.xs, spacing.md) },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonPill}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.storefront.ink} />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Masuk ({selectedRole === "seller" ? "Penjual" : "Pelanggan"})
        </Text>
        <View style={{ width: 70 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxl) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* User Role Segmented Selector Toggle */}
          <View style={styles.roleToggleBar}>
            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === "customer" && styles.roleTabActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedRole("customer")}
            >
              <User
                size={16}
                color={
                  selectedRole === "customer"
                    ? colors.white
                    : colors.storefront.inkSoft
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === "customer" && styles.roleTabTextActive,
                ]}
              >
                Pelanggan (Customer)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === "seller" && styles.roleTabActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedRole("seller")}
            >
              <Store
                size={16}
                color={
                  selectedRole === "seller"
                    ? colors.white
                    : colors.storefront.inkSoft
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === "seller" && styles.roleTabTextActive,
                ]}
              >
                Penjual (Seller)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Welcome Banner with Lucide Hero Icon */}
          <View style={styles.welcomeSection}>
            <View style={styles.heroIconBadge}>
              {selectedRole === "seller" ? (
                <Store size={28} color={colors.storefront.greenDark} />
              ) : (
                <User size={28} color={colors.storefront.greenDark} />
              )}
            </View>
            <Text style={styles.welcomeTitle}>
              {selectedRole === "seller"
                ? "Masuk Akun Penjual"
                : "Masuk Akun Pelanggan"}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {selectedRole === "seller"
                ? "Kelola katalog toko, pantau pesanan masuk, dan analisis pendapatan."
                : "Masuk untuk menikmati pengalaman belanja mudah di berbagai toko marketplace."}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {selectedRole === "seller" ? "Email Toko / Penjual *" : "Alamat Email *"}
              </Text>
              <View style={styles.inputIconWrapper}>
                <Mail size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder={
                    selectedRole === "seller"
                      ? "contoh: seller@store.com"
                      : "contoh: nama@email.com"
                  }
                  placeholderTextColor={colors.storefront.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kata Sandi *</Text>
              <View style={styles.inputIconWrapper}>
                <Lock size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, { flex: 1 }]}
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
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.storefront.greenDark} />
                  ) : (
                    <Eye size={18} color={colors.storefront.muted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LogIn size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.submitButtonText}>
                {loading
                  ? "Memproses..."
                  : selectedRole === "seller"
                  ? "Masuk Sebagai Penjual"
                  : "Masuk Sebagai Pelanggan"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Register Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={styles.footerText}>Belum memiliki akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Daftar Akun Baru</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert Dialog */}
      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        onConfirm={alertConfig.onConfirm}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
    ...shadows.subtle,
    zIndex: 10,
  },
  backButtonPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    gap: 4,
  },
  backButtonText: {
    color: colors.storefront.ink,
    fontWeight: "700",
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  scrollContainer: {
    padding: spacing.xl,
  },
  roleToggleBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  roleTabActive: {
    backgroundColor: colors.storefront.green,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
  },
  roleTabTextActive: {
    color: colors.white,
  },
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  heroIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.green,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.storefront.inkSoft,
    lineHeight: 21,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.storefront.line,
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
  inputIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
    borderRadius: borderRadius.md,
    backgroundColor: colors.storefront.bg,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  inputWithIcon: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: colors.storefront.ink,
  },
  togglePasswordButton: {
    padding: spacing.xs,
  },
  submitButton: {
    flexDirection: "row",
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
    fontSize: 15,
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
