import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context";
import { Button } from "../common/Button";

const ProfileDropdown = () => {
  const { user, signOut } = useAuth();
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
        className={`flex w-8 aspect-square border-2 border-emerald-500 rounded-full cursor-pointer`}
      >
        <div>
          {user?.profile ? (
            <img
              src={user.profile}
              alt="Profile"
              className="aspect-square rounded-full object-cover"
            />
          ) : (
            <div
              className={`flex items-center justify-center font-bold text-xl text-emerald-500`}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
      </button>
      {/* 2. THE DROPDOWN POPUP DIV */}
      {isOpen && (
        <div
          className={`absolute top-full right-0 mt-3 w-72 bg-neutral-900 border-2 border-neutral-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4`}
        >
          <div
            className={`flex items-center gap-4 pb-4 border-b border-neutral-800`}
          >
            {user?.profile ? (
              <img
                src={user.profile}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-emerald-500/10 text-emerald-500`}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm">{user?.name || "User"}</span>
              <span className="text-xs opacity-50">
                {user?.email || "No email"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              className={`text-left px-3 py-2 text-sm rounded-lg hover:bg-neutral-800 transition-colors`}
            >
              Settings
            </Button>
            <Button
              onClick={() => signOut()}
              className={`text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors`}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
