import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../../theme";
import { getErrorMessage, sellerClient } from "../../api/client";
import { formatIDRInput } from "../../utils/format";
import AppButton from "../../components/AppButton";
import BackRow from "../../components/BackRow";
import FormField, { inputStyle } from "../../components/FormField";
import Icon from "../../components/Icon";
import Panel from "../../components/Panel";
import ProductImage from "../../components/ProductImage";
import Screen from "../../components/Screen";
import { ErrorState, Spinner } from "../../components/states";
import { useToast } from "../../components/Toast";

// Mirrors web/src/seller/pages/ProductFormPage.jsx.
const EMPTY = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
};

const CATEGORY_OPTIONS = [
  "Elektronik",
  "Fashion",
  "Kecantikan",
  "Makanan",
  "Rumah",
  "Hobi",
  "Lainnya",
];

export default function ProductFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();

  const id = route.params?.id;
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);

  const load = useCallback(() => {
    if (!isEdit) return;
    setLoading(true);
    setError("");
    sellerClient
      .get(`/seller/products/${id}`)
      .then(({ data }) => {
        const p = data.data;
        setForm({
          name: p.name,
          description: p.description || "",
          price: p.price,
          stock: p.stock,
          category: p.category,
          imageUrl: p.imageUrl || p.images?.[0] || "",
        });
      })
      .catch((err) => setError(getErrorMessage(err, "Produk tidak ditemukan.")))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = () => {
    if (submitting) return;

    const missing =
      !form.name.trim() ||
      !form.description.trim() ||
      !(Number(form.price) > 0) ||
      form.stock === "" ||
      !(Number(form.stock) >= 0) ||
      !form.category ||
      !form.imageUrl.trim().toLowerCase().startsWith("http");

    if (missing) {
      toast("Lengkapi semua field wajib.", { tone: "error" });
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      imageUrl: form.imageUrl.trim(),
    };

    const request = isEdit
      ? sellerClient.put(`/products/${id}`, payload)
      : sellerClient.post("/products", payload);

    request
      .then(() => {
        toast(isEdit ? "Perubahan disimpan." : "Produk berhasil diterbitkan.");
        navigation.goBack();
      })
      .catch((err) => {
        toast(getErrorMessage(err), { tone: "error" });
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <Screen bg={theme.colors.bg}>
        <Spinner />
      </Screen>
    );
  }

  if (isEdit && error) {
    return (
      <Screen bg={theme.colors.bg}>
        <ErrorState message={error} onRetry={load} />
      </Screen>
    );
  }

  return (
    <Screen scroll bg={theme.colors.bg} keyboardAvoiding>
      <BackRow label="Kembali" />

      <Text style={styles.pageTitle}>{isEdit ? "Edit Produk" : "Tambah Produk"}</Text>

      <Panel style={styles.formCard}>
        <FormField label="Nama produk" required>
          <TextInput
            style={inputStyle(focused === "name", false)}
            placeholder="Contoh: Laptop Pro 14"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <FormField label="Deskripsi" required>
          <TextInput
            style={[inputStyle(focused === "description", false), styles.descriptionInput]}
            multiline
            placeholder="Jelaskan produkmu"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            onFocus={() => setFocused("description")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <View style={styles.formRow}>
          <FormField label="Harga jual" required containerStyle={styles.fieldHalf}>
            <View style={[styles.currencyRow, inputStyle(focused === "price", false)]}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.currencyInput}
                keyboardType="numeric"
                placeholder="1500000"
                value={formatIDRInput(form.price)}
                onChangeText={(text) =>
                  setForm({ ...form, price: text.replace(/\D/g, "") })
                }
                onFocus={() => setFocused("price")}
                onBlur={() => setFocused(null)}
              />
            </View>
          </FormField>

          <FormField label="Stok" required containerStyle={styles.fieldHalf}>
            <TextInput
              style={inputStyle(focused === "stock", false)}
              keyboardType="number-pad"
              placeholder="10"
              value={form.stock === "" ? "" : String(form.stock)}
              onChangeText={(text) =>
                setForm({ ...form, stock: text.replace(/\D/g, "") })
              }
              onFocus={() => setFocused("stock")}
              onBlur={() => setFocused(null)}
            />
          </FormField>
        </View>

        <FormField label="Kategori" required>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pilih kategori"
            onPress={() => setCategoryModal(true)}
            style={[styles.categoryField, inputStyle(focused === "category", false)]}
          >
            <Text
              style={form.category ? styles.categoryValue : styles.categoryPlaceholder}
              numberOfLines={1}
            >
              {form.category || "Pilih kategori"}
            </Text>
            <Icon name="chevron" size={16} color={theme.colors.muted} />
          </Pressable>
        </FormField>

        <FormField label="URL Gambar" required>
          <TextInput
            style={inputStyle(focused === "imageUrl", false)}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="https://contoh.com/foto-produk.jpg"
            value={form.imageUrl}
            onChangeText={(text) => setForm({ ...form, imageUrl: text })}
            onFocus={() => setFocused("imageUrl")}
            onBlur={() => setFocused(null)}
          />
        </FormField>
        <Text style={styles.help}>
          Wajib diisi dengan URL publik langsung ke file gambar produk. Upload file belum tersedia.
        </Text>

        {form.imageUrl ? (
          <ProductImage
            src={form.imageUrl}
            alt="Pratinjau gambar produk"
            style={styles.preview}
          />
        ) : null}

        <View style={styles.actionsRow}>
          <AppButton title="Batal" variant="ghost" onPress={() => navigation.goBack()} />
          <AppButton
            title={
              submitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Terbitkan Produk"
            }
            variant="primary"
            style={styles.submitButton}
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>
      </Panel>

      <Modal
        visible={categoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityLabel="Tutup pilihan kategori"
            style={StyleSheet.absoluteFill}
            onPress={() => setCategoryModal(false)}
          />
          <Panel style={styles.sheet}>
            <Text style={styles.sheetTitle}>Pilih Kategori</Text>
            {CATEGORY_OPTIONS.map((category) => {
              const selected = form.category === category;
              return (
                <Pressable
                  key={category}
                  accessibilityRole="button"
                  accessibilityLabel={category}
                  onPress={() => {
                    setForm({ ...form, category });
                    setCategoryModal(false);
                  }}
                  style={styles.categoryOption}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selected && styles.categoryOptionSelected,
                    ]}
                  >
                    {category}
                  </Text>
                  {selected ? (
                    <Icon name="check" size={16} color={theme.colors.greenDark} />
                  ) : null}
                </Pressable>
              );
            })}
            <AppButton
              title="Batal"
              variant="ghost"
              size="sm"
              onPress={() => setCategoryModal(false)}
              style={styles.sheetCancel}
            />
          </Panel>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: theme.colors.ink,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  formCard: {
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
  },
  formRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  fieldHalf: {
    flex: 1,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    overflow: "hidden",
  },
  currencyPrefix: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  currencyInput: {
    flex: 1,
    height: 44,
    padding: 0,
    fontSize: 14,
    color: theme.colors.ink,
  },
  categoryField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
  },
  categoryValue: {
    fontSize: 14,
    color: theme.colors.ink,
  },
  categoryPlaceholder: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  help: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: -10,
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: theme.radii.card,
    alignSelf: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginTop: 4,
  },
  submitButton: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(23, 37, 34, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    margin: theme.spacing.lg,
    borderRadius: theme.radii.hero,
    gap: 2,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
    minHeight: 48,
  },
  categoryOptionText: {
    fontSize: 14,
    color: theme.colors.ink,
  },
  categoryOptionSelected: {
    color: theme.colors.greenDark,
    fontWeight: "700",
  },
  sheetCancel: {
    alignSelf: "flex-end",
    marginTop: theme.spacing.sm,
  },
});
