import React from 'react';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const Toast = ({ id, message, type, timestamp }) => {
    const { removeToast } = useToast();
    const { theme } = useTheme();

    // Thingz.Hub Industrial Theme
    const baseStyles = "relative flex flex-col gap-1 p-5 mb-4 min-w-[320px] rounded-xl border-2 transition-all duration-500 animate-robotic-fast shadow-xl";

    const themeStyles = theme === 'dark'
        ? "bg-black border-neutral-800 text-white"
        : "bg-white border-neutral-200 text-black";

    const typeAccent = {
        info: theme === 'dark' ? "border-l-blue-400" : "border-l-blue-600",
        success: theme === 'dark' ? "border-l-emerald-400" : "border-l-emerald-600",
        error: theme === 'dark' ? "border-l-rose-500" : "border-l-rose-600",
        warning: theme === 'dark' ? "border-l-amber-500" : "border-l-amber-600",
    };

    return (
        <div className={`${baseStyles} ${themeStyles} ${typeAccent[type]}`}>
            {/* Decorative IoT Scan Line */}
            <div
                className="absolute bottom-0 left-0 h-[2px] bg-emerald-400 opacity-20 animate-scan-line"
                style={{ animationDuration: '4s', width: '100%' }}
            />

            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-${type === 'success' ? 'emerald-400' : type === 'error' ? 'rose-500' : 'blue-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        {type}_SYSTEM_LOG
                    </span>
                </div>
                <span className="text-[9px] font-mono opacity-20">{timestamp}</span>
            </div>

            <div className={`text-xs font-black tracking-tight leading-relaxed ${type === 'success' ? 'text-emerald-500' : ''}`}>
                {message}
            </div>

            <button
                onClick={() => removeToast(id)}
                className="absolute top-4 right-4 p-1 hover:opacity-100 opacity-20 transition-opacity"
            >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
