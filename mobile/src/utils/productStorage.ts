import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../data/mockData";
import { CONFIG } from "../services/config";
import { productService } from "../services/productService";

const PRODUCTS_STORAGE_KEY = "@marketplace_products_list";

/** Initialize product list in storage if empty, or fetch current list */
export const getProducts = async (): Promise<Product[]> => {
  if (!CONFIG.USE_MOCK_DATA) {
    try {
      return await productService.getProducts();
    } catch (error) {
      console.warn("Failed to fetch products from API, falling back to local storage:", error);
    }
  }

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

/** Get products owned by a specific seller (BR-4) */
export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  if (!CONFIG.USE_MOCK_DATA) {
    try {
      const myProducts = await productService.getMySellerProducts();
      if (myProducts && myProducts.length > 0) return myProducts;
    } catch (error) {
      console.warn("Failed to fetch seller products from API, checking general products:", error);
    }
  }

  try {
    const allProducts = await getProducts();
    if (!sellerId) return allProducts;
    return allProducts.filter((p) => p.sellerId === sellerId);
  } catch (error) {
    console.error("Error getting products by seller:", error);
    return [];
  }
};

/** Save new product or update existing product */
export const saveProduct = async (
  productData: Partial<Product> & {
    name: string;
    price: number;
    category: string;
    stock: number;
    sellerId: string;
    sellerStoreName: string;
  }
): Promise<Product> => {
  if (!CONFIG.USE_MOCK_DATA) {
    try {
      if (productData.id) {
        return await productService.updateProduct(productData.id, {
          name: productData.name,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          imageUrl: productData.imageUrl,
          description: productData.description,
        });
      } else {
        return await productService.createProduct({
          name: productData.name,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          imageUrl: productData.imageUrl,
          description: productData.description,
        });
      }
    } catch (error) {
      console.warn("Failed to save product via API, saving to local storage fallback:", error);
    }
  }

  try {
    const currentProducts = await getProducts();

    if (productData.id) {
      // Update existing product
      const index = currentProducts.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        const updatedProduct: Product = {
          ...currentProducts[index],
          ...productData,
          imageUrl:
            productData.imageUrl ||
            currentProducts[index].imageUrl ||
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        };
        currentProducts[index] = updatedProduct;
        await AsyncStorage.setItem(
          PRODUCTS_STORAGE_KEY,
          JSON.stringify(currentProducts)
        );
        return updatedProduct;
      }
    }

    // Create new product
    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sellerId: productData.sellerId,
      sellerStoreName: productData.sellerStoreName || "Toko Penjual",
      name: productData.name,
      price: productData.price,
      category: productData.category || "Elektronik",
      stock: productData.stock,
      imageUrl:
        productData.imageUrl ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      description: productData.description || "",
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newProduct, ...currentProducts];
    await AsyncStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(updatedList)
    );
    return newProduct;
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

/** Toggle product active status */
export const toggleProductActive = async (productId: string): Promise<Product[]> => {
  if (!CONFIG.USE_MOCK_DATA) {
    try {
      const all = await getProductsBySeller("");
      const target = all.find((p) => p.id === productId);
      if (target) {
        await productService.updateProduct(productId, {
          imageUrl: target.imageUrl,
        });
      }
    } catch (error) {
      console.warn("Failed to toggle active product via API:", error);
    }
  }

  try {
    const currentProducts = await getProducts();
    const updated = currentProducts.map((p) => {
      if (p.id === productId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });

    await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error toggling product active state:", error);
    return [];
  }
};

/** Delete a product from seller's catalog */
export const deleteProduct = async (productId: string): Promise<Product[]> => {
  if (!CONFIG.USE_MOCK_DATA) {
    try {
      await productService.deleteProduct(productId);
      return await getProductsBySeller("");
    } catch (error) {
      console.warn("Failed to delete product via API, executing local deletion:", error);
    }
  }

  try {
    const currentProducts = await getProducts();
    const filtered = currentProducts.filter((p) => p.id !== productId);
    await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Error deleting product:", error);
    return [];
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
