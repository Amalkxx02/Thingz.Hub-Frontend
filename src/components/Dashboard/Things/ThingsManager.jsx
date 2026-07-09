import React, { useState, useEffect } from "react";
import { SectionHeader } from "../SectionHeader";

const ThingsManager = () => {
  const [showForm, setShowForm] = useState(false);

    const [things, setThings] = useState(() => {
      const saved = localStorage.getItem("things");
      return saved ? JSON.parse(saved) : [];
    });
  
    const loadThings = async () => {
      try {
        // const thingsData = await apiThing.getThings();
        // setThings(thingsData);
        // localStorage.setItem("things", JSON.stringify(thingsData));
      } catch (error) {
        console.error("Failed to fetch user devices", error);
        setThings([])
      } finally {
      }
    };
    
    useEffect(() => {
      loadThings();
    }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="TELEMETRY_THING" count={things.length} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {things.length === 0 ? (
          <div className={`col-span-full h-64 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-neutral-800 rounded-[2rem]`}>
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

export default ThingsManager;
