import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ArrowLeft,
  ShoppingBag,
  Store,
  Trash2,
  Plus,
  Minus,
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react-native";
import { RootStackParamList } from "../navigation/types";
import { Cart, CartItem, Customer } from "../types";
import { colors, spacing, borderRadius, shadows } from "../theme";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../utils/cartStorage";
import { getCustomerToken, getCustomerData } from "../utils/storage";
import { createOrdersFromCart } from "../utils/orderStorage";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { CheckoutSuccessModal } from "../components/CheckoutSuccessModal";
import { CheckoutConfirmModal } from "../components/CheckoutConfirmModal";

type CartScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Cart"
>;

interface Props {
  navigation: CartScreenNavigationProp;
}

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState<Cart | null>(null);
  const [customerToken, setCustomerTokenState] = useState<string | null>(null);
  const [customerData, setCustomerDataState] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Checkout state
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [checkoutSuccessVisible, setCheckoutSuccessVisible] = useState(false);
  const [completedOrderCount, setCompletedOrderCount] = useState(0);
  const [completedTotalAmount, setCompletedTotalAmount] = useState(0);
  
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank BCA");
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const token = await getCustomerToken();
      const user = await getCustomerData();
      const cartData = await getCart();

      setCustomerTokenState(token);
      setCustomerDataState(user);
      setCart(cartData);
      if (user && user.address) {
        setShippingAddress(user.address);
      } else {
        setShippingAddress("Jl. Sudirman No. 45, Jakarta Selatan");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCartData();
    });
    fetchCartData();
    return unsubscribe;
  }, [navigation]);

  const handleUpdateQuantity = async (
    productId: string,
    currentQty: number,
    delta: number
  ) => {
    const newQty = currentQty + delta;
    const updated = await updateCartQuantity(productId, newQty);
    setCart(updated);
  };

  const handleRemoveItem = async (productId: string) => {
    const updated = await removeFromCart(productId);
    setCart(updated);
  };

  const handleClearCart = async () => {
    Alert.alert(
      "Kosongkan Keranjang",
      "Apakah Anda yakin ingin mengosongkan seluruh isi keranjang belanja?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: async () => {
            const updated = await clearCart();
            setCart(updated);
          },
        },
      ]
    );
  };

  const handleCheckoutPressed = async () => {
    if (!customerToken) {
      setIsAuthModalVisible(true);
      return;
    }

    if (!cart || cart.items.length === 0) {
      Alert.alert(
        "Keranjang Kosong",
        "Silakan tambahkan produk ke keranjang terlebih dahulu."
      );
      return;
    }

    setConfirmModalVisible(true);
  };

  const executeCheckout = async () => {
    if (!cart) return;
    setIsSubmittingCheckout(true);
    try {
      const checkoutTotal = cart.totalPrice;
      const newOrders = await createOrdersFromCart(
        cart,
        shippingAddress,
        paymentMethod
      );

      const emptyCart = await getCart();
      setCart(emptyCart);
      setCompletedOrderCount(newOrders.length);
      setCompletedTotalAmount(checkoutTotal);
      setCheckoutSuccessVisible(true);
    } catch (error: any) {
      console.error("Checkout failed:", error);
      Alert.alert(
        "Gagal Checkout",
        error.message || "Terjadi kesalahan saat memproses transaksi."
      );
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  // Group items by Seller Store (BR-7)
  const groupedCartItems = useMemo(() => {
    if (!cart || !cart.items) return [];
    const map = new Map<
      string,
      { storeName: string; items: CartItem[]; subtotal: number }
    >();

    cart.items.forEach((item) => {
      const sellerId = item.product.sellerId || "default_seller";
      const storeName = item.product.sellerStoreName || "Toko Penjual";
      if (!map.has(sellerId)) {
        map.set(sellerId, { storeName, items: [], subtotal: 0 });
      }
      const entry = map.get(sellerId)!;
      entry.items.push(item);
      entry.subtotal += item.product.price * item.quantity;
    });

    return Array.from(map.entries()).map(([sellerId, data]) => ({
      sellerId,
      ...data,
    }));
  }, [cart]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: Math.max(insets.top, spacing.xs) },
        ]}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.storefront.green} />
          <Text style={styles.loadingText}>Memuat keranjang belanja...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, spacing.xs) },
      ]}
    >
      {/* Sticky Top Header with Safe Top Padding */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.storefront.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        {cart && cart.items.length > 0 ? (
          <TouchableOpacity
            onPress={handleClearCart}
            style={styles.clearCartButton}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color={colors.storefront.danger} />
            <Text style={styles.clearText}>Hapus</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Unauthorized Customer Banner */}
      {!customerToken && (
        <View style={styles.unauthBanner}>
          <Lock size={16} color="#92400E" style={{ marginRight: spacing.xs }} />
          <Text style={styles.unauthBannerText}>
            Silakan masuk ke akun Anda untuk melakukan transaksi checkout.
          </Text>
          <TouchableOpacity
            style={styles.unauthLoginBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
          >
            <Text style={styles.unauthLoginBtnText}>Masuk</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!cart || cart.items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={48} color={colors.storefront.green} />
          </View>
          <Text style={styles.emptyTitle}>Keranjang Belanja Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Temukan produk menarik dari penjual terpercaya di Storefront Marketplace.
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowButtonText}>Eksplor Katalog</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Multi-Seller Grouped Store Cards (BR-7) */}
          {groupedCartItems.map((group) => (
            <View key={group.sellerId} style={styles.storeCard}>
              {/* Store Header */}
              <View style={styles.storeHeader}>
                <Store size={18} color={colors.storefront.greenDark} />
                <Text style={styles.storeName}>{group.storeName}</Text>
                <View style={styles.br7Badge}>
                  <Text style={styles.br7BadgeText}>1 Faktur Per Toko</Text>
                </View>
              </View>

              {/* Items in Store */}
              {group.items.map((item) => (
                <View key={item.productId} style={styles.cartItemRow}>
                  <Image
                    source={{ uri: item.product.imageUrl }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      Rp {item.product.price.toLocaleString("id-ID")}
                    </Text>

                    {/* Quantity Stepper & Remove Item */}
                    <View style={styles.qtyContainer}>
                      <View style={styles.qtyStepper}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity,
                              -1
                            )
                          }
                          activeOpacity={0.7}
                        >
                          <Minus size={14} color={colors.storefront.ink} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity,
                              1
                            )
                          }
                          activeOpacity={0.7}
                        >
                          <Plus size={14} color={colors.storefront.ink} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.productId)}
                        style={styles.deleteBtn}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={colors.storefront.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              {/* Store Subtotal */}
              <View style={styles.storeFooter}>
                <Text style={styles.storeSubtotalLabel}>Subtotal Toko:</Text>
                <Text style={styles.storeSubtotalValue}>
                  Rp {group.subtotal.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          ))}

          {/* Shipping & Payment Options Form */}
          <View style={styles.checkoutFormCard}>
            <View style={styles.formSectionHeader}>
              <ShieldCheck size={18} color={colors.storefront.greenDark} />
              <Text style={styles.checkoutSectionTitle}>
                Detail Pengiriman & Pembayaran
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alamat Pengiriman Utama</Text>
              <TextInput
                style={styles.textInput}
                value={shippingAddress}
                onChangeText={setShippingAddress}
                placeholder="Alamat lengkap pengiriman"
                placeholderTextColor={colors.storefront.muted}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pilihan Metode Pembayaran</Text>
              <View style={styles.paymentMethodsRow}>
                {["Transfer Bank BCA", "GoPay", "OVO", "Mandiri VA"].map(
                  (method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentChip,
                        paymentMethod === method && styles.paymentChipSelected,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                      activeOpacity={0.8}
                    >
                      <CreditCard
                        size={14}
                        color={
                          paymentMethod === method
                            ? colors.storefront.greenDark
                            : colors.storefront.muted
                        }
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.paymentChipText,
                          paymentMethod === method &&
                            styles.paymentChipTextSelected,
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Fixed Bottom Checkout Action Bar with Dynamic Safe Bottom Inset */}
      {cart && cart.items.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          <View>
            <Text style={styles.grandTotalLabel}>Total Pembayaran</Text>
            <Text style={styles.grandTotalValue}>
              Rp {cart.totalPrice.toLocaleString("id-ID")}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              isSubmittingCheckout && styles.disabledButton,
            ]}
            onPress={handleCheckoutPressed}
            disabled={isSubmittingCheckout}
            activeOpacity={0.85}
          >
            {isSubmittingCheckout ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <View style={styles.checkoutBtnContent}>
                <CheckCircle2 size={18} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.checkoutButtonText}>Checkout Sekarang</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Protected Auth Modal */}
      <AuthPromptModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onLoginPress={() => {
          setIsAuthModalVisible(false);
          navigation.navigate("Login");
        }}
        onRegisterPress={() => {
          setIsAuthModalVisible(false);
          navigation.navigate("Register");
        }}
      />

      {/* Checkout Success Sheet */}
      <CheckoutSuccessModal
        visible={checkoutSuccessVisible}
        orderCount={completedOrderCount}
        totalAmount={completedTotalAmount}
        onClose={() => setCheckoutSuccessVisible(false)}
        onViewOrders={() => {
          setCheckoutSuccessVisible(false);
          navigation.replace("OrderHistory");
        }}
      />

      {/* Checkout Confirm Dialog */}
      <CheckoutConfirmModal
        visible={confirmModalVisible}
        cart={cart}
        shippingAddress={shippingAddress}
        paymentMethod={paymentMethod}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={executeCheckout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.storefront.inkSoft,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  clearCartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: spacing.xs,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.danger,
  },
  unauthBanner: {
    backgroundColor: "#FEF3C7",
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  unauthBannerText: {
    fontSize: 12,
    color: "#92400E",
    flex: 1,
    fontWeight: "600",
  },
  unauthLoginBtn: {
    backgroundColor: "#D97706",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  unauthLoginBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.storefront.ink,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.storefront.muted,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  shopNowButton: {
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.button,
  },
  shopNowButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  scrollContent: {
    padding: spacing.lg,
  },
  storeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  storeName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.storefront.ink,
    flex: 1,
  },
  br7Badge: {
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  br7BadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
  cartItemRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.storefront.lineLight,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.gray100,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.storefront.ink,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.storefront.greenDark,
    marginVertical: spacing.xs,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyStepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.storefront.bg,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    paddingHorizontal: spacing.md,
    fontSize: 13,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  storeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
  },
  storeSubtotalLabel: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    fontWeight: "600",
  },
  storeSubtotalValue: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.storefront.ink,
  },
  checkoutFormCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
  },
  formSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  checkoutSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.storefront.ink,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.storefront.inkSoft,
    marginBottom: spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.storefront.line,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 13,
    color: colors.storefront.ink,
    backgroundColor: colors.storefront.bg,
    height: 56,
  },
  paymentMethodsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  paymentChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    backgroundColor: colors.storefront.bg,
  },
  paymentChipSelected: {
    borderColor: colors.storefront.green,
    backgroundColor: colors.storefront.greenSubtle,
  },
  paymentChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.storefront.inkSoft,
  },
  paymentChipTextSelected: {
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.storefront.lineLight,
    ...shadows.floating,
  },
  grandTotalLabel: {
    fontSize: 11,
    color: colors.storefront.muted,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.storefront.greenDark,
  },
  checkoutButton: {
    backgroundColor: colors.storefront.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 170,
    alignItems: "center",
    ...shadows.button,
  },
  checkoutBtnContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
