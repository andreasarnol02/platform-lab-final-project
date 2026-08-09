import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock, LogIn, UserPlus, ShieldCheck, X } from "lucide-react-native";
import { colors, spacing, borderRadius, commonStyles, shadows } from "../theme";

interface AuthPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin?: () => void;
  onLoginPress?: () => void;
  onRegister?: () => void;
  onRegisterPress?: () => void;
  actionText?: string;
}

export const AuthPromptModal = ({
  visible,
  onClose,
  onLogin,
  onLoginPress,
  onRegister,
  onRegisterPress,
  actionText = "Fitur Terproteksi",
}: AuthPromptModalProps) => {
  const insets = useSafeAreaInsets();
  const handleLogin = onLogin || onLoginPress;
  const handleRegister = onRegister || onRegisterPress;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalSheet,
            { paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxl) },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Drag Indicator Handle */}
          <View style={styles.dragHandle} />

          {/* Close X Button */}
          <TouchableOpacity
            style={styles.closeIconButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={18} color={colors.storefront.muted} />
          </TouchableOpacity>

          {/* Top Shield & Lock Badge Icon */}
          <View style={styles.heroIconCircle}>
            <Lock size={28} color={colors.storefront.greenDark} />
          </View>

          <View style={styles.badgeContainer}>
            <ShieldCheck size={12} color={colors.storefront.greenDark} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>Sistem Autentikasi Pelanggan</Text>
          </View>

          <Text style={styles.modalTitle}>Masuk untuk Melanjutkan</Text>

          <Text style={styles.description}>
            Untuk mengakses <Text style={styles.highlightText}>{actionText}</Text>, silakan masuk atau mendaftar akun Storefront Marketplace Anda.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                if (handleLogin) handleLogin();
              }}
            >
              <LogIn size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.primaryButtonText}>Masuk ke Akun</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                if (handleRegister) handleRegister();
              }}
            >
              <UserPlus size={18} color={colors.storefront.greenDark} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryButtonText}>Daftar Akun Baru</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Lanjut Browsing Katalog</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.hero,
    borderTopRightRadius: borderRadius.hero,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.storefront.lineLight,
    ...shadows.floating,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.storefront.line,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  closeIconButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.storefront.green,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs - 1,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  badgeText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.storefront.ink,
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 13,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  primaryButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.storefront.greenLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.storefront.greenLight,
  },
  secondaryButtonText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.storefront.muted,
    fontWeight: "700",
    fontSize: 13,
  },
});
