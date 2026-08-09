import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import Panel from "../../components/Panel";
import AppButton from "../../components/AppButton";
import ProductImage from "../../components/ProductImage";
import QuantityControl from "../../components/QuantityControl";
import { Spinner, ErrorState, EmptyState } from "../../components/states";
import { formatIDR } from "../../utils/format";
import { getProductImage } from "../../utils/product";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import RequireLogin from "./RequireLogin";

export default function CartScreen() {
  const navigation = useNavigation();
  const { user, booting } = useAuth();
  const { items, loading, error, totalPrice, updateQuantity, removeItem, refresh } =
    useCart();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (booting) return <Spinner />;
  if (!user) {
    return (
      <RequireLogin
        title="Masuk untuk melihat keranjangmu"
        message="Kamu perlu masuk sebagai pembeli untuk menambahkan produk ke keranjang."
      />
    );
  }
  if (loading && items.length === 0) return <Spinner label="Memuat keranjang..." />;
  if (error && items.length === 0) {
    return <ErrorState message={error} onRetry={refresh} />;
  }
  if (items.length === 0) {
    return (
      <View style={styles.flexCenter}>
        <EmptyState icon="bag" title="Keranjangmu kosong" message="Yuk tambahkan produk favoritmu.">
          <AppButton title="Mulai Belanja" onPress={() => navigation.navigate("CatalogTab")} />
        </EmptyState>
      </View>
    );
  }

  const summaryPanel = (
    <Panel style={styles.summary}>
      <Text style={styles.summaryTitle}>Ringkasan</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatIDR(totalPrice)}</Text>
      </View>
      <Text style={styles.summaryHint}>Ongkir dihitung di langkah berikutnya (flat).</Text>
      <AppButton
        title="Lanjut ke Pembayaran"
        size="lg"
        block
        onPress={() => navigation.navigate("Checkout")}
      />
      <AppButton
        title="Lanjut Belanja"
        variant="ghost"
        block
        onPress={() => navigation.navigate("CatalogTab")}
      />
    </Panel>
  );

  return (
    <FlatList
      style={styles.flex}
      data={items}
      keyExtractor={(item) => item.product._id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.head}>
          <Text style={theme.typography.pageTitle}>Keranjang ({items.length} produk)</Text>
          {error ? (
            <View style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>{error}</Text>
              <Pressable onPress={refresh} hitSlop={8}>
                <Text style={styles.inlineErrorRetry}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : null}
          {loading ? <Text style={styles.refreshing}>Memperbarui keranjang...</Text> : null}
        </View>
      }
      ListFooterComponent={summaryPanel}
      renderItem={({ item }) => {
        const product = item.product;
        return (
          <Panel style={styles.itemPanel}>
            <View style={styles.itemRow}>
              <ProductImage
                src={getProductImage(product)}
                alt={product.name}
                style={styles.itemImage}
              />
              <View style={styles.itemCol}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("CatalogTab", {
                      screen: "ProductDetail",
                      params: { id: product._id },
                    })
                  }
                  hitSlop={4}
                >
                  <Text style={styles.itemName} numberOfLines={2}>
                    {product.name}
                  </Text>
                </Pressable>
                <Text style={styles.itemStore}>
                  {product.seller?.storeName || "Toko"}
                </Text>
                <Text style={styles.itemPrice}>{formatIDR(product.price)}</Text>
                {product.stock <= 0 && (
                  <Text style={styles.itemOut}>Stok habis — hapus dari keranjang</Text>
                )}
              </View>
            </View>
            <View style={styles.itemFooter}>
              <QuantityControl
                value={item.quantity}
                min={1}
                max={product.stock}
                onChange={(v) => updateQuantity(product._id, v).catch(() => {})}
              />
              <Pressable
                onPress={() => removeItem(product._id).catch(() => {})}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Hapus ${product.name} dari keranjang`}
              >
                <Text style={styles.remove}>Hapus</Text>
              </Pressable>
            </View>
          </Panel>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  flexCenter: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
  },
  list: {
    padding: 14,
    gap: 12,
    paddingBottom: 32,
  },
  head: {
    gap: 10,
  },
  inlineError: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FDECEA",
    borderRadius: 10,
    padding: 10,
  },
  inlineErrorText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.danger,
  },
  inlineErrorRetry: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.danger,
  },
  refreshing: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  itemPanel: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemCol: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.ink,
    lineHeight: 19,
  },
  itemStore: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
    marginTop: 2,
  },
  itemOut: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  remove: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.danger,
  },
  summary: {
    gap: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.inkSoft,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  summaryHint: {
    fontSize: 12,
    color: theme.colors.muted,
  },
});
