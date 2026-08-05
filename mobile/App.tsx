import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import CONFIG from "./src/services/config";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-tokopedia-bg">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center", justifyContent: "center" }}>
        {/* Header Badge */}
        <View className="bg-tokopedia-green-light px-4 py-2 rounded-full mb-6 mt-10">
          <Text className="text-tokopedia-green-dark font-bold text-sm">
            {CONFIG.APP_NAME} v{CONFIG.VERSION}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-tokopedia-ink text-center mb-2">
          Marketplace Mobile Client
        </Text>
        <Text className="text-tokopedia-ink-soft text-center mb-8 px-4">
          Fase 1: Inisialisasi Proyek, NativeWind Styling & Konfigurasi Pusat
        </Text>

        {/* Central Configuration Cards */}
        <View className="w-full bg-white rounded-2xl p-5 mb-4 border border-tokopedia-line shadow-sm">
          <Text className="text-xs font-bold text-tokopedia-muted uppercase tracking-wider mb-3">
            Central Configuration
          </Text>

          <View className="flex-row justify-between items-center py-2 border-b border-tokopedia-line">
            <Text className="text-tokopedia-ink font-medium">ENABLE_ONBOARDING</Text>
            <View className={`px-3 py-1 rounded-full ${CONFIG.ENABLE_ONBOARDING ? 'bg-tokopedia-green-light' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-bold ${CONFIG.ENABLE_ONBOARDING ? 'text-tokopedia-green-dark' : 'text-gray-600'}`}>
                {CONFIG.ENABLE_ONBOARDING ? 'TRUE' : 'FALSE'}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-tokopedia-line">
            <Text className="text-tokopedia-ink font-medium">USE_MOCK_DATA</Text>
            <View className={`px-3 py-1 rounded-full ${CONFIG.USE_MOCK_DATA ? 'bg-tokopedia-green-light' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-bold ${CONFIG.USE_MOCK_DATA ? 'text-tokopedia-green-dark' : 'text-gray-600'}`}>
                {CONFIG.USE_MOCK_DATA ? 'TRUE' : 'FALSE'}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center py-2">
            <Text className="text-tokopedia-ink font-medium">API_BASE_URL</Text>
            <Text className="text-xs text-tokopedia-muted font-mono" numberOfLines={1}>
              {CONFIG.API_BASE_URL}
            </Text>
          </View>
        </View>

        {/* Color Palette Demo Card */}
        <View className="w-full bg-white rounded-2xl p-5 mb-6 border border-tokopedia-line shadow-sm">
          <Text className="text-xs font-bold text-tokopedia-muted uppercase tracking-wider mb-3">
            Tokopedia Green Palette Tokens
          </Text>

          <View className="flex-row flex-wrap gap-2 justify-between">
            <View className="bg-tokopedia-green p-3 rounded-xl flex-1 items-center justify-center min-w-[90px]">
              <Text className="text-white font-bold text-xs">Green</Text>
              <Text className="text-white text-[10px]">#00A86B</Text>
            </View>
            <View className="bg-tokopedia-green-dark p-3 rounded-xl flex-1 items-center justify-center min-w-[90px]">
              <Text className="text-white font-bold text-xs">Dark Green</Text>
              <Text className="text-white text-[10px]">#007D5A</Text>
            </View>
            <View className="bg-tokopedia-green-light p-3 rounded-xl flex-1 items-center justify-center min-w-[90px]">
              <Text className="text-tokopedia-green-dark font-bold text-xs">Light Green</Text>
              <Text className="text-tokopedia-green-dark text-[10px]">#E3F6ED</Text>
            </View>
          </View>
        </View>

        <View className="bg-tokopedia-green w-full py-4 rounded-xl items-center shadow-md">
          <Text className="text-white font-bold text-base">Fase 1 Berhasil Dikonfigurasi ✨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
