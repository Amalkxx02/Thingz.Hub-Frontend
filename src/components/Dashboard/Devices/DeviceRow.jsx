import React from 'react';

const DeviceRow = ({ device, theme, onToggleStatus, onRevoke, onRotateKey, onDelete }) => {
  const getDeviceTypeLabel = (type) => {
    switch (type) {
      case 0: return 'HUB_NODE';
      case 1: return 'EDGE_NODE';
      default: return `UNKNOWN_TYPE_${type}`;
    }
  };

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 md:p-6 rounded-2xl border-b transition-all duration-300 group ${theme === 'dark' ? 'bg-[#0a0a0a]/40 border-neutral-900/50 hover:bg-[#0f0f0f] hover:border-emerald-500/10' : 'bg-white border-neutral-100 hover:bg-neutral-50 hover:border-emerald-500/10 shadow-sm shadow-neutral-100'}`}
    >
      {/* Node Identity */}
      <div className="col-span-4 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${device.revoked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <h4 className="text-sm md:text-base font-black tracking-tighter uppercase truncate">{device.name}</h4>
        </div>
        <p className="text-[8px] font-mono opacity-30 uppercase tracking-widest pl-4 hidden md:block">LOC: GATEWAY_{device.id.substring(0,4)}</p>
      </div>

      {/* Type Class */}
      <div className="md:col-span-2 text-left md:text-center">
        <span className={`px-2 py-1 rounded text-[8px] font-mono font-bold tracking-widest border transition-colors ${theme === 'dark' ? 'bg-black/40 border-white/5 opacity-50' : 'bg-neutral-100 border-neutral-200 opacity-60'} group-hover:opacity-100 uppercase`}>
          {getDeviceTypeLabel(device.type)}
        </span>
      </div>

      {/* Device ID */}
      <div className="md:col-span-2 text-left md:text-center text-[10px] font-mono opacity-40 uppercase tracking-widest">
        {device.id.substring(0, 8)}...
      </div>

      {/* Connection State (is_active) */}
      <div className="md:col-span-2 text-left md:text-center">
        <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${device.is_active ? 'text-emerald-500' : 'text-neutral-500'}`}>
          {device.is_active ? 'ACTIVE_LINK' : 'IDLE_STATE'}
        </span>
      </div>

      {/* Dynamic Actions */}
      <div className="md:col-span-2 text-right opacity-0 group-hover:opacity-100 transition-all">
        <div className="flex justify-end gap-2">
          {!device.revoked ? (
            <>
              <button 
                onClick={onToggleStatus}
                className={`px-3 py-1.5 rounded-lg border transition-colors text-[9px] font-black uppercase tracking-widest ${device.is_active ? 'border-amber-500/20 hover:bg-amber-500/10 text-amber-500' : 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500'}`}
                title={device.is_active ? "Deactivate Link Connection" : "Activate Link Connection"}
              >
                {device.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={onRevoke}
                className={`px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors text-rose-500 text-[9px] font-black uppercase tracking-widest`}
                title="Revoke Node Authorization"
              >
                Revoke
              </button>
              <button 
                onClick={onRotateKey}
                className={`px-3 py-1.5 rounded-lg border border-emerald-500/10 hover:bg-emerald-500/5 transition-colors text-emerald-500/70 hover:text-emerald-500 text-[9px] font-black uppercase tracking-widest`}
                title="Regenerate Security Token"
              >
                Rotate_Key
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onRotateKey}
                className={`px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors text-emerald-500 text-[9px] font-black uppercase tracking-widest`}
                title="Restore Authorization with New Token"
              >
                Rotate_Key
              </button>
              <button 
                onClick={onDelete}
                className={`px-2 py-1.5 rounded-lg border border-neutral-500/10 hover:bg-rose-500/10 transition-colors text-neutral-500 hover:text-rose-500 text-[9px] font-black uppercase`}
                title="Purge Node From Inventory"
              >
                ⌧
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceRow;
