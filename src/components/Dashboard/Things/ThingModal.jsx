import React from 'react';
import { createPortal } from 'react-dom';

const ThingModal = ({ isOpen, onClose, theme, children }) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-300" 
        onClick={onClose} 
      />
      <div className={`relative w-full max-w-lg p-6 md:p-10 rounded-[2.5rem] border shadow-2xl transition-all scale-100 ${theme === 'dark' ? 'bg-[#0a0a0a] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-black'}`}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ThingModal;
