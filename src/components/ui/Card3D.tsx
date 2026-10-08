'use client';

import React, { useRef, useState, useCallback } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (default 10)
  glareOpacity?: number; // max glare opacity (default 0.15)
  glowColor?: string; // e.g. "rgba(255, 72, 0, 0.4)"
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glareOpacity = 0.2,
  glowColor = 'rgba(255, 72, 0, 0.3)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      // Invert Y for natural tilt
      setRotateX(normY * -maxTilt);
      setRotateY(normX * maxTilt);

      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        active: true,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, active: false }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d will-change-transform ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Specular glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-30 transition-opacity duration-300"
        style={{
          opacity: glarePos.active ? glareOpacity : 0,
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.25), transparent 80%)`,
        }}
      />

      {/* Dynamic 3D ambient shadow */}
      <div
        className="absolute -inset-1 rounded-[inherit] pointer-events-none -z-10 transition-opacity duration-300 blur-xl"
        style={{
          opacity: glarePos.active ? 0.8 : 0.2,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 70%)`,
        }}
      />

      {children}
    </div>
  );
};
