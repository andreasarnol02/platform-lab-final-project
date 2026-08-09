import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Save,
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon,
  FileText,
} from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { saveProduct } from "../utils/productStorage";
import { getSellerData, getSellerToken } from "../utils/storage";
import { CustomAlertModal, ModalType } from "../components/CustomAlertModal";
import { GuestLoginBanner } from "../components/GuestLoginBanner";
import { colors, spacing, borderRadius, shadows } from "../theme";

type AddEditProductNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddEditProduct"
>;
type AddEditProductRouteProp = RouteProp<
  RootStackParamList,
  "AddEditProduct"
>;

interface Props {
  navigation: AddEditProductNavigationProp;
  route: AddEditProductRouteProp;
}

const CATEGORIES = [
  "Elektronik",
  "Fashion",
  "Aksesoris",
  "Peralatan",
  "Kecantikan",
  "Lainnya",
];

export const AddEditProductScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const existingProduct = route.params?.product;

  const [sellerToken, setSellerTokenState] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getSellerToken();
        setSellerTokenState(token);
      } catch (err) {
        console.error("Error checking seller token:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkToken();
  }, []);

  const [name, setName] = useState(existingProduct?.name || "");
  const [price, setPrice] = useState(
    existingProduct?.price ? String(existingProduct.price) : ""
  );
  const [category, setCategory] = useState(
    existingProduct?.category || CATEGORIES[0]
  );
  const [stock, setStock] = useState(
    existingProduct?.stock !== undefined ? String(existingProduct.stock) : "10"
  );
  const [imageUrl, setImageUrl] = useState(existingProduct?.imageUrl || "");
  const [description, setDescription] = useState(
    existingProduct?.description || ""
  );
  const [isActive, setIsActive] = useState(
    existingProduct?.isActive !== undefined ? existingProduct.isActive : true
  );
  const [loading, setLoading] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
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
    onConfirm: () => void = () => {}
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const numPrice = Number(price);
    const numStock = Number(stock);

    if (!trimmedName) {
      showAlert("warning", "Input Wajib", "Silakan masukkan nama produk.");
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      showAlert("warning", "Harga Tidak Valid", "Masukkan nominal harga produk yang valid.");
      return;
    }
    if (isNaN(numStock) || numStock < 0) {
      showAlert("warning", "Stok Tidak Valid", "Masukkan jumlah stok barang yang valid.");
      return;
    }

    setLoading(true);

    try {
      const seller = await getSellerData();
      const sellerId = seller?.id || "sell_001";
      const sellerStoreName = seller?.storeName || "Toko Penjual";

      await saveProduct({
        id: existingProduct?.id,
        name: trimmedName,
        price: numPrice,
        category,
        stock: numStock,
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        isActive,
        sellerId,
        sellerStoreName,
      });

      showAlert(
        "success",
        existingProduct ? "Produk Diperbarui" : "Produk Berhasil Ditambah",
        existingProduct
          ? `Produk "${trimmedName}" telah berhasil diperbarui.`
          : `Produk "${trimmedName}" telah resmi ditambahkan ke katalog toko.`,
        () => {
          navigation.goBack();
        }
      );
    } catch (error) {
      console.error("Error saving product:", error);
      showAlert("danger", "Gagal Menyimpan", "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Header Bar */}
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
          <Text style={styles.backButtonText}>Batal</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {existingProduct ? "Edit Produk Toko" : "Tambah Produk Baru"}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {checkingAuth ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.storefront.green} />
        </View>
      ) : !sellerToken ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <GuestLoginBanner
            title="Akses Toko Diperlukan"
            description="Anda harus login sebagai Seller / Toko untuk menambah atau mengedit produk toko Anda."
            role="seller"
            onLogin={() => navigation.navigate("Login")}
            onRegister={() => navigation.navigate("Register")}
          />
        </ScrollView>
      ) : (
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
          {/* Image Preview Banner */}
          <View style={styles.imagePreviewCard}>
            <Image
              source={{
                uri:
                  imageUrl.trim() ||
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
              }}
              style={styles.previewImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageOverlayText}>Pratinjau Foto Produk</Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Nama Produk */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Produk Toko *</Text>
              <View style={styles.inputIconWrapper}>
                <Package size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="contoh: Headphone Bluetooth Wireless"
                  placeholderTextColor={colors.storefront.muted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Harga Produk */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Harga Produk (Rp) *</Text>
              <View style={styles.inputIconWrapper}>
                <DollarSign size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="contoh: 450000"
                  placeholderTextColor={colors.storefront.muted}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Jumlah Stok Real-time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jumlah Stok Real-time *</Text>
              <View style={styles.inputIconWrapper}>
                <Package size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="contoh: 25"
                  placeholderTextColor={colors.storefront.muted}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Kategori Produk */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kategori Produk *</Text>
              <View style={styles.categoryChipsRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Tag
                      size={12}
                      color={
                        category === cat
                          ? colors.white
                          : colors.storefront.inkSoft
                      }
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* URL Gambar Produk */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL Foto Produk (Opsional)</Text>
              <View style={styles.inputIconWrapper}>
                <ImageIcon size={16} color={colors.storefront.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="https://..."
                  placeholderTextColor={colors.storefront.muted}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Deskripsi Produk */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deskripsi Produk</Text>
              <View style={[styles.inputIconWrapper, { alignItems: "flex-start", paddingTop: spacing.xs }]}>
                <FileText size={16} color={colors.storefront.muted} style={[styles.inputIcon, { marginTop: 4 }]} />
                <TextInput
                  style={[styles.inputWithIcon, { height: 72, textAlignVertical: "top" }]}
                  placeholder="Jelaskan spesifikasi dan keunggulan produk Anda..."
                  placeholderTextColor={colors.storefront.muted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>
            </View>

            {/* Switch Status Aktif */}
            <View style={styles.switchGroup}>
              <View>
                <Text style={styles.switchTitle}>Status Tampil Produk</Text>
                <Text style={styles.switchSubtitle}>
                  {isActive
                    ? "Produk aktif dan dapat dibeli oleh pelanggan"
                    : "Produk disembunyikan dari etalase"}
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: colors.storefront.line, true: colors.storefront.greenLight }}
                thumbColor={isActive ? colors.storefront.green : "#f4f3f4"}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Save size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.submitButtonText}>
                {loading
                  ? "Menyimpan..."
                  : existingProduct
                  ? "Simpan Perubahan Produk"
                  : "Tambah Produk Baru"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      )}

      {/* Custom Alert Modal */}
      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  imagePreviewCard: {
    height: 140,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    backgroundColor: colors.storefront.lineLight,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  imageOverlayText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
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
  categoryChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.storefront.bg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  categoryChipSelected: {
    backgroundColor: colors.storefront.green,
    borderColor: colors.storefront.green,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
  },
  categoryChipTextSelected: {
    color: colors.white,
  },
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.storefront.lineLight,
    marginBottom: spacing.xl,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  switchSubtitle: {
    fontSize: 12,
    color: colors.storefront.muted,
  },
  submitButton: {
    flexDirection: "row",
    height: 50,
    backgroundColor: colors.storefront.green,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
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
});
