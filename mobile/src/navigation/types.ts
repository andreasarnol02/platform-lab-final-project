import { Product } from "../types";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
  Login: undefined;
  Register: undefined;
  Cart: undefined;
  OrderHistory: undefined;
  Profile: undefined;
  SellerProductList: { sellerId?: string } | undefined;
  AddEditProduct: { product?: Product } | undefined;
  SellerOrderInbox: { sellerId?: string } | undefined;
};
