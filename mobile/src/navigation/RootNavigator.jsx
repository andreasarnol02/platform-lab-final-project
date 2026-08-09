import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "../theme";
import { CustomerTabs } from "./CustomerNavigator";
import SellerNavigator from "./SellerNavigator";
import LoginScreen from "../screens/customer/LoginScreen";
import RegisterScreen from "../screens/customer/RegisterScreen";
import CheckoutScreen from "../screens/customer/CheckoutScreen";

// Mirrors web's route split: customer app at /, seller at /seller/* —
// here MainTabs / Login / Register / Checkout vs Seller, switched in-app
// via navigation (screens call navigate('Login'|'Register'|'Checkout'|'Seller'|'MainTabs')).
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="MainTabs" component={CustomerTabs} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Seller" component={SellerNavigator} />
    </Stack.Navigator>
  );
}
