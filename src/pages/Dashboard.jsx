import React, { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";
import { useAuth, useTheme } from "../context";
import { useThemeStyles } from "../hooks/useThemeStyles";

import ProfileDropdown from "../components/Dashboard/ProfileDropdown";

import DevicesManager from "../components/Dashboard/DevicesManager";
import ThingsManager from "../components/Dashboard/ThingsManager";
import HomeManager from "../components/Dashboard/HomeManager";

const Dashboard = ({ page = "" }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const { bgColor, textColor, inputBg, inputBorder, buttonBg } =
    useThemeStyles();

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
      case "things":
        return <ThingsManager />;
      default:
        return <HomeManager />;
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex overflow-hidden ${bgColor} ${textColor}`}
    >
      <aside className="hidden md:flex w-48 flex-col border-r border-neutral-800 p-6">
        <div className="mb-8 hover:opacity-80 inline-block">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <p className="opacity-50 text-xs font-mono mb-2">NAVIGATION</p>

          {navLinks.map((link) => {
            const isActive = page === link.id;

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "hover:bg-neutral-500/10 opacity-60 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen relative">
        <header className="h-20 flex items-center justify-between px-8 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold">{header.title}</h2>
            <p className="text-xs opacity-50 font-mono">{header.subtitle} 0</p>
          </div>
          <div>
            <ProfileDropdown />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
