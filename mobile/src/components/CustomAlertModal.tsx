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
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from "lucide-react-native";
import { colors, spacing, borderRadius, shadows } from "../theme";

export type ModalType = "success" | "warning" | "danger" | "info";

export interface CustomAlertModalProps {
  visible: boolean;
  type?: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  type = "info",
  title,
  message,
  confirmText = "Mengerti",
  cancelText,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  const renderTypeIcon = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 size={32} color={colors.storefront.greenDark} />,
          bg: colors.storefront.greenLight,
          borderColor: colors.storefront.green,
        };
      case "warning":
        return {
          icon: <AlertTriangle size={32} color={colors.status.pendingText} />,
          bg: colors.status.pendingBg,
          borderColor: colors.storefront.warning,
        };
      case "danger":
        return {
          icon: <XCircle size={32} color={colors.status.cancelledText} />,
          bg: colors.status.cancelledBg,
          borderColor: colors.storefront.danger,
        };
      case "info":
      default:
        return {
          icon: <Info size={32} color={colors.status.paidText} />,
          bg: colors.status.paidBg,
          borderColor: colors.status.paidText,
        };
    }
  };

  const typeConfig = renderTypeIcon();

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
            styles.dialogCard,
            { paddingBottom: Math.max(insets.bottom + spacing.md, spacing.xl) },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close X Button */}
          <TouchableOpacity
            style={styles.closeIconButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={18} color={colors.storefront.muted} />
          </TouchableOpacity>

          {/* Hero Type Icon Container */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: typeConfig.bg,
                borderColor: typeConfig.borderColor,
              },
            ]}
          >
            {typeConfig.icon}
          </View>

          {/* Modal Header & Message */}
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>

          {/* Action Buttons Group */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                type === "danger" && styles.dangerConfirmBtn,
              ]}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onConfirm();
              }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>

            {cancelText && (
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  if (onCancel) onCancel();
                }}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  dialogCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.hero,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.floating,
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
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  titleText: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.storefront.ink,
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  messageText: {
    fontSize: 14,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 21,
    paddingHorizontal: spacing.sm,
  },
  buttonGroup: {
    width: "100%",
    gap: spacing.sm,
  },
  confirmButton: {
    width: "100%",
    backgroundColor: colors.storefront.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  dangerConfirmBtn: {
    backgroundColor: colors.storefront.danger,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  cancelButton: {
    width: "100%",
    backgroundColor: colors.storefront.bg,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  cancelButtonText: {
    color: colors.storefront.inkSoft,
    fontSize: 14,
    fontWeight: "700",
  },
});
