import React from 'react';

const WaterCard = ({ value, unit, label, id }) => {
  return (
    <div className="water-waves-wrapper h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="water-waves" />
      <div className="relative z-10 flex flex-col items-center">
         <span className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-sm">
           {value ?? '---'}
         </span>
         <span className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] mt-2">
           {unit || 'Liters'}
         </span>
      </div>
    </div>
  );
};

export default WaterCard;
