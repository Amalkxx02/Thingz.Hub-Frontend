import React from 'react';
import { useLiveValue } from '../../../../hooks/useLiveValue';
import SensorFloatCard from './SensorFloat/SensorFloatCard';

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ThingCard = ({ thing, onEdit, onToggle }) => {
  const liveValue = useLiveValue(thing);
  const isActuator = thing.thing_type === 1 || thing.thing_type === 2;
  const isSensor = thing.thing_type === 0;
  const isFloat = thing.data_type === 1;

  if (isSensor && isFloat) {
    return <SensorFloatCard thing={thing} onEdit={onEdit} />;
  }

  const isActive = liveValue === 1 || liveValue === true || liveValue === "true" || liveValue === "on";

  return (
    <div className={`
      p-7 rounded-[2.5rem] border h-full transition-all duration-700 
      overflow-hidden relative group grid grid-rows-[auto_1fr_auto] gap-4
      bg-hub-card-bg/60 backdrop-blur-xl border-hub-border/50
      hover:border-hub-accent/40 hover:shadow-2xl hover:shadow-hub-accent/5
      active:scale-[0.98]
    `}>
      
      {/* Dynamic Background Glow */}
      {isActuator && isActive && (
        <div className="absolute inset-0 bg-radial-gradient from-hub-accent/10 to-transparent opacity-50 pointer-events-none animate-pulse" />
      )}

      {/* Header Slot */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1.5 text-left">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-30 block">
            {isActuator ? 'ACTUATOR_LINK' : 'SENSOR_LINK'}
          </span>
          <h4 className="text-[13px] font-black tracking-tight uppercase truncate max-w-[150px] text-hub-text-primary/90">
            {thing.meta?.label || thing.slug || 'VIRTUAL_ENTITY'}
          </h4>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="w-9 h-9 rounded-2xl border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-hub-surface-bg border-hub-border hover:border-hub-accent/40 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <EditIcon />
        </button>
      </div>

      {/* Main Display Slot */}
      <div className="flex flex-col items-center justify-center gap-5 relative z-10">
        {isActuator ? (
          <div className="relative">
             <button 
              onClick={(e) => { e.stopPropagation(); onToggle(!isActive); }}
              className={`
                w-24 h-12 rounded-full border-2 transition-all duration-500 relative flex items-center
                ${isActive 
                  ? 'bg-hub-accent border-hub-accent/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : 'bg-hub-surface-bg/50 border-hub-border hover:border-hub-accent/20'}
              `}
            >
              <div className={`
                absolute top-1 left-1.5 w-8 h-8 rounded-full transition-all transform duration-500 ease-out
                ${isActive 
                  ? 'translate-x-[48px] bg-white shadow-lg scale-110' 
                  : 'translate-x-0 bg-hub-text-primary/10' }
              `} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h4 className="text-5xl font-black tracking-tighter uppercase tabular-nums text-center text-hub-text-primary">
              {liveValue !== undefined && liveValue !== null ? liveValue : '---'}
            </h4>
            <span className="text-[10px] font-mono opacity-30 mt-1 tracking-[0.3em] uppercase">
              {thing.meta?.unit || 'Units'}
            </span>
          </div>
        )}
        
        {isActuator && (
           <span className={`
            text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500
            ${isActive ? 'text-hub-accent opacity-100' : 'opacity-20'}
           `}>
             {isActive ? 'System_Active' : 'Standby_Mode'}
           </span>
        )}
      </div>

      {/* Footer Details Slot */}
      <div className="pt-5 border-t border-dashed border-hub-border/50 flex justify-between items-center w-full relative z-10">
        <div className="flex flex-col">
          <p className="text-[8px] font-mono opacity-20 uppercase tracking-widest">
            NODE_UID
          </p>
          <p className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">
            {thing.id.substring(0, 8)}..{thing.id.substring(thing.id.length - 4)}
          </p>
        </div>
        <div className={`
          w-2 h-2 rounded-full transition-all duration-500
          ${isActive 
            ? 'bg-hub-accent shadow-[0_0_10px_var(--hub-accent)] animate-pulse' 
            : 'opacity-20 bg-hub-text-primary'}
        `} title={isActive ? "Linked" : "Offline"} />
      </div>
    </div>
  );
};

export default ThingCard;

