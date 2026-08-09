import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../theme";
import { getErrorMessage } from "../../api/client";
import AppButton from "../../components/AppButton";
import AuthCard from "../../components/AuthCard";
import BackRow from "../../components/BackRow";
import FormField, { inputStyle } from "../../components/FormField";
import Screen from "../../components/Screen";
import { useSellerAuth } from "../../context/SellerAuthContext";

// Mirrors web/src/seller/pages/RegisterPage.jsx.
export default function SellerRegisterScreen() {
  const navigation = useNavigation();
  const { register } = useSellerAuth();

  const [form, setForm] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = () => {
    if (submitting) return;
    setError("");

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);
    register({
      storeName: form.storeName,
      ownerName: form.ownerName,
      email: form.email,
      password: form.password,
      phone: form.phone,
    })
      .then(() => {
        // The navigator swaps to the seller tabs automatically.
      })
      .catch((err) => setError(getErrorMessage(err, "Pendaftaran gagal. Coba lagi.")))
      .finally(() => setSubmitting(false));
  };

  const handleVisitStorefront = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainTabs");
    }
  };

  const footer = (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Masuk"
        onPress={() => navigation.replace("SellerLogin")}
      >
        <Text style={styles.altText}>
          Sudah punya akun? <Text style={styles.altLink}>Masuk</Text>
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kunjungi storefront"
        onPress={handleVisitStorefront}
        style={styles.storefrontButton}
      >
        <Text style={styles.storefrontText}>Kunjungi storefront</Text>
      </Pressable>
    </>
  );

  return (
    <Screen bg={theme.colors.bg} keyboardAvoiding>
      <BackRow />

      <AuthCard
        title="Buka Toko Gratis"
        subtitle="Mulai jualan di marketplace kami."
        error={error}
        sellerPill="Seller"
        footer={footer}
      >
        <FormField label="Nama Toko" required>
          <TextInput
            style={inputStyle(focused === "storeName", false)}
            placeholder="Toko Andaku"
            value={form.storeName}
            onChangeText={(text) => setForm({ ...form, storeName: text })}
            onFocus={() => setFocused("storeName")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <FormField label="Nama Pemilik" required>
          <TextInput
            style={inputStyle(focused === "ownerName", false)}
            placeholder="Nama kamu"
            value={form.ownerName}
            onChangeText={(text) => setForm({ ...form, ownerName: text })}
            onFocus={() => setFocused("ownerName")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <FormField label="Email" required>
          <TextInput
            style={inputStyle(focused === "email", false)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="toko@email.com"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <FormField label="Password" required>
          <TextInput
            style={inputStyle(focused === "password", false)}
            secureTextEntry
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <FormField label="No. HP (opsional)">
          <TextInput
            style={inputStyle(focused === "phone", false)}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <AppButton
          title={submitting ? "Memproses..." : "Daftar"}
          variant="primary"
          size="lg"
          block
          loading={submitting}
          onPress={handleSubmit}
        />
      </AuthCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  altText: {
    textAlign: "center",
    fontSize: 13,
    color: theme.colors.muted,
  },
  altLink: {
    color: theme.colors.greenDark,
    fontWeight: "700",
  },
  storefrontButton: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  storefrontText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.greenDark,
  },
});
