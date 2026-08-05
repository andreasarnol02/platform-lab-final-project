import { Product } from "../types";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
};
