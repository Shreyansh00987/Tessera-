'use client';

import React, { useState, useMemo } from 'react';
import { 
  computeSegmentsWithCapacities, 
  getCurveStateAtQuoteReserve, 
  simulateSwapExactInQuote 
} from '@/lib/meteora/dbcMath';
import { CurveSegment, FeeSchedule } from '@/types/strategy';
import { Sparkles, Sliders, ArrowUpRight, ShieldCheck, Zap, TrendingUp, Layers, Coins, Cpu, ArrowRight, Box, Compass } from 'lucide-react';
import Link from 'next/link';
import { BondingSurface3D } from './BondingSurface3D';

export type CurvePresetType = 'STEP_LADDER' | 'FLAT_CURVE' | 'EXPONENTIAL_CURVE' | 'LONG_CURVE';

interface PresetConfig {
  id: CurvePresetType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  assetClass: string;
  quoteSymbol: string;
  migrationThreshold: number;
  startingFeeBps: number;
  endingFeeBps: number;
  feeMode: 'FEE_SCHEDULER_EXPONENTIAL' | 'FIXED' | 'FEE_SCHEDULER_LINEAR';
  accentColor: string;
  segments: CurveSegment[];
}

const PRESETS: Record<CurvePresetType, PresetConfig> = {
  STEP_LADDER: {
    id: 'STEP_LADDER',
    title: 'Conviction Step Ladder',
    badge: 'FLAGSHIP QUANT',
    tagline: 'Alternating high-L accumulation shelves and velocity risers',
    description: 'Tessera’s highest-ranked quantitative architecture. Prevents sniper dumps by absorbing early flow in wide shelves, followed by rewarding sustained conviction through structured breakout risers.',
    assetClass: 'UTILITY / MEME',
    quoteSymbol: 'SOL',
    migrationThreshold: 10,
    startingFeeBps: 800,
    endingFeeBps: 100,
    feeMode: 'FEE_SCHEDULER_EXPONENTIAL',
    accentColor: '#ff4800',
    segments: [
      { segmentIndex: 0, label: 'Floor Accumulation Shelf', type: 'SHELF', pLower: 0.00001, pUpper: 0.000022, liquidityWeight: 14 },
      { segmentIndex: 1, label: 'Velocity Riser 1', type: 'RISER', pLower: 0.000022, pUpper: 0.000045, liquidityWeight: 2.8 },
      { segmentIndex: 2, label: 'Consolidation Shelf', type: 'SHELF', pLower: 0.000045, pUpper: 0.000075, liquidityWeight: 9 },
      { segmentIndex: 3, label: 'Graduation Riser 2', type: 'RISER', pLower: 0.000075, pUpper: 0.00013, liquidityWeight: 3.2 },
    ],
  },
  FLAT_CURVE: {
    id: 'FLAT_CURVE',
    title: 'Steady-State Flat Curve',
    badge: 'RWA & CREDIT',
    tagline: 'Deep uniform liquidity depth with minimal slippage',
    description: 'Designed for tokenized real-world assets (US Treasuries, private credit, commercial paper). Single deep price corridor providing institutional order execution and direct 25 bps DAMM v2 migration.',
    assetClass: 'RWA / YIELD',
    quoteSymbol: 'USDC',
    migrationThreshold: 750,
    startingFeeBps: 25,
    endingFeeBps: 25,
    feeMode: 'FIXED',
    accentColor: '#00f0ff',
    segments: [
      { segmentIndex: 0, label: 'Institutional Parity Depth', type: 'SHELF', pLower: 0.98, pUpper: 1.02, liquidityWeight: 35 },
    ],
  },
  EXPONENTIAL_CURVE: {
    id: 'EXPONENTIAL_CURVE',
    title: 'Exponential Anti-Snipe Surge',
    badge: 'HIGH VOLATILITY',
    tagline: 'Parabolic steepness with aggressive early MEV penalties',
    description: 'Imposes severe exponential decay trading fees (900 bps -> 80 bps) in the initial 180s. The curve steepens parabolically as reserve fills, punishing inorganic multi-slot snipers and protecting organic retail.',
    assetClass: 'MEME / VIRAL',
    quoteSymbol: 'SOL',
    migrationThreshold: 10,
    startingFeeBps: 900,
    endingFeeBps: 80,
    feeMode: 'FEE_SCHEDULER_EXPONENTIAL',
    accentColor: '#ff2d55',
    segments: [
      { segmentIndex: 0, label: 'Anti-Snipe Defense Trench', type: 'SHELF', pLower: 0.000008, pUpper: 0.000016, liquidityWeight: 16 },
      { segmentIndex: 1, label: 'Parabolic Velocity Ramp', type: 'RISER', pLower: 0.000016, pUpper: 0.000065, liquidityWeight: 4.5 },
      { segmentIndex: 2, label: 'Graduation Squeeze Sprint', type: 'RISER', pLower: 0.000065, pUpper: 0.00016, liquidityWeight: 2.2 },
    ],
  },
  LONG_CURVE: {
    id: 'LONG_CURVE',
    title: 'xStocks Long Curve',
    badge: 'STOCKLANA / RFQ',
    tagline: 'Extended price discovery runway for thinly traded tokenized equities',
    description: 'Built for Stocklana, Backpack Onchain, and Ondo RFQ stock catalogs ($xTSLA, $xNVDA). Prevents order book freeze by providing continuous bonding curve depth across an orderly valuation band.',
    assetClass: 'TOKENIZED STOCKS',
    quoteSymbol: 'USDC',
    migrationThreshold: 750,
    startingFeeBps: 30,
    endingFeeBps: 30,
    feeMode: 'FIXED',
    accentColor: '#a855f7',
    segments: [
      { segmentIndex: 0, label: 'xStocks Valuation Anchor', type: 'SHELF', pLower: 0.45, pUpper: 0.70, liquidityWeight: 22 },
      { segmentIndex: 1, label: 'Orderly Discovery Ramp', type: 'STANDARD', pLower: 0.70, pUpper: 1.25, liquidityWeight: 14 },
      { segmentIndex: 2, label: 'Pre-Listing Liquidity Cushion', type: 'SHELF', pLower: 1.25, pUpper: 1.95, liquidityWeight: 18 },
    ],
  },
};

export const InteractiveHeroCurve: React.FC = () => {
  const [activePreset, setActivePreset] = useState<CurvePresetType>('STEP_LADDER');
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const currentConfig = PRESETS[activePreset];

  // Dynamic buy slider
  const [testBuyQuote, setTestBuyQuote] = useState<number>(() => {
    return activePreset === 'FLAT_CURVE' || activePreset === 'LONG_CURVE' ? 150 : 2.5;
  });

  const handleSelectPreset = (key: CurvePresetType) => {
    setActivePreset(key);
    const cfg = PRESETS[key];
    setTestBuyQuote(cfg.quoteSymbol === 'USDC' ? 150 : 2.5);
  };

  const feeSchedule = useMemo<FeeSchedule>(() => {
    return {
      baseFeeMode: currentConfig.feeMode,
      startingFeeBps: currentConfig.startingFeeBps,
      endingFeeBps: currentConfig.endingFeeBps,
      totalDurationSeconds: 180,
      numberOfPeriods: 30,
      dynamicFeeEnabled: true,
      creatorTradingFeePercentage: 40,
      partnerTradingFeePercentage: 60,
      poolCreationFeeSol: 0.05,
    };
  }, [currentConfig]);

  // Compute curve capacities with exact DBC formulas
  const calculatedSegments = useMemo(() => {
    return computeSegmentsWithCapacities(currentConfig.segments, 1_000_000_000);
  }, [currentConfig.segments]);

  // Simulate swap at current buy slider
  const swapSimulation = useMemo(() => {
    return simulateSwapExactInQuote(
      calculatedSegments,
      0, // starting from 0 reserve
      testBuyQuote,
      feeSchedule,
      30 // 30 seconds into launch
    );
  }, [calculatedSegments, testBuyQuote, feeSchedule]);

  const curveState = useMemo(() => {
    return getCurveStateAtQuoteReserve(calculatedSegments, testBuyQuote * 0.95);
  }, [calculatedSegments, testBuyQuote]);

  // Generate SVG curve points for 2D mode
  const svgWidth = 620;
  const svgHeight = 250;
  const padding = { top: 22, right: 30, bottom: 36, left: 62 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const minPrice = currentConfig.segments[0].pLower;
  const maxPrice = currentConfig.segments[currentConfig.segments.length - 1].pUpper;
  const migrationThreshold = currentConfig.migrationThreshold;

  const curvePoints = useMemo(() => {
    const points: { x: number; y: number; quote: number; price: number }[] = [];
    const steps = 90;
    for (let i = 0; i <= steps; i++) {
      const q = (i / steps) * migrationThreshold;
      const state = getCurveStateAtQuoteReserve(calculatedSegments, q);
      const x = padding.left + (q / migrationThreshold) * plotWidth;
      const normalizedY = (state.currentPrice - minPrice) / (maxPrice - minPrice || 1);
      const y = padding.top + plotHeight - normalizedY * plotHeight;
      points.push({ x, y, quote: q, price: state.currentPrice });
    }
    return points;
  }, [calculatedSegments, migrationThreshold, minPrice, maxPrice, padding.left, padding.top, plotWidth, plotHeight]);

  const pathD = useMemo(() => {
    if (curvePoints.length === 0) return '';
    return curvePoints.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [curvePoints]);

  const areaD = useMemo(() => {
    if (curvePoints.length === 0) return '';
    const first = curvePoints[0];
    const last = curvePoints[curvePoints.length - 1];
    return `${pathD} L ${last.x} ${padding.top + plotHeight} L ${first.x} ${padding.top + plotHeight} Z`;
  }, [pathD, curvePoints, padding.top, plotHeight]);

  const currentPt = useMemo(() => {
    const q = Math.min(migrationThreshold, testBuyQuote * 0.95);
    const x = padding.left + (q / migrationThreshold) * plotWidth;
    const normalizedY = (curveState.currentPrice - minPrice) / (maxPrice - minPrice || 1);
    const y = padding.top + plotHeight - normalizedY * plotHeight;
    return { x, y };
  }, [testBuyQuote, migrationThreshold, curveState, minPrice, maxPrice, padding.left, padding.top, plotWidth, plotHeight]);

  return (
    <div className="w-full bg-[#0a0d14]/90 backdrop-blur-2xl border border-[#1e2538] hover:border-[#ff4800]/40 transition-all duration-300 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
      {/* Background ambient glow matching preset accent */}
      <div 
        className="absolute -top-12 -right-12 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentConfig.accentColor }}
      />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar with Archetype Selector & 3D/2D Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1b2133]">
        <div className="flex items-center space-x-2.5">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: currentConfig.accentColor }}
          />
          <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            Meteora DBC Interactive Curve Engine
          </span>
          <span 
            className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold hidden md:inline"
            style={{ 
              borderColor: `${currentConfig.accentColor}40`, 
              color: currentConfig.accentColor,
              backgroundColor: `${currentConfig.accentColor}12`
            }}
          >
            {currentConfig.badge}
          </span>
        </div>

        {/* Right Side: 3D/2D View Toggle & Archetype Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 3D vs 2D View Switch */}
          <div className="flex items-center p-0.5 bg-[#06080e] border border-[#1c2235] rounded-xl font-mono text-[11px]">
            <button
              onClick={() => setViewMode('3D')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === '3D'
                  ? 'bg-gradient-to-r from-[#ff4800] to-[#ff6224] text-white font-bold shadow-glow'
                  : 'text-[#828ea8] hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Hologram</span>
            </button>
            <button
              onClick={() => setViewMode('2D')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === '2D'
                  ? 'bg-[#00f0ff] text-black font-bold shadow-glowCyan'
                  : 'text-[#828ea8] hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>2D Precise</span>
            </button>
          </div>

          {/* Archetype Switcher Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-[#06080e] border border-[#1c2235] rounded-xl overflow-x-auto max-w-full">
            {(Object.keys(PRESETS) as CurvePresetType[]).map((key) => {
              const p = PRESETS[key];
              const isActive = activePreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#182136] text-white font-bold border border-[#2b395c]'
                      : 'text-[#828ea8] hover:text-white hover:bg-[#121624]'
                  }`}
                >
                  {p.title.split(' ')[0]} {p.title.split(' ')[1] || ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset summary banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-3.5 py-2.5 bg-[#0f1422] border border-[#1e263c] rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-white font-bold">{currentConfig.title}</span>
          <span className="text-[#64748b]">|</span>
          <span className="text-[#94a3b8] text-[11px] truncate">{currentConfig.tagline}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px]">
          <span className="text-[#64748b]">Asset Class:</span>
          <span className="text-[#00f0ff] font-bold">{currentConfig.assetClass}</span>
          <span className="text-[#64748b]">•</span>
          <span className="text-[#10b981] font-bold">{currentConfig.migrationThreshold} {currentConfig.quoteSymbol} DAMM v2</span>
        </div>
      </div>

      {/* VIEWPORT: 3D HOLOGRAM OR 2D ANALYTICAL */}
      <div className="relative w-full aspect-[2.3/1] bg-[#06080e] border border-[#191f30] rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
        {viewMode === '3D' ? (
          <BondingSurface3D
            segments={currentConfig.segments}
            quoteReserve={testBuyQuote * 0.95}
            migrationThreshold={currentConfig.migrationThreshold}
            currentPrice={curveState.currentPrice}
            quoteSymbol={currentConfig.quoteSymbol}
            accentColor={currentConfig.accentColor}
            isGraduated={curveState.curveProgressPct >= 100}
          />
        ) : (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
            <defs>
              <linearGradient id={`curveGrad-${activePreset}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentConfig.accentColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={currentConfig.accentColor} stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="neonLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor={currentConfig.accentColor} />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={padding.left} y1={padding.top + plotHeight * 0.25} x2={padding.left + plotWidth} y2={padding.top + plotHeight * 0.25} stroke="#131724" strokeDasharray="3 3" />
            <line x1={padding.left} y1={padding.top + plotHeight * 0.50} x2={padding.left + plotWidth} y2={padding.top + plotHeight * 0.50} stroke="#131724" strokeDasharray="3 3" />
            <line x1={padding.left} y1={padding.top + plotHeight * 0.75} x2={padding.left + plotWidth} y2={padding.top + plotHeight * 0.75} stroke="#131724" strokeDasharray="3 3" />

            {/* Graduation threshold line */}
            <line
              x1={padding.left + plotWidth}
              y1={padding.top}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left + plotWidth - 6}
              y={padding.top + 14}
              textAnchor="end"
              fill="#10b981"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              DAMM v2 GRADUATION ({migrationThreshold} {currentConfig.quoteSymbol})
            </text>

            {/* Shaded Area under Curve */}
            <path d={areaD} fill={`url(#curveGrad-${activePreset})`} />

            {/* The Active Bonding Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#neonLineGrad)"
              strokeWidth="2.75"
              strokeLinecap="round"
            />

            {/* Current simulation point circle */}
            <circle
              cx={currentPt.x}
              cy={currentPt.y}
              r="6.5"
              fill={currentConfig.accentColor}
              stroke="#ffffff"
              strokeWidth="2"
              className="animate-pulse"
            />

            {/* Current point vertical marker */}
            <line
              x1={currentPt.x}
              y1={currentPt.y}
              x2={currentPt.x}
              y2={padding.top + plotHeight}
              stroke={currentConfig.accentColor}
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />

            {/* Axis Labels */}
            <text x={padding.left} y={padding.top + plotHeight + 18} fill="#64748b" fontSize="10" fontFamily="monospace">
              0 {currentConfig.quoteSymbol}
            </text>
            <text x={padding.left + plotWidth / 2} y={padding.top + plotHeight + 18} textAnchor="middle" fill="#828ea8" fontSize="10" fontFamily="monospace">
              QUOTE RESERVE ({currentConfig.quoteSymbol})
            </text>
            <text x={padding.left + plotWidth} y={padding.top + plotHeight + 18} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
              {migrationThreshold} {currentConfig.quoteSymbol}
            </text>

            <text x={padding.left - 8} y={padding.top + plotHeight} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
              {minPrice >= 0.01 ? minPrice.toFixed(2) : minPrice.toFixed(6)}
            </text>
            <text x={padding.left - 8} y={padding.top + 10} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
              {maxPrice >= 0.01 ? maxPrice.toFixed(2) : maxPrice.toFixed(6)}
            </text>
          </svg>
        )}

        {/* Live floating pill stats */}
        <div className="absolute top-3 left-3 bg-[#0a0d14]/90 border border-[#1f263c] px-3.5 py-2 rounded-xl text-xs font-mono shadow-xl backdrop-blur-md">
          <div className="text-[10px] text-[#64748b]">Current Spot Price:</div>
          <div className="text-[#00f0ff] font-bold text-sm">
            {curveState.currentPrice >= 0.01 ? curveState.currentPrice.toFixed(4) : curveState.currentPrice.toFixed(7)} {currentConfig.quoteSymbol}
          </div>
        </div>

        <div className="absolute bottom-10 right-3 bg-[#0a0d14]/90 border border-[#1f263c] px-3.5 py-2 rounded-xl text-xs font-mono shadow-xl text-right backdrop-blur-md">
          <div className="text-[10px] text-[#64748b]">Graduation Fill:</div>
          <div className="text-[#10b981] font-bold text-sm">
            {curveState.curveProgressPct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Segment Structure Strip */}
      <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
        <span className="text-[#64748b] text-[10px] uppercase font-bold shrink-0">Segments:</span>
        {currentConfig.segments.map((seg, idx) => (
          <div 
            key={idx}
            className={`px-2.5 py-1 rounded-lg border shrink-0 flex items-center gap-1.5 ${
              seg.type === 'SHELF' 
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30' 
                : seg.type === 'RISER' 
                ? 'bg-[#ff4800]/10 text-[#ff4800] border-[#ff4800]/30' 
                : 'bg-[#94a3b8]/10 text-[#e2e8f0] border-[#94a3b8]/30'
            }`}
          >
            <span className="font-bold">{seg.label}</span>
            <span className="text-[9px] opacity-75">(L={seg.liquidityWeight})</span>
          </div>
        ))}
      </div>

      {/* Real-Time Swap Influx Slider */}
      <div className="mt-4 p-4 bg-[#07090f] border border-[#191f32] rounded-2xl font-mono text-xs space-y-2">
        <div className="flex justify-between items-center text-[#94a3b8]">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#ff4800]" /> Test Swap Order Size:
          </span>
          <span className="text-white font-bold px-2.5 py-0.5 bg-[#141a29] rounded-lg border border-[#232c45]">
            {testBuyQuote.toFixed(1)} {currentConfig.quoteSymbol}
          </span>
        </div>
        <input
          type="range"
          min={currentConfig.quoteSymbol === 'USDC' ? 10 : 0.5}
          max={currentConfig.migrationThreshold}
          step={currentConfig.quoteSymbol === 'USDC' ? 10 : 0.5}
          value={testBuyQuote}
          onChange={(e) => setTestBuyQuote(parseFloat(e.target.value))}
          className="w-full accent-[#ff4800] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#64748b]">
          <span>{currentConfig.quoteSymbol === 'USDC' ? '10 USDC' : '0.5 SOL'} (Dust)</span>
          <span>{(currentConfig.migrationThreshold / 2).toFixed(0)} {currentConfig.quoteSymbol} (Mid)</span>
          <span>{currentConfig.migrationThreshold} {currentConfig.quoteSymbol} (Automated Keeper Trigger)</span>
        </div>
      </div>

      {/* Dynamic Simulation Metrics Output Bar */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 bg-[#0c101c] border border-[#1b2236] rounded-xl">
          <div className="text-[10px] text-[#64748b]">Tokens Received:</div>
          <div className="text-white font-bold text-sm truncate">
            {(swapSimulation.amountOut / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-[#00f0ff]">Price Impact: {swapSimulation.priceImpactPct.toFixed(2)}%</div>
        </div>

        <div className="p-3.5 bg-[#0c101c] border border-[#1b2236] rounded-xl">
          <div className="text-[10px] text-[#64748b]">Trading Fee Deducted:</div>
          <div className="text-[#ff4800] font-bold text-sm truncate">
            {swapSimulation.feeAmount.toFixed(3)} {currentConfig.quoteSymbol}
          </div>
          <div className="text-[10px] text-[#828ea8]">Base Mode: {currentConfig.feeMode.replace('FEE_SCHEDULER_', '')}</div>
        </div>

        <div className="p-3.5 bg-[#0c101c] border border-[#1b2236] rounded-xl">
          <div className="text-[10px] text-[#64748b]">Supply Circulating:</div>
          <div className="text-white font-bold text-sm">
            {(curveState.baseTokensSold / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-[#64748b]">of 1,000M Virtual Cap</div>
        </div>

        <div className="p-3.5 bg-[#0c101c] border border-[#1b2236] rounded-xl">
          <div className="text-[10px] text-[#64748b]">DAMM v2 Pool State:</div>
          <div className="text-[#10b981] font-bold text-sm">
            {curveState.curveProgressPct >= 100 ? 'GRADUATED & PERM LP' : 'DBC ACCUMULATION'}
          </div>
          <div className="text-[10px] text-[#10b981]">100% Permanently Locked</div>
        </div>
      </div>
    </div>
  );
};
