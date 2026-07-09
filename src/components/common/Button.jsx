import React from "react";

export const Button = ({
  type = "button",
  onClick,
  isLoading = false,
  disabled = false,
  className = "",
  children,
}) => {

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-5 flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 disabled:cursor-not-allowed transition-all bg-white text-neutral-900 ${className}`}
    >
      {isLoading && 
        <span className="aspect-square h-full border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
      }
      {children}
    </button>
  );
};
