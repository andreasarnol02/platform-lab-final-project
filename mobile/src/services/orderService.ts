import apiRequest from "./apiClient";
import { Order, OrderStatus } from "../types";

export const normalizeOrderStatus = (rawStatus: string): OrderStatus => {
  const upper = String(rawStatus || "").toUpperCase();
  switch (upper) {
    case "PENDING":
      return "PENDING";
    case "PAID":
    case "PROCESSING":
    case "PROCESSED":
      return "PAID";
    case "SHIPPED":
      return "SHIPPED";
    case "DELIVERED":
    case "COMPLETED":
      return "COMPLETED";
    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
};

const normalizePaymentMethod = (method: string): "COD" | "Transfer" => {
  const upper = String(method || "").toUpperCase();
  if (upper.includes("COD")) return "COD";
  return "Transfer";
};

export const mapOrderFromApi = (raw: any): Order => {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item: any) => ({
        productId: String(item.product?._id || item.product?.id || item.product || ""),
        name: String(item.name || item.product?.name || "Product"),
        price: Number(item.price || item.product?.price || 0),
        quantity: Number(item.quantity || 1),
        imageUrl: item.product?.imageUrl || item.imageUrl || undefined,
      }))
    : [];

  const customerId = typeof raw.customer === "object" ? (raw.customer._id || raw.customer.id) : raw.customer;
  const customerName = typeof raw.customer === "object" ? raw.customer.name : "Customer";
  const sellerId = typeof raw.seller === "object" ? (raw.seller._id || raw.seller.id) : raw.seller;
  const sellerStoreName = typeof raw.seller === "object" ? raw.seller.storeName : "Store";

  return {
    id: String(raw._id || raw.id),
    customerId: String(customerId || ""),
    customerName: String(customerName || "Customer"),
    sellerId: String(sellerId || ""),
    sellerStoreName: String(sellerStoreName || "Store"),
    status: normalizeOrderStatus(raw.status),
    totalPrice: Number(raw.totalPrice || raw.totalAmount || 0),
    shippingAddress: String(raw.shippingAddress || ""),
    paymentMethod: String(raw.paymentMethod || "Transfer"),
    items,
    createdAt: String(raw.createdAt || new Date().toISOString()),
  };
};

export const orderService = {
  /** Checkout cart and place order */
  async checkout(shippingAddress: string, paymentMethod: string = "Transfer"): Promise<Order[]> {
    const apiPaymentMethod = normalizePaymentMethod(paymentMethod);
    const res = await apiRequest<any[]>("/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress, paymentMethod: apiPaymentMethod }),
    });

    const ordersRaw = Array.isArray(res.data) ? res.data : [res.data];
    return ordersRaw.map(mapOrderFromApi);
  },

  /** Get customer's order history */
  async getCustomerOrders(): Promise<Order[]> {
    const res = await apiRequest<any[]>("/orders");
    const items = Array.isArray(res.data) ? res.data : [];
    return items.map(mapOrderFromApi);
  },

  /** Get orders received by seller */
  async getSellerOrders(): Promise<Order[]> {
    const res = await apiRequest<any[]>("/seller/orders");
    const items = Array.isArray(res.data) ? res.data : [];
    return items.map(mapOrderFromApi);
  },

  /** Update order status as seller */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const res = await apiRequest<any>(`/seller/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return mapOrderFromApi(res.data);
  },
};

export default orderService;
