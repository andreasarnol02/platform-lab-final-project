import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ArrowLeft,
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  Compass,
  LogOut,
  LogIn,
  TrendingUp,
  Package,
  Clock,
  ShieldCheck,
  ChevronRight,
  UserPlus,
  Briefcase,
} from "lucide-react-native";
import { RootStackParamList } from "../navigation/types";
import { CustomAlertModal, ModalType } from "../components/CustomAlertModal";
import { Customer, Seller, SalesStats } from "../types";
import { colors, spacing, borderRadius, shadows } from "../theme";
import {
  getCustomerToken,
  getCustomerData,
  getSellerToken,
  getSellerData,
  getUserRole,
  clearCustomerSession,
  clearSellerSession,
  setHasSeenOnboarding,
} from "../utils/storage";

import { getProductsBySeller } from "../utils/productStorage";
import { getOrdersBySeller } from "../utils/orderStorage";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [customerToken, setCustomerTokenState] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [sellerToken, setSellerTokenState] = useState<string | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [userRoleState, setUserRoleState] = useState<"customer" | "seller" | null>(null);

  // Custom Alert Modal State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
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
    confirmText = "Mengerti",
    cancelText?: string,
    onCancel?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        onConfirm();
      },
      onCancel: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onCancel) onCancel();
      },
    });
  };

  // Real-time Sales Stats for Seller Dashboard
  const [salesStats, setSalesStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeProducts: 0,
  });
  const [sellerLowStockCount, setSellerLowStockCount] = useState<number>(0);

  const loadUserData = async () => {
    try {
      const role = await getUserRole();
      const cToken = await getCustomerToken();
      const cData = await getCustomerData();
      const sToken = await getSellerToken();
      const sData = await getSellerData();

      setUserRoleState(role);
      setCustomerTokenState(cToken);
      setCustomer(cData);
      setSellerTokenState(sToken);
      setSeller(sData);

      // Only calculate stats if seller token exists and active role is seller
      if (sToken && (role === "seller" || !cToken)) {
        const sellerId = sData?.id || "";
        const sellerProds = await getProductsBySeller(sellerId);
        const sellerOrders = await getOrdersBySeller(sellerId);

        const totalRevenue = sellerOrders
          .filter((o) => o.status === "PAID" || o.status === "PROCESSED" || o.status === "SHIPPED" || o.status === "COMPLETED")
          .reduce((sum, o) => sum + o.totalPrice, 0);

        const pendingOrders = sellerOrders.filter(
          (o) => o.status === "PAID" || o.status === "PROCESSED"
        ).length;

        const completedOrders = sellerOrders.filter(
          (o) => o.status === "COMPLETED" || o.status === "SHIPPED"
        ).length;

        const activeProducts = sellerProds.filter((p) => p.isActive).length;
        const lowStockCount = sellerProds.filter((p) => p.stock <= 5).length;

        setSalesStats({
          totalRevenue,
          totalOrders: sellerOrders.length,
          pendingOrders,
          completedOrders,
          activeProducts,
        });
        setSellerLowStockCount(lowStockCount);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserData();
    });
    loadUserData();
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    showAlert(
      "warning",
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari akun Storefront?",
      async () => {
        await clearCustomerSession();
        await clearSellerSession();
        setCustomerTokenState(null);
        setCustomer(null);
        setSellerTokenState(null);
        setSeller(null);
        setUserRoleState(null);
        
        showAlert(
          "success",
          "Berhasil Logout",
          "Sesi akun Anda telah dihapus. Anda dapat masuk kembali kapan saja.",
          () => {},
          "OK"
        );
      },
      "Keluar Akun",
      "Batal"
    );
  };

  const handleResetOnboarding = async () => {
    await setHasSeenOnboarding(false);
    navigation.replace("Onboarding");
  };

  const isSellerLoggedIn = !!sellerToken && (userRoleState === "seller" || !customerToken);
  const isCustomerLoggedIn = !!customerToken && (userRoleState === "customer" || !sellerToken);
  const isGuest = !customerToken && !sellerToken;

  return (
    <View style={styles.mainContainer}>
      {/* Top Header with Dynamic Safe Top Padding */}
      <View
        style={[
          styles.topHeader,
          { paddingTop: Math.max(insets.top + spacing.xs, spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.backButtonPill}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={18} color={colors.storefront.ink} />
          <Text style={styles.backButtonText}>Katalog</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isSellerLoggedIn
            ? "Dashboard Toko"
            : isCustomerLoggedIn
            ? "Profil Pelanggan"
            : "Profil"}
        </Text>

        <TouchableOpacity
          style={styles.onboardingIconButton}
          activeOpacity={0.7}
          onPress={handleResetOnboarding}
        >
          <Compass size={18} color={colors.storefront.greenDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxl) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* VIEW 1: GUEST / NOT LOGGED IN STATE */}
        {isGuest && (
          <View style={styles.guestContainer}>
            <View style={styles.profileHeroCard}>
              <View style={styles.avatarCircleGuest}>
                <User size={38} color={colors.storefront.inkSoft} />
              </View>

              <View style={styles.roleBadgeGuestContainer}>
                <Text style={styles.roleBadgeGuestText}>TAMU (BELUM LOGIN)</Text>
              </View>

              <Text style={styles.userNameText}>Anda Belum Masuk Akun</Text>

              <Text style={styles.userEmailTextGuest}>
                Masuk atau daftar akun untuk melihat informasi profil, mengelola keranjang belanja, dan melihat riwayat pesanan Anda.
              </Text>

              <View style={styles.guestCtaGroup}>
                <TouchableOpacity
                  style={styles.guestLoginButton}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("Login")}
                >
                  <LogIn size={18} color={colors.white} style={{ marginRight: 6 }} />
                  <Text style={styles.guestLoginButtonText}>Masuk ke Akun</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.guestRegisterButton}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("Register")}
                >
                  <UserPlus size={18} color={colors.storefront.greenDark} style={{ marginRight: 6 }} />
                  <Text style={styles.guestRegisterButtonText}>Daftar Akun Baru</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Action: Onboarding link for Guest */}
            <TouchableOpacity
              style={styles.actionMenuCard}
              activeOpacity={0.8}
              onPress={handleResetOnboarding}
            >
              <View style={styles.actionMenuLeft}>
                <View style={styles.actionIconCircle}>
                  <Compass size={18} color={colors.storefront.greenDark} />
                </View>
                <View>
                  <Text style={styles.actionMenuTitle}>Panduan Aplikasi (Onboarding)</Text>
                  <Text style={styles.actionMenuSubtitle}>
                    Pelajari cara belanja dan menggunakan fitur marketplace
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.storefront.muted} />
            </TouchableOpacity>
          </View>
        )}

        {/* VIEW 2: CUSTOMER LOGGED IN STATE */}
        {isCustomerLoggedIn && (
          <View style={styles.sectionContainer}>
            {/* Customer User Hero Card */}
            <View style={styles.profileHeroCard}>
              <View style={styles.avatarCircle}>
                <User size={36} color={colors.storefront.greenDark} />
              </View>

              <View style={styles.roleBadgeContainer}>
                <ShieldCheck size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
                <Text style={styles.roleBadgeText}>Pelanggan Terverifikasi</Text>
              </View>

              <Text style={styles.userNameText}>{customer?.name || "Pelanggan"}</Text>

              <Text style={styles.userEmailText}>{customer?.email || ""}</Text>
            </View>

            {/* Customer Detail Card */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Informasi Pelanggan</Text>

              <View style={styles.infoRow}>
                <Mail size={16} color={colors.storefront.muted} style={{ marginRight: spacing.sm }} />
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Alamat Email</Text>
                  <Text style={styles.infoValue}>{customer?.email || "-"}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Phone size={16} color={colors.storefront.muted} style={{ marginRight: spacing.sm }} />
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Nomor Telepon</Text>
                  <Text style={styles.infoValue}>{customer?.phone || "Belum diisi"}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <MapPin size={16} color={colors.storefront.muted} style={{ marginRight: spacing.sm }} />
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Alamat Pengiriman Utama</Text>
                  <Text style={styles.infoValue}>{customer?.address || "Belum diisi"}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <TouchableOpacity
              style={styles.actionMenuCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("OrderHistory")}
            >
              <View style={styles.actionMenuLeft}>
                <View style={styles.actionIconCircle}>
                  <ClipboardList size={18} color={colors.storefront.greenDark} />
                </View>
                <View>
                  <Text style={styles.actionMenuTitle}>Riwayat Transaksi</Text>
                  <Text style={styles.actionMenuSubtitle}>Lihat daftar pesanan belanja Anda</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.storefront.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuCard}
              activeOpacity={0.8}
              onPress={handleResetOnboarding}
            >
              <View style={styles.actionMenuLeft}>
                <View style={styles.actionIconCircle}>
                  <Compass size={18} color={colors.storefront.greenDark} />
                </View>
                <View>
                  <Text style={styles.actionMenuTitle}>Lihat Onboarding App</Text>
                  <Text style={styles.actionMenuSubtitle}>Buka kembali tur panduan awal</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.storefront.muted} />
            </TouchableOpacity>
          </View>
        )}

        {/* VIEW 3: SELLER DASHBOARD STATE (Only rendered when logged in as seller) */}
        {isSellerLoggedIn && (
          <View style={styles.sectionContainer}>
            {/* Seller Store Profile Hero Card */}
            <View style={styles.profileHeroCard}>
              <View style={styles.avatarCircle}>
                <Store size={36} color={colors.storefront.greenDark} />
              </View>

              <View style={styles.roleBadgeContainer}>
                <ShieldCheck size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
                <Text style={styles.roleBadgeText}>Penjual Resmi Marketplace</Text>
              </View>

              <Text style={styles.userNameText}>{seller?.storeName || "Toko Penjual"}</Text>
              <Text style={styles.userEmailText}>Pemilik: {seller?.ownerName || "-"} ({seller?.email || ""})</Text>
            </View>

            {/* Revenue Overview Banner */}
            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <TrendingUp size={18} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.revenueLabel}>Total Pendapatan Toko</Text>
              </View>
              <Text style={styles.revenueAmount}>
                Rp {salesStats.totalRevenue.toLocaleString("id-ID")}
              </Text>
              <Text style={styles.revenueSubtext}>
                Hasil akumulasi dari {salesStats.completedOrders} pesanan selesai
              </Text>
            </View>

            {/* Store Statistics Cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={styles.statIconRow}>
                  <TrendingUp size={16} color={colors.storefront.greenDark} />
                  <Text style={styles.statTitle}>Pendapatan</Text>
                </View>
                <Text style={styles.statNumber}>
                  Rp {(salesStats.totalRevenue / 1000).toFixed(0)}k
                </Text>
              </View>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SellerOrderInbox")}
              >
                <View style={styles.statIconRow}>
                  <Clock size={16} color={colors.status.pendingText} />
                  <Text style={styles.statTitle}>Pesanan Masuk</Text>
                </View>
                <Text style={[styles.statNumber, { color: colors.status.pendingText }]}>
                  {salesStats.pendingOrders}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SellerProductList")}
              >
                <View style={styles.statIconRow}>
                  <Store size={16} color={colors.storefront.greenDark} />
                  <Text style={styles.statTitle}>Produk Aktif</Text>
                </View>
                <Text style={styles.statNumber}>{salesStats.activeProducts}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SellerProductList")}
              >
                <View style={styles.statIconRow}>
                  <Package size={16} color={colors.status.cancelledText} />
                  <Text style={styles.statTitle}>Alert Stok</Text>
                </View>
                <Text style={[styles.statNumber, { color: colors.status.cancelledText }]}>
                  {sellerLowStockCount}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Operational Shortcuts */}
            <Text style={styles.sectionTitle}>Aksi Operasional Penjual</Text>
            <View style={styles.quickActionsGroup}>
              <TouchableOpacity
                style={styles.actionMenuCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SellerOrderInbox")}
              >
                <View style={styles.actionMenuLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: "#E0F2FE" }]}>
                    <ClipboardList size={18} color="#0284C7" />
                  </View>
                  <View>
                    <Text style={styles.actionMenuTitle}>Kotak Masuk Pesanan</Text>
                    <Text style={styles.actionMenuSubtitle}>
                      Proses pesanan masuk & perbarui status kirim
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.storefront.muted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionMenuCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SellerProductList")}
              >
                <View style={styles.actionMenuLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: colors.storefront.greenLight }]}>
                    <Store size={18} color={colors.storefront.greenDark} />
                  </View>
                  <View>
                    <Text style={styles.actionMenuTitle}>Katalog Produk Toko</Text>
                    <Text style={styles.actionMenuSubtitle}>
                      Lihat, edit, atau ubah stok barang real-time
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.storefront.muted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionMenuCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AddEditProduct")}
              >
                <View style={styles.actionMenuLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: "#FEF3C7" }]}>
                    <Package size={18} color="#D97706" />
                  </View>
                  <View>
                    <Text style={styles.actionMenuTitle}>Tambah Produk Baru</Text>
                    <Text style={styles.actionMenuSubtitle}>
                      Buka etalase baru dan atur stok awal
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.storefront.muted} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Session Logout Action Button (Only for logged in users) */}
        {!isGuest && (
          <View style={styles.sessionContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.85}
              onPress={handleLogout}
            >
              <LogOut size={18} color={colors.storefront.danger} style={{ marginRight: 6 }} />
              <Text style={styles.logoutButtonText}>Keluar dari Akun (Logout)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Custom Alert Dialog Modal */}
      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
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
  onboardingIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  guestContainer: {
    gap: spacing.lg,
  },
  profileHeroCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.hero,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.storefront.green,
  },
  avatarCircleGuest: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.storefront.line,
  },
  roleBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs - 1,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  roleBadgeText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  roleBadgeGuestContainer: {
    backgroundColor: colors.storefront.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs - 1,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  roleBadgeGuestText: {
    color: colors.storefront.inkSoft,
    fontWeight: "800",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.storefront.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: "center",
  },
  userEmailText: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    textAlign: "center",
  },
  userEmailTextGuest: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  guestCtaGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  guestLoginButton: {
    flexDirection: "row",
    height: 48,
    backgroundColor: colors.storefront.green,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.button,
  },
  guestLoginButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  guestRegisterButton: {
    flexDirection: "row",
    height: 48,
    backgroundColor: colors.storefront.greenLight,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.green,
  },
  guestRegisterButtonText: {
    color: colors.storefront.greenDark,
    fontSize: 14,
    fontWeight: "800",
  },
  sectionContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.muted,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.storefront.ink,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.storefront.lineLight,
    marginVertical: spacing.sm,
  },
  actionMenuCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  actionMenuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  quickActionsGroup: {
    gap: spacing.sm,
  },
  actionMenuTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  actionMenuSubtitle: {
    fontSize: 12,
    color: colors.storefront.inkSoft,
    marginTop: 2,
  },
  revenueCard: {
    backgroundColor: colors.storefront.green,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.card,
  },
  revenueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  revenueLabel: {
    color: colors.storefront.greenLight,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  revenueAmount: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  revenueSubtext: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  statIconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
    marginLeft: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.storefront.ink,
  },
  sessionContainer: {
    marginTop: spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    height: 48,
    backgroundColor: "#FEE2E2",
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.danger,
  },
  logoutButtonText: {
    color: colors.storefront.danger,
    fontSize: 14,
    fontWeight: "800",
  },
});
