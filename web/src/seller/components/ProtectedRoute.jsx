import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();

  if (booting) return null;

  if (!user) {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
}
