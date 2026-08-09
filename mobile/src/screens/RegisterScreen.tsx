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
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Store,
  Briefcase,
  UserPlus,
} from "lucide-react-native";
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
import { CONFIG } from "../services/config";
import { authService } from "../services/authService";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<"customer" | "seller">("customer");

  // Customer Form State (customer.js schema: name, email, password, phone, address)
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Seller Form State (seller.js schema: storeName, ownerName, email, password, phone)
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

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

  const handleRegister = async () => {
    if (selectedRole === "customer") {
      const trimmedName = customerName.trim();
      const trimmedEmail = customerEmail.trim();

      if (!trimmedName) {
        showAlert("warning", "Input Wajib", "Silakan masukkan nama lengkap Anda.");
        return;
      }
      if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
        showAlert("warning", "Input Tidak Valid", "Masukkan alamat email yang valid.");
        return;
      }
      if (!password || password.length < 6) {
        showAlert("warning", "Kata Sandi Lemah", "Kata sandi minimal harus terdiri dari 6 karakter.");
        return;
      }

      setLoading(true);

      try {
        if (!CONFIG.USE_MOCK_DATA) {
          await authService.registerCustomer({
            name: trimmedName,
            email: trimmedEmail,
            password,
            phone: customerPhone.trim() || "081234567890",
            address: customerAddress.trim() || "Alamat Pengiriman Utama",
          });
        } else {
          const mockToken = `cust_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newCustomer = {
            id: `cust_${Date.now()}`,
            name: trimmedName,
            email: trimmedEmail,
            phone: customerPhone.trim() || "081234567890",
            address: customerAddress.trim() || "Alamat Pengiriman Utama",
            createdAt: new Date().toISOString(),
          };

          await setCustomerToken(mockToken);
          await setUserRole("customer");
          await setCustomerData(newCustomer);
        }

        showAlert(
          "success",
          "Pendaftaran Pelanggan Berhasil",
          `Selamat datang, ${trimmedName}! Akun Anda telah berhasil dibuat.`,
          () => {
            navigation.replace("Home");
          },
          "Mulai Belanja"
        );
      } catch (error: any) {
        console.error("Customer Register error:", error);
        const msg = error?.message || "Terjadi kesalahan saat pendaftaran. Silakan coba lagi.";
        showAlert("danger", "Gagal Mendaftar", msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Seller Registration
      const trimmedStore = storeName.trim();
      const trimmedOwner = ownerName.trim();
      const trimmedEmail = sellerEmail.trim();

      if (!trimmedStore) {
        showAlert("warning", "Input Wajib", "Silakan masukkan nama toko penjual.");
        return;
      }
      if (!trimmedOwner) {
        showAlert("warning", "Input Wajib", "Silakan masukkan nama pemilik toko.");
        return;
      }
      if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
        showAlert("warning", "Input Tidak Valid", "Masukkan email toko yang valid.");
        return;
      }
      if (!password || password.length < 6) {
        showAlert("warning", "Kata Sandi Lemah", "Kata sandi minimal harus terdiri dari 6 karakter.");
        return;
      }

      setLoading(true);

      try {
        if (!CONFIG.USE_MOCK_DATA) {
          await authService.registerSeller({
            storeName: trimmedStore,
            ownerName: trimmedOwner,
            email: trimmedEmail,
            password,
            phone: sellerPhone.trim() || "081298765432",
          });
        } else {
          const mockToken = `seller_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newSeller = {
            id: `seller_${Date.now()}`,
            storeName: trimmedStore,
            ownerName: trimmedOwner,
            email: trimmedEmail,
            phone: sellerPhone.trim() || "081298765432",
            createdAt: new Date().toISOString(),
          };

          await setSellerToken(mockToken);
          await setUserRole("seller");
          await setSellerData(newSeller);
        }

        showAlert(
          "success",
          "Pendaftaran Toko Berhasil",
          `Selamat, toko "${trimmedStore}" telah resmi terdaftar di Storefront Marketplace!`,
          () => {
            navigation.replace("Profile");
          },
          "Ke Dashboard Toko"
        );
      } catch (error: any) {
        console.error("Seller Register error:", error);
        const msg = error?.message || "Terjadi kesalahan saat pendaftaran toko. Silakan coba lagi.";
        showAlert("danger", "Gagal Mendaftar Toko", msg);
      } finally {
        setLoading(false);
      }
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
          Daftar ({selectedRole === "seller" ? "Penjual" : "Pelanggan"})
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

          {/* Welcome Title with Hero Lucide Badge */}
          <View style={styles.welcomeSection}>
            <View style={styles.heroIconBadge}>
              {selectedRole === "seller" ? (
                <Store size={28} color={colors.storefront.greenDark} />
              ) : (
                <UserPlus size={28} color={colors.storefront.greenDark} />
              )}
            </View>
            <Text style={styles.welcomeTitle}>
              {selectedRole === "seller"
                ? "Daftar Toko Baru"
                : "Buat Akun Pelanggan"}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {selectedRole === "seller"
                ? "Buka etalase toko Anda sendiri dan mulai jualan produk ke ribuan pelanggan."
                : "Isi data diri di bawah untuk mulai berbelanja produk berkualitas dari etalase."}
            </Text>
          </View>

          {/* Registration Form */}
          <View style={styles.formCard}>
            {selectedRole === "customer" ? (
              /* CUSTOMER FORM FIELDS (matches customer.js) */
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama Lengkap *</Text>
                  <View style={styles.inputIconWrapper}>
                    <User size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: Budi Santoso"
                      placeholderTextColor={colors.storefront.muted}
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Alamat Email *</Text>
                  <View style={styles.inputIconWrapper}>
                    <Mail size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: budi@email.com"
                      placeholderTextColor={colors.storefront.muted}
                      value={customerEmail}
                      onChangeText={setCustomerEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Handphone</Text>
                  <View style={styles.inputIconWrapper}>
                    <Phone size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: 081234567890"
                      placeholderTextColor={colors.storefront.muted}
                      value={customerPhone}
                      onChangeText={setCustomerPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Alamat Pengiriman Utama</Text>
                  <View style={[styles.inputIconWrapper, { alignItems: "flex-start", paddingTop: spacing.xs }]}>
                    <MapPin size={16} color={colors.storefront.muted} style={[styles.inputIcon, { marginTop: 4 }]} />
                    <TextInput
                      style={[styles.inputWithIcon, { height: 68, textAlignVertical: "top" }]}
                      placeholder="Alamat lengkap pengiriman barang"
                      placeholderTextColor={colors.storefront.muted}
                      value={customerAddress}
                      onChangeText={setCustomerAddress}
                      multiline
                    />
                  </View>
                </View>
              </>
            ) : (
              /* SELLER FORM FIELDS (matches seller.js: storeName, ownerName, email, phone) */
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama Toko Penjual *</Text>
                  <View style={styles.inputIconWrapper}>
                    <Store size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: Toko Elektro Jaya"
                      placeholderTextColor={colors.storefront.muted}
                      value={storeName}
                      onChangeText={setStoreName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama Pemilik Toko *</Text>
                  <View style={styles.inputIconWrapper}>
                    <Briefcase size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: Andi Wijaya"
                      placeholderTextColor={colors.storefront.muted}
                      value={ownerName}
                      onChangeText={setOwnerName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Resmi Toko *</Text>
                  <View style={styles.inputIconWrapper}>
                    <Mail size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: kontak@elektrojaya.id"
                      placeholderTextColor={colors.storefront.muted}
                      value={sellerEmail}
                      onChangeText={setSellerEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Kontak Toko / HP</Text>
                  <View style={styles.inputIconWrapper}>
                    <Phone size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      placeholder="contoh: 081298765432"
                      placeholderTextColor={colors.storefront.muted}
                      value={sellerPhone}
                      onChangeText={setSellerPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </>
            )}

            {/* Password Field Common to Both Roles */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kata Sandi (Min. 6 Karakter) *</Text>
              <View style={styles.inputIconWrapper}>
                <Lock size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, { flex: 1 }]}
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
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <UserPlus size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.submitButtonText}>
                {loading
                  ? "Mendaftarkan..."
                  : selectedRole === "seller"
                  ? "Daftar Toko Sekarang"
                  : "Daftar Akun Pelanggan"}
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
  loginLink: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.green,
  },
});
