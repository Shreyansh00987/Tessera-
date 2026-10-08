'use client';

import React from 'react';
import Link from 'next/link';
import { Strategy } from '@/types/strategy';
import { 
  TrendingUp, 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  Users, 
  Zap, 
  Coins,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';

interface StrategyCardProps {
  strategy: Strategy;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy }) => {
  const v = strategy.versions[0];
  const { score, metrics, segments, feeSchedule, migration } = v;

  // Mini SVG curve representation
  const svgWidth = 280;
  const svgHeight = 70;
  const minP = segments[0].pLower;
  const maxP = segments[segments.length - 1].pUpper;

  // Generate points
  const points = segments.map((seg, i) => {
    const x = (i / (segments.length - 1 || 1)) * (svgWidth - 24) + 12;
    const normY = (seg.pUpper - minP) / (maxP - minP || 1);
    const y = svgHeight - 12 - normY * (svgHeight - 24);
    return `${x},${y}`;
  }).join(' ');

  const assetClassColors: Record<string, string> = {
    MEME: 'bg-[#ff4800]/15 text-[#ff4800] border-[#ff4800]/30',
    RWA: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/30',
    EQUITY: 'bg-[#a855f7]/15 text-[#c084fc] border-[#a855f7]/30',
    UTILITY: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30',
    AI: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30',
    THIN_MARKET: 'bg-[#64748b]/15 text-[#94a3b8] border-[#64748b]/30',
  };

  const glowColors: Record<string, string> = {
    MEME: 'rgba(255, 72, 0, 0.35)',
    RWA: 'rgba(0, 240, 255, 0.35)',
    EQUITY: 'rgba(168, 85, 247, 0.35)',
    UTILITY: 'rgba(16, 185, 129, 0.35)',
    AI: 'rgba(245, 158, 11, 0.35)',
    THIN_MARKET: 'rgba(100, 116, 139, 0.35)',
  };

  const archetypeLabels: Record<string, string> = {
    STEP_LADDER: 'Step Ladder',
    FLAT_CURVE: 'Flat Curve',
    EXPONENTIAL_CURVE: 'Exponential',
    LONG_CURVE: 'Long Curve',
  };

  return (
    <Card3D
      maxTilt={9}
      glowColor={glowColors[strategy.assetClass] || 'rgba(255, 72, 0, 0.3)'}
      className="rounded-2xl h-full"
    >
      <div className="bg-[#0b0e17]/95 border border-[#1b2236] hover:border-[#ff4800]/40 rounded-2xl p-5 flex flex-col justify-between h-full transition-all group backdrop-blur-md shadow-xl">
        <div>
          {/* Header tags row */}
          <div className="flex items-center justify-between mb-3" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  assetClassColors[strategy.assetClass] || 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {strategy.assetClass}
              </span>

              {strategy.curveArchetype && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131929] text-[#94a3b8] border border-[#202940]">
                  {archetypeLabels[strategy.curveArchetype] || strategy.curveArchetype}
                </span>
              )}

              {strategy.isFlagship && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ff4800]/20 text-[#ff4800] border border-[#ff4800]/40 font-bold">
                  FLAGSHIP
                </span>
              )}

              {strategy.stocklanaGrantEligible && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40 font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> GRANT
                </span>
              )}
            </div>

            {/* Tessera Score Badge */}
            <div className="flex items-center space-x-1 font-mono">
              {score.isInsufficientData ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3 h-3" /> N &lt; 3 DATA
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded bg-[#ff4800]/15 text-[#ff4800] border border-[#ff4800]/30 font-black flex items-center gap-1 shadow-glow">
                  <span className="text-[10px] text-[#64748b]">SCORE</span> {score.tesseraScore}
                </span>
              )}
            </div>
          </div>

          {/* Strategy Name & Tagline */}
          <div className="mb-3" style={{ transform: 'translateZ(15px)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white group-hover:text-[#ff4800] transition-colors font-sans">
                {strategy.name}
              </h3>
              <span className="text-[11px] font-mono text-[#64748b]">{v.version}</span>
            </div>
            <p className="text-xs text-[#828ea8] line-clamp-2 mt-1 leading-relaxed">
              {strategy.tagline}
            </p>
          </div>

          {/* Mini SVG Curve Profile */}
          <div 
            className="w-full h-16 bg-[#06080e] border border-[#161d2d] rounded-xl p-2 mb-4 flex items-center justify-center relative overflow-hidden"
            style={{ transform: 'translateZ(10px)' }}
          >
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              <polyline
                fill="none"
                stroke="#ff4800"
                strokeWidth="2.5"
                strokeLinecap="round"
                points={`12,${svgHeight - 12} ${points}`}
              />
            </svg>
            <div className="absolute bottom-1 right-2.5 text-[9px] font-mono text-[#64748b]">
              {segments.length} Segments • {migration.migrationQuoteThreshold} {migration.quoteSymbol}
            </div>
          </div>

          {/* Quantitative Metrics Grid */}
          <div 
            className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4 pt-2 border-t border-[#161d2d]"
            style={{ transform: 'translateZ(12px)' }}
          >
            <div className="flex justify-between">
              <span className="text-[#64748b]">Graduation:</span>
              <span className="text-[#10b981] font-bold">
                {(metrics.graduationRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Avg Drawdown:</span>
              <span className="text-white font-medium">
                {(metrics.maxDrawdownAvg * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Sample Size:</span>
              <span className="text-[#94a3b8]">
                {metrics.totalLaunches} {metrics.totalLaunches === 1 ? 'Launch' : 'Launches'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">License Cost:</span>
              <span className="text-[#00f0ff] font-bold">
                {strategy.presetLicenseCost || 'Free (OSS)'}
              </span>
            </div>
          </div>
        </div>

        {/* Author and Action Buttons footer */}
        <div style={{ transform: 'translateZ(22px)' }}>
          <div className="flex items-center justify-between py-2 border-t border-[#161d2d] text-[11px] text-[#64748b]">
            <div className="flex items-center space-x-1.5 truncate">
              <span>By {strategy.author.name}</span>
              {strategy.author.verified && (
                <CheckCircle2 className="w-3 h-3 text-[#10b981] shrink-0" />
              )}
            </div>
            <span className="font-mono text-[10px] text-[#94a3b8]">
              Fee: {feeSchedule.startingFeeBps / 100}% → {feeSchedule.endingFeeBps / 100}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
            <Link
              href={`/curvelab?strategy=${strategy.id}`}
              className="py-2 px-3 rounded-xl bg-[#121727] hover:bg-[#182036] border border-[#202a44] hover:border-[#ff4800]/50 text-white font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#ff4800]" />
              <span>Simulate</span>
            </Link>

            <Link
              href={`/launch?strategy=${strategy.id}`}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#ff4800] to-[#ff6224] hover:from-[#ff6224] hover:to-[#ff7a45] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-glow"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Pay &amp; Launch</span>
            </Link>
          </div>
        </div>
      </div>
    </Card3D>
  );
};
