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
      showToast('NODE_HANDSHAKE_SUCCESSFUL', 'success');
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
      setPendingAction(null);
      setLoading(true);
      
      switch(type) {
        case 'REVOKE':
          await deviceService.revokeDevice(deviceId);
          await syncSingleNode(deviceId);
          showToast('NODE_AUTHORIZATION_REVOKED', 'success');
          break;
        case 'ROTATE_KEY':
          const res = await deviceService.rotateKey(deviceId);
          setRotatedKeyInfo(res);
          await syncSingleNode(deviceId);
          showToast('SECURITY_TOKEN_ROTATED', 'success');
          break;
        case 'DELETE':
          await deviceService.deleteDevice(deviceId);
          const filtered = devices.filter(d => d.id !== deviceId);
          syncCache(filtered);
          showToast('SYSTEM_RECORD_PURGED', 'success');
          break;
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Triggers warning first
  const initiateAction = (type, device) => {
    setPendingAction({ type, deviceId: device.id, deviceName: device.name });
  };

  if (loading && devices.length === 0) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <p className="text-xs font-mono opacity-40 uppercase tracking-widest">Initial_Link_Sequence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Device_Inventory</h2>
          <p className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">
            TOTAL_NODES_ACTIVE: {devices.length} // STATUS: STABLE
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchInventory(true)}
            disabled={loading}
            className={`p-3 rounded-xl border border-neutral-500/10 hover:border-emerald-500/30 transition-all font-mono text-[10px] uppercase tracking-widest ${loading ? 'opacity-50' : ''}`}
            title="Force System Inventory Synchronization"
          >
            {loading ? 'SYNCING...' : 'SYNC_REFRESH'}
          </button>
          <button 
            onClick={() => setIsRegistering(true)}
            className="px-6 py-3 bg-emerald-500 text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            Register_New_Node
          </button>
        </div>
      </header>

      {/* Modular Registration Modal */}
      <DeviceRegistrationModal 
        isOpen={isRegistering} 
        onClose={() => setIsRegistering(false)} 
        theme={theme}
        onRegister={handleRegister}
      />

      {/* Rotation Success Overlay */}
      {rotatedKeyInfo && (
        <DeviceRegistrationModal 
          isOpen={true}
          onClose={() => setRotatedKeyInfo(null)}
          theme={theme}
          initialResult={rotatedKeyInfo} 
        />
      )}

      {/* Confirmation Warning Overlay */}
      <DeviceWarningModal 
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={executePendingAction}
        theme={theme}
        actionType={pendingAction?.type}
        deviceName={pendingAction?.deviceName}
      />

      {/* Devices List - High-Density Tabular View */}
      <div className="space-y-4">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
          <div className="col-span-4">Node_Identity</div>
          <div className="col-span-2 text-center">Type_Class</div>
          <div className="col-span-2 text-center">Device_ID</div>
          <div className="col-span-2 text-center">Connection_State</div>
          <div className="col-span-2 text-right">Actions_Terminal</div>
        </div>

        <div className="space-y-1">
          {devices.map((device) => (
            <DeviceRow 
              key={device.id} 
              device={device} 
              theme={theme}
              onToggleStatus={() => handleToggleStatus(device.id)}
              onRevoke={() => initiateAction('REVOKE', device)}
              onRotateKey={() => initiateAction('ROTATE_KEY', device)}
              onDelete={() => initiateAction('DELETE', device)}
            />
          ))}
        </div>
      </div>

      {devices.length === 0 && !loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
           <div className="text-4xl text-emerald-500/20">⬚</div>
           <p className="text-xs font-mono uppercase tracking-[0.3em]">No_Devices_Detected_In_Local_Network</p>
        </div>
      )}
    </div>
  );
};

export default DevicesManager;
