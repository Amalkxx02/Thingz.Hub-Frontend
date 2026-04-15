import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ProfileDropdown from '../components/Dashboard/ProfileDropdown';
import HomeManager from '../components/Dashboard/HomeManager';
import DevicesManager from '../components/Dashboard/DevicesManager';
import ThingsManager from '../components/Dashboard/ThingsManager';
import RoomsManager from '../components/Dashboard/RoomsManager';
import { useAuth, useTheme } from '../context';

import { thingService } from '../services/thingService';

const Dashboard = ({ page = 'home' }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState('device'); // 'device' | 'room'
  const [filterId, setFilterId] = useState(null); // Filter by specific ID
  const [activeDeviceIds, setActiveDeviceIds] = useState([]);

  React.useEffect(() => {
    const fetchActive = async () => {
      try {
        const things = await thingService.getThingzWithMeta();
        const ids = [...new Set(things.map(t => t.device_id || t.deviceId))];
        setActiveDeviceIds(ids);
      } catch (err) {
        console.error('Topology_Sync_Fault:', err);
      }
    };
    fetchActive();
  }, [page]); // Re-sync when switching pages or on mount

  const cachedDevices = JSON.parse(localStorage.getItem('hub_node_inventory') || '[]')
    .filter(d => activeDeviceIds.includes(d.id));
  const cachedThings = JSON.parse(localStorage.getItem('hub_meta_inventory') || '[]')

  const navLinks = [
    { label: 'Home', path: '/', id: 'home' },
    { label: 'Devices', path: '/devices', id: 'devices' },
    { label: 'Things', path: '/things', id: 'things' },
    { label: 'Rooms', path: '/rooms', id: 'rooms' },
  ];

  const getPageHeader = () => {
    switch(page) {
      case 'home': return { title: 'Home_Center', subtitle: 'LIVE_MESH_OVERVIEW', count: null };
      case 'devices': return { title: 'Device_Inventory', subtitle: 'TOTAL_NODES_ACTIVE', count: cachedDevices.length };
      case 'things': return { title: 'Thing_Repository', subtitle: 'TOTAL_VIRTUAL_OBJECTS', count: cachedThings.length }; 
      case 'rooms': return { title: 'Spatial_Config', subtitle: 'TOTAL_ZONES_DEFINED', count: 0 };
      default: return { title: 'Hub_Dashboard', subtitle: 'SYSTEM_STATUS_STABLE', count: null };
    }
  };

  const header = getPageHeader();

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <HomeManager filterType={filterType} filterId={filterId} />;
      case 'devices':
        return <DevicesManager />;
      case 'things':
        return <ThingsManager />;
      case 'rooms':
        return <RoomsManager />;
      default:
        return <HomeManager />;
    }
  };

  return (
    <div className={`h-[100dvh] w-full flex flex-col transition-all duration-700 ${theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-[#F9FAFB] text-neutral-900'}`}>

      {/* Top Navigation Bar - Fixed */}
      <header className={`shrink-0 w-full h-12 md:h-14 px-4 md:px-8 flex items-center justify-between border-b z-50 backdrop-blur-md transition-all duration-500 select-none ${theme === 'dark' ? 'bg-[#080808]/80 border-neutral-900' : 'bg-white/80 border-neutral-200'}`}>
        <div className="flex flex-col gap-1 overflow-hidden">
          <Link to="/" className="shrink-0 flex items-center" onClick={() => setFilterId(null)}>
            <Logo className="h-4 md:h-5" />
          </Link>
          
          <div className="iot-dots absolute inset-0 opacity-5 pointer-events-none" />

          {/* breadcrumb info - ultra compact below logo */}
          <div className="flex items-center gap-1.5 pl-0.5">
            <div className={`w-1 h-1 rounded-full bg-emerald-500`} />
            <p className="text-[7px] font-mono font-bold tracking-[0.2em] uppercase opacity-40 whitespace-nowrap">
              {page === 'home' ? 'OVERVIEW' : page.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <div className="flex items-center gap-2 md:gap-4 transition-all">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR - Expandable on hover */}
        <aside className={`group hidden md:flex flex-col h-full border-r shrink-0 !z-40 transition-all duration-500 ease-in-out select-none whitespace-nowrap w-12 hover:w-64 ${theme === 'dark' ? 'bg-[#080808] border-neutral-900' : 'bg-white border-neutral-100'}`}>
          <nav className="flex-grow flex flex-col gap-2 p-2 pt-6 overflow-hidden">
            {/* Top Link: Home */}
            <Link
              to="/"
              onClick={() => setFilterId(null)}
              className={`relative flex items-center h-10 px-2 rounded-lg transition-all group/link overflow-hidden ${page === 'home' && !filterId ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-neutral-500/10 opacity-40 hover:opacity-100'}`}
            >
              <div className={`shrink-0 w-6 h-6 flex items-center justify-center font-mono font-bold text-xs ${page === 'home' && !filterId ? 'text-emerald-500' : ''}`}>⧇</div>
              <span className="ml-4 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Home</span>
              {page === 'home' && !filterId && <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-500 rounded-full" />}
            </Link>

            {/* Filtering Controls Div - Only shown on Home Center */}
            {page === 'home' && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 px-2 space-y-4">
                <div className="flex bg-neutral-500/5 rounded-lg p-1">
                  <button 
                    onClick={() => setFilterType('device')}
                    className={`flex-grow py-1.5 text-[8px] font-black uppercase tracking-widest rounded-l-md transition-all ${filterType === 'device' ? 'bg-emerald-500 text-black' : 'opacity-40 hover:opacity-100'}`}>
                    By_Device
                  </button>
                  <button 
                    onClick={() => setFilterType('room')}
                    className={`flex-grow py-1.5 text-[8px] font-black uppercase tracking-widest rounded-r-md transition-all ${filterType === 'room' ? 'bg-emerald-500 text-black' : 'opacity-40 hover:opacity-100'}`}>
                    By_Room
                  </button>
                </div>

                {/* Dynamic Selection List */}
                <div className="space-y-1 max-h-[40vh] overflow-y-auto no-scrollbar">
                  <p className="text-[7px] font-mono opacity-20 uppercase tracking-[0.3em] mb-2 px-1">Topology_Groups</p>
                  {filterType === 'device' ? (
                    cachedDevices.map(device => (
                      <button
                        key={device.id}
                        onClick={() => {
                          setFilterId(device.id);
                          const element = document.getElementById(`device-${device.id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${filterId === device.id ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-white/5 opacity-40 hover:opacity-80'}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full border border-current opacity-20" />
                        <span className="text-[9px] font-bold uppercase truncate">{device.name}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-[8px] font-mono opacity-10 px-1 py-4 uppercase">Spatial_Groups_Locked</p>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Stack: Management Links */}
            <div className="mt-auto mb-4 flex flex-col gap-2">
              {navLinks.filter(l => l.id !== 'home').map(link => (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`relative flex items-center h-10 px-2 rounded-lg transition-all group/link overflow-hidden ${page === link.id ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-neutral-500/10 opacity-40 hover:opacity-100'}`}
                >
                  <div className={`shrink-0 w-6 h-6 flex items-center justify-center font-mono font-bold text-xs ${page === link.id ? 'text-emerald-500' : ''}`}>
                    {link.id === 'devices' && '⧉' }
                    {link.id === 'things' && '◈' }
                    {link.id === 'rooms' && '◰' }
                  </div>
                  <span className="ml-4 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {link.label}
                  </span>
                  {page === link.id && <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-500 rounded-full" />}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* MOBILE BOTTOM NAVIGATION - App-like UX */}
        <nav className={`fixed bottom-0 left-0 w-full h-16 md:hidden z-50 border-t backdrop-blur-lg flex items-center justify-around px-4 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a]/80 border-neutral-900' : 'bg-white/80 border-neutral-200'}`}>
          {navLinks.map(link => (
            <Link
              key={link.id}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-1 min-w-[70px] transition-all relative ${page === link.id ? 'text-emerald-500' : 'opacity-40'}`}
            >
              <span className="text-lg font-mono leading-none">
                {link.id === 'home' && '⧇' }
                {link.id === 'devices' && '⧉' }
                {link.id === 'things' && '◈' }
                {link.id === 'rooms' && '◰' }
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">{link.label}</span>
              
              {/* Mobile Active Indicator */}
              {page === link.id && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Main Content Area - Natural Mobile Physics */}
        <main className="flex-grow relative overflow-y-auto custom-scrollbar overflow-x-hidden selection:bg-emerald-500/30">
          <div className="min-h-full px-4 md:px-8 lg:px-12 py-4 md:py-6 pb-24 md:pb-6 max-w-[1600px] mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

