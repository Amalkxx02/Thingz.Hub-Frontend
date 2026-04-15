import React from 'react';

const GasCard = ({ value, unit, label, id }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="gas-aura" />
      <div className="relative z-10 flex flex-col items-center">
         <span className="text-6xl font-black tracking-tighter tabular-nums text-hub-accent">
           {value ?? '---'}
         </span>
         <span className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] mt-2">
           {unit || 'PPM'}
         </span>
      </div>
    </div>
  );
};

export default GasCard;
