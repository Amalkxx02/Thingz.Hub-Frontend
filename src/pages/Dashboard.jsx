import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ProfileDropdown from '../components/Dashboard/ProfileDropdown';
import DevicesManager from '../components/Dashboard/DevicesManager';
import ThingsManager from '../components/Dashboard/ThingsManager';
import RoomsManager from '../components/Dashboard/RoomsManager';
import { useAuth, useTheme } from '../context';

const Dashboard = ({ page = 'home' }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Devices', path: '/devices', id: 'devices' },
    { label: 'Things', path: '/things', id: 'things' },
    { label: 'Rooms', path: '/rooms', id: 'rooms' },
  ];

  const renderContent = () => {
    switch (page) {
      case 'devices':
        return <DevicesManager />;
      case 'things':
        return <ThingsManager />;
      case 'rooms':
        return <RoomsManager />;
      default:
        return (
          <div className="relative text-center">
          </div>
        );
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-[#F9FAFB] text-neutral-900'}`}>

      {/* Top Navigation Bar - Fixed */}
      <header className={`shrink-0 w-full h-12 md:h-14 px-4 md:px-8 flex items-center justify-between border-b z-50 backdrop-blur-md transition-all duration-500 ${theme === 'dark' ? 'bg-[#080808]/80 border-neutral-900' : 'bg-white/80 border-neutral-200'}`}>
        <div className="flex flex-col gap-1 overflow-hidden">
          <Link to="/" className="shrink-0 flex items-center">
            <Logo className="h-4 md:h-5" />
          </Link>
          
          <div className="iot-dots absolute inset-0 opacity-5 pointer-events-none" />

          {/* breadcrumb info - ultra compact below logo */}
          <div className="flex items-center gap-1.5 pl-0.5">
            <div className={`w-1 h-1 rounded-full bg-emerald-500`} />
            <p className="text-[7px] font-mono font-bold tracking-[0.2em] uppercase opacity-40 whitespace-nowrap">
              {page.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <div className="flex items-center gap-2 md:gap-4 scale-90 md:scale-100 origin-right">
            <ProfileDropdown />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 md:hidden flex flex-col gap-1 justify-center items-end"
            >
              <span className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'w-5 translate-y-1.5 -rotate-45' : 'w-5'}`} />
              <span className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-3'}`} />
              <span className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'w-5 -translate-y-1.5 rotate-45' : 'w-4'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR - Expandable on hover */}
        <aside className={`group hidden md:flex flex-col h-full border-r shrink-0 !z-40 transition-all duration-500 ease-in-out select-none whitespace-nowrap w-12 hover:w-64 ${theme === 'dark' ? 'bg-[#080808] border-neutral-900' : 'bg-white border-neutral-100'}`}>
          <nav className="flex-grow flex flex-col gap-2 p-2 pt-6">
            {navLinks.map(link => (
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
                <span className="ml-4 text-[10px] font-black uppercase tracking-widest transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                  {link.label}
                </span>

                {/* active indicator bar */}
                {page === link.id && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* <div className="p-4 border-t border-neutral-500/5 overflow-hidden">
            <div className="text-[7px] font-mono opacity-20 uppercase tracking-[0.2em] transition-opacity duration-300 opacity-0 group-hover:opacity-100">
               SYSTEM CORE_v2.0.4
            </div>
          </div> */}
        </aside>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className={`absolute top-0 right-0 h-full w-72 transition-transform duration-500 ease-out p-8 flex flex-col gap-8 shadow-2xl ${theme === 'dark' ? 'bg-[#0a0a0a] border-l border-neutral-900' : 'bg-white border-l border-neutral-200'} ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Navigation_Menu</p>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-mono opacity-50 hover:opacity-100">[CLOSE]</button>
            </div>

            <nav className="flex flex-col gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.id}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center gap-4 transition-all"
                >
                  <span className={`w-1 h-1 rounded-full bg-emerald-500 transition-all duration-300 ${page === link.id ? 'scale-150 opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  <span className={`text-2xl font-black tracking-tighter transition-all ${page === link.id ? 'text-emerald-500' : 'opacity-40 group-hover:opacity-100'}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-neutral-500/10">
              <p className="text-[8px] font-mono opacity-30 uppercase tracking-widest leading-relaxed">
                THINGZ_HUB OPERATING SYSTEM <br />
                VERSION 2.0.4_STABLE <br />
                ENCRYPTED CONNECTION : ACTIVE
              </p>
            </div>
          </aside>
        </div>
        {/* Main Content Area - Scrollable */}
        <main className="flex-grow relative overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="min-h-full px-4 md:px-8 lg:px-12 py-4 md:py-6 max-w-[1600px] mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

