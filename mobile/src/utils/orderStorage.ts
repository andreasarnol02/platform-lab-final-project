import AsyncStorage from "@react-native-async-storage/async-storage";
import { Order, Cart, CartItem, OrderItem, OrderStatus } from "../types";
import { MOCK_ORDERS } from "../data/mockData";
import { getCustomerData } from "./storage";
import { clearCart } from "./cartStorage";
import { deductProductStock } from "./productStorage";

const ORDERS_STORAGE_KEY = "@marketplace_customer_orders";

/** Initialize and retrieve all customer/seller orders */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const json = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    // Seed with mock orders initially
    await AsyncStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(MOCK_ORDERS)
    );
    return MOCK_ORDERS;
  } catch (error) {
    console.error("Error getting orders from storage:", error);
    return MOCK_ORDERS;
  }
};

/** Get orders for a specific seller store (BR-3) */
export const getOrdersBySeller = async (sellerId: string): Promise<Order[]> => {
  try {
    const allOrders = await getOrders();
    if (!sellerId) return allOrders;
    return allOrders.filter((order) => order.sellerId === sellerId);
  } catch (error) {
    console.error("Error getting seller orders:", error);
    return [];
  }
};

/** Update order status progression (PAID -> PROCESSED -> SHIPPED -> COMPLETED) */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus
): Promise<Order[]> => {
  try {
    const allOrders = await getOrders();
    const updatedOrders = allOrders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });

    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    return updatedOrders;
  } catch (error) {
    console.error("Error updating order status:", error);
    return [];
  }
};

/**
 * BR-7 Multi-Seller Order Creation:
 * Splits cart items by sellerId and creates 1 separate Order per seller.
 * Deducts stock automatically and clears the shopping cart upon success.
 */
export const createOrdersFromCart = async (
  cart: Cart,
  shippingAddress: string,
  paymentMethod: string
): Promise<Order[]> => {
  if (!cart.items || cart.items.length === 0) {
    throw new Error("Keranjang belanja kosong.");
  }

  const customer = await getCustomerData();
  const customerId = customer ? customer.id : "cust_001";
  const customerName = customer ? customer.name : "Pelanggan Marketplace";

  // Group cart items by sellerId (BR-7)
  const itemsBySeller = new Map<string, { storeName: string; items: CartItem[] }>();

  cart.items.forEach((item) => {
    const sellerId = item.product.sellerId;
    const storeName = item.product.sellerStoreName || "Toko Penjual";

    if (!itemsBySeller.has(sellerId)) {
      itemsBySeller.set(sellerId, { storeName, items: [] });
    }
    itemsBySeller.get(sellerId)!.items.push(item);
  });

  const newOrders: Order[] = [];
  const purchasedItemSummary: { productId: string; quantity: number }[] = [];
  const nowStr = new Date().toISOString();

  // Create one separate order per seller store
  let counter = Date.now();
  itemsBySeller.forEach(({ storeName, items }, sellerId) => {
    counter += 1;
    const orderItems: OrderItem[] = items.map((cartItem) => {
      purchasedItemSummary.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });
      return {
        productId: cartItem.productId,
        name: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        imageUrl: cartItem.product.imageUrl,
      };
    });

    const storeTotalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ord_${counter}`,
      customerId,
      customerName,
      sellerId,
      sellerStoreName: storeName,
      status: "PAID", // Initial status after successful checkout simulation
      totalPrice: storeTotalPrice,
      shippingAddress: shippingAddress || "Alamat Utama Pelanggan",
      paymentMethod: paymentMethod || "Transfer Bank",
      items: orderItems,
      createdAt: nowStr,
    };

    newOrders.push(newOrder);
  });

  // Save new orders to storage (prepend to list so newest orders appear first)
  const currentOrders = await getOrders();
  const updatedOrders = [...newOrders, ...currentOrders];
  await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  // Deduct product stock automatically
  await deductProductStock(purchasedItemSummary);

  // Clear shopping cart
  await clearCart();

  return newOrders;
};
