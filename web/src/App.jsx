import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import SellerApp from "./SellerApp";
import { AuthProvider as SellerAuthProvider } from "./seller/context/AuthContext";
import { AuthProvider as CustomerAuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AnalyticsTracker from "./components/AnalyticsTracker";

function CustomerApp() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">2026 Marketplace - Tugas Kelompok Lab</div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route
          path="/seller/*"
          element={
            <SellerAuthProvider>
              <SellerApp />
            </SellerAuthProvider>
          }
        />
        <Route
          path="*"
          element={
            <CustomerAuthProvider>
              <CartProvider>
                <CustomerApp />
              </CartProvider>
            </CustomerAuthProvider>
          }
        />
      </Routes>
    </>
  );
}
