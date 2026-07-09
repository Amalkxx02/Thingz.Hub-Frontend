import React, { useState } from "react";
import Logo from "../components/Logo";
import { useAuth, useTheme } from "../context";
import { useThemeStyles } from "../hooks/useThemeStyles";

const OnboardingPage = () => {
  const { onboard } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    await onboard(formData.name, formData.image);
  };

  const { bgColor, textColor, inputBg, inputBorder, buttonBg } =
    useThemeStyles();

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-6 ${bgColor} ${textColor}`}
    >
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <h1 className="text-3xl font-bold">{content.h1}</h1> */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
            className={`w-full px-5 py-4 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-emerald-500 text-sm`}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="image"
            className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1"
          >
            Profile Image URL
          </label>
          <input
            id="image"
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.png"
            className={`w-full px-5 py-4 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-emerald-500 text-sm`}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-5 ${buttonBg} rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-xl disabled:opacity-50`}
        >
          onboard
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
