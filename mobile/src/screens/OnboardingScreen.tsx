import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { setHasSeenOnboarding } from "../utils/storage";
import { colors, spacing, borderRadius, shadows, commonStyles } from "../theme";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

interface Slide {
  id: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    icon: "🛍️",
    badge: "Etalase Lengkap",
    title: "Belanja Mudah & Cepat di Storefront",
    description: "Temukan ribuan produk pilihan dari penjual terpercaya dengan harga terbaik dan pengalaman belanja yang nyaman.",
  },
  {
    id: "2",
    icon: "🛡️",
    badge: "Transaksi Terjamin",
    title: "Perlindungan & Kualitas Green",
    description: "Nikmati perlindungan belanja dengan pembayaran terverifikasi dan pemantauan stok real-time langsung dari etalase.",
  },
  {
    id: "3",
    icon: "🏪",
    badge: "Dua Peran Marketplace",
    title: "Belanja atau Kelola Toko Sendiri!",
    description: "Beralih peran secara bebas antara Pembeli dan Penjual untuk mengelola katalog toko serta pesanan Anda secara efisien.",
  },
];

export const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const completeOnboarding = async () => {
    await setHasSeenOnboarding(true);
    navigation.replace("Home");
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <View
      style={[
        styles.safeContainer,
        {
          paddingTop: Math.max(insets.top + spacing.sm, spacing.lg),
          paddingBottom: Math.max(insets.bottom + spacing.sm, spacing.lg),
        },
      ]}
    >
      {/* Top Header Navigation */}
      <View style={styles.topNavRow}>
        <View style={commonStyles.badgeGreen}>
          <Text style={commonStyles.badgeGreenText}>
            LANGKAH {currentIndex + 1} DARI {SLIDES.length}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.skipPill}
          activeOpacity={0.7}
          onPress={handleSkip}
        >
          <Text style={styles.skipPillText}>Skip Intro ✕</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Card Hero */}
      <View style={styles.heroCard}>
        <View style={styles.iconCircleOuter}>
          <View style={styles.iconCircleInner}>
            <Text style={styles.iconEmoji}>{currentSlide.icon}</Text>
          </View>
        </View>

        <View style={styles.slideBadge}>
          <Text style={styles.slideBadgeText}>{currentSlide.badge}</Text>
        </View>

        <Text style={styles.slideTitle}>{currentSlide.title}</Text>
        <Text style={styles.slideDescription}>{currentSlide.description}</Text>

        {/* Carousel Indicators */}
        <View style={styles.indicatorRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                index === currentIndex
                  ? styles.indicatorDotActive
                  : styles.indicatorDotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Action CTA */}
      <View style={styles.bottomCtaContainer}>
        <TouchableOpacity
          style={commonStyles.buttonPrimary}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={commonStyles.buttonPrimaryText}>
            {currentIndex === SLIDES.length - 1
              ? "Mulai Belanja Sekarang ✨"
              : "Lanjutkan →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
    paddingHorizontal: spacing.xl,
    justifyContent: "space-between",
  },
  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipPill: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.storefront.line,
  },
  skipPillText: {
    color: colors.storefront.muted,
    fontWeight: "700",
    fontSize: 12,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.hero,
    padding: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.storefront.line,
    ...shadows.card,
    marginVertical: spacing.md,
  },
  iconCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.storefront.greenLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.storefront.green,
  },
  iconCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEmoji: {
    fontSize: 42,
  },
  slideBadge: {
    backgroundColor: colors.storefront.greenSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.storefront.line,
    marginBottom: spacing.md,
  },
  slideBadgeText: {
    color: colors.storefront.greenDark,
    fontWeight: "800",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.storefront.ink,
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  slideDescription: {
    fontSize: 14,
    color: colors.storefront.inkSoft,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  indicatorRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorDot: {
    height: 6,
    borderRadius: borderRadius.full,
  },
  indicatorDotActive: {
    width: 24,
    backgroundColor: colors.storefront.green,
  },
  indicatorDotInactive: {
    width: 6,
    backgroundColor: colors.storefront.line,
  },
  bottomCtaContainer: {
    width: "100%",
  },
});
