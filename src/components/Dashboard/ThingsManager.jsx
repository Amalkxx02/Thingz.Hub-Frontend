import React, { useState, useEffect, useCallback } from 'react';
import { useTheme, useToast } from '../../context';

// Mock Things since no service exists yet
const MOCK_THINGS = [
  { id: 'th_01', name: 'Ambient_Light_Ctrl', type: 'ACTUATOR', state: 'ONLINE', is_active: true },
  { id: 'th_02', name: 'Thermal_Zone_A', type: 'SENSOR_ARRAY', state: 'IDLE', is_active: false },
  { id: 'th_03', name: 'Security_Lock_G1', type: 'SECURITY_GATE', state: 'SECURED', is_active: true },
];

const ThingsManager = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [things, setThings] = useState(MOCK_THINGS);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('THING_INVENTORY_SYNCED', 'success');
    }, 800);
  };

  const toggleActive = (id) => {
    setThings(prev => prev.map(t => 
      t.id === id ? { ...t, is_active: !t.is_active } : t
    ));
    showToast('VIRTUAL_STATE_TOGGLED', 'info');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Thing_Repository</h2>
          <p className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
            TOTAL_VIRTUAL_OBJECTS: {things.length} // STATE: SYNCRONIZED
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className={`p-3 rounded-xl border border-neutral-500/10 hover:border-emerald-500/30 transition-all font-mono text-[10px] uppercase tracking-widest ${loading ? 'opacity-50' : ''}`}
            title="Force Thing Repository Synchronization"
          >
            {loading ? 'SYNCING...' : 'SYNC_REFRESH'}
          </button>
          <button 
            className="px-6 py-3 bg-emerald-500 text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            Register_New_Thing
          </button>
        </div>
      </header>

      {/* High-Density Tabular View for Things */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
          <div className="col-span-4">Object_Identity</div>
          <div className="col-span-3 text-center">Logic_Class</div>
          <div className="col-span-3 text-center">Virtual_State</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="space-y-1">
          {things.map((thing) => (
            <div 
              key={thing.id} 
              className={`grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 md:p-6 rounded-2xl border-b transition-all duration-300 group ${theme === 'dark' ? 'bg-[#0a0a0a]/40 border-neutral-900/50 hover:bg-[#0f0f0f] hover:border-emerald-500/10' : 'bg-white border-neutral-100 hover:bg-neutral-50 hover:border-emerald-500/10 shadow-sm shadow-neutral-100'}`}
            >
              <div className="col-span-4 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                   <div className={`w-1.5 h-1.5 rounded-full ${thing.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                   <h4 className="text-sm md:text-base font-black tracking-tighter uppercase truncate">{thing.name}</h4>
                </div>
                <p className="text-[8px] font-mono opacity-30 uppercase tracking-widest pl-4 hidden md:block">UID: {thing.id}</p>
              </div>

              <div className="md:col-span-3 text-left md:text-center">
                 <span className={`px-2 py-1 rounded text-[8px] font-mono font-bold tracking-widest border transition-colors ${theme === 'dark' ? 'bg-black/40 border-white/5 opacity-50' : 'bg-neutral-100 border-neutral-200 opacity-60'} group-hover:opacity-100 uppercase`}>
                   {thing.type}
                 </span>
              </div>

              <div className="md:col-span-3 text-left md:text-center">
                <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${thing.is_active ? 'text-emerald-500 animate-pulse' : 'text-neutral-500'}`}>
                  {thing.state}
                </span>
              </div>

              <div className="md:col-span-2 text-right opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => toggleActive(thing.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors text-[9px] font-black uppercase tracking-widest ${thing.is_active ? 'border-amber-500/20 hover:bg-amber-500/10 text-amber-500' : 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500'}`}
                >
                  {thing.is_active ? 'Suspend' : 'Engage'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThingsManager;
