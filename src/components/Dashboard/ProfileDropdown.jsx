import React, { useState, useRef, useEffect } from "react";
import { useAuth, useTheme } from "../../context";
import ThemeToggle from "../ThemeToggle";

const ProfileDropdown = () => {
  const { user} = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        <span className="text-sm font-bold">{user?.name || "User"}</span>
        <span className="text-xs opacity-50">▼</span>
      </button>
      {/* 2. THE DROPDOWN POPUP DIV */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-neutral-900 border-2 border-neutral-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4">
          <p className="opacity-50 text-sm">
            We will put your menu items in here next!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
