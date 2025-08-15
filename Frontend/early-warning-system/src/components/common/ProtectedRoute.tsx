import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { ReactElement } from "react";

export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
