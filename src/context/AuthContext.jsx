import React, { createContext, useContext, useState, useEffect } from "react";
import { apiAuth } from "../services/authService";
import { apiAuth as apiUser } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loadUserProfile = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const profile = await apiUser.get_user();
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const signIn = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Invalid email or password" };
      }

      const data = await apiAuth.signIn({ email, password });

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // Fetch the full profile so `user` gets populated and App re-renders
      await loadUserProfile();

      return { success: true, message: "User logged in successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // ─── signUp ─────────────────────────────────────────────────────────────
  const signUp = async (email, password, name, profile) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Invalid email or password" };
      }

      await apiAuth.signUp({ email, password, name, profile });

      return { success: true, message: "User signed up successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    try {
      await apiAuth.signOut({});
    } catch (error) {
      // sign-out errors are non-critical; proceed with local cleanup regardless
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
