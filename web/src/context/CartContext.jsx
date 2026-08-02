import { createContext, useContext, useEffect, useState, useCallback } from "react";
import client from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const getCartErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await client.get("/cart");
      const cart = data.data?.items || [];
      setItems(
        cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }))
      );
    } catch (requestError) {
      // Keep the last successful cart visible while the user retries.
      setError(getCartErrorMessage(requestError, "Gagal memuat keranjang."));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      try {
        await client.post("/cart/items", { productId, quantity });
        await refresh();
      } catch (requestError) {
        setError(getCartErrorMessage(requestError, "Gagal memperbarui keranjang."));
        throw requestError;
      }
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        await client.put(`/cart/items/${productId}`, { quantity });
        await refresh();
      } catch (requestError) {
        setError(getCartErrorMessage(requestError, "Gagal memperbarui keranjang."));
        throw requestError;
      }
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId) => {
      try {
        await client.delete(`/cart/items/${productId}`);
        await refresh();
      } catch (requestError) {
        setError(getCartErrorMessage(requestError, "Gagal memperbarui keranjang."));
        throw requestError;
      }
    },
    [refresh]
  );

  const clearLocal = useCallback(() => {
    setItems([]);
    setError("");
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const value = {
    items,
    loading,
    error,
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
