import React, { useState, useEffect } from "react";
 // Assuming this exists based on AuthPage
import { DeviceForm } from "./DeviceForm";
import { DeviceCard } from "./DeviceCard";
import { apiDevice } from "../../../services/deviceService";
import { SectionHeader } from "../SectionHeader";

const DevicesManager = () => {
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem("devices");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);

  const loadDevices = async () => {
    try {
      const devicesData = await apiDevice.getDevices();
      setDevices(devicesData);
      localStorage.setItem("devices", JSON.stringify(devicesData));
    } catch (error) {
      console.error("Failed to fetch user devices", error);
      setDevices([])
    } finally {
    }
  };
  
  useEffect(() => {
    loadDevices();
  }, []);


  return (
    <div className="space-y-2">
      <SectionHeader 
        title="TELEMETRY_NODES" 
        count={devices.length} 
        actionText="Insert Device" 
        onAction={() => setShowForm(true)} 
      />

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl`}>
            <DeviceForm
              onSuccess={(newDevice) => {
                setDevices((prev) => [...prev, newDevice]);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {devices.length === 0 ? (
            <div
              className={`col-span-full h-64 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-neutral-800 rounded-[2rem]`}
            >
              <div className="text-4xl mb-4">◈</div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em]">
                No_Devices_Found
              </p>
            </div>
          ) : (
            devices.map((device, index) => (
              <DeviceCard key={index} device={device} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DevicesManager;
