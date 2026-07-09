import React, { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";

import ProfileDropdown from "../components/Dashboard/ProfileDropdown";

import DevicesManager from "../components/Dashboard/Devices/DevicesManager";
import DeviceDetails from "../components/Dashboard/Devices/DeviceDetails";
import ThingsManager from "../components/Dashboard/Things/ThingsManager";
import HomeManager from "../components/Dashboard/HomeManager";
import { VectorBackground } from "../components/styles/VectorBackground";

const Dashboard = ({ page = "" }) => {
  // React.useEffect(() => {
  //   const fetchActive = async () => {
  //     try {
  //       const things = await thingService.getThingzWithMeta();
  //       const ids = [...new Set(things.map((t) => t.device_id || t.deviceId))];
  //       setActiveDeviceIds(ids);
  //     } catch (err) {
  //       console.error("Topology_Sync_Fault:", err);
  //     }
  //   };
  //   fetchActive();
  // }, [page]); // Re-sync when switching pages or on mount

  // const cachedDevices = JSON.parse(
  //   localStorage.getItem("hub_node_inventory") || "[]",
  // ).filter((d) => activeDeviceIds.includes(d.id));
  // const cachedThings = JSON.parse(
  //   localStorage.getItem("hub_meta_inventory") || "[]",
  // );

  const navLinks = [
    { label: "Devices", path: "/devices", id: "devices" },
    { label: "Things", path: "/things", id: "things" },
  ];

  const getPageHeader = () => {
    switch (page) {
      case "":
        return {
          title: "Home_Center",
          subtitle: "LIVE_MESH_OVERVIEW",
          count: null,
        };
      case "devices":
        return {
          title: "Device_Inventory",
          subtitle: "TOTAL_NODES_ACTIVE",
          // count: cachedDevices.length,
        };
      case "things":
        return {
          title: "Thing_Repository",
          subtitle: "TOTAL_VIRTUAL_OBJECTS",
          // count: cachedThings.length,
        };
      case "device":
        return {
          title: "Device_Details",
          subtitle: "NODE_INSPECTION",
        };
      default:
        return {
          title: "Hub_Dashboard",
          subtitle: "SYSTEM_STATUS_STABLE",
          count: null,
        };
    }
  };

  const header = getPageHeader();

  const renderContent = () => {
    switch (page) {
      case "":
        return <HomeManager />;

      case "devices":
        return <DevicesManager />;
      case "device":
        return <DeviceDetails />;

      case "things":
        return <ThingsManager />;

      default:
        return <HomeManager />;
    }
  };

  return (
    <div
      className={`relative h-[100dvh] w-full flex flex-col overflow-hidden bg-[#0B0E14] text-white`}
    >
      <VectorBackground />

      <header
        className={`relative z-30 shrink-0 flex items-center justify-between py-2 px-2 border-b border-emerald-500/25 bg-[#0B0E14]/75 backdrop-blur-[5px]`}
      >
        {/*  backdrop-blur-[5px] */}
        <div>
          <Link to="/">
            <h2 className="text-xl font-bold">
              <Logo />
            </h2>
          </Link>
        </div>
        <div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-20 ">
        <aside
          className={`hidden md:flex w-15 hover:w-30 transition-all duration-200 ease-in-out flex-col items-center py-2 group overflow-hidden border-r border-emerald-500/25 bg-[#0B0E14]/75 backdrop-blur-[2px]`}
        >
          <nav className="flex flex-col gap-2 mt-auto w-full px-2">
            <p className="opacity-0 group-hover:opacity-50 text-xs font-mono mb-2 text-center transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              NAVIGATION
            </p>

            {navLinks.map((link) => {
              const isActive = page === link.id;

              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`h-11 rounded-xl font-bold text-sm transition-all duration-300 flex items-center overflow-hidden whitespace-nowrap ${
                    isActive
                      ? `bg-neutral-800 text-white`
                      : "hover:bg-neutral-500/10 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="min-w-[2rem] flex items-center justify-center text-lg">
                    {link.label.charAt(0)}
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-1 md:p-2">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden relative z-30 shrink-0 flex items-center justify-around w-full border-t border-emerald-500/25 bg-[#020618]/85 backdrop-blur-md p-2">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-300 ${
            page === "" ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="text-xl font-bold">H</span>
          <span className="text-[10px] font-mono mt-0.5">Home</span>
        </Link>
        {navLinks.map((link) => {
          const isActive = page === link.id;
          return (
            <Link
              key={link.id}
              to={link.path}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-300 ${
                isActive ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-xl font-bold">{link.label.charAt(0)}</span>
              <span className="text-[10px] font-mono mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Dashboard;
