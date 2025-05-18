import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/firebase.utils";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading while checking auth state
  }

  return user ? children : <Navigate to="/apology-in" />;
};

export default ProtectedRoute;
