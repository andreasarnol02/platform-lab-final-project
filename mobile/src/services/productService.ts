import apiRequest from "./apiClient";
import { Product } from "../types";

/** Convert raw Mongoose Product document to Mobile Product entity */
export const mapProductFromApi = (raw: any): Product => {
  const sellerId = typeof raw.seller === "object" ? (raw.seller._id || raw.seller.id) : (raw.seller || raw.sellerId || "");
  const sellerStoreName = raw.sellerStoreName || (typeof raw.seller === "object" ? raw.seller.storeName : null) || "Official Store";

  return {
    id: String(raw._id || raw.id),
    sellerId: String(sellerId),
    sellerStoreName: String(sellerStoreName),
    name: String(raw.name || ""),
    price: Number(raw.price || 0),
    category: String(raw.category || "General"),
    stock: Number(raw.stock || 0),
    imageUrl: String(raw.imageUrl || raw.images?.[0] || "https://via.placeholder.com/300"),
    description: raw.description ? String(raw.description) : undefined,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  };
};

export const productService = {
  /** Fetch all active products with optional search query & category filter */
  async getProducts(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    const queryParts: string[] = [];
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params?.category && params.category !== "All") {
      queryParts.push(`category=${encodeURIComponent(params.category)}`);
    }
    if (params?.page) queryParts.push(`page=${params.page}`);
    if (params?.limit) queryParts.push(`limit=${params.limit}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const res = await apiRequest<any[]>(`/products${queryString}`);
    
    const items = Array.isArray(res.data) ? res.data : [];
    return items.map(mapProductFromApi);
  },

  /** Get single product details by ID */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await apiRequest<any>(`/products/${id}`);
      return res.data ? mapProductFromApi(res.data) : null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  /** Get products owned by current authenticated seller */
  async getMySellerProducts(): Promise<Product[]> {
    const res = await apiRequest<any[]>("/seller/products");
    const items = Array.isArray(res.data) ? res.data : [];
    return items.map(mapProductFromApi);
  },

  /** Create a new product as seller */
  async createProduct(data: {
    name: string;
    price: number;
    category: string;
    stock: number;
    imageUrl?: string;
    description?: string;
  }): Promise<Product> {
    const res = await apiRequest<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return mapProductFromApi(res.data);
  },

  /** Update an existing product */
  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      price: number;
      category: string;
      stock: number;
      imageUrl: string;
      description: string;
    }>
  ): Promise<Product> {
    const res = await apiRequest<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return mapProductFromApi(res.data);
  },

  /** Delete a product */
  async deleteProduct(id: string): Promise<boolean> {
    await apiRequest(`/products/${id}`, {
      method: "DELETE",
    });
    return true;
  },
};

export default productService;
