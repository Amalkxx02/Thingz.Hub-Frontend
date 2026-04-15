import React, { useState } from 'react';

const DeviceRow = ({ device, theme, onToggleStatus, onRevoke, onRotateKey, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDeviceTypeLabel = (type) => {
    switch (type) {
      case 0: return 'HUB_NODE';
      case 1: return 'EDGE_NODE';
      default: return `UNKNOWN_TYPE_${type}`;
    }
  };

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
            <div className={`w-1.5 h-1.5 rounded-full ${device.revoked ? 'bg-rose-500' : 'bg-hub-accent shadow-[0_0_8px_var(--hub-accent)]'}`} />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden text-left">
            <h4 className="text-[11px] font-black uppercase tracking-widest truncate">
              {device.name}
            </h4>
            <span className={`text-[7px] font-mono uppercase tracking-[0.3em] truncate opacity-20 ${isExpanded ? 'opacity-60 text-hub-accent' : ''}`}>
              UID_CORE::{device.id}
            </span>
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="flex-grow grid grid-cols-4 gap-4 px-6 md:px-12">
          <div className="flex flex-col gap-1">
            <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest">Logic_Class</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">
              {getDeviceTypeLabel(device.type)}
            </span>
          </div>
        </div>

        {/* Action Pillar */}
        <div className="flex items-center gap-4 pl-6 border-l border-hub-border">
          <div className="md:flex flex-col items-end gap-1">
             <div className="flex bg-hub-text-primary/5 rounded-md p-0.5">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
                  className={`h-5 px-3 rounded text-[7px] font-black uppercase transition-all ${device.is_active ? 'bg-hub-accent text-black' : 'opacity-40 hover:opacity-100'}`}
                >
                  On
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
                  className={`h-5 px-3 rounded text-[7px] font-black uppercase transition-all ${!device.is_active ? 'bg-hub-text-primary/40 text-hub-text-primary' : 'opacity-40 hover:opacity-100'}`}
                >
                  Off
                </button>
             </div>
             <span className="text-[7px] font-mono opacity-20 uppercase text-right">System_State</span>
          </div>
        </div>
      </div>

      {/* Expanded Security Module */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="p-6 border-t border-dashed border-hub-border grid grid-cols-1 md:grid-cols-2 gap-8 bg-hub-text-primary/5">
            <div className="space-y-4">
               <div className="flex flex-col gap-1">
                  <p className="text-[10px] opacity-60 leading-relaxed font-mono">
                     Provision_At: {new Date(device.created_at).toLocaleString()}
                  </p>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 self-end">
               {!device.revoked ? (
                 <>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onRevoke(); }}
                     className="px-6 h-10 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest transition-all"
                   >
                     Revoke_Access
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onRotateKey(); }}
                     className="px-6 h-10 rounded-xl border border-hub-accent/20 hover:bg-hub-accent/10 text-hub-accent text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-hub-accent/5"
                   >
                     Rotate_Root_Key
                   </button>
                 </>
               ) : (
                 <>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onRotateKey(); }}
                     className="px-6 h-10 rounded-xl bg-hub-accent text-black text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all"
                   >
                     Resurrect_Handshake
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onDelete(); }}
                     className="px-6 h-10 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest transition-all"
                   >
                     Purge_Record
                   </button>
                 </>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default DeviceRow;
