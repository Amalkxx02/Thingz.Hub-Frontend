import React, { useMemo } from 'react';

export const VectorBackground = () => {
  const lines = useMemo(() => {
    // Generate deterministic random lines so they don't jump around on re-renders
    return Array.from({ length: 80 }).map((_, i) => {
      const type = Math.random();
      const startX = Math.random() * 1000;
      const startY = Math.random() * 1000;
      const length = Math.random() * 300 + 50; 
      
      let endX, endY;
      if (type < 0.25) {
        // Horizontal
        endX = startX + length;
        endY = startY;
      } else if (type < 0.5) {
        // Vertical
        endX = startX;
        endY = startY + length;
      } else if (type < 0.75) {
        // Diagonal top-left to bottom-right
        endX = startX + length;
        endY = startY + length;
      } else {
        // Diagonal bottom-left to top-right
        endX = startX + length;
        endY = startY - length;
      }

      const width = Math.random() * 2 + 0.5; // Thinner, sharper lines
      const opacity = Math.random() * 0.4 + 0.1; // More visible to match the monitor image

      return {
        id: i,
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        width,
        opacity
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* The bronze/copper color from the monitor screenshot */}
      <svg 
        className="w-full h-full text-neutral-200" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="xMidYMid slice"
      >
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth={line.width}
            opacity={line.opacity}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
};
