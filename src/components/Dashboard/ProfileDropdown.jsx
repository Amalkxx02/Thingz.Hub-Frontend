import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useTheme } from '../../context';
import ThemeToggle from '../ThemeToggle';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="relative z-[100]"
      ref={dropdownRef}
    >
      {/* Trigger: Avatar/Name */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 md:gap-4 cursor-pointer p-1.5 md:p-2 rounded-xl border transition-all duration-300 outline-none ${isOpen ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-500/10'}`}
      >
        <div className="text-right hidden sm:block">
          <p className="text-[10px] md:text-xs font-bold font-mono truncate max-w-[80px] md:max-w-[120px] uppercase opacity-60">{user?.name || 'Authorized'}</p>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-emerald-500/30 transition-all duration-500 bg-neutral-900 flex items-center justify-center shrink-0">
          {user?.profile_image_url ? (
            <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all" />
          ) : (
            <span className="text-emerald-500 text-xs md:text-sm font-bold uppercase">{user?.name?.[0] || 'U'}</span>
          )}
        </div>
      </button>

      {/* Dropdown Card */}
      <div className={`absolute top-full right-0 mt-3 w-64 max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:w-auto origin-top-right transition-all duration-300 transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
        <div className={`p-4 md:p-6 rounded-2xl border-2 shadow-2xl ${theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Identity_Token</p>
                <h3 className="text-sm md:text-base font-black tracking-tighter truncate max-w-[140px]">{user?.name}</h3>
                <p className="text-[9px] md:text-[10px] font-mono opacity-40 truncate">{user?.email}</p>
              </div>
              <ThemeToggle className="scale-90" />
            </div>

            <div className="pt-4 border-t border-neutral-500/10 space-y-2">
              <button 
                onClick={logout}
                className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-rose-900/5"
              >
                Terminal_Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;

