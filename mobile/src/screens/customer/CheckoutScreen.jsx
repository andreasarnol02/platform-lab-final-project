import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import Screen from "../../components/Screen";
import Panel from "../../components/Panel";
import FormField, { inputStyle } from "../../components/FormField";
import AppButton from "../../components/AppButton";
import BackRow from "../../components/BackRow";
import { Spinner, EmptyState } from "../../components/states";
import { useToast } from "../../components/Toast";
import Icon from "../../components/Icon";
import { formatIDR } from "../../utils/format";
import { customerClient, getErrorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import RequireLogin from "./RequireLogin";

const PAYMENT_OPTIONS = [
  { value: "Transfer", icon: "shield", title: "Transfer Bank" },
  { value: "COD", icon: "store", title: "COD (Bayar di tempat)" },
];

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const { user, booting } = useAuth();
  const { items, loading, totalPrice, clearLocal } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer");
  const [submitting, setSubmitting] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);

  if (booting) return <Spinner />;
  if (!user) {
    return (
      <RequireLogin
        title="Masuk untuk checkout"
        message="Login diperlukan sebelum melanjutkan ke pembayaran."
      />
    );
  }
  if (loading && items.length === 0) return <Spinner />;
  if (items.length === 0) {
    return (
      <View style={styles.flexCenter}>
        <EmptyState
          icon="bag"
          title="Keranjang kosong"
          message="Tidak ada item untuk di-checkout."
        >
          <AppButton title="Mulai Belanja" onPress={() => navigation.navigate("CatalogTab")} />
        </EmptyState>
      </View>
    );
  }

  const groups = items.reduce((acc, item) => {
    const store = item.product?.seller?.storeName || "Toko";
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {});

  const handleSubmit = async () => {
    if (!shippingAddress.trim()) {
      toast("Alamat pengiriman wajib diisi.", { tone: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await customerClient.post("/orders", {
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      });
      clearLocal();
      const count = Array.isArray(data.data) ? data.data.length : 1;
      navigation.navigate("OrdersTab", {
        screen: "Orders",
        params: { success: `Pesanan berhasil dibuat (${count} invoice per toko).` },
      });
    } catch (err) {
      toast(getErrorMessage(err), { tone: "error" });
      setSubmitting(false);
    }
  };

  return (
    <Screen
      bg={theme.colors.bg}
      contentContainerStyle={styles.content}
      keyboardAvoiding
    >
      <BackRow label="Kembali" />

      <Text style={theme.typography.pageTitle}>Checkout</Text>

      <FormField label="Alamat pengiriman" required>
        <TextInput
          style={[inputStyle(addressFocused, false), styles.addressInput]}
          value={shippingAddress}
          onChangeText={setShippingAddress}
          placeholder="Nama, jalan, kota, kode pos"
          placeholderTextColor={theme.colors.muted}
          multiline
          onFocus={() => setAddressFocused(true)}
          onBlur={() => setAddressFocused(false)}
        />
      </FormField>

      <View style={styles.paymentBlock}>
        <Text style={styles.paymentLabel}>Metode pembayaran</Text>
        <View style={styles.radioRow}>
          {PAYMENT_OPTIONS.map((option) => {
            const selected = paymentMethod === option.value;
            return (
              <Pressable
                key={option.value}
                style={[styles.radioCard, selected && styles.radioCardSelected]}
                onPress={() => setPaymentMethod(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <Icon name={option.icon} size={18} color={theme.colors.greenDark} />
                <View style={styles.radioCol}>
                  <Text style={styles.radioTitle}>{option.title}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Panel style={styles.orderPanel}>
        <Text style={styles.orderTitle}>Rincian Pesanan</Text>
        {Object.entries(groups).map(([store, storeItems], idx) => (
          <View key={store} style={[styles.group, idx > 0 && styles.groupDivider]}>
            <Text style={styles.storeName}>{store}</Text>
            {storeItems.map((item) => (
              <View key={item.product._id} style={styles.line}>
                <Text style={styles.lineName} numberOfLines={2}>
                  {item.product.name} × {item.quantity}
                </Text>
                <Text style={styles.linePrice}>
                  {formatIDR(item.product.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
        ))}
        <View style={[styles.line, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatIDR(totalPrice)}</Text>
        </View>
        <Text style={styles.disclaimer}>
          Simulasi pembayaran — tidak ada uang sungguhan yang dipindahkan.
        </Text>
      </Panel>

      <AppButton
        variant="primary"
        size="lg"
        block
        title={submitting ? "Memproses pesanan..." : `Bayar ${formatIDR(totalPrice)}`}
        disabled={submitting}
        onPress={handleSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 16,
  },
  flexCenter: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
  },
  addressInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  paymentBlock: {
    gap: 8,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.inkSoft,
  },
  radioRow: {
    flexDirection: "row",
    gap: 12,
  },
  radioCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.line,
    borderRadius: 12,
    padding: 14,
    backgroundColor: theme.colors.white,
  },
  radioCardSelected: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.greenLight,
  },
  radioCol: {
    flex: 1,
    gap: 1,
  },
  radioTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  orderPanel: {
    gap: 12,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  group: {
    gap: 8,
  },
  groupDivider: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    paddingTop: 12,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  lineName: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  linePrice: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: theme.colors.inkSoft,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.muted,
  },
});
