import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <span className="tracking-tighter uppercase text-emerald-500">
        Thingz.Hub
      </span>
    </div>
  );
};

export default Logo;
