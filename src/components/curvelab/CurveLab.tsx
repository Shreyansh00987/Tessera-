'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { CurveSegment, FeeSchedule, MigrationConfig } from '@/types/strategy';
import { computeSegmentsWithCapacities, getCurveStateAtQuoteReserve, simulateSwapExactInQuote } from '@/lib/meteora/dbcMath';
import { CurveVisualizer } from './CurveVisualizer';
import { ReplayTimeline } from './ReplayTimeline';
import { ConfigPanel } from './ConfigPanel';
import { 
  TrendingUp, 
  Rocket, 
  Code2, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  HelpCircle,
  ArrowRightLeft
} from 'lucide-react';
import Link from 'next/link';

export const CurveLab: React.FC = () => {
  const searchParams = useSearchParams();
  const initialStratId = searchParams.get('strategy') || 'conviction-ladder';

  // Find strategy
  const initialStrategy = useMemo(() => {
    return CURATED_STRATEGIES.find((s) => s.id === initialStratId) || CURATED_STRATEGIES[0];
  }, [initialStratId]);

  const initialVersion = initialStrategy.versions[0];

  // Configurable states
  const [segments, setSegments] = useState<CurveSegment[]>(initialVersion.segments);
  const [feeSchedule, setFeeSchedule] = useState<FeeSchedule>(initialVersion.feeSchedule);
  const [migration, setMigration] = useState<MigrationConfig>(initialVersion.migration);
  const [currentQuoteReserve, setCurrentQuoteReserve] = useState<number>(0);
  const [showJsonExport, setShowJsonExport] = useState<boolean>(false);

  // Load a new preset strategy
  const handleLoadStrategy = (strategyId: string) => {
    const found = CURATED_STRATEGIES.find((s) => s.id === strategyId);
    if (found) {
      const v = found.versions[0];
      setSegments(v.segments);
      setFeeSchedule(v.feeSchedule);
      setMigration(v.migration);
      setCurrentQuoteReserve(0);
    }
  };

  // Sync state if URL query param changes
  useEffect(() => {
    handleLoadStrategy(initialStratId);
  }, [initialStratId]);

  // Compute curve capacities
  const calculatedSegments = useMemo(() => {
    return computeSegmentsWithCapacities(segments, 1_000_000_000);
  }, [segments]);

  // Curve state at current scrubber reserve
  const curveState = useMemo(() => {
    return getCurveStateAtQuoteReserve(calculatedSegments, currentQuoteReserve);
  }, [calculatedSegments, currentQuoteReserve]);

  // Slippage for a standard 1 SOL (or 100 USDC) buy
  const slippageSimulation = useMemo(() => {
    const testAmount = migration.quoteSymbol === 'SOL' ? 1.0 : 100.0;
    return simulateSwapExactInQuote(
      calculatedSegments,
      currentQuoteReserve,
      testAmount,
      feeSchedule,
      60
    );
  }, [calculatedSegments, currentQuoteReserve, migration.quoteSymbol, feeSchedule]);

  // DAMM v2 estimated opening price
  const dammV2OpeningPrice = useMemo(() => {
    return segments[segments.length - 1]?.pUpper || curveState.currentPrice;
  }, [segments, curveState.currentPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1f232f] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff5c16] mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>PRIMARY QUANT LABORATORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Curve Lab
          </h1>
          <p className="text-xs text-[#7f889b] font-mono mt-0.5">
            Interactive multi-segment DBC design, simulation, and DAMM v2 migration parameterizer.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={() => setShowJsonExport(!showJsonExport)}
            className="px-3 py-1.5 rounded-lg bg-[#141722] hover:bg-[#1a1e2d] border border-[#232734] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#00d2c4]" />
            <span>{showJsonExport ? 'Hide JSON' : 'Export JSON'}</span>
          </button>

          <Link
            href={`/launch`}
            className="px-4 py-1.5 rounded-lg bg-[#ff5c16] hover:bg-[#ff7438] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-glow"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deploy This Curve</span>
          </Link>
        </div>
      </div>

      {/* JSON Export Drawer if toggled */}
      {showJsonExport && (
        <div className="p-4 bg-[#08090d] border border-[#1f232f] rounded-xl font-mono text-xs space-y-2">
          <div className="flex justify-between items-center text-[#a5b0c4]">
            <span className="text-[#00d2c4] font-bold">Meteora DBC Verified Configuration Payload:</span>
            <span className="text-[10px] text-[#7f889b]">SDK-Ready for buildCurveWithCustomSqrtPrices</span>
          </div>
          <pre className="p-3 bg-[#0d0f16] border border-[#181b24] rounded-lg text-[11px] text-[#10b981] overflow-x-auto max-h-60">
            {JSON.stringify(
              {
                curveSegments: segments,
                feeSchedule,
                migrationConfig: migration,
                dammV2TargetKey: migration.migratedDammV2ConfigKey,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* TOP 2-PANE GRID: Left = Curve Visualizer, Right = Replay Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-full">
          <CurveVisualizer
            segments={calculatedSegments}
            currentQuoteReserve={currentQuoteReserve}
            migrationQuoteThreshold={migration.migrationQuoteThreshold}
            quoteSymbol={migration.quoteSymbol}
          />
        </div>

        <div className="lg:col-span-4 h-full">
          <ReplayTimeline
            currentQuoteReserve={currentQuoteReserve}
            setCurrentQuoteReserve={setCurrentQuoteReserve}
            migrationQuoteThreshold={migration.migrationQuoteThreshold}
            quoteSymbol={migration.quoteSymbol}
          />
        </div>
      </div>

      {/* LIVE QUANTITATIVE METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl">
          <div className="text-[10px] text-[#7f889b]">Current Price:</div>
          <div className="text-[#00d2c4] font-bold text-sm truncate">
            {curveState.currentPrice.toFixed(7)} {migration.quoteSymbol}
          </div>
          <div className="text-[10px] text-[#7f889b]">Segment {curveState.currentSegmentIndex + 1}</div>
        </div>

        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl">
          <div className="text-[10px] text-[#7f889b]">Tokens Remaining:</div>
          <div className="text-white font-bold text-sm">
            {(curveState.baseReserveRemaining / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-[#7f889b]">of 1,000M total</div>
        </div>

        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl">
          <div className="text-[10px] text-[#7f889b]">Quote Collected:</div>
          <div className="text-white font-bold text-sm">
            {currentQuoteReserve.toFixed(2)} {migration.quoteSymbol}
          </div>
          <div className="text-[10px] text-[#10b981]">{curveState.curveProgressPct.toFixed(1)}% complete</div>
        </div>

        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl">
          <div className="text-[10px] text-[#7f889b]">1 {migration.quoteSymbol} Slippage:</div>
          <div className="text-[#ff5c16] font-bold text-sm">
            {slippageSimulation.priceImpactPct.toFixed(2)}%
          </div>
          <div className="text-[10px] text-[#7f889b]">Impact on current depth</div>
        </div>

        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl col-span-2 sm:col-span-1">
          <div className="text-[10px] text-[#7f889b]">DAMM v2 Open Price:</div>
          <div className="text-[#10b981] font-bold text-sm truncate">
            {dammV2OpeningPrice.toFixed(7)} {migration.quoteSymbol}
          </div>
          <div className="text-[10px] text-[#7f889b]">{migration.migratedDammV2FeeBps} bps pool tier</div>
        </div>
      </div>

      {/* BOTTOM CONFIGURATION PANEL */}
      <ConfigPanel
        segments={segments}
        setSegments={setSegments}
        feeSchedule={feeSchedule}
        setFeeSchedule={setFeeSchedule}
        migration={migration}
        setMigration={setMigration}
        onLoadStrategy={handleLoadStrategy}
      />
    </div>
  );
};
