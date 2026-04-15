import React, { useState } from 'react';
import DeviceModal from './DeviceModal';

const DeviceRegistrationModal = ({ isOpen, onClose, theme, onRegister, initialResult }) => {
  const [newDevice, setNewDevice] = useState({ name: '', type: 0 });
  const [registrationResult, setRegistrationResult] = useState(initialResult || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync internal state if initialResult changes (e.g. from a rotation)
  React.useEffect(() => {
    if (initialResult) setRegistrationResult(initialResult);
  }, [initialResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await onRegister(newDevice.name, parseInt(newDevice.type));
      setRegistrationResult(result);
    } catch (err) {
      // Error is handled in the parent via Toast or direct propagation if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setRegistrationResult(null);
    setNewDevice({ name: '', type: 0 });
    onClose();
  };

  return (
    <DeviceModal isOpen={isOpen} onClose={resetAndClose} theme={theme}>
      {!registrationResult ? (
        <>
          <div className="mb-8">
            <h3 className="text-2xl font-black tracking-tighter uppercase">Authorize_Node</h3>
            <p className="text-[9px] font-mono opacity-20 uppercase tracking-[.2em] mt-1">Establishing_Encrypted_Protocol</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Node_Descriptor</label>
              <input 
                type="text"
                required
                placeholder="IDENTITY_STRING"
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl border outline-none transition-all font-mono text-xs uppercase ${theme === 'dark' ? 'bg-white/5 border-neutral-800 focus:border-emerald-500/50' : 'bg-neutral-50 border-neutral-200 focus:border-emerald-500/30'}`}
                value={newDevice.name}
                onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Node_Type_Class</label>
              <div className="relative">
                <select 
                  disabled={isSubmitting}
                  className={`w-full p-4 rounded-xl border outline-none transition-all font-mono text-xs uppercase appearance-none cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-neutral-800 focus:border-emerald-500/50' : 'bg-neutral-50 border-neutral-200 focus:border-emerald-500/30'}`}
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                >
                  <option value={0}>HUB_NODE (MASTER)</option>
                  <option value={1}>EDGE_NODE (PERIPHERAL)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[8px]">▼</div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={resetAndClose}
                className="flex-grow py-4 border border-neutral-500/10 hover:border-neutral-500/30 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-grow py-4 bg-emerald-500 text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Initializing...' : 'Initialize_Link'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h3 className="text-base md:text-xl font-black tracking-tight uppercase text-emerald-500 leading-snug">Node_Authorized_Success</h3>
            <button onClick={resetAndClose} className="text-[10px] font-mono opacity-40 hover:opacity-100 uppercase shrink-0">[ACKNOWLEDGE]</button>
          </div>

          <div className="space-y-3">
            {/* Device ID Display */}
            <div className={`space-y-2 p-4 md:p-5 rounded-2xl font-mono ${theme === 'dark' ? 'bg-black/40' : 'bg-white border'}`}>
              <p className="text-[9px] opacity-30 uppercase tracking-widest">Permanent_Device_ID</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-xs md:text-sm font-bold text-neutral-500 break-all select-all flex-1">{registrationResult.device_id}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(registrationResult.device_id)}
                  className="self-end sm:self-center shrink-0 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-neutral-500/20 hover:bg-neutral-500/10 rounded-lg transition-all"
                >
                  ⎘ Copy
                </button>
              </div>
            </div>

            {/* API Key Display */}
            <div className={`space-y-2 p-4 md:p-5 rounded-2xl font-mono border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-500/20'}`}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] uppercase tracking-widest text-emerald-500/60 font-bold">Encoded_Secret_API_Key — COPY_NOW</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-xs md:text-sm font-bold text-emerald-500 break-all select-all flex-1">{registrationResult.api_key}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(registrationResult.api_key)}
                  className="self-end sm:self-center shrink-0 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-all"
                >
                  ⎘ Copy
                </button>
              </div>
            </div>

            <p className="text-[9px] font-mono opacity-60 uppercase tracking-widest leading-relaxed">
              ⚠ API_KEY_WILL_NEVER_BE_SHOWN_AGAIN. COPY_BEFORE_CLOSING. <br />
              DEVICE_ID_IS_PERMANENT_IDENTITY_FOR_THIS_NODE.
            </p>
          </div>
        </div>
      )}
    </DeviceModal>
  );
};

export default DeviceRegistrationModal;
