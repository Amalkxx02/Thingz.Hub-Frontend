import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Invalid email or password" };
      }

      setUser({ email: email });
      return { success: true, message: "User logged in successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const onboard = async (name, image) => {
    try {
      if (!name || !image) {
        return { success: false, message: "Invalid name or profile image" };
      }

      setUser((prev) => ({
        ...prev,
        name: name,
        image: image,
        is_onboarded: true,
      }));
      return { success: true, message: "User onboarded successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, onboard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
