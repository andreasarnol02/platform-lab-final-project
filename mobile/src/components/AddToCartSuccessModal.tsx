import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, ShoppingBag, X, ArrowRight, Store } from "lucide-react-native";
import { Product } from "../types";
import { colors, spacing, borderRadius, shadows } from "../theme";

interface AddToCartSuccessModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onViewCart: () => void;
}

export const AddToCartSuccessModal: React.FC<AddToCartSuccessModalProps> = ({
  visible,
  product,
  onClose,
  onViewCart,
}) => {
  const insets = useSafeAreaInsets();

  if (!product) return null;

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
            styles.modalSheet,
            { paddingBottom: Math.max(insets.bottom + spacing.md, spacing.xl) },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Sheet Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Close X Button */}
          <TouchableOpacity
            style={styles.closeIconButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={18} color={colors.storefront.muted} />
          </TouchableOpacity>

          {/* Hero Success Badge */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.iconCircle}>
              <CheckCircle2 size={26} color={colors.storefront.greenDark} />
            </View>
            <View style={styles.badgeTextContainer}>
              <Text style={styles.successTitle}>Berhasil Ditambahkan!</Text>
              <Text style={styles.successSubtitle}>
                Produk pilihan Anda sudah ada di keranjang belanja
              </Text>
            </View>
          </View>

          {/* Product Snippet Preview Card */}
          <View style={styles.productCard}>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>

              <View style={styles.sellerRow}>
                <Store size={12} color={colors.storefront.muted} style={{ marginRight: 3 }} />
                <Text style={styles.sellerName} numberOfLines={1}>
                  {product.sellerStoreName}
                </Text>
              </View>

              <Text style={styles.productPrice}>
                Rp {product.price.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.viewCartButton}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onViewCart();
              }}
            >
              <ShoppingBag size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.viewCartButtonText}>Lihat Keranjang Belanja</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.continueButtonText}>Lanjut Belanja Katalog</Text>
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
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.hero,
    borderTopRightRadius: borderRadius.hero,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.storefront.lineLight,
    ...shadows.floating,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.storefront.line,
    borderRadius: borderRadius.full,
    alignSelf: "center",
    marginBottom: spacing.md,
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
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingRight: spacing.xl,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.green,
  },
  badgeTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.storefront.ink,
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 12,
    color: colors.storefront.inkSoft,
    marginTop: 1,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: colors.storefront.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.storefront.ink,
    lineHeight: 17,
    marginBottom: 2,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  sellerName: {
    fontSize: 11,
    color: colors.storefront.muted,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  viewCartButton: {
    flexDirection: "row",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  viewCartButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  continueButton: {
    backgroundColor: colors.storefront.greenLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  continueButtonText: {
    color: colors.storefront.greenDark,
    fontSize: 14,
    fontWeight: "800",
  },
});
