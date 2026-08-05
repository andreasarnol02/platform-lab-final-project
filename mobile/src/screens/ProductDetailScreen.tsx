import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { colors, spacing, borderRadius, typography, commonStyles, shadows } from "../theme";

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetail"
>;
type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

interface ProductDetailScreenProps {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

export const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const insets = useSafeAreaInsets();
  const { product } = route.params;
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [gatedActionName, setGatedActionName] = useState("");

  const handleProtectedAction = (actionName: string) => {
    setGatedActionName(actionName);
    setAuthModalVisible(true);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + spacing.xs, spacing.md),
            paddingBottom: insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Top Back Bar */}
        <TouchableOpacity
          style={styles.backButtonPill}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Kembali ke Katalog</Text>
        </TouchableOpacity>

        {/* Product Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        </View>

        {/* Product Meta Info Card */}
        <View style={commonStyles.card}>
          <View style={styles.categoryBadgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{product.category}</Text>
            </View>

            <View style={commonStyles.badgeGreen}>
              <Text style={commonStyles.badgeGreenText}>
                Stok: {product.stock} unit
              </Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>

          <Text style={styles.productPrice}>
            Rp {product.price.toLocaleString("id-ID")}
          </Text>

          <View style={commonStyles.divider} />

          {/* Seller Store Badge */}
          <View style={styles.sellerCard}>
            <Text style={styles.storeIcon}>🏬</Text>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerLabel}>Penjual Terdaftar Marketplace</Text>
              <Text style={styles.sellerStoreName}>{product.sellerStoreName}</Text>
            </View>
          </View>
        </View>

        {/* Product Description Card */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionHeaderTitle}>Deskripsi Produk</Text>
          <Text style={styles.descriptionText}>
            {product.description ||
              "Produk berkualitas tinggi yang dijual langsung oleh toko resmi di platform Storefront Marketplace. Garansi kualitas dan transaksi aman."}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar with Dynamic Safe Inset Padding */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.85}
          onPress={() =>
            handleProtectedAction(`Tambah "${product.name}" ke Keranjang`)
          }
        >
          <Text style={styles.cartButtonText}>+ Keranjang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowButton}
          activeOpacity={0.85}
          onPress={() =>
            handleProtectedAction(`Beli Sekarang "${product.name}"`)
          }
        >
          <Text style={styles.buyNowButtonText}>Beli Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Gated Auth BottomSheet Modal */}
      <AuthPromptModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        actionText={gatedActionName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  backButtonPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  backButtonText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 12,
  },
  imageContainer: {
    width: "100%",
    height: 230,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  categoryBadgeText: {
    color: colors.storefront.muted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  productTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.storefront.ink,
    lineHeight: 25,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenSubtle,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  storeIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.storefront.muted,
    textTransform: "uppercase",
  },
  sellerStoreName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    lineHeight: 20,
  },
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.storefront.line,
    ...shadows.floating,
  },
  cartButton: {
    flex: 1,
    backgroundColor: colors.storefront.greenLight,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cartButtonText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 14,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  buyNowButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
});
