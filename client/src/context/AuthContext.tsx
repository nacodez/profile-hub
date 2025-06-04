import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { type AuthContextType, type AuthProviderProps } from "../types/index";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkAuth = async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      await axios.get("/auth/verify");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };
  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
