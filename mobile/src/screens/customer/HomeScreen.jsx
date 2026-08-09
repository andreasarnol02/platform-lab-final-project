import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import Icon from "../../components/Icon";
import BrandMark from "../../components/BrandMark";
import AppButton from "../../components/AppButton";
import ProductImage from "../../components/ProductImage";
import ProductCard from "../../components/ProductCard";
import CategoryRow from "../../components/CategoryRow";
import { Spinner, ErrorState } from "../../components/states";
import { formatIDR, getInitial } from "../../utils/format";
import { getProductImage } from "../../utils/product";
import { customerClient } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const INFO_ITEMS = [
  { icon: "store", title: "Berbagai toko", desc: "Lihat penjual di setiap produk" },
  { icon: "tag", title: "Harga dalam IDR", desc: "Harga tampil dalam rupiah" },
  { icon: "package", title: "Pesanan per toko", desc: "Checkout dipisah berdasarkan penjual" },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { totalCount } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    customerClient
      .get("/products")
      .then(({ data }) => setProducts(data.data))
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openCatalog = () => navigation.navigate("CatalogTab");
  const openCatalogProducts = () =>
    navigation.navigate("CatalogTab", { screen: "Products" });
  const openCategory = (label) =>
    navigation.navigate("CatalogTab", { screen: "Products", params: { category: label } });
  const openProduct = (product) =>
    navigation.navigate("CatalogTab", { screen: "ProductDetail", params: { id: product._id } });

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const featured = products.slice(0, 8);
  const heroProduct = products[0];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ribbon */}
        <View style={styles.ribbon}>
          <Icon name="store" size={13} color={theme.colors.white} />
          <Text style={styles.ribbonText}>Temukan produk dari berbagai toko</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <BrandMark showWordmark size={31} />
          <View style={styles.headerRight}>
            <Pressable
              style={styles.iconButton}
              onPress={() => navigation.navigate("CartTab")}
              accessibilityRole="button"
              accessibilityLabel="Keranjang"
            >
              <Icon name="bag" size={22} color={theme.colors.ink} />
              {totalCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCount}</Text>
                </View>
              )}
            </Pressable>
            {user ? (
              <Pressable
                style={styles.avatar}
                onPress={() => navigation.navigate("ProfileTab")}
                accessibilityRole="button"
                accessibilityLabel="Profil"
              >
                <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => navigation.navigate("Login", { redirect: "back" })}
                accessibilityRole="button"
                accessibilityLabel="Masuk"
                hitSlop={8}
              >
                <Text style={styles.loginLink}>Masuk</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>MARKETPLACE LOKAL</Text>
          <Text style={styles.heroTitle}>
            Temukan yang{"\n"}
            <Text style={styles.heroTitleAccent}>kamu butuhkan.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Jelajahi produk dari berbagai toko dan temukan barang yang cocok untukmu.
          </Text>
          <View style={styles.heroActions}>
            <AppButton
              variant="primary"
              title="Mulai belanja"
              icon="arrowRight"
              size="lg"
              onPress={openCatalogProducts}
              style={styles.heroButton}
            />
            <Pressable style={styles.textLink} onPress={openCatalogProducts} hitSlop={8}>
              <Text style={styles.textLinkText}>Lihat semua produk</Text>
              <Icon name="arrowRight" size={15} color={theme.colors.greenDark} />
            </Pressable>
          </View>
          <View style={styles.proofRow}>
            <Text style={styles.proof}>
              <Text style={styles.proofStrong}>{products.length}</Text> produk tersedia
            </Text>
            <Text style={styles.proof}>
              <Text style={styles.proofStrong}>IDR</Text> harga ditampilkan dalam rupiah
            </Text>
          </View>

          {heroProduct ? (
            <Pressable
              style={({ pressed }) => [styles.heroCard, pressed && styles.pressed]}
              onPress={() => openProduct(heroProduct)}
              accessibilityRole="button"
              accessibilityLabel={heroProduct.name}
            >
              <ProductImage
                src={getProductImage(heroProduct)}
                alt={heroProduct.name}
                style={styles.heroImage}
              />
              <View style={styles.heroLabel}>
                <Text style={styles.heroCategory}>{heroProduct.category || "Produk"}</Text>
                <Text style={styles.heroName} numberOfLines={2}>
                  {heroProduct.name}
                </Text>
                <View style={styles.heroMeta}>
                  <Text style={styles.heroPrice}>{formatIDR(heroProduct.price)}</Text>
                  <Text style={styles.heroStore}>
                    {heroProduct.seller?.storeName || "Toko marketplace"}
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <View style={styles.heroEmpty}>
              <Icon name="bag" size={46} color={theme.colors.greenDark} />
            </View>
          )}
        </View>

        {/* Category panel */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.eyebrow}>KATEGORI PILIHAN</Text>
          <Pressable style={styles.textLink} onPress={openCatalog} hitSlop={8}>
            <Text style={styles.linkText}>Lihat semua</Text>
            <Icon name="arrowRight" size={14} color={theme.colors.greenDark} />
          </Pressable>
        </View>
        <View style={styles.categoryWrap}>
          <CategoryRow onSelect={openCategory} />
        </View>

        {/* Products section */}
        <View style={styles.productsHeading}>
          <View>
            <Text style={styles.eyebrow}>DIPILIH UNTUKMU</Text>
            <Text style={styles.sectionTitle}>Temukan yang kamu suka</Text>
          </View>
          <Pressable style={styles.textLink} onPress={openCatalog} hitSlop={8}>
            <Text style={styles.linkText}>Lihat semua</Text>
            <Icon name="arrowRight" size={15} color={theme.colors.greenDark} />
          </Pressable>
        </View>
        {featured.length === 0 ? (
          <Text style={styles.noProducts}>Belum ada produk.</Text>
        ) : (
          <View style={styles.grid}>
            {featured.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                style={styles.gridCard}
                onPress={() => openProduct(product)}
              />
            ))}
          </View>
        )}

        {/* Seller banner */}
        {products.length > 0 && (
          <View style={styles.sellerBanner}>
            <View style={styles.sellerEyebrowRow}>
              <Icon name="store" size={14} color={theme.colors.ribbonTextSoft} />
              <Text style={styles.sellerEyebrow}>UNTUK PEMILIK USAHA</Text>
            </View>
            <Text style={styles.sellerTitle}>Punya produk untuk dijual?</Text>
            <Text style={styles.sellerDesc}>
              Jadikan marketplace ini rumah baru untuk tokomu.
            </Text>
            <AppButton
              variant="light"
              title="Buka toko gratis"
              icon="arrowRight"
              onPress={() => navigation.navigate("Seller")}
            />
          </View>
        )}

        {/* Info row */}
        <View style={styles.infoRow}>
          {INFO_ITEMS.map((item) => (
            <View key={item.title} style={styles.infoTile}>
              <View style={styles.infoIcon}>
                <Icon name={item.icon} size={19} color={theme.colors.greenDark} />
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoTitle}>{item.title}</Text>
                <Text style={styles.infoDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>2026 Marketplace · Tugas Kelompok Lab</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  ribbon: {
    backgroundColor: theme.colors.forest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  ribbonText: {
    color: theme.colors.ribbonText,
    fontSize: 11,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.ink,
    fontWeight: "700",
    fontSize: 13,
  },
  loginLink: {
    color: theme.colors.greenDark,
    fontWeight: "600",
    fontSize: 14,
  },
  hero: {
    margin: 14,
    backgroundColor: "#E5F2ED",
    borderWidth: 1,
    borderColor: "#D6E8E0",
    borderRadius: theme.radii.hero,
    padding: theme.spacing.xl,
    gap: 10,
  },
  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.greenDark,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: theme.colors.ink,
    lineHeight: 46,
  },
  heroTitleAccent: {
    color: theme.colors.greenDark,
    fontStyle: "italic",
  },
  heroSub: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 21,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 14,
    marginTop: 2,
  },
  heroButton: {
    backgroundColor: "#172522",
  },
  textLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  textLinkText: {
    color: theme.colors.greenDark,
    fontWeight: "600",
    fontSize: 13,
  },
  proofRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 2,
  },
  proof: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  proofStrong: {
    color: theme.colors.ink,
    fontWeight: "700",
  },
  heroCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
    ...theme.shadow,
  },
  heroImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5F2ED",
  },
  heroLabel: {
    padding: 12,
    gap: 4,
  },
  heroCategory: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.greenDark,
  },
  heroName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  heroPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.greenDark,
  },
  heroStore: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  heroEmpty: {
    backgroundColor: "#D4E8DF",
    height: 180,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  pressed: {
    opacity: 0.92,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 24,
  },
  linkText: {
    color: theme.colors.greenDark,
    fontWeight: "600",
    fontSize: 13,
  },
  categoryWrap: {
    paddingHorizontal: 14,
    marginTop: 4,
  },
  productsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    paddingTop: 28,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.ink,
    marginTop: 2,
  },
  noProducts: {
    color: theme.colors.muted,
    paddingHorizontal: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 14,
  },
  gridCard: {
    width: "48%",
    flexGrow: 1,
  },
  sellerBanner: {
    backgroundColor: theme.colors.forest,
    borderRadius: theme.radii.hero,
    margin: 14,
    padding: theme.spacing.xl,
    gap: 8,
  },
  sellerEyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sellerEyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.ribbonTextSoft,
  },
  sellerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.white,
  },
  sellerDesc: {
    fontSize: 13,
    color: theme.colors.ribbonText,
    lineHeight: 20,
    marginBottom: 4,
  },
  infoRow: {
    padding: 14,
    gap: 12,
  },
  infoTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  infoDesc: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 1,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.muted,
    fontSize: 12,
    paddingVertical: 24,
  },
});
