import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { theme } from "../../theme";
import Screen from "../../components/Screen";
import AuthCard from "../../components/AuthCard";
import BackRow from "../../components/BackRow";
import FormField, { inputStyle } from "../../components/FormField";
import AppButton from "../../components/AppButton";
import { getErrorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, phone, address });
      navigation.replace("MainTabs");
    } catch (err) {
      setError(getErrorMessage(err, "Pendaftaran gagal. Coba lagi."));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <>
      <Pressable onPress={() => navigation.replace("Login")} hitSlop={8}>
        <Text style={styles.link}>
          Sudah punya akun? <Text style={styles.linkStrong}>Masuk</Text>
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Seller")} hitSlop={8}>
        <Text style={styles.sellerLink}>Daftar sebagai Seller</Text>
      </Pressable>
    </>
  );

  return (
    <Screen bg={theme.colors.bg} keyboardAvoiding>
      <BackRow />

      <AuthCard
        title="Daftar sebagai Pembeli"
        subtitle="Buat akun untuk mulai berbelanja."
        error={error}
        footer={footer}
      >
        <FormField label="Nama lengkap" required>
          <TextInput
            style={inputStyle(nameFocused, false)}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="Nama kamu"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </FormField>

        <FormField label="Email" required>
          <TextInput
            style={inputStyle(emailFocused, false)}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="nama@email.com"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </FormField>

        <FormField label="Password" required>
          <TextInput
            style={inputStyle(passFocused, false)}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Minimal 6 karakter"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
          />
        </FormField>

        <FormField label="No. HP (opsional)">
          <TextInput
            style={inputStyle(phoneFocused, false)}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
          />
        </FormField>

        <FormField label="Alamat (opsional)">
          <TextInput
            style={[inputStyle(addressFocused, false), styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder="Alamat pengiriman"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setAddressFocused(true)}
            onBlur={() => setAddressFocused(false)}
          />
        </FormField>

        <AppButton
          variant="primary"
          block
          title={submitting ? "Memproses..." : "Daftar"}
          loading={submitting}
          onPress={handleSubmit}
        />
      </AuthCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addressInput: {
    height: 76,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  link: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  linkStrong: {
    fontWeight: "700",
    color: theme.colors.greenDark,
  },
  sellerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.greenDark,
  },
});
