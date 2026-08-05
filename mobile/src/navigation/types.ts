import { Product } from "../types";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
  Login: undefined;
  Register: undefined;
  Cart: undefined;
  OrderHistory: undefined;
};
