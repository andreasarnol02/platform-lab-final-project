import { CONFIG } from "./config";
import { getCustomerToken, getSellerToken, getUserRole } from "../utils/storage";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: any;
  errors?: any[];
}

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/** Get current stored JWT token based on active role or availability */
const getActiveToken = async (): Promise<string | null> => {
  try {
    const role = await getUserRole();
    if (role === "seller") {
      const sellerToken = await getSellerToken();
      if (sellerToken) return sellerToken;
    }
    const customerToken = await getCustomerToken();
    if (customerToken) return customerToken;
    
    return (await getSellerToken()) || null;
  } catch {
    return null;
  }
};

/** Universal fetch wrapper with authorization header & error normalization */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getActiveToken();
  const url = `${CONFIG.API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        json?.message ||
        (json?.errors && Array.isArray(json.errors) ? json.errors.map((e: any) => e.msg).join(", ") : null) ||
        `HTTP Error ${response.status}`;
      throw new ApiError(errorMessage, response.status, json);
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(`[API Network Error] ${options.method || "GET"} ${url}:`, error);
    throw new ApiError(
      error.message || "Gagal terhubung ke server API lokal",
      500
    );
  }
}

export default apiRequest;
