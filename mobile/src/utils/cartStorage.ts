import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cart, CartItem, Product } from "../types";
import { getCustomerData } from "./storage";

const CART_STORAGE_KEY = "@marketplace_shopping_cart";

export const getCart = async (): Promise<Cart> => {
  try {
    const customer = await getCustomerData();
    const customerId = customer ? customer.id : "guest_user";
    const json = await AsyncStorage.getItem(CART_STORAGE_KEY);
    
    if (json) {
      const cart: Cart = JSON.parse(json);
      // Ensure customerId matches
      return { ...cart, customerId };
    }

    const defaultCart: Cart = {
      id: "cart_default",
      customerId,
      items: [],
      totalPrice: 0,
    };
    return defaultCart;
  } catch (error) {
    console.error("Error getting cart:", error);
    return {
      id: "cart_default",
      customerId: "guest_user",
      items: [],
      totalPrice: 0,
    };
  }
};

const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

export const saveCart = async (items: CartItem[]): Promise<Cart> => {
  const customer = await getCustomerData();
  const customerId = customer ? customer.id : "guest_user";
  const totalPrice = calculateTotalPrice(items);

  const updatedCart: Cart = {
    id: `cart_${Date.now()}`,
    customerId,
    items,
    totalPrice,
  };

  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  return updatedCart;
};

export const addToCart = async (
  product: Product,
  quantity: number = 1
): Promise<Cart> => {
  const currentCart = await getCart();
  const existingItemIndex = currentCart.items.findIndex(
    (item) => item.productId === product.id
  );

  let updatedItems = [...currentCart.items];

  if (existingItemIndex > -1) {
    const existingItem = updatedItems[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;
    // Cap at product stock
    const cappedQuantity = Math.min(newQuantity, product.stock);
    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: cappedQuantity,
    };
  } else {
    updatedItems.push({
      productId: product.id,
      product,
      quantity: Math.min(quantity, product.stock),
    });
  }

  return await saveCart(updatedItems);
};

export const updateCartQuantity = async (
  productId: string,
  newQuantity: number
): Promise<Cart> => {
  const currentCart = await getCart();
  if (newQuantity <= 0) {
    return await removeFromCart(productId);
  }

  const updatedItems = currentCart.items.map((item) => {
    if (item.productId === productId) {
      const cappedQuantity = Math.min(newQuantity, item.product.stock);
      return { ...item, quantity: cappedQuantity };
    }
    return item;
  });

  return await saveCart(updatedItems);
};

export const removeFromCart = async (productId: string): Promise<Cart> => {
  const currentCart = await getCart();
  const updatedItems = currentCart.items.filter(
    (item) => item.productId !== productId
  );
  return await saveCart(updatedItems);
};

export const clearCart = async (): Promise<Cart> => {
  return await saveCart([]);
};
