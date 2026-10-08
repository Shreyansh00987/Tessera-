'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CurveSegment } from '@/types/strategy';

interface BondingSurface3DProps {
  segments: CurveSegment[];
  quoteReserve: number;
  migrationThreshold: number;
  currentPrice: number;
  quoteSymbol: string;
  accentColor: string;
  isGraduated: boolean;
}

interface Point3D {
  x: number; // Quote Reserve [0 -> 1]
  y: number; // Price [0 -> 1]
  z: number; // Liquidity Depth [0 -> 1]
}

export const BondingSurface3D: React.FC<BondingSurface3DProps> = ({
  segments,
  quoteReserve,
  migrationThreshold,
  currentPrice,
  quoteSymbol,
  accentColor,
  isGraduated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Camera Angles
  const [rotX, setRotX] = useState<number>(0.38); // pitch ~22 deg
  const [rotY, setRotY] = useState<number>(-0.45); // yaw ~-26 deg
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Mouse drag orbit controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotY((prev) => prev + dx * 0.008);
    setRotX((prev) => Math.max(0.1, Math.min(1.1, prev + dy * 0.008)));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particleOffset = 0;

    // HiDPI Scaling
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();

    // 3D Projection Engine
    const project = (p: Point3D, w: number, h: number, currentRotX: number, currentRotY: number) => {
      // Center origin
      const cx = (p.x - 0.5) * 360;
      const cy = -(p.y - 0.5) * 220; // inverted Y
      const cz = (p.z - 0.5) * 200;

      // Rotate around Y-axis (yaw)
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const x1 = cx * cosY - cz * sinY;
      const z1 = cx * sinY + cz * cosY;

      // Rotate around X-axis (pitch)
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const y2 = cy * cosX - z1 * sinX;
      const z2 = cy * sinX + z1 * cosX;

      // Perspective projection
      const cameraDist = 650;
      const fov = cameraDist / (cameraDist + z2);

      return {
        x: w / 2 + x1 * fov,
        y: h / 2 + y2 * fov + 20,
        z: z2,
        fov,
      };
    };

    // Main 3D Render Loop
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Auto subtle floating oscillation
      if (autoRotate) {
        particleOffset += 0.003;
      } else {
        particleOffset += 0.005;
      }
      const currentRotX = rotX;
      const currentRotY = autoRotate ? rotY + Math.sin(particleOffset * 0.8) * 0.08 : rotY;

      // 1. Draw 3D Ground Grid (Quote Reserve vs Liquidity Depth)
      ctx.lineWidth = 1;
      const gridSteps = 8;
      for (let i = 0; i <= gridSteps; i++) {
        const u = i / gridSteps;

        // Lines along X (Quote axis)
        const pA = project({ x: 0, y: 0, z: u }, w, h, currentRotX, currentRotY);
        const pB = project({ x: 1, y: 0, z: u }, w, h, currentRotX, currentRotY);
        ctx.strokeStyle = i === 0 || i === gridSteps ? 'rgba(255, 72, 0, 0.25)' : 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();

        // Lines along Z (Depth axis)
        const pC = project({ x: u, y: 0, z: 0 }, w, h, currentRotX, currentRotY);
        const pD = project({ x: u, y: 0, z: 1 }, w, h, currentRotX, currentRotY);
        ctx.strokeStyle = u === 1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.moveTo(pC.x, pC.y);
        ctx.lineTo(pD.x, pD.y);
        ctx.stroke();
      }

      // 2. Generate 3D Curve Surface Ribbon
      const minP = segments[0].pLower;
      const maxP = segments[segments.length - 1].pUpper;
      const steps = 40;

      const ribbonFront: { x: number; y: number }[] = [];
      const ribbonBack: { x: number; y: number }[] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps; // [0 -> 1] quote
        // Approximate price progression through segments
        const segIdx = Math.min(segments.length - 1, Math.floor(u * segments.length));
        const seg = segments[segIdx];
        const segProgress = (u * segments.length) - segIdx;
        const price = seg.pLower + (seg.pUpper - seg.pLower) * Math.pow(segProgress, 0.85);

        const normY = (price - minP) / (maxP - minP || 1);
        const depthNorm = Math.min(1, Math.max(0.2, seg.liquidityWeight / 25));

        // Front edge of ribbon (Z = 0.35)
        const frontPt = project({ x: u, y: normY, z: 0.5 - depthNorm * 0.3 }, w, h, currentRotX, currentRotY);
        // Back edge of ribbon (Z = 0.65)
        const backPt = project({ x: u, y: normY, z: 0.5 + depthNorm * 0.3 }, w, h, currentRotX, currentRotY);

        ribbonFront.push(frontPt);
        ribbonBack.push(backPt);
      }

      // Draw Ribbon Polygon (3D Surface)
      ctx.beginPath();
      ctx.moveTo(ribbonFront[0].x, ribbonFront[0].y);
      for (let i = 1; i < ribbonFront.length; i++) {
        ctx.lineTo(ribbonFront[i].x, ribbonFront[i].y);
      }
      for (let i = ribbonBack.length - 1; i >= 0; i--) {
        ctx.lineTo(ribbonBack[i].x, ribbonBack[i].y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(
        ribbonFront[0].x,
        ribbonFront[0].y,
        ribbonFront[ribbonFront.length - 1].x,
        ribbonFront[ribbonFront.length - 1].y
      );
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      grad.addColorStop(0.5, `${accentColor}70`);
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.55)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Ribbon Wireframe Edges
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ribbonFront[0].x, ribbonFront[0].y);
      for (let i = 1; i < ribbonFront.length; i++) {
        ctx.lineTo(ribbonFront[i].x, ribbonFront[i].y);
      }
      ctx.stroke();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ribbonBack[0].x, ribbonBack[0].y);
      for (let i = 1; i < ribbonBack.length; i++) {
        ctx.lineTo(ribbonBack[i].x, ribbonBack[i].y);
      }
      ctx.stroke();

      // 3. Draw 3D Graduation Beacon Pillar at Threshold (X=1)
      const gradBase = project({ x: 1, y: 0, z: 0.5 }, w, h, currentRotX, currentRotY);
      const gradTop = project({ x: 1, y: 1.15, z: 0.5 }, w, h, currentRotX, currentRotY);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(gradBase.x, gradBase.y);
      ctx.lineTo(gradTop.x, gradTop.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Beacon Light Flare
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath();
      ctx.arc(gradTop.x, gradTop.y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`DAMM v2 (${migrationThreshold} ${quoteSymbol})`, gradTop.x - 30, gradTop.y - 12);

      // 4. Draw Active Swap Point Marker (Floating Sphere with Ground Shadow)
      const normQuote = Math.min(1, Math.max(0, quoteReserve / (migrationThreshold || 1)));
      const normPrice = (currentPrice - minP) / (maxP - minP || 1);
      const activePt = project({ x: normQuote, y: normPrice, z: 0.5 }, w, h, currentRotX, currentRotY);
      const groundPt = project({ x: normQuote, y: 0, z: 0.5 }, w, h, currentRotX, currentRotY);

      // Vertical connecting line to 3D floor
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(activePt.x, activePt.y);
      ctx.lineTo(groundPt.x, groundPt.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ground shadow ring
      ctx.strokeStyle = 'rgba(255, 72, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(groundPt.x, groundPt.y, 8, 4, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Glowing Sphere
      const sphereRadius = 7 * activePt.fov;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, sphereRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Pulsing outer aura
      ctx.fillStyle = `${accentColor}35`;
      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, sphereRadius + 5 + Math.sin(particleOffset * 8) * 3, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw Animated 3D Trading Particles Flowing Up the Curve
      for (let p = 0; p < 4; p++) {
        const pProgress = ((particleOffset * 0.4 + p * 0.25) % 1);
        const pIdx = Math.min(steps - 1, Math.floor(pProgress * steps));
        const pt = ribbonFront[pIdx];
        if (pt) {
          ctx.fillStyle = p % 2 === 0 ? '#00f0ff' : '#ff4800';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', updateSize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, [segments, quoteReserve, migrationThreshold, currentPrice, quoteSymbol, accentColor, rotX, rotY, autoRotate]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* 3D Viewport Controls & Hints */}
      <div className="absolute top-2 right-2 flex items-center gap-2 text-[10px] font-mono pointer-events-auto">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
            autoRotate
              ? 'bg-[#ff4800]/20 text-[#ff4800] border-[#ff4800]/40 font-bold'
              : 'bg-[#111624] text-[#828ea8] border-[#1d273e]'
          }`}
        >
          {autoRotate ? 'Orbit: ON' : 'Orbit: OFF'}
        </button>
        <div className="hidden sm:inline px-2 py-0.5 rounded bg-[#0b0e17]/80 text-[#64748b] border border-[#1b2236]">
          Click &amp; Drag to Rotate 3D
        </div>
      </div>

      {/* Axis Hologram Labels */}
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#64748b] flex items-center gap-3 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-[#00f0ff]" /> X: Quote Reserve
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-[#ff4800]" /> Y: Spot Price
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-[#10b981]" /> Z: Liquidity Depth (L)
        </span>
      </div>
    </div>
  );
};
