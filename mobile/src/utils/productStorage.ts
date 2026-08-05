import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../data/mockData";

const PRODUCTS_STORAGE_KEY = "@marketplace_products_list";

/** Initialize product list in storage if empty, or fetch current list */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const json = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    // Initialize with mock products
    await AsyncStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(MOCK_PRODUCTS)
    );
    return MOCK_PRODUCTS;
  } catch (error) {
    console.error("Error getting products from storage:", error);
    return MOCK_PRODUCTS;
  }
};

/** Deduct stock of items after successful checkout */
export const deductProductStock = async (
  purchasedItems: { productId: string; quantity: number }[]
): Promise<void> => {
  try {
    const currentProducts = await getProducts();
    const updatedProducts = currentProducts.map((prod) => {
      const purchased = purchasedItems.find((item) => item.productId === prod.id);
      if (purchased) {
        const newStock = Math.max(0, prod.stock - purchased.quantity);
        return { ...prod, stock: newStock };
      }
      return prod;
    });

    await AsyncStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );
  } catch (error) {
    console.error("Error deducting product stock:", error);
  }
};
