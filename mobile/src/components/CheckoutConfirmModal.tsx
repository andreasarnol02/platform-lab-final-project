import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CreditCard,
  MapPin,
  Store,
  ShieldCheck,
  X,
  CheckCircle2,
} from "lucide-react-native";
import { Cart } from "../types";
import { colors, spacing, borderRadius, shadows } from "../theme";

interface CheckoutConfirmModalProps {
  visible: boolean;
  cart: Cart | null;
  shippingAddress: string;
  paymentMethod: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const CheckoutConfirmModal: React.FC<CheckoutConfirmModalProps> = ({
  visible,
  cart,
  shippingAddress,
  paymentMethod,
  onClose,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();

  if (!cart) return null;

  // Compute number of unique sellers
  const uniqueSellers = Array.from(
    new Set(cart.items.map((item) => item.product.sellerId))
  ).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalCard,
            { paddingBottom: Math.max(insets.bottom + spacing.md, spacing.xl) },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close X Button */}
          <TouchableOpacity
            style={styles.closeIconButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={18} color={colors.storefront.muted} />
          </TouchableOpacity>

          {/* Hero Icon */}
          <View style={styles.iconCircle}>
            <CreditCard size={30} color={colors.storefront.greenDark} />
          </View>

          <View style={styles.badgeContainer}>
            <ShieldCheck size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Aturan BR-7: 1 Faktur Per Toko</Text>
          </View>

          <Text style={styles.modalTitle}>Konfirmasi Transaksi</Text>
          <Text style={styles.subtitleText}>
            Periksa rincian pesanan dan metode pembayaran sebelum membuat faktur.
          </Text>

          {/* Order Details Breakdown Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <Store size={14} color={colors.storefront.greenDark} style={{ marginRight: 6 }} />
                <Text style={styles.detailLabel}>Jumlah Toko Penjual</Text>
              </View>
              <Text style={styles.detailValue}>{uniqueSellers} Toko (Pesanan Terpisah)</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <MapPin size={14} color={colors.storefront.muted} style={{ marginRight: 6 }} />
                <Text style={styles.detailLabel}>Alamat Pengiriman</Text>
              </View>
              <Text style={styles.detailValueText} numberOfLines={1}>
                {shippingAddress || "Alamat Utama Pelanggan"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.labelGroup}>
                <CreditCard size={14} color={colors.storefront.muted} style={{ marginRight: 6 }} />
                <Text style={styles.detailLabel}>Metode Pembayaran</Text>
              </View>
              <Text style={styles.detailValueText}>{paymentMethod}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Total Tagihan</Text>
              <Text style={styles.totalAmountValue}>
                Rp {cart.totalPrice.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onConfirm();
              }}
            >
              <CheckCircle2 size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.confirmButtonText}>Bayar & Buat Pesanan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Batal & Periksa Kembali</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.hero,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.floating,
  },
  closeIconButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.storefront.green,
  },
  badgeContainer: {
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
  badgeText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.storefront.ink,
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 19,
  },
  detailsCard: {
    width: "100%",
    backgroundColor: colors.storefront.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.storefront.inkSoft,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
  detailValueText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.ink,
    maxWidth: "50%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.storefront.line,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  cancelButton: {
    backgroundColor: colors.storefront.bg,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  cancelButtonText: {
    color: colors.storefront.inkSoft,
    fontSize: 14,
    fontWeight: "700",
  },
});
