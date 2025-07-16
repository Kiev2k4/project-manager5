//auth-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import type { User } from "@/types";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";
import { fa } from "zod/v4/locales";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Wrap useNavigate/useLocation in try/catch so they never throw
  let navigate: (to: string) => void = (to) => {
    // fallback: full-page redirect
    window.location.href = to;
  };
  let currentPath: string =
    typeof window !== "undefined" ? window.location.pathname : "/";

  try {
    // If we're inside a <BrowserRouter> / <RouterProvider>, these succeed:
    navigate = useNavigate();
    currentPath = useLocation().pathname;
  } catch {
    // otherwise we just keep our fallback implementations
  }
  const isPublicRoute = publicRoutes.includes(currentPath);

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      const userInfo = localStorage.getItem("user");
      console.log("[AuthContext] checkAuth: userInfo", userInfo);
      if (userInfo) {
        setUser(JSON.parse(userInfo));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          console.log(
            "[AuthContext] Not authenticated, redirecting to /sign-in from",
            currentPath
          );
          navigate("/sign-in");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      logout();
      console.log("[AuthContext] Forced logout, redirecting to /sign-in");
      navigate("/sign-in");
    };
    window.addEventListener("force-logout", handleLogout);
    return () => window.removeEventListener("force-logout", handleLogout);
  }, []);

  const login = async (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);

    queryClient.clear();
  };

  // Log values on every render
  React.useEffect(() => {
    console.log(
      "[AuthContext] Render: isLoading=",
      isLoading,
      "isAuthenticated=",
      isAuthenticated,
      "user=",
      user,
      "currentPath=",
      currentPath
    );
  }, [isLoading, isAuthenticated, user, currentPath]);

  const values = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
