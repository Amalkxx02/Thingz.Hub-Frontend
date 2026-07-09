import React, { useState, useEffect } from "react";

const ThingsManager = () => {
  const [things, setThings] = useState([]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-neutral-800 pb-4">

        <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all">
          + Register Thing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {things.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-neutral-800 rounded-[2rem]">
            <div className="text-4xl mb-4">◈</div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em]">
              No_Things_Found
            </p>
          </div>
        ) : (
          <p>We will map through your things here!</p>
        )}
      </div>
    </div>
  );
};

export default ThingsManager