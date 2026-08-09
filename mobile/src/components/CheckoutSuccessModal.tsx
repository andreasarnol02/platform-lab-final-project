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
import { CheckCircle2, ClipboardList, Store, Sparkles, ShieldCheck, X } from "lucide-react-native";
import { colors, spacing, borderRadius, shadows } from "../theme";

interface CheckoutSuccessModalProps {
  visible: boolean;
  orderCount: number;
  totalAmount: number;
  onClose: () => void;
  onViewOrders: () => void;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  visible,
  orderCount,
  totalAmount,
  onClose,
  onViewOrders,
}) => {
  const insets = useSafeAreaInsets();

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

          {/* Hero Icon Container */}
          <View style={styles.iconCircle}>
            <Sparkles size={32} color={colors.storefront.greenDark} />
          </View>

          <View style={styles.badgeContainer}>
            <ShieldCheck size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Aturan BR-7: 1 Faktur Per Toko</Text>
          </View>

          <Text style={styles.modalTitle}>Pesanan Berhasil Dibuat! 🎉</Text>
          <Text style={styles.subtitleText}>
            Transaksi Anda telah terverifikasi dan keranjang belanja telah dikosongkan.
          </Text>

          {/* Order Invoice Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabelGroup}>
                <Store size={14} color={colors.storefront.greenDark} style={{ marginRight: 6 }} />
                <Text style={styles.summaryLabel}>Total Faktur Pesanan</Text>
              </View>
              <Text style={styles.summaryValue}>{orderCount} Pesanan Toko</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Pembayaran</Text>
              <Text style={styles.totalAmountValue}>
                Rp {totalAmount.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Micro Note */}
          <View style={styles.stockNoteBox}>
            <Text style={styles.stockNoteText}>
              ✓ Stok produk di etalase telah dikurangi secara otomatis.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.viewOrdersButton}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onViewOrders();
              }}
            >
              <ClipboardList size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.viewOrdersButtonText}>Lihat Riwayat Pesanan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.continueButtonText}>Kembali ke Katalog</Text>
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
    width: 68,
    height: 68,
    borderRadius: 34,
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
  summaryCard: {
    width: "100%",
    backgroundColor: colors.storefront.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.storefront.inkSoft,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  divider: {
    height: 1,
    backgroundColor: colors.storefront.line,
    marginVertical: spacing.sm,
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
  stockNoteBox: {
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
    width: "100%",
  },
  stockNoteText: {
    color: colors.storefront.greenDark,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  viewOrdersButton: {
    flexDirection: "row",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  viewOrdersButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  continueButton: {
    backgroundColor: colors.storefront.bg,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  continueButtonText: {
    color: colors.storefront.inkSoft,
    fontSize: 14,
    fontWeight: "700",
  },
});
