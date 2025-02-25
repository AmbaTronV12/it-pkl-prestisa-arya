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
        const parsedUser = JSON.parse(storedUser);
        // Ensure profile_photo is loaded correctly
        parsedUser.profile_photo = localStorage.getItem("profile_photo") || parsedUser.profile_photo;

        setUser(parsedUser);
        setIsLoggedIn(true);

        // Auto-logout when token expires
        const timeout = expiryTime - Date.now();
        setTimeout(() => logout(), timeout);
      }
    }
  }, []);

  const login = (user: UserType, token: string) => {
    console.log("Logging in user:", user);
  
    // Properly format the profile photo URL
    const updatedUser = {
      ...user,
      profile_photo: user.profile_photo?.startsWith("/uploads/")
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.profile_photo}`
        : user.profile_photo || "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    };
  
    // Save to localStorage
    localStorage.setItem("profile_photo", updatedUser.profile_photo);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("token", token);
  
    setUser(updatedUser);
    setIsLoggedIn(true);
  
    const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
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
    localStorage.removeItem("profile_photo");
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
