import "./global.css";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import CONFIG from "./src/services/config";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CUSTOMERS } from "./src/data/mockData";
import { getUserRole, setUserRole, setCustomerToken, getCustomerToken } from "./src/utils/storage";
import { UserRole } from "./src/types";

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>(null);
  const [savedToken, setSavedToken] = useState<string | null>(null);

  useEffect(() => {
    // Test initial storage load
    const loadStorage = async () => {
      await setCustomerToken("mock_jwt_customer_token_xyz123");
      await setUserRole("customer");
      const role = await getUserRole();
      const token = await getCustomerToken();
      setActiveRole(role);
      setSavedToken(token);
    };
    loadStorage();
  }, []);

  const handleRoleToggle = async (role: UserRole) => {
    await setUserRole(role);
    setActiveRole(role);
  };

  return (
    <SafeAreaView className="flex-1 bg-tokopedia-bg">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header Badge */}
        <View className="items-center mt-6 mb-4">
          <View className="bg-tokopedia-green-light px-4 py-1.5 rounded-full mb-2">
            <Text className="text-tokopedia-green-dark font-bold text-xs">
              {CONFIG.APP_NAME} • Fase 2
            </Text>
          </View>
          <Text className="text-2xl font-bold text-tokopedia-ink text-center">
            Data Architecture & Storage Demo
          </Text>
        </View>

        {/* Role & Storage Helper Card */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-tokopedia-line shadow-sm">
          <Text className="text-xs font-bold text-tokopedia-muted uppercase tracking-wider mb-3">
            AsyncStorage Helper Verification
          </Text>

          <View className="flex-row items-center justify-between py-2 border-b border-tokopedia-line mb-3">
            <Text className="text-tokopedia-ink font-medium">Active USER_ROLE</Text>
            <View className="bg-tokopedia-green-light px-3 py-1 rounded-full">
              <Text className="text-tokopedia-green-dark font-bold text-xs">
                {activeRole ? activeRole.toUpperCase() : "NONE"}
              </Text>
            </View>
          </View>

          <View className="py-2 mb-3">
            <Text className="text-tokopedia-ink font-medium text-xs mb-1">CUSTOMER_JWT_TOKEN</Text>
            <Text className="text-xs text-tokopedia-muted font-mono bg-tokopedia-bg p-2 rounded-lg">
              {savedToken || "No token saved"}
            </Text>
          </View>

          {/* Role Switcher buttons */}
          <Text className="text-xs text-tokopedia-ink-soft mb-2">Switch Active Role:</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleRoleToggle("customer")}
              className={`flex-1 py-2 rounded-xl items-center ${activeRole === "customer" ? "bg-tokopedia-green" : "bg-gray-100"}`}
            >
              <Text className={`font-bold text-xs ${activeRole === "customer" ? "text-white" : "text-tokopedia-ink"}`}>
                Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRoleToggle("seller")}
              className={`flex-1 py-2 rounded-xl items-center ${activeRole === "seller" ? "bg-tokopedia-green" : "bg-gray-100"}`}
            >
              <Text className={`font-bold text-xs ${activeRole === "seller" ? "text-white" : "text-tokopedia-ink"}`}>
                Seller
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mock Product Dataset Preview */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-tokopedia-line shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-bold text-tokopedia-muted uppercase tracking-wider">
              Mock Products ({MOCK_PRODUCTS.length} items)
            </Text>
            <Text className="text-xs text-tokopedia-green-dark font-bold">Dual-Role Sellers</Text>
          </View>

          {MOCK_PRODUCTS.slice(0, 3).map((prod) => (
            <View key={prod.id} className="py-2.5 border-b border-tokopedia-line last:border-b-0">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-tokopedia-ink flex-1 text-sm mr-2" numberOfLines={1}>
                  {prod.name}
                </Text>
                <Text className="text-tokopedia-green-dark font-extrabold text-sm">
                  Rp {prod.price.toLocaleString("id-ID")}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-xs text-tokopedia-muted">{prod.sellerStoreName}</Text>
                <Text className="text-[10px] bg-tokopedia-green-light text-tokopedia-green-dark px-2 py-0.5 rounded-md font-medium">
                  Stok: {prod.stock}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mock Orders Lifecycle Preview */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-tokopedia-line shadow-sm">
          <Text className="text-xs font-bold text-tokopedia-muted uppercase tracking-wider mb-3">
            Mock Orders Cycle ({MOCK_ORDERS.length} orders)
          </Text>

          {MOCK_ORDERS.map((ord) => (
            <View key={ord.id} className="py-2 border-b border-tokopedia-line flex-row justify-between items-center">
              <View>
                <Text className="text-xs font-bold text-tokopedia-ink">{ord.id} • {ord.customerName}</Text>
                <Text className="text-[11px] text-tokopedia-muted">{ord.sellerStoreName}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${
                ord.status === 'PENDING' ? 'bg-amber-100' :
                ord.status === 'PAID' ? 'bg-blue-100' :
                ord.status === 'PROCESSED' ? 'bg-teal-100' :
                ord.status === 'SHIPPED' ? 'bg-purple-100' : 'bg-emerald-100'
              }`}>
                <Text className={`text-[10px] font-bold ${
                  ord.status === 'PENDING' ? 'text-amber-800' :
                  ord.status === 'PAID' ? 'text-blue-800' :
                  ord.status === 'PROCESSED' ? 'text-teal-800' :
                  ord.status === 'SHIPPED' ? 'text-purple-800' : 'text-emerald-800'
                }`}>
                  {ord.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="bg-tokopedia-green w-full py-4 rounded-xl items-center shadow-md mb-8">
          <Text className="text-white font-bold text-base">Fase 2 Berhasil Dikonfigurasi ✨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
