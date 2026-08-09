import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../../theme";
import Icon from "../../components/Icon";
import ProductCard from "../../components/ProductCard";
import SearchInput from "../../components/SearchInput";
import { CATEGORIES } from "../../components/CategoryRow";
import { Spinner, ErrorState, EmptyState } from "../../components/states";
import { customerClient } from "../../api/client";

const PAGE_LIMIT = 24;

const CHIP_LABELS = ["Semua", ...CATEGORIES.map((c) => c.label)];

export default function ProductsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(route.params?.category || "");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Sync category when arriving from the Home screen (catalog deep link).
  useEffect(() => {
    setCategory(route.params?.category || "");
  }, [route.params?.category]);

  // Shared fetch used by the first load and by load-more (append).
  const fetchPage = useCallback(
    async (nextPage, { append = false } = {}) => {
      const { data } = await customerClient.get("/products", {
        params: {
          search: search || undefined,
          category: category || undefined,
          page: nextPage,
          limit: PAGE_LIMIT,
        },
      });
      setProducts((prev) => (append ? [...prev, ...data.data] : data.data));
      setPagination(data.pagination || null);
      setPage(nextPage);
    },
    [search, category]
  );

  const load = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError("");
      try {
        await fetchPage(nextPage);
      } catch (err) {
        setError("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    },
    [fetchPage]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleLoadMore = () => {
    if (loading || loadingMore) return;
    if (!pagination || page >= pagination.pages) return;
    const next = page + 1;
    setLoadingMore(true);
    fetchPage(next, { append: true })
      .catch(() => {
        // Keep the current list; the user can pull more later.
      })
      .finally(() => setLoadingMore(false));
  };

  const submitSearch = () => setSearch(searchInput.trim());

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
  };

  const selectCategory = (label) => setCategory(label);

  const hasFilter = Boolean(search || category);

  const headerBlock = (
    <View>
      <View style={styles.headerPad}>
        <View style={styles.eyebrowRow}>
          <Icon name="grid" size={14} color={theme.colors.greenDark} />
          <Text style={styles.eyebrow}>KATALOG MARKETPLACE</Text>
        </View>
        <Text style={theme.typography.pageTitle}>Temukan yang kamu suka</Text>
        <Text style={styles.subtitle}>Jelajahi produk dari berbagai toko.</Text>
        <View style={styles.resultPill}>
          <Text style={styles.resultPillText}>
            {pagination?.total ?? products.length} produk
          </Text>
        </View>
        <View style={styles.searchWrap}>
          <SearchInput
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmit={submitSearch}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CHIP_LABELS.map((label) => {
          const isSelected =
            category === "" ? label === "Semua" : label === category;
          return (
            <Pressable
              key={label}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => selectCategory(label === "Semua" ? "" : label)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {hasFilter ? (
        <View style={[styles.headerPad, styles.filterRow]}>
          <Text style={styles.filterText} numberOfLines={1}>
            {search ? `Hasil pencarian untuk "${search}"` : `Kategori ${category}`}
          </Text>
          <Pressable onPress={clearFilters} hitSlop={8}>
            <Text style={styles.clearFilter}>Hapus filter</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  if (loading && products.length === 0) return <Spinner />;
  if (error && products.length === 0) {
    return <ErrorState message={error} onRetry={() => load(1)} />;
  }

  if (products.length === 0) {
    return (
      <View style={styles.flex}>
        {headerBlock}
        <EmptyState
          icon="search"
          title="Produk tidak ditemukan"
          message="Coba kata kunci atau kategori lain."
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.flex}
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={headerBlock}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={styles.footer} color={theme.colors.green} />
        ) : null
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          style={styles.gridCard}
          onPress={() => navigation.navigate("ProductDetail", { id: item._id })}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  headerPad: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 10,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.greenDark,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
  },
  resultPill: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
  },
  resultPillText: {
    color: theme.colors.greenDark,
    fontSize: 12,
    fontWeight: "700",
  },
  searchWrap: {
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  chip: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  chipSelected: {
    backgroundColor: theme.colors.green,
    borderColor: theme.colors.green,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.inkSoft,
  },
  chipTextSelected: {
    color: theme.colors.white,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 6,
  },
  filterText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.muted,
  },
  clearFilter: {
    color: theme.colors.greenDark,
    fontWeight: "600",
    fontSize: 13,
  },
  columnWrapper: {
    gap: 12,
    paddingHorizontal: 14,
  },
  listContent: {
    gap: 12,
    paddingBottom: 32,
  },
  gridCard: {
    width: "48%",
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});
