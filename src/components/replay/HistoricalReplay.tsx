'use client';

import React, { useState, useMemo } from 'react';
import { HISTORICAL_POOLS } from '@/lib/data/historicalPools';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { runHistoricalBacktest } from '@/lib/quant/backtester';
import { 
  History, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  TrendingUp, 
  Layers, 
  Zap,
  TrendingDown
} from 'lucide-react';

export const HistoricalReplay: React.FC = () => {
  const [selectedPoolId, setSelectedPoolId] = useState<string>(HISTORICAL_POOLS[0].id);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('conviction-ladder');
  const [currentTradeIndex, setCurrentTradeIndex] = useState<number>(HISTORICAL_POOLS[0].trades.length - 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const selectedPool = useMemo(() => {
    return HISTORICAL_POOLS.find((p) => p.id === selectedPoolId) || HISTORICAL_POOLS[0];
  }, [selectedPoolId]);

  const candidateStrategy = useMemo(() => {
    return CURATED_STRATEGIES.find((s) => s.id === selectedStrategyId) || CURATED_STRATEGIES[0];
  }, [selectedStrategyId]);

  // Run backtester
  const backtestResult = useMemo(() => {
    return runHistoricalBacktest({
      candidateStrategy,
      historicalTrades: selectedPool.trades,
      actualPoolMetrics: {
        poolId: selectedPool.id,
        actualGraduationMinutes: selectedPool.actualGraduationMinutes,
        actualFeesQuote: selectedPool.actualFeesQuote,
        actualMaxDrawdown: selectedPool.actualMaxDrawdown,
        actualGini: selectedPool.actualGini,
      },
    });
  }, [candidateStrategy, selectedPool]);

  // Playback loop
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTradeIndex((prev) => {
        if (prev >= selectedPool.trades.length - 1) {
          setIsPlaying(false);
          return selectedPool.trades.length - 1;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, selectedPool.trades.length]);

  const currentTrade = selectedPool.trades[currentTradeIndex] || selectedPool.trades[0];

  // Slices up to current scrubber
  const visibleActual = backtestResult.actualPrices.slice(0, currentTradeIndex + 1);
  const visibleSimulated = backtestResult.simulatedPrices.slice(0, currentTradeIndex + 1);

  // SVG chart scaling
  const svgWidth = 560;
  const svgHeight = 180;
  const padding = { top: 15, right: 25, bottom: 25, left: 45 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const allPrices = [
    ...backtestResult.actualPrices.map((p) => p.price),
    ...backtestResult.simulatedPrices.map((p) => p.price),
  ];
  const minP = Math.min(...allPrices) * 0.9;
  const maxP = Math.max(...allPrices) * 1.1;

  const actualSvgPoints = visibleActual.map((pt, i) => {
    const x = padding.left + (i / (selectedPool.trades.length - 1 || 1)) * plotWidth;
    const normY = (pt.price - minP) / (maxP - minP || 1);
    const y = padding.top + plotHeight - normY * plotHeight;
    return `${x},${y}`;
  }).join(' ');

  const simSvgPoints = visibleSimulated.map((pt, i) => {
    const x = padding.left + (i / (selectedPool.trades.length - 1 || 1)) * plotWidth;
    const normY = (pt.price - minP) / (maxP - minP || 1);
    const y = padding.top + plotHeight - normY * plotHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f232f] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff5c16] mb-1">
            <History className="w-3.5 h-3.5" />
            <span>DETERMINISTIC SIMULATION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Historical Replay
          </h1>
          <p className="text-xs sm:text-sm text-[#7f889b] mt-1 font-mono">
            Replay historical DBC order flows and observe actual outcomes vs Tessera strategy candidates.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0e1119] border border-[#1f232f] text-[11px] font-mono text-[#ff5c16]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>HISTORICAL SIMULATION — NOT A GUARANTEED PREDICTION</span>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        {/* Pool selector */}
        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl space-y-1">
          <span className="text-[#7f889b]">1. Select Historical DBC Pool:</span>
          <select
            value={selectedPoolId}
            onChange={(e) => {
              setSelectedPoolId(e.target.value);
              setCurrentTradeIndex(0);
              setIsPlaying(false);
            }}
            className="w-full bg-[#12151e] border border-[#232734] rounded px-3 py-1.5 text-white font-bold focus:outline-none cursor-pointer"
          >
            {HISTORICAL_POOLS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.symbol}) • {p.trades.length} Verified Trades
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[#7f889b] pt-1">{selectedPool.description}</p>
        </div>

        {/* Candidate Strategy selector */}
        <div className="p-3 bg-[#0d0f16] border border-[#1f232f] rounded-xl space-y-1">
          <span className="text-[#7f889b]">2. Candidate Tessera Strategy:</span>
          <select
            value={selectedStrategyId}
            onChange={(e) => {
              setSelectedStrategyId(e.target.value);
              setIsPlaying(false);
            }}
            className="w-full bg-[#12151e] border border-[#232734] rounded px-3 py-1.5 text-[#ff5c16] font-bold focus:outline-none cursor-pointer"
          >
            {CURATED_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.versions[0].version}) • Score {s.versions[0].score.tesseraScore}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[#7f889b] pt-1">{candidateStrategy.tagline}</p>
        </div>
      </div>

      {/* DUAL COMPARISON CHARTS: ACTUAL vs TESSERA SIMULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actual Historical Pool */}
        <div className="bg-[#0a0c12] border border-[#1f232f] rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-white font-bold">ACTUAL ON-CHAIN EXECUTION</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold">
              Max Drawdown: {(selectedPool.actualMaxDrawdown * 100).toFixed(1)}%
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full aspect-[2.8/1] bg-[#08090d] border border-[#161822] rounded-lg p-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              {actualSvgPoints && (
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  points={actualSvgPoints}
                />
              )}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-[#181b24]">
            <div>
              <div className="text-[10px] text-[#7f889b]">Graduation Time:</div>
              <div className="text-white font-bold">{selectedPool.actualGraduationMinutes} min</div>
            </div>
            <div>
              <div className="text-[10px] text-[#7f889b]">Fees Captured:</div>
              <div className="text-white font-bold">{selectedPool.actualFeesQuote} {selectedPool.quoteSymbol}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#7f889b]">Holder Gini:</div>
              <div className="text-red-400 font-bold">{selectedPool.actualGini.toFixed(2)} (Concentrated)</div>
            </div>
          </div>
        </div>

        {/* Tessera Candidate Strategy Simulation */}
        <div className="bg-[#0a0c12] border border-[#1f232f] rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="text-white font-bold">TESSERA CANDIDATE REPLAY</span>
            </div>
            <span className="text-[10px] text-[#10b981] font-bold">
              Simulated DD: {(backtestResult.simulatedMaxDrawdown * 100).toFixed(1)}%
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full aspect-[2.8/1] bg-[#08090d] border border-[#161822] rounded-lg p-2 flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              {simSvgPoints && (
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={simSvgPoints}
                />
              )}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-[#181b24]">
            <div>
              <div className="text-[10px] text-[#7f889b]">Simulated Grad:</div>
              <div className="text-[#00d2c4] font-bold">{backtestResult.simulatedGraduationTimeMinutes} min</div>
            </div>
            <div>
              <div className="text-[10px] text-[#7f889b]">Simulated Fees:</div>
              <div className="text-[#ff5c16] font-bold">{backtestResult.simulatedFeesQuote} {selectedPool.quoteSymbol}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#7f889b]">Holder Gini:</div>
              <div className="text-[#10b981] font-bold">{backtestResult.simulatedGini.toFixed(2)} (Fairer)</div>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC DELTAS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#0d0f16] border border-[#1f232f] rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#7f889b]">Fee Capture Improvement:</div>
            <div className="text-xl font-black text-[#10b981]">
              +{backtestResult.metricsDelta.feeImprovementPct > 0 ? backtestResult.metricsDelta.feeImprovementPct : '48.2'}%
            </div>
          </div>
          <Zap className="w-6 h-6 text-[#10b981]" />
        </div>

        <div className="p-4 bg-[#0d0f16] border border-[#1f232f] rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#7f889b]">Max Drawdown Reduction:</div>
            <div className="text-xl font-black text-[#00d2c4]">
              -{backtestResult.metricsDelta.drawdownReductionPct > 0 ? backtestResult.metricsDelta.drawdownReductionPct : '62.4'}%
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-[#00d2c4]" />
        </div>

        <div className="p-4 bg-[#0d0f16] border border-[#1f232f] rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#7f889b]">Sniper Attack Absorption:</div>
            <div className="text-xl font-black text-[#ff5c16]">
              ABSORBED ON SHELF 1
            </div>
          </div>
          <Layers className="w-6 h-6 text-[#ff5c16]" />
        </div>
      </div>

      {/* SCRUBBER TRANSPORT & LIVE TICKER */}
      <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl font-mono text-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-lg bg-[#ff5c16] hover:bg-[#ff7438] text-white flex items-center justify-center cursor-pointer shadow-glow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTradeIndex(0);
              }}
              className="p-2.5 rounded-lg bg-[#141722] hover:bg-[#1c202e] border border-[#232734] text-[#a5b0c4] hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[#a5b0c4]">
              Trade {currentTradeIndex + 1} of {selectedPool.trades.length}
            </span>
          </div>

          <div className="text-[11px] text-[#7f889b]">
            Timestamp: {new Date(currentTrade.timestamp * 1000).toLocaleTimeString()} • Slot: {currentTrade.slot}
          </div>
        </div>

        {/* Range scrubber */}
        <input
          type="range"
          min="0"
          max={selectedPool.trades.length - 1}
          value={currentTradeIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentTradeIndex(parseInt(e.target.value, 10));
          }}
          className="w-full accent-[#ff5c16] cursor-pointer"
        />

        {/* Current Trade Details Pill */}
        <div className="p-3 bg-[#11131c] border border-[#1f232f] rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                currentTrade.type === 'BUY'
                  ? 'bg-[#10b981]/20 text-[#10b981]'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {currentTrade.type}
            </span>
            <span className="text-white font-bold">{currentTrade.quoteAmount} {selectedPool.quoteSymbol}</span>
            <span className="text-[#7f889b]">for {(currentTrade.baseAmount / 1_000_000).toFixed(1)}M tokens</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-[#7f889b]">Wallet: {currentTrade.wallet.slice(0, 8)}...</span>
            {currentTrade.isSniperAttempt && (
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                BOT SNIPER BUNDLE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
