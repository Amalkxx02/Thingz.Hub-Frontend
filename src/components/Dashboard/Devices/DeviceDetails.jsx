import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock status for UI preview
  const isOnline = true;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 p-2 md:p-6">
      
      {/* Back Button */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Devices
        </button>
      </div>

      {/* Device Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-neutral-500'}`} />
            <span className={`text-xs font-semibold tracking-widest uppercase ${isOnline ? 'text-green-400' : 'text-neutral-400'}`}>
              {isOnline ? 'Active Connection' : 'Offline'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1">
            Device Node
          </h1>
          <p className="text-neutral-400 font-mono text-sm tracking-widest">
            ID: {id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs font-medium text-neutral-300 border border-neutral-700">
            ESP32
          </span>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">
            MQTT Protocol
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Metrics & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Telemetry Stream
            </h3>
            <div className="h-48 flex items-center justify-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
              <p className="text-neutral-500 text-sm font-medium flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
                Awaiting Data Payload
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-800 p-6">
              <h4 className="text-sm font-medium text-neutral-400 mb-1">Uptime</h4>
              <p className="text-2xl font-semibold text-white">99.9%</p>
            </div>
            <div className="bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-800 p-6">
              <h4 className="text-sm font-medium text-neutral-400 mb-1">Last Sync</h4>
              <p className="text-2xl font-semibold text-white">Just now</p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          
          {/* Control Panel */}
          <div className="bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
              State Control
            </h3>
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-300 border border-neutral-700 font-medium group shadow-sm hover:shadow-md"
              onClick={() => console.log("Toggle Online/Offline clicked")}
            >
              <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-neutral-500' : 'bg-green-500'}`} />
              {isOnline ? 'Force Offline' : 'Bring Online'}
            </button>
          </div>

          {/* Security Panel */}
          <div className="bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-800 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security Operations
            </h3>
            
            <div className="space-y-4">
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-all duration-300 border border-yellow-500/20 font-medium group"
                onClick={() => console.log("Rotate Key clicked")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                Rotate Auth Key
              </button>
              
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all duration-300 border border-red-500/20 font-medium group relative overflow-hidden"
                onClick={() => console.log("Revoke clicked")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                Revoke Device
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DeviceDetails;
