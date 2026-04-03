import React from 'react';
import { useTheme } from '../../context';

const Logo = ({ className = "" }) => {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center select-none ${className}`}>
      <span className={`font-black text-2xl tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Thingz.Hub
      </span>
    </div>
  );
};

export default Logo;
