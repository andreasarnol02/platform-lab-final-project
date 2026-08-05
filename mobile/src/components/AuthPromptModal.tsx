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
            styles.modalContent,
            { paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxl) },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Drag Indicator Handle */}
          <View style={styles.dragHandle} />

          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Akses Terproteksi</Text>
          </View>

          <Text style={styles.modalTitle}>Yuk, Masuk ke Akun! 🔒</Text>

          <Text style={styles.description}>
            Untuk mengakses <Text style={styles.highlightText}>{actionText}</Text>, silakan masuk atau daftar akun Storefront Marketplace terlebih dahulu.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={commonStyles.buttonPrimary}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                if (handleLogin) handleLogin();
              }}
            >
              <Text style={commonStyles.buttonPrimaryText}>Masuk ke Akun</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                if (handleRegister) handleRegister();
              }}
            >
              <Text style={styles.secondaryButtonText}>Daftar Akun Baru</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
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
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.hero,
    borderTopRightRadius: borderRadius.hero,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    alignItems: "center",
    ...shadows.floating,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.storefront.line,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  badgeContainer: {
    backgroundColor: colors.storefront.greenLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.storefront.greenDark,
    fontWeight: "700",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.storefront.ink,
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  highlightText: {
    fontWeight: "800",
    color: colors.storefront.greenDark,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: colors.storefront.greenLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.storefront.muted,
    fontWeight: "700",
    fontSize: 13,
  },
});
