import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import Icon from "../components/Icon";
import { Spinner } from "../components/states";
import { useSellerAuth } from "../context/SellerAuthContext";
import SellerLoginScreen from "../screens/seller/SellerLoginScreen";
import SellerRegisterScreen from "../screens/seller/SellerRegisterScreen";
import DashboardScreen from "../screens/seller/DashboardScreen";
import SellerProductsScreen from "../screens/seller/SellerProductsScreen";
import ProductFormScreen from "../screens/seller/ProductFormScreen";
import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";

// Mirrors web/src/seller/components/Layout.jsx sidebar:
// Dashboard / Produk Saya / Pesanan Masuk as bottom tabs.
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

function ProductsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Products" component={SellerProductsScreen} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Orders" component={SellerOrdersScreen} />
    </Stack.Navigator>
  );
}

function SellerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.greenDark,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.line,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{
          tabBarLabel: "Produk",
          tabBarIcon: ({ color, size }) => (
            <Icon name="products" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: "Pesanan",
          tabBarIcon: ({ color, size }) => (
            <Icon name="orders" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function SellerNavigator() {
  const { user, booting } = useSellerAuth();

  if (booting) {
    return (
      <View style={styles.boot}>
        <StatusBar style="light" />
        <Spinner label="Memuat..." />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="SellerTabs" component={SellerTabs} />
      ) : (
        <>
          <Stack.Screen name="SellerLogin" component={SellerLoginScreen} />
          <Stack.Screen name="SellerRegister" component={SellerRegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: theme.colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
});
