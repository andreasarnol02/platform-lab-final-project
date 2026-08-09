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

// Mirrors web/src/seller/pages/LoginPage.jsx.
export default function SellerLoginScreen() {
  const navigation = useNavigation();
  const { login } = useSellerAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = () => {
    if (submitting) return;
    setError("");
    setSubmitting(true);
    login(form.email, form.password)
      .then(() => {
        // The navigator swaps to the seller tabs automatically.
      })
      .catch((err) => setError(getErrorMessage(err, "Email atau password salah.")))
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
        accessibilityLabel="Buka Toko Gratis"
        onPress={() => navigation.replace("SellerRegister")}
      >
        <Text style={styles.altText}>
          Belum punya toko?{" "}
          <Text style={styles.altLink}>Daftar sebagai seller</Text>
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
        title="Masuk ke Toko"
        subtitle="Kelola produk dan pesanan tokomu."
        error={error}
        sellerPill="Seller"
        footer={footer}
      >
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
            placeholder="••••••••"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
          />
        </FormField>

        <AppButton
          title={submitting ? "Memproses..." : "Masuk"}
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
