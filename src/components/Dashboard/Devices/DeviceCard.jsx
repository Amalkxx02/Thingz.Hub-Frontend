import React from "react";
import { Link } from "react-router-dom";

export const DeviceCard = ({ device }) => {
  // 0 = Hub (Handles interconnected nodes)
  // 1 = Node (Standalone sensors)
  // We add 2 for Edge Router as per the image
  const typeMap = {
    0: {
      label: "Gateway Hub",
      badgeText: "text-emerald-400",
      badgeBorder: "border-emerald-900",
    },
    1: {
      label: "Sensor Node",
      badgeText: "text-slate-400",
      badgeBorder: "border-slate-700",
    },
    2: {
      label: "Edge Router",
      badgeText: "text-rose-300",
      badgeBorder: "border-rose-900/70",
    },
  };

  // Determine type config or default
  // Default to 1 (Sensor Node) or 2 if revoked for visual variety if type is missing, 
  // but normally we'd rely on device.type
  let typeConfig = typeMap[device.type];
  if (!typeConfig) {
    if (device.revoked) typeConfig = typeMap[2];
    else typeConfig = typeMap[1];
  }

  const getStatusInfo = () => {
    if (device.revoked) {
      return {
        dot: "bg-rose-400",
        cardBorder: "border-rose-900/50",
        nameText: "text-rose-300",
      };
    }
    if (device.is_active) {
      return {
        dot: "bg-emerald-500",
        cardBorder: "border-slate-800",
        nameText: "text-gray-100",
      };
    }
    return {
      dot: "bg-slate-400",
      cardBorder: "border-slate-800",
      nameText: "text-gray-100",
    };
  };

  const status = getStatusInfo();

  return (
    <Link
      to={`/device/${device.id}`}
      className={`flex flex-col p-5 bg-[#0B0E14]/90 border ${status.cardBorder} rounded shadow-sm hover:bg-[#0b101e] transition-color backdrop-blur-[5px]`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          <h4 className={`font-bold text-[17px] ${status.nameText} tracking-wide truncate`} title={device.name}>
            {device.name}
          </h4>
        </div>

        <div className={`px-2 py-0.5 text-xs border ${typeConfig.badgeBorder} ${typeConfig.badgeText}`}>
          [{typeConfig.label}]
        </div>
      </div>

      <div className="h-px bg-slate-800/80 mb-5 w-full"></div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 mb-8">
        {device.revoked ? (
          <>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-400 tracking-wide">STATUS</span>
              <span className="text-rose-300 tracking-wide">REVOKED</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-400 tracking-wide">REASON</span>
              <span className="text-rose-300 tracking-wide">AUTH_FAILURE</span>
            </div>
          </>
        ) : typeConfig.label === "Gateway Hub" ? (
          <>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-400 tracking-wide">UPTIME</span>
              <span className="text-gray-200 tracking-wide">242:12:08</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-400 tracking-wide">SIGNAL</span>
              <span className="text-gray-200 tracking-wide">-42 dBm</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-400 tracking-wide">LAST_SEEN</span>
              <span className="text-gray-200 tracking-wide">12m ago</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-[11px] text-slate-600 truncate mt-auto">
        ID: {device.id}
      </div>
    </Link>
  );
};