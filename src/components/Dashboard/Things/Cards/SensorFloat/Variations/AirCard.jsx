import React, { useMemo } from 'react';

const AirCard = ({ value, unit, label, id }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      startX: `${Math.random() * 100}%`,
      endX: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 5}s`
    }));
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="air-drift">
        {particles.map(p => (
          <div 
            key={p.id} 
            className="air-particle"
            style={{ 
              '--start-x': p.startX, 
              '--end-x': p.endX, 
              '--duration': p.duration,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center">
         <span className="text-6xl font-black tracking-tighter tabular-nums text-hub-accent/80">
           {value ?? '---'}
         </span>
         <span className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] mt-2">
           {unit || 'AQI'}
         </span>
      </div>
    </div>
  );
};

export default AirCard;
