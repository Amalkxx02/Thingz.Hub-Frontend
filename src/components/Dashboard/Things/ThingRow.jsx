import React, { useState } from 'react';
import { useLiveValue } from '../../../hooks/useLiveValue';

const ThingRow = ({ thing, theme, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const liveValue = useLiveValue(thing);

  // Enums for descriptive labels
  const DataType = ['INT', 'FLOAT', 'BOOL', 'VECTOR3'];
  const ThingType = ['SENSOR', 'ACTUATOR', 'HYBRID'];

  return (
    <div 
      className={`flex flex-col rounded-xl border transition-all duration-500 overflow-hidden ${isExpanded ? 'bg-hub-accent/5 border-hub-accent/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'bg-hub-card-bg border-hub-border hover:border-hub-accent/10 shadow-sm'}`}
    >
      {/* Main Interaction Surface */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex flex-row items-center p-4 cursor-pointer select-none"
      >
        {/* Identity Column */}
        <div className="flex items-center gap-4 min-w-[260px] md:min-w-[320px]">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-hub-surface-bg border-hub-border">
            <div className={`w-1.5 h-1.5 rounded-full ${thing.meta ? 'bg-hub-accent shadow-[0_0_8px_var(--hub-accent)]' : 'opacity-20 bg-hub-text-primary'}`} />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden text-left">
            <h4 className="text-[11px] font-black uppercase tracking-widest truncate">
              {thing.meta?.label || thing.slug || 'UNLABELED_VIRTUAL_OBJECT'}
            </h4>
            <span className={`text-[7px] font-mono uppercase tracking-[0.3em] truncate opacity-20 ${isExpanded ? 'opacity-60 text-hub-accent' : ''}`}>
              UID_PHYS::{thing.id_hex || thing.id.replace(/-/g, '')}
            </span>
          </div>
        </div>

        {/* Attributes Grid (Simplified sync with latest DeviceRow) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 px-6 md:px-12">
            <div className="flex flex-col gap-1">
              <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest">Logic_Class</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">
                {ThingType[thing.thing_type] || 'GENERIC'}
              </span>
            </div>

            <div className="flex flex-col gap-1 hidden md:flex">
              <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest">Data_Stream</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">
                {DataType[thing.data_type] || 'RAW'}
              </span>
            </div>
        </div>

        {/* Action Pillar */}
        <div className="flex items-center gap-4 pl-6 border-l border-hub-border">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-mono font-black">{liveValue !== undefined ? liveValue : '---'} {thing.meta?.unit}</span>
            <span className="text-[7px] font-mono opacity-20 uppercase">Realtime_Signal</span>
          </div>
        </div>
      </div>

      {/* Expanded Actions Module */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="p-6 border-t border-dashed border-hub-border grid grid-cols-1 md:grid-cols-2 gap-8 bg-hub-text-primary/5">
            <div className="space-y-4">
               <div className="flex flex-col gap-1">
                  <p className="text-[10px] opacity-60 leading-relaxed font-mono">
                     Hardware_Origin: {(() => {
                        const inventory = JSON.parse(localStorage.getItem('hub_node_inventory') || '[]');
                        const device = inventory.find(d => d.id === (thing.device_id || thing.deviceId));
                        return device ? device.name : (thing.device_id || thing.deviceId || 'ORPHANED_LINK');
                     })()}
                  </p>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 self-end">
               <button 
                 onClick={(e) => { e.stopPropagation(); onEdit(); }}
                 className="px-6 h-10 rounded-xl border border-hub-accent/20 hover:bg-hub-accent/10 text-hub-accent text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-hub-accent/5"
               >
                 Update_Config
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); onDelete(); }}
                 className="px-6 h-10 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest transition-all"
               >
                 Purge_Entity
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ThingRow;
