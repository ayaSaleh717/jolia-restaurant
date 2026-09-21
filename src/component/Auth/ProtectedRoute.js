import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// Wraps a route element and bounces guests to /login, remembering where
// they were headed so Login can send them back after they sign in.
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.allAuth);
  const location = useLocation();
  const hasWarned = useRef(false);

  useEffect(() => {
    if (!user && !hasWarned.current) {
      toast.error("Please log in to view your cart");
      hasWarned.current = true;
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
