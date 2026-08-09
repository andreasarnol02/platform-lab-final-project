import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme";
import Icon from "./Icon";

// Mirrors web/src/components/Toast.jsx (commerce-toast). Max one at a time,
// auto-dismisses after 3200ms, animated opacity/translateY.
const ToastContext = createContext(null);

const TONES = {
  success: {
    bg: "#EFFBF2",
    border: "#B7E3C1",
    text: theme.colors.greenDark,
    icon: "shield",
    iconBg: "rgba(0, 168, 107, 0.11)",
  },
  error: {
    bg: "#FFF4F2",
    border: "#F0C3BD",
    text: theme.colors.danger,
    icon: "spark",
    iconBg: "rgba(211, 47, 47, 0.1)",
  },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const insets = useSafeAreaInsets();

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
      opacity.setValue(0);
      translateY.setValue(-8);
    });
  }, [opacity, translateY]);

  const show = useCallback(
    (message, options = {}) => {
      const tone = options.tone === "error" ? "error" : "success";
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setToast({ message, tone });
      opacity.setValue(0);
      translateY.setValue(-8);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
      timerRef.current = setTimeout(dismiss, 3200);
    },
    [dismiss, opacity, translateY]
  );

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  const toneStyle = toast ? TONES[toast.tone] : null;

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && toneStyle ? (
        <View pointerEvents="box-none" style={[styles.wrapper, { top: insets.top + 8 }]}>
          <Animated.View
            style={[
              styles.toast,
              {
                backgroundColor: toneStyle.bg,
                borderColor: toneStyle.border,
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: toneStyle.iconBg }]}>
              <Icon name={toneStyle.icon} size={16} color={toneStyle.text} />
            </View>
            <Text style={[styles.message, { color: toneStyle.text }]}>{toast.message}</Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx; // show(message, { tone }) function
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 10,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 13,
    borderWidth: 1,
    shadowColor: "#172522",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 35,
    elevation: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
});
