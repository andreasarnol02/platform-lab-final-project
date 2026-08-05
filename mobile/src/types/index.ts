/**
 * Core Type Definitions for Mobile Marketplace Application
 * Replicates Mongoose Schemas defined in Technical Requirements Document (TRD)
 */

export type UserRole = "customer" | "seller" | null;

/** Customer User Entity */
export interface Customer {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

/** Seller Store Entity */
export interface Seller {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  password?: string;
  phone?: string;
  createdAt?: string;
}

/** Product Entity */
export interface Product {
  id: string;
  sellerId: string;
  sellerStoreName: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

/** Line item stored in Customer's Shopping Cart */
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

/** Customer Shopping Cart */
export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  totalPrice: number;
}

/** Lifecycle statuses for Marketplace Orders */
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSED"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

/** Immutable snapshot of a product within a placed Order */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/** Customer/Seller Marketplace Order */
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  sellerStoreName: string;
  status: OrderStatus;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
}

/** Seller Dashboard Sales Statistics */
export interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  activeProducts: number;
}
