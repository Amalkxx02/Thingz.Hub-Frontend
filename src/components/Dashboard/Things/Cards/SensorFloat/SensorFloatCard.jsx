import React from 'react';
import { useLiveValue } from '../../../../../hooks/useLiveValue';
import WaterCard from './Variations/WaterCard';
import AirCard from './Variations/AirCard';
import GasCard from './Variations/GasCard';
import './SensorFloat.css';

const SensorFloatCard = ({ thing, onEdit }) => {
  const liveValue = useLiveValue(thing);
  const variation = thing.meta?.variation_id || 'default';

  const renderVariation = () => {
    switch (variation) {
      case 'water':
        return <WaterCard value={liveValue} unit={thing.meta?.unit} label={thing.meta?.label} id={thing.id} />;
      case 'air':
        return <AirCard value={liveValue} unit={thing.meta?.unit} label={thing.meta?.label} id={thing.id} />;
      case 'gas':
        return <GasCard value={liveValue} unit={thing.meta?.unit} label={thing.meta?.label} id={thing.id} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h4 className="text-5xl font-black tracking-tighter uppercase tabular-nums text-center text-hub-text-primary">
              {liveValue !== undefined && liveValue !== null ? liveValue : '---'}
            </h4>
            <span className="text-[10px] font-mono opacity-30 mt-1 tracking-[0.3em] uppercase">
              {thing.meta?.unit || 'Units'}
            </span>
          </div>
        );
    }
  };

  return (
    <div 
      id={`sensor-float-${thing.id}`}
      className={`
      p-7 rounded-[2.5rem] border h-full transition-all duration-700 
      overflow-hidden relative group grid grid-rows-[auto_1fr_auto] gap-4
      bg-hub-card-bg/60 backdrop-blur-xl border-hub-border/50
      hover:border-hub-accent/40 hover:shadow-2xl hover:shadow-hub-accent/5
      active:scale-[0.98] sensor-float-container
    `}>
      {/* Header Slot */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1.5 text-left">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-30 block">
            INT_SENSOR::{variation.toUpperCase()}
          </span>
          <h4 className="text-[13px] font-black tracking-tight uppercase truncate max-w-[150px] text-hub-text-primary/90">
            {thing.meta?.label || thing.slug || 'VIRTUAL_ENTITY'}
          </h4>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="w-9 h-9 rounded-2xl border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-hub-surface-bg border-hub-border hover:border-hub-accent/40 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* Main Display Extension Slot */}
      <div className="relative z-10 h-full">
        {renderVariation()}
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
      </div>
    </div>
  );
};

export default SensorFloatCard;
