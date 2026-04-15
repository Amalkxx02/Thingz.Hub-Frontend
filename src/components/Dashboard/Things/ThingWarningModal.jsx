import React from 'react';
import ThingModal from './ThingModal';

const ThingWarningModal = ({ isOpen, onClose, onConfirm, theme, actionType, thingName, isProcessing = false }) => {
  const getActionConfig = () => {
    switch (actionType) {
      case 'DELETE':
        return {
          title: 'VIRTUAL_OBJECT_PURGE_WARNING',
          message: `CRITICAL: You are about to permanently delete [${thingName}] from the virtual inventory. All historical data streams associated with this entity will be terminated.`,
          confirmText: 'EXECUTE_PURGE_SEQUENCE',
          confirmColor: 'bg-rose-600',
          textColor: 'text-rose-600'
        };
      default:
        return {
          title: 'SYSTEM_ACTION_CONFIRMATION',
          message: 'Please confirm the pending operation.',
          confirmText: 'CONFIRM',
          confirmColor: 'bg-emerald-500',
          textColor: 'text-emerald-500'
        };
    }
  };

  const config = getActionConfig();

  return (
    <ThingModal isOpen={isOpen} onClose={onClose} theme={theme}>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
             <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${config.confirmColor}`} />
             <h3 className={`text-base md:text-xl font-black tracking-tight uppercase leading-snug ${config.textColor}`}>{config.title}</h3>
          </div>
          <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest leading-relaxed pl-5 break-all">
             ENTITY_ID: {thingName} // STATUS: PENDING_CONFIRMATION
          </p>
        </div>

        <div className={`p-4 md:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
           <p className="text-[10px] md:text-[11px] font-mono uppercase tracking-wide leading-relaxed opacity-80">
              {config.message}
           </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className={`flex-1 py-4 border border-neutral-500/10 hover:border-neutral-500/30 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isProcessing ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            Abort_Operation
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 py-4 ${config.confirmColor} text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin text-base">⟳</span>
                <span>Processing...</span>
              </>
            ) : (
              config.confirmText
            )}
          </button>
        </div>
      </div>
    </ThingModal>
  );
};

export default ThingWarningModal;
