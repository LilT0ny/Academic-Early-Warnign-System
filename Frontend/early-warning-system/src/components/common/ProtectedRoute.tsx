import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: React.ReactNode;
  roles?: Array<"admin" | "teacher" | "specialist">; // opcional
}

export const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    // sin permiso -> vuelve al dashboard
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
