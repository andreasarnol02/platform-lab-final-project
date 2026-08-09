import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import { getErrorMessage, sellerClient } from "../../api/client";
import { formatIDR } from "../../utils/format";
import { getProductImage } from "../../utils/product";
import AppButton from "../../components/AppButton";
import { EmptyState, ErrorState, Spinner } from "../../components/states";
import PageHeading from "../../components/PageHeading";
import Panel from "../../components/Panel";
import ProductImage from "../../components/ProductImage";
import Screen from "../../components/Screen";
import SellerHeader from "../../components/SellerHeader";
import { useToast } from "../../components/Toast";
import { useSellerAuth } from "../../context/SellerAuthContext";

// Mirrors web/src/seller/pages/ProductsPage.jsx.
// The Hapus button uses AppButton variant="ghost" with
// titleColor={theme.colors.danger} (previously mirrored web
// `.btn-ghost.btn-sm.text-danger` — ghost variant + danger title color).
export default function SellerProductsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useSellerAuth();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    sellerClient
      .get("/seller/products")
      .then(({ data }) => setProducts(data.data))
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLogout = () => {
    logout();
    navigation.navigate("MainTabs");
  };

  const handleDelete = (product) => {
    Alert.alert("Hapus produk", `Hapus "${product.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () =>
          sellerClient
            .delete(`/products/${product._id}`)
            .then(() => {
              toast("Produk dihapus.");
              load();
            })
            .catch((err) => toast(getErrorMessage(err), { tone: "error" })),
      },
    ]);
  };

  return (
    <Screen scroll edges={["left", "right"]}>
      <SellerHeader user={user} onLogout={handleLogout} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <PageHeading
            title="Produk Saya"
            action={
              <AppButton
                title="Tambah Produk"
                variant="primary"
                size="sm"
                icon="plus"
                onPress={() =>
                  navigation.navigate("ProductsTab", { screen: "ProductForm" })
                }
              />
            }
          />

          {products.length === 0 ? (
            <EmptyState
              icon="products"
              title="Belum ada produk"
              message="Tambahkan produk pertamamu agar tampil di storefront."
            >
              <AppButton
                title="Tambah Produk"
                variant="primary"
                size="sm"
                icon="plus"
                onPress={() =>
                  navigation.navigate("ProductsTab", { screen: "ProductForm" })
                }
              />
            </EmptyState>
          ) : (
            <View style={styles.list}>
              {products.map((product) => (
                <Panel key={product._id} style={styles.productCard}>
                  <View style={styles.productRow}>
                    <ProductImage
                      src={getProductImage(product)}
                      alt={product.name}
                      style={styles.thumb}
                    />
                    <View style={styles.productInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>
                          {product.name}
                        </Text>
                        {!product.isActive ? (
                          <View style={styles.offlineBadge}>
                            <Text style={styles.offlineBadgeText}>Nonaktif</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.category}>{product.category}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.price}>{formatIDR(product.price)}</Text>
                        <Text
                          style={[
                            styles.stock,
                            product.stock <= 0 ? styles.stockEmpty : null,
                          ]}
                        >
                          Stok: {product.stock}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <AppButton
                      title="Edit"
                      variant="ghost"
                      size="sm"
                      onPress={() =>
                        navigation.navigate("ProductForm", { id: product._id })
                      }
                    />
                    <AppButton
                      variant="ghost"
                      titleColor={theme.colors.danger}
                      title="Hapus"
                      size="sm"
                      onPress={() => handleDelete(product)}
                    />
                  </View>
                </Panel>
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md + 2,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md + 2,
  },
  productCard: {
    gap: theme.spacing.md,
  },
  productRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  thumb: {
    width: 44,
    height: 47,
    borderRadius: theme.radii.small,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
    flexShrink: 1,
  },
  offlineBadge: {
    backgroundColor: "#EEE",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  offlineBadgeText: {
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: "700",
  },
  category: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  stock: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  stockEmpty: {
    color: theme.colors.danger,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
});
