import React, { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../../services/deviceService';
import { useTheme, useToast } from '../../context';
import DeviceRow from './Devices/DeviceRow';
import DeviceRegistrationModal from './Devices/DeviceRegistrationModal';
import DeviceWarningModal from './Devices/DeviceWarningModal';

const DevicesManager = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [devices, setDevices] = useState(() => {
    const cache = localStorage.getItem('hub_node_inventory');
    return cache ? JSON.parse(cache) : [];
  });
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rotatedKeyInfo, setRotatedKeyInfo] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // { type, deviceId, deviceName }
  const [isProcessing, setIsProcessing] = useState(false); // Keeps modal alive during API call

  const syncCache = useCallback((updatedInventory) => {
    setDevices(updatedInventory);
    localStorage.setItem('hub_node_inventory', JSON.stringify(updatedInventory));
  }, []);

  const fetchInventory = useCallback(async (isManual = false) => {
    try {
      if (isManual || devices.length === 0) setLoading(true);
      const data = await deviceService.getDevices();
      syncCache(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [devices.length, syncCache, showToast]);

  const syncSingleNode = useCallback(async (id) => {
    try {
      const node = await deviceService.getDevice(id);
      const updated = devices.map(d => d.id === id ? node : d);
      syncCache(updated);
    } catch (err) {
      showToast(`SYNC_DELTA_FAILED: ${err.message}`, 'error');
    }
  }, [devices, syncCache, showToast]);

  useEffect(() => {
    if (devices.length === 0) {
      fetchInventory();
    }
  }, [devices.length, fetchInventory]);

  const handleRegister = async (name, type) => {
    try {
      setLoading(true);
      const result = await deviceService.registerDevice(name, type);
      await fetchInventory(true);

      return result;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await deviceService.toggleStatus(id);
      await syncSingleNode(id);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const executePendingAction = async () => {
    if (!pendingAction) return;
    const { type, deviceId } = pendingAction;
    try {
      // Keep warning modal open with a spinner — no gap between modals
      setIsProcessing(true);

      switch (type) {
        case 'REVOKE':
          await deviceService.revokeDevice(deviceId);
          await syncSingleNode(deviceId);
          setPendingAction(null); // Safe to close — no follow-up modal
          showToast('NODE_AUTHORIZATION_REVOKED', 'success');
          break;
        case 'ROTATE_KEY': {
          const res = await deviceService.rotateKey(deviceId);
          await syncSingleNode(deviceId);
          // Batch both state updates: React renders them together → zero flash gap
          setRotatedKeyInfo(res);
          setPendingAction(null);

          break;
        }
        case 'REVOKE_ALL':
          await deviceService.revokeAllDevices();
          // Efficiently update local state without extra GET call
          const revokedAll = devices.map(d => ({ ...d, revoked: true, is_active: false }));
          syncCache(revokedAll);
          setPendingAction(null);
          showToast('MASS_SYSTEM_REVOCATION_ACKNOWLEDGED', 'success');
          break;
        case 'DELETE': {
          await deviceService.deleteDevice(deviceId);
          const filtered = devices.filter(d => d.id !== deviceId);
          syncCache(filtered);
          setPendingAction(null);
          showToast('SYSTEM_RECORD_PURGED', 'success');
          break;
        }
      }
    } catch (err) {
      setPendingAction(null);
      showToast(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const initiateAction = (type, device) => {
    setPendingAction({ type, deviceId: device.id, deviceName: device.name });
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Device_Inventory</h2>
          <p className="text-[10px] font-mono opacity-20 uppercase tracking-[0.2em]">
            TOTAL_NODES_ACTIVE: {devices.length}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchInventory(true)}
            disabled={loading}
            className={`h-11 w-11 md:h-12 md:w-12 flex items-center justify-center shrink-0 rounded-xl border border-neutral-500/10 hover:border-emerald-500/30 transition-all font-mono text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Force System Inventory Synchronization"
          >
            <span className={loading ? 'animate-spin' : ''}>⟳</span>
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className="h-11 md:h-12 flex-grow md:w-52 flex items-center justify-center bg-emerald-500 text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            Reg_Node
          </button>
        </div>
      </header>

      {loading && devices.length === 0 && (
        <div className="flex items-center gap-4 py-20 px-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 border-dashed animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <p className="text-xs font-mono opacity-50 uppercase tracking-widest">Initial_Node_Link_Sequence_In_Progress...</p>
        </div>
      )}

      {/* Registration Modal */}
      <DeviceRegistrationModal
        isOpen={isRegistering}
        onClose={() => setIsRegistering(false)}
        theme={theme}
        onRegister={handleRegister}
      />

      {/* Rotation Key Result Modal — opens atomically after warning closes */}
      {rotatedKeyInfo && (
        <DeviceRegistrationModal
          isOpen={true}
          onClose={() => setRotatedKeyInfo(null)}
          theme={theme}
          initialResult={rotatedKeyInfo}
        />
      )}

      {/* Confirmation Warning Modal — stays open (isProcessing) during API call */}
      <DeviceWarningModal
        isOpen={!!pendingAction}
        onClose={() => !isProcessing && setPendingAction(null)}
        onConfirm={executePendingAction}
        theme={theme}
        actionType={pendingAction?.type}
        deviceName={pendingAction?.deviceName}
        isProcessing={isProcessing}
      />

      {/* Device Inventory List */}
      <div className="space-y-2">
          {devices.length > 0 ? (
            devices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                theme={theme}
                onToggleStatus={() => handleToggleStatus(device.id)}
                onRevoke={() => initiateAction('REVOKE', device)}
                onRotateKey={() => initiateAction('ROTATE_KEY', device)}
                onDelete={() => initiateAction('DELETE', device)}
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="text-4xl text-emerald-500/20">⬚</div>
              <p className="text-xs font-mono uppercase tracking-[0.3em]">No_Nodes_Detected</p>
            </div>
          )}

        {/* Revoke All Action - Visibility refined (at least 2 non-revoked nodes) */}
        {devices.filter(d => !d.revoked).length >= 2 && (
          <div className="pt-8 border-t border-rose-500/10 flex justify-end mt-8">
            <button
              onClick={() => initiateAction('REVOKE_ALL', { id: 'ALL', name: 'SYSTEM_WIDE_NODES' })}
              className="px-6 py-3 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse group-hover:scale-125 transition-transform" />
              Revoke_All_Access
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicesManager;
