import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CONFIG from "../services/config";
import {
  getCustomerToken,
  getSellerToken,
  getHasSeenOnboarding,
} from "../utils/storage";
import { RootStackParamList } from "./types";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { CartScreen } from "../screens/CartScreen";
import { OrderHistoryScreen } from "../screens/OrderHistoryScreen";
import { colors } from "../theme";

const Stack = createStackNavigator<RootStackParamList>();
const AppNavigationContainer = NavigationContainer as unknown as React.FC<
  React.ComponentProps<typeof NavigationContainer>
>;
const AppStackNavigator = Stack.Navigator as unknown as React.FC<
  React.ComponentProps<typeof Stack.Navigator>
>;

export const RootNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>("Home");

  useEffect(() => {
    const initializeAppState = async () => {
      try {
        const customerToken = await getCustomerToken();
        const sellerToken = await getSellerToken();
        const hasSeenOnboarding = await getHasSeenOnboarding();

        // Check feature flag & persistence: show Onboarding if enabled AND user has not seen it AND not logged in
        if (
          CONFIG.ENABLE_ONBOARDING &&
          !hasSeenOnboarding &&
          !customerToken &&
          !sellerToken
        ) {
          setInitialRoute("Onboarding");
        } else {
          setInitialRoute("Home");
        }
      } catch (error) {
        console.error("Error initializing root navigation state:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAppState();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.storefront.green} />
      </View>
    );
  }

  return (
    <AppNavigationContainer>
      <AppStackNavigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.storefront.bg },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      </AppStackNavigator>
    </AppNavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.storefront.bg,
    justifyContent: "center",
    alignItems: "center",
  },
});
