import apiRequest, { ApiResponse } from "./apiClient";
import { Customer, Seller } from "../types";
import {
  setCustomerToken,
  setSellerToken,
  setCustomerUserData,
  setSellerUserData,
  setUserRole,
} from "../utils/storage";

export interface AuthResponseData {
  token: string;
  data: any;
  message?: string;
}

export const authService = {
  /** Register a new Customer */
  async registerCustomer(payload: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
  }): Promise<{ token: string; user: Customer }> {
    const res = await apiRequest<Customer>("/auth/customer/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const token = (res as any).token;
    const user: Customer = {
      id: res.data.id || (res.data as any)._id,
      name: res.data.name,
      email: res.data.email,
      phone: res.data.phone,
      address: res.data.address,
    };

    if (token) {
      await setCustomerToken(token);
      await setCustomerUserData(user);
      await setUserRole("customer");
    }

    return { token, user };
  },

  /** Login Customer */
  async loginCustomer(email: string, password?: string): Promise<{ token: string; user: Customer }> {
    const res = await apiRequest<Customer>("/auth/customer/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const token = (res as any).token;
    const user: Customer = {
      id: res.data.id || (res.data as any)._id,
      name: res.data.name,
      email: res.data.email,
      phone: res.data.phone,
      address: res.data.address,
    };

    if (token) {
      await setCustomerToken(token);
      await setCustomerUserData(user);
      await setUserRole("customer");
    }

    return { token, user };
  },

  /** Register a new Seller */
  async registerSeller(payload: {
    storeName: string;
    ownerName: string;
    email: string;
    password?: string;
    phone?: string;
  }): Promise<{ token: string; user: Seller }> {
    const res = await apiRequest<Seller>("/auth/seller/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const token = (res as any).token;
    const user: Seller = {
      id: res.data.id || (res.data as any)._id,
      storeName: res.data.storeName,
      ownerName: res.data.ownerName,
      email: res.data.email,
      phone: res.data.phone,
    };

    if (token) {
      await setSellerToken(token);
      await setSellerUserData(user);
      await setUserRole("seller");
    }

    return { token, user };
  },

  /** Login Seller */
  async loginSeller(email: string, password?: string): Promise<{ token: string; user: Seller }> {
    const res = await apiRequest<Seller>("/auth/seller/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const token = (res as any).token;
    const user: Seller = {
      id: res.data.id || (res.data as any)._id,
      storeName: res.data.storeName,
      ownerName: res.data.ownerName,
      email: res.data.email,
      phone: res.data.phone,
    };

    if (token) {
      await setSellerToken(token);
      await setSellerUserData(user);
      await setUserRole("seller");
    }

    return { token, user };
  },

  /** Fetch current authenticated user info from backend */
  async getCurrentUser(): Promise<any> {
    const res = await apiRequest("/auth/me", { method: "GET" });
    return res.data;
  },
};

export default authService;
