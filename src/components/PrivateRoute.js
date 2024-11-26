import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PrivateRoute = ({ element: Component }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? Component : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
