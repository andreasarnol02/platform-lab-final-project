import apiRequest from "./apiClient";
import { Cart, CartItem } from "../types";
import { mapProductFromApi } from "./productService";

export const mapCartFromApi = (rawCart: any, customerId: string = ""): Cart => {
  if (!rawCart) {
    return {
      id: "cart_empty",
      customerId,
      items: [],
      totalPrice: 0,
    };
  }

  const rawItems = Array.isArray(rawCart.items) ? rawCart.items : [];
  let totalPrice = 0;

  const items: CartItem[] = rawItems
    .filter((item: any) => item && item.product)
    .map((item: any) => {
      const product = mapProductFromApi(item.product);
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      return {
        productId: product.id,
        product,
        quantity: item.quantity,
      };
    });

  return {
    id: String(rawCart._id || rawCart.id || "cart"),
    customerId: String(rawCart.customer || customerId),
    items,
    totalPrice,
  };
};

export const cartService = {
  /** Fetch Customer's active cart */
  async getCart(): Promise<Cart> {
    try {
      const res = await apiRequest<any>("/cart");
      return mapCartFromApi(res.data);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return { id: "cart_empty", customerId: "", items: [], totalPrice: 0 };
      }
      throw error;
    }
  },

  /** Add item to cart */
  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    const res = await apiRequest<any>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    return mapCartFromApi(res.data);
  },

  /** Update cart item quantity */
  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    const res = await apiRequest<any>(`/cart/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    return mapCartFromApi(res.data);
  },

  /** Remove item from cart */
  async removeCartItem(productId: string): Promise<Cart> {
    const res = await apiRequest<any>(`/cart/items/${productId}`, {
      method: "DELETE",
    });
    return mapCartFromApi(res.data);
  },
};

export default cartService;
