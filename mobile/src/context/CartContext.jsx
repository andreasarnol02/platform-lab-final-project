import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { customerClient, getErrorMessage } from "../api/client";
import { useAuth } from "./AuthContext";

// Mirrors web/src/context/CartContext.jsx. CartProvider must be nested
// inside AuthProvider (it reads the customer token).
const CartContext = createContext(null);

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
      const { data } = await customerClient.get("/cart");
      const cart = data.data?.items || [];
      setItems(
        cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }))
      );
    } catch (requestError) {
      // Keep the last successful cart visible while the user retries.
      setError(getErrorMessage(requestError, "Gagal memuat keranjang."));
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
        await customerClient.post("/cart/items", { productId, quantity });
        await refresh();
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Gagal memperbarui keranjang."));
        throw requestError;
      }
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        await customerClient.put(`/cart/items/${productId}`, { quantity });
        await refresh();
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Gagal memperbarui keranjang."));
        throw requestError;
      }
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId) => {
      try {
        await customerClient.delete(`/cart/items/${productId}`);
        await refresh();
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Gagal memperbarui keranjang."));
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
