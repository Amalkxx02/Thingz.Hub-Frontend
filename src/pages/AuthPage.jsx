import React, { useState } from "react";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme, useAuth } from "../context";
import { useThemeStyles } from "../hooks/useThemeStyles";
import "./AuthPage.css";

const AuthPage = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // 'login', 'register', 'recovery'

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { bgColor, textColor, inputBg, inputBorder, buttonBg } = useThemeStyles();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    if (authMode !== "recovery" && !formData.password) return;

    try {
      if (authMode === "login") {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      // Errors are already handled by the context toasts
    }
  };

  const getPageContent = () => {
    switch (authMode) {
      case "register":
        return {
          h1: "Register Account.",
          submitText: "Sign Up",
          toggleText: "Sign In",
          toggleMode: "login",
        };
      case "recovery":
        return {
          h1: "Rest Password?",
          submitText: "Reset",
          toggleText: "Sign In",
          toggleMode: "login",
        };
      default:
        return {
          h1: "Login Account.",
          submitText: "Sign In",
          toggleText: "Sign Up",
          toggleMode: "register",
        };
    }
  };

  const content = getPageContent();

  return (
    <div className={`min-h-screen flex ${bgColor} ${textColor}`}>
      <ThemeToggle />
      <div className="hidden lg:flex lg:w-[60%] bg-neutral-900 items-center justify-center">
        <Logo />
      </div>
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-8">
        <form onSubmit={handleAuth} className="space-y-6">
          <h1 className="text-3xl font-bold">{content.h1}</h1>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={`w-full px-5 py-4 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-emerald-500 text-sm`}
            />
          </div>
          {authMode !== "recovery" && (
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                className={`w-full px-5 py-4 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-emerald-500 text-sm`}
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-5 ${buttonBg} rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-xl disabled:opacity-50`}
          >
            {content.submitText}
          </button>

          <div className="flex flex-col items-center gap-2 mt-2 text-sm">
            <button
              type="button"
              onClick={() => setAuthMode(content.toggleMode)}
              className={`w-full py-5 ${buttonBg} rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-xl disabled:opacity-50`}
            >
              {content.toggleText}
            </button>

            {authMode === "login" && (
              <button
                type="button"
                onClick={() => setAuthMode("recovery")}
                className={`w-full py-5 ${buttonBg} rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-xl disabled:opacity-50`}
              >
                Forgot your password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
