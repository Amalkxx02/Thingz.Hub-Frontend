import React from 'react';
import DeviceModal from './DeviceModal';

const DeviceWarningModal = ({ isOpen, onClose, onConfirm, theme, actionType, deviceName }) => {
  const getActionConfig = () => {
    switch (actionType) {
      case 'REVOKE':
        return {
          title: 'AUTHORIZATION_REVOCATION_WARNING',
          message: `Are you sure you want to revoke authorization for node [${deviceName}]? This will immediately terminate all active cryptographic links.`,
          confirmText: 'INITIALIZE_REVOCATION',
          confirmColor: 'bg-rose-500',
          textColor: 'text-rose-500'
        };
      case 'ROTATE_KEY':
        return {
          title: 'SECURITY_TOKEN_ROTATION',
          message: `Rotating the secret key for [${deviceName}] will invalidate the current token. You must update the hardware node with the new key immediately to prevent link failure.`,
          confirmText: 'ROTATE_SECRET_TOKEN',
          confirmColor: 'bg-emerald-500',
          textColor: 'text-emerald-500'
        };
      case 'DELETE':
        return {
          title: 'PERMANENT_DECOMMISSION_NOTICE',
          message: `CRITICAL: You are about to permanently delete [${deviceName}] from the system inventory. This action is irreversible and all historical telemetry links will be severed.`,
          confirmText: 'PURGE_SYSTEM_RECORD',
          confirmColor: 'bg-rose-600',
          textColor: 'text-rose-600'
        };
      default:
        return {};
    }
  };

  const config = getActionConfig();

  return (
    <DeviceModal isOpen={isOpen} onClose={onClose} theme={theme}>
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${config.confirmColor} animate-pulse`} />
             <h3 className={`text-xl font-black tracking-tighter uppercase ${config.textColor}`}>{config.title}</h3>
          </div>
          <p className="text-[11px] font-mono opacity-40 uppercase tracking-widest leading-relaxed">
             SYSTEM_ID: {deviceName} // STATUS: PENDING_CONFIRMATION
          </p>
        </div>

        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
           <p className="text-xs font-mono uppercase tracking-widest leading-loose opacity-80">
              {config.message}
           </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={onClose}
            className="flex-grow py-4 border border-neutral-500/10 hover:border-neutral-500/30 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
            Abort_Operation
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-grow py-4 ${config.confirmColor} text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </DeviceModal>
  );
};

export default DeviceWarningModal;
