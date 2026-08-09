import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";
import Icon from "../../components/Icon";
import Panel from "../../components/Panel";
import AppButton from "../../components/AppButton";
import ProductImage from "../../components/ProductImage";
import QuantityControl from "../../components/QuantityControl";
import { Spinner, ErrorState } from "../../components/states";
import { useToast } from "../../components/Toast";
import { formatIDR } from "../../utils/format";
import { getProductImage } from "../../utils/product";
import { customerClient, getErrorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function ProductDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { user } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    customerClient
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setError("Produk tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Header title shows the product name once loaded (empty until then).
  useEffect(() => {
    navigation.setOptions({ title: product?.name || "" });
  }, [navigation, product]);

  const handleAddToCart = () => {
    if (!user) {
      navigation.navigate("Login", { redirect: "back" });
      return;
    }
    if (qty > product.stock) return;
    setAdding(true);
    addItem(product._id, qty)
      .then(() => toast("Berhasil ditambahkan ke keranjang."))
      .catch((err) => toast(getErrorMessage(err), { tone: "error" }))
      .finally(() => setAdding(false));
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const outOfStock = product.stock <= 0;
  const maxQty = product.stock || 1;
  const storeName = product.seller?.storeName || "Toko";
  const ownerName = product.seller?.ownerName;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ProductImage
        src={getProductImage(product)}
        alt={product.name}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.category}>{product.category || "Pilihan"}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.storeLine}>
          Dijual oleh <Text style={styles.storeStrong}>{storeName}</Text>
        </Text>

        <Panel style={styles.sellerPanel}>
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {(product.seller?.storeName || "T")[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.sellerCol}>
              <Text style={styles.sellerEyebrow}>INFORMASI TOKO</Text>
              <Text style={styles.sellerName}>{storeName}</Text>
              <Text style={styles.sellerOwner}>
                {ownerName ? `Pemilik: ${ownerName}` : "Seller marketplace"}
              </Text>
            </View>
          </View>
        </Panel>

        <Text style={styles.price}>{formatIDR(product.price)}</Text>

        <Text style={styles.descTitle}>Deskripsi produk</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.stockRow}>
          {outOfStock ? (
            <View style={styles.stockBadgeOut}>
              <Text style={styles.stockBadgeOutText}>Stok habis</Text>
            </View>
          ) : (
            <View style={styles.stockBadgeOk}>
              <Text style={styles.stockBadgeOkText}>Stok tersedia: {product.stock}</Text>
            </View>
          )}
        </View>

        {!outOfStock && (
          <View style={styles.qtyBlock}>
            <Text style={styles.qtyLabel}>Jumlah</Text>
            <QuantityControl value={qty} min={1} max={maxQty} onChange={setQty} />
            <AppButton
              variant="primary"
              size="lg"
              block
              title={adding ? "Menambahkan..." : "Tambah ke Keranjang"}
              disabled={adding}
              onPress={handleAddToCart}
            />
          </View>
        )}

        <View style={styles.facts}>
          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Kategori</Text>
            <Text style={styles.factValue}>{product.category}</Text>
          </View>
          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Ketersediaan</Text>
            <Text style={styles.factValue}>
              {outOfStock ? "Stok habis" : `${product.stock} unit`}
            </Text>
          </View>
          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Penjual</Text>
            <Text style={styles.factValue}>{ownerName || "Seller marketplace"}</Text>
          </View>
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Icon name="shield" size={16} color={theme.colors.greenDark} />
            <Text style={styles.trustText}>Transfer bank atau COD</Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="store" size={16} color={theme.colors.greenDark} />
            <Text style={styles.trustText}>Ketersediaan dari data produk</Text>
          </View>
        </View>

        {!user && (
          <Pressable onPress={() => navigation.navigate("Login", { redirect: "back" })} hitSlop={8}>
            <Text style={styles.loginHint}>
              <Text style={styles.loginHintStrong}>Masuk</Text> dulu untuk menambahkan ke
              keranjang.
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#E5F2ED",
  },
  body: {
    padding: 14,
  },
  category: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.greenDark,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.ink,
    lineHeight: 30,
  },
  storeLine: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    marginTop: 4,
  },
  storeStrong: {
    fontWeight: "700",
    color: theme.colors.ink,
  },
  sellerPanel: {
    marginTop: 14,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.greenDark,
  },
  sellerCol: {
    flex: 1,
    gap: 1,
  },
  sellerEyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.muted,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  sellerOwner: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  price: {
    fontSize: 31,
    fontWeight: "800",
    color: theme.colors.greenDark,
    marginTop: 16,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
    marginTop: 18,
  },
  desc: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 23,
    marginTop: 6,
  },
  stockRow: {
    marginTop: 16,
  },
  stockBadgeOut: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stockBadgeOutText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  stockBadgeOk: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.greenLight,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stockBadgeOkText: {
    color: theme.colors.greenDark,
    fontSize: 12,
    fontWeight: "700",
  },
  qtyBlock: {
    marginTop: 18,
    gap: 10,
  },
  qtyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.inkSoft,
  },
  facts: {
    marginTop: 20,
    gap: 8,
  },
  factRow: {
    flexDirection: "row",
    gap: 8,
  },
  factLabel: {
    width: 100,
    fontSize: 12,
    color: theme.colors.muted,
  },
  factValue: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  trustRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  trustItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.muted,
  },
  loginHint: {
    marginTop: 18,
    fontSize: 13,
    color: theme.colors.muted,
  },
  loginHintStrong: {
    color: theme.colors.greenDark,
    fontWeight: "600",
  },
});
