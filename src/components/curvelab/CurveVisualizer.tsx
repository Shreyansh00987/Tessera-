'use client';

import React, { useState, useMemo } from 'react';
import { CalculatedSegment } from '@/lib/meteora/dbcMath';
import { Layers, ShieldCheck } from 'lucide-react';

interface CurveVisualizerProps {
  segments: CalculatedSegment[];
  currentQuoteReserve: number;
  migrationQuoteThreshold: number;
  quoteSymbol: string;
}

export const CurveVisualizer: React.FC<CurveVisualizerProps> = ({
  segments,
  currentQuoteReserve,
  migrationQuoteThreshold,
  quoteSymbol,
}) => {
  const [hoveredData, setHoveredData] = useState<{
    x: number;
    y: number;
    quote: number;
    price: number;
    segmentLabel: string;
  } | null>(null);

  const svgWidth = 620;
  const svgHeight = 280;
  const padding = { top: 25, right: 35, bottom: 40, left: 65 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const minPrice = segments[0]?.pLower || 0.00001;
  const maxPrice = segments[segments.length - 1]?.pUpper || 0.00015;

  // Sampling points along the curve
  const points = useMemo(() => {
    if (segments.length === 0) return [];
    const pts: { x: number; y: number; quote: number; price: number; segment: CalculatedSegment }[] = [];
    const totalSteps = 100;

    for (let i = 0; i <= totalSteps; i++) {
      const q = (i / totalSteps) * migrationQuoteThreshold;
      
      // Determine segment
      let currentSeg = segments[0];
      let segStartQ = 0;
      for (const seg of segments) {
        if (q <= seg.cumulativeQuoteThreshold || seg === segments[segments.length - 1]) {
          currentSeg = seg;
          break;
        }
        segStartQ = seg.cumulativeQuoteThreshold;
      }

      const deltaQ = Math.max(0, q - segStartQ);
      const currentSqrtP = currentSeg.sqrtPLower + (deltaQ / (currentSeg.virtualLiquidity || 1));
      const price = currentSqrtP * currentSqrtP;

      const x = padding.left + (q / (migrationQuoteThreshold || 1)) * plotWidth;
      const normY = (price - minPrice) / (maxPrice - minPrice || 1);
      const y = padding.top + plotHeight - normY * plotHeight;

      pts.push({ x, y, quote: q, price, segment: currentSeg });
    }
    return pts;
  }, [segments, migrationQuoteThreshold, minPrice, maxPrice, padding.left, padding.top, plotWidth, plotHeight]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    return `${pathD} L ${last.x} ${padding.top + plotHeight} L ${first.x} ${padding.top + plotHeight} Z`;
  }, [pathD, points, padding.top, plotHeight]);

  // Current scrubber position
  const currentPos = useMemo(() => {
    const q = Math.min(migrationQuoteThreshold, Math.max(0, currentQuoteReserve));
    const ratio = q / (migrationQuoteThreshold || 1);
    const x = padding.left + ratio * plotWidth;

    // Estimate price
    let seg = segments[0];
    let segStart = 0;
    for (const s of segments) {
      if (q <= s.cumulativeQuoteThreshold || s === segments[segments.length - 1]) {
        seg = s;
        break;
      }
      segStart = s.cumulativeQuoteThreshold;
    }
    const currentSqrtP = seg.sqrtPLower + ((q - segStart) / (seg.virtualLiquidity || 1));
    const price = currentSqrtP * currentSqrtP;
    const normY = (price - minPrice) / (maxPrice - minPrice || 1);
    const y = padding.top + plotHeight - normY * plotHeight;

    return { x, y, price, quote: q };
  }, [currentQuoteReserve, migrationQuoteThreshold, segments, minPrice, maxPrice, padding.left, padding.top, plotWidth, plotHeight]);

  // Handle mouse move for hover crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgMouseX = (mouseX / rect.width) * svgWidth;

    if (svgMouseX < padding.left || svgMouseX > padding.left + plotWidth) {
      setHoveredData(null);
      return;
    }

    const ratio = (svgMouseX - padding.left) / plotWidth;
    const q = ratio * migrationQuoteThreshold;

    // Find closest point
    let closest = points[0];
    let minDist = Infinity;
    for (const pt of points) {
      const dist = Math.abs(pt.quote - q);
      if (dist < minDist) {
        minDist = dist;
        closest = pt;
      }
    }

    if (closest) {
      setHoveredData({
        x: closest.x,
        y: closest.y,
        quote: closest.quote,
        price: closest.price,
        segmentLabel: closest.segment.label,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#0a0c12] border border-[#1f232f] rounded-xl p-4 font-mono relative overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#181b24] text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5c16]"></span>
          <span className="text-white font-bold">BONDING CURVE PROFILE</span>
          <span className="text-[10px] text-[#7f889b]">({segments.length} Meteora Segments)</span>
        </div>
        <div className="text-[11px] text-[#00d2c4] font-bold">
          Current: {currentPos.price.toFixed(7)} {quoteSymbol}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[2.2/1] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredData(null)}
        >
          <defs>
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5c16" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff5c16" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00d2c4" />
              <stop offset="60%" stopColor="#ff5c16" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1={padding.left}
              y1={padding.top + plotHeight * pct}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight * pct}
              stroke="#161823"
              strokeDasharray="3 3"
            />
          ))}

          {/* Segment boundary vertical dashed lines */}
          {segments.map((seg, idx) => {
            if (idx === segments.length - 1) return null;
            const segRatio = seg.cumulativeQuoteThreshold / (migrationQuoteThreshold || 1);
            const x = padding.left + segRatio * plotWidth;
            return (
              <g key={seg.segmentIndex}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke="#232738"
                  strokeDasharray="2 2"
                />
                <text
                  x={x + 3}
                  y={padding.top + 12}
                  fill="#586175"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  SEG {idx + 1}
                </text>
              </g>
            );
          })}

          {/* Migration Threshold Boundary */}
          <line
            x1={padding.left + plotWidth}
            y1={padding.top}
            x2={padding.left + plotWidth}
            y2={padding.top + plotHeight}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={padding.left + plotWidth - 5}
            y={padding.top + 12}
            textAnchor="end"
            fill="#10b981"
            fontSize="8"
            fontFamily="monospace"
          >
            DAMM v2 GRADUATION ({migrationQuoteThreshold} {quoteSymbol})
          </text>

          {/* Shaded Area */}
          <path d={areaD} fill="url(#curveFill)" />

          {/* Bonding curve line */}
          <path d={pathD} fill="none" stroke="url(#curveStroke)" strokeWidth="2.5" />

          {/* Current position marker */}
          <circle
            cx={currentPos.x}
            cy={currentPos.y}
            r="5"
            fill="#ff5c16"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <line
            x1={currentPos.x}
            y1={currentPos.y}
            x2={currentPos.x}
            y2={padding.top + plotHeight}
            stroke="#ff5c16"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Hover Crosshair */}
          {hoveredData && (
            <g>
              <line
                x1={hoveredData.x}
                y1={padding.top}
                x2={hoveredData.x}
                y2={padding.top + plotHeight}
                stroke="#00d2c4"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredData.x}
                cy={hoveredData.y}
                r="4"
                fill="#00d2c4"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* X Axis Labels */}
          <text x={padding.left} y={padding.top + plotHeight + 16} fill="#7f889b" fontSize="9">
            0
          </text>
          <text
            x={padding.left + plotWidth / 2}
            y={padding.top + plotHeight + 16}
            textAnchor="middle"
            fill="#7f889b"
            fontSize="9"
          >
            QUOTE ACCUMULATED ({quoteSymbol})
          </text>
          <text x={padding.left + plotWidth} y={padding.top + plotHeight + 16} textAnchor="end" fill="#7f889b" fontSize="9">
            {migrationQuoteThreshold} {quoteSymbol}
          </text>

          {/* Y Axis Labels */}
          <text x={padding.left - 6} y={padding.top + plotHeight} textAnchor="end" fill="#7f889b" fontSize="8">
            {minPrice.toFixed(6)}
          </text>
          <text x={padding.left - 6} y={padding.top + 10} textAnchor="end" fill="#7f889b" fontSize="8">
            {maxPrice.toFixed(6)}
          </text>
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredData && (
          <div
            className="absolute z-20 pointer-events-none bg-[#11141e]/95 border border-[#2d3345] rounded-lg p-2 text-[10px] text-white shadow-xl"
            style={{
              left: `${(hoveredData.x / svgWidth) * 100}%`,
              top: `${(hoveredData.y / svgHeight) * 100}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="text-[#ff5c16] font-bold">{hoveredData.segmentLabel}</div>
            <div>Price: {hoveredData.price.toFixed(7)} {quoteSymbol}</div>
            <div>Reserve: {hoveredData.quote.toFixed(2)} {quoteSymbol}</div>
          </div>
        )}
      </div>

      {/* Segment Legend */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#181b24] text-[10px] text-[#a5b0c4]">
        {segments.map((s, idx) => (
          <div key={s.segmentIndex} className="flex items-center space-x-1 bg-[#12141c] px-2 py-0.5 rounded border border-[#1f232f]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                s.type === 'SHELF' ? 'bg-[#00d2c4]' : s.type === 'RISER' ? 'bg-[#ff5c16]' : 'bg-[#10b981]'
              }`}
            ></span>
            <span className="font-bold">{s.label}:</span>
            <span className="text-[#7f889b]">L={Math.round(s.virtualLiquidity / 1_000_000)}M</span>
          </div>
        ))}
      </div>
    </div>
  );
};
