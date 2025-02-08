"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserType {
  username: string;
  email: string;
  phone_number: string;
  birth_date: string;
  profile_photo?: string; // Optional because not every user might have it initially
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserType | null;
  login: (user: UserType, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
  
    if (storedUser && storedToken && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10);
      if (Date.now() > expiryTime) {
        logout(); // Token expired, log out
        console.log("Token expired, logging out...");
      } else {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
  
        // Set a timer to automatically log out when the token expires
        const timeout = expiryTime - Date.now();
        setTimeout(() => logout(), timeout);
      }
    }
  }, []);

  const login = (user: UserType, token: string) => {
    console.log("Logging in user:", user);
  
    setUser(user);
    setIsLoggedIn(true);
  
    const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiryTime.toString());
  
    // Auto logout after one hour
    setTimeout(() => logout(), 60 * 60 * 1000);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
