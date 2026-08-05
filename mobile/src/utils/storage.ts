import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserRole, Customer, Seller } from "../types";

/** Local Storage Constant Keys */
export const STORAGE_KEYS = {
  CUSTOMER_JWT_TOKEN: "@marketplace_customer_jwt_token",
  SELLER_JWT_TOKEN: "@marketplace_seller_jwt_token",
  USER_ROLE: "@marketplace_user_role",
  CUSTOMER_USER_DATA: "@marketplace_customer_user_data",
  SELLER_USER_DATA: "@marketplace_seller_user_data",
  HAS_SEEN_ONBOARDING: "@marketplace_has_seen_onboarding",
} as const;

/** Onboarding Persistence Helper */
export const setHasSeenOnboarding = async (seen: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.HAS_SEEN_ONBOARDING,
      JSON.stringify(seen)
    );
  } catch (error) {
    console.error("Error setting onboarding seen status:", error);
  }
};

export const getHasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    return val ? JSON.parse(val) === true : false;
  } catch (error) {
    console.error("Error getting onboarding seen status:", error);
    return false;
  }
};

/** Customer Token Management */
export const setCustomerToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMER_JWT_TOKEN, token);
  } catch (error) {
    console.error("Error setting customer JWT token:", error);
  }
};

export const getCustomerToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_JWT_TOKEN);
  } catch (error) {
    console.error("Error getting customer JWT token:", error);
    return null;
  }
};

export const removeCustomerToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CUSTOMER_JWT_TOKEN);
  } catch (error) {
    console.error("Error removing customer JWT token:", error);
  }
};

/** Seller Token Management */
export const setSellerToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELLER_JWT_TOKEN, token);
  } catch (error) {
    console.error("Error setting seller JWT token:", error);
  }
};

export const getSellerToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.SELLER_JWT_TOKEN);
  } catch (error) {
    console.error("Error getting seller JWT token:", error);
    return null;
  }
};

export const removeSellerToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SELLER_JWT_TOKEN);
  } catch (error) {
    console.error("Error removing seller JWT token:", error);
  }
};

/** User Role Management */
export const setUserRole = async (role: UserRole): Promise<void> => {
  try {
    if (role) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    }
  } catch (error) {
    console.error("Error setting user role:", error);
  }
};

export const getUserRole = async (): Promise<UserRole> => {
  try {
    const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    if (role === "customer" || role === "seller") {
      return role;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

/** Customer Profile Data Storage */
export const setCustomerData = async (customer: Customer): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CUSTOMER_USER_DATA,
      JSON.stringify(customer)
    );
  } catch (error) {
    console.error("Error saving customer data:", error);
  }
};

export const getCustomerData = async (): Promise<Customer | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_USER_DATA);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error getting customer data:", error);
    return null;
  }
};

/** Seller Profile Data Storage */
export const setSellerData = async (seller: Seller): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELLER_USER_DATA,
      JSON.stringify(seller)
    );
  } catch (error) {
    console.error("Error saving seller data:", error);
  }
};

export const getSellerData = async (): Promise<Seller | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.SELLER_USER_DATA);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Error getting seller data:", error);
    return null;
  }
};

/** Clear All Local Auth Sessions */
export const clearAllAuthSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CUSTOMER_JWT_TOKEN,
      STORAGE_KEYS.SELLER_JWT_TOKEN,
      STORAGE_KEYS.USER_ROLE,
      STORAGE_KEYS.CUSTOMER_USER_DATA,
      STORAGE_KEYS.SELLER_USER_DATA,
      STORAGE_KEYS.HAS_SEEN_ONBOARDING,
    ]);
  } catch (error) {
    console.error("Error clearing all auth sessions:", error);
  }
};
