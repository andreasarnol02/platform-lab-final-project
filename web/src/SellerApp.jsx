import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./seller/components/ProtectedRoute";
import Layout from "./seller/components/Layout";
import LoginPage from "./seller/pages/LoginPage";
import RegisterPage from "./seller/pages/RegisterPage";
import DashboardPage from "./seller/pages/DashboardPage";
import ProductsPage from "./seller/pages/ProductsPage";
import ProductFormPage from "./seller/pages/ProductFormPage";
import OrdersPage from "./seller/pages/OrdersPage";

export default function SellerApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
