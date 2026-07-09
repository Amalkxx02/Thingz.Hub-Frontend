import { useEffect, useRef } from 'react';

export function InteractiveDotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse strictly in raw JS memory (Bypasses React completely)
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Configuration
    const SPACING = 15;
    const RADIUS = 150;
    const MAX_SCALE = 4;
    const BASE_DOT_RADIUS = 0.5; // 1px radius = 2px wide dot

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.floor(width / SPACING);
      const rows = Math.floor(height / SPACING);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * SPACING + SPACING / 1
          const y = j * SPACING + SPACING / 1;

          const dist = Math.hypot(mouse.x - x, mouse.y - y);

          let currentRadius = BASE_DOT_RADIUS;
          let currentOpacity = 0.35;

          if (dist < RADIUS) {
            const factor = 1 - dist / RADIUS;
            currentRadius = BASE_DOT_RADIUS * (1 + factor * (MAX_SCALE - 1));
            currentOpacity = 0.35 + factor * 0.65;
          }
          // Rainbow hue calculated from coordinates and time
          const hue = ((x / width) * 360 + (y / height) * 180 + Date.now() * 0.05) % 360;

          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${currentOpacity})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none backdrop-blur-[2px]"
    />
  );
}