import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "../theme";
import Icon from "../components/Icon";
import { useCart } from "../context/CartContext";
import HomeScreen from "../screens/customer/HomeScreen";
import ProductsScreen from "../screens/customer/ProductsScreen";
import ProductDetailScreen from "../screens/customer/ProductDetailScreen";
import CartScreen from "../screens/customer/CartScreen";
import OrdersScreen from "../screens/customer/OrdersScreen";
import OrderDetailScreen from "../screens/customer/OrderDetailScreen";
import ProfileScreen from "../screens/customer/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: theme.colors.white },
  headerShadowVisible: false,
  headerTitleStyle: { fontSize: 16, fontWeight: "700", color: theme.colors.ink },
  headerTintColor: theme.colors.greenDark,
  headerBackButtonDisplayMode: "minimal",
};

const tabScreenOptions = {
  tabBarActiveTintColor: theme.colors.greenDark,
  tabBarInactiveTintColor: theme.colors.muted,
  tabBarStyle: {
    backgroundColor: theme.colors.white,
    borderTopColor: theme.colors.line,
  },
  tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
  headerShown: false,
};

// Hoisted tab bar icons so each tabBarIcon receives a stable component
// reference instead of a fresh function per render.
const HomeTabIcon = ({ color, size }) => <Icon name="home" size={size} color={color} />;
const CatalogTabIcon = ({ color, size }) => <Icon name="grid" size={size} color={color} />;
const CartTabIcon = ({ color, size }) => <Icon name="bag" size={size} color={color} />;
const OrdersTabIcon = ({ color, size }) => (
  <Icon name="package" size={size} color={color} />
);
const ProfileTabIcon = ({ color, size }) => <Icon name="user" size={size} color={color} />;

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function CatalogStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "Katalog" }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "", headerTransparent: false }}
      />
    </Stack.Navigator>
  );
}

function CartStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Keranjang" }} />
    </Stack.Navigator>
  );
}

function OrdersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "Pesanan" }} />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: "Detail Pesanan" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Stack.Navigator>
  );
}

export function CustomerTabs() {
  const { totalCount } = useCart();

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: "Beranda", tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name="CatalogTab"
        component={CatalogStackNavigator}
        options={{ tabBarLabel: "Katalog", tabBarIcon: CatalogTabIcon }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          tabBarLabel: "Keranjang",
          tabBarIcon: CartTabIcon,
          tabBarBadge: totalCount > 0 ? totalCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.green,
            color: "#fff",
            fontSize: 11,
          },
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackNavigator}
        options={{ tabBarLabel: "Pesanan", tabBarIcon: OrdersTabIcon }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: "Profil", tabBarIcon: ProfileTabIcon }}
      />
    </Tab.Navigator>
  );
}

export default CustomerTabs;
