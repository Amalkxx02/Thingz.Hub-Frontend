import React from 'react';
import { useTheme } from '../../context';

const RoomsManager = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Spatial_Config</h2>
          <p className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
            TOTAL_ZONES_DEFINED: 0 // SCAN_STATUS: INCOMPLETE
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className={`p-3 rounded-xl border border-neutral-500/10 hover:border-emerald-500/30 transition-all font-mono text-[10px] uppercase tracking-widest opacity-50 cursor-not-allowed`}
            title="Spatial synchronization is currently offline"
          >
            SYNC_LOCKED
          </button>
          <button 
            className="px-6 py-3 bg-emerald-500/20 text-emerald-500 text-[11px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/30 cursor-not-allowed"
          >
            Define_New_Zone
          </button>
        </div>
      </header>

      <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-40 grayscale">
         <div className="text-6xl font-mono">◰</div>
         <div className="space-y-2">
           <p className="text-xs font-mono uppercase tracking-[0.3em]">No_Structural_Zones_Detected</p>
           <p className="text-[9px] font-mono uppercase tracking-widest opacity-50 max-w-sm">
             Connect a Spatial_Scanner_Node to begin mapping physical environment and structural hierarchies.
           </p>
         </div>
      </div>
    </div>
  );
};

export default RoomsManager;
