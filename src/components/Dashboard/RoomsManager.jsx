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
            TOTAL_ZONES_DEFINED: 0
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button 
            className={`h-11 w-11 md:h-12 md:w-12 flex items-center justify-center shrink-0 rounded-xl border border-neutral-500/10 hover:border-emerald-500/30 transition-all font-mono text-lg opacity-30 cursor-not-allowed`}
            title="Spatial synchronization is currently offline"
          >
            ⟳
          </button>
          <button 
            disabled={true}
            className="h-11 md:h-12 flex-grow md:w-52 flex items-center justify-center bg-emerald-500/20 text-emerald-500 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/30 cursor-not-allowed opacity-50"
          >
            Def_Zone
          </button>
        </div>
      </header>

      <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
         <div className="text-6xl text-emerald-500/20 font-mono">◰</div>
         <div className="space-y-2">
           <p className="text-xs font-mono uppercase tracking-[0.3em]">No_Zones_Defined</p>
           <p className="text-[9px] font-mono uppercase tracking-widest opacity-50 max-w-sm">
             Connect a Spatial_Scanner_Node to begin mapping physical environment and structural hierarchies.
           </p>
         </div>
      </div>
    </div>
  );
};

export default RoomsManager;
