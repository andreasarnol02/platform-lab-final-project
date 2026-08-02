import { createContext, useContext, useEffect, useState, useCallback } from "react";
import client from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.get("/cart");
      const cart = data.data?.items || [];
      setItems(
        cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }))
      );
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      await client.post("/cart/items", { productId, quantity });
      await refresh();
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      await client.put(`/cart/items/${productId}`, { quantity });
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId) => {
      await client.delete(`/cart/items/${productId}`);
      await refresh();
    },
    [refresh]
  );

  const clearLocal = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const value = {
    items,
    loading,
    totalCount,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    refresh,
    clearLocal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
