'use client';

import React, { useState, useMemo } from 'react';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { computeSegmentsWithCapacities, getCurveStateAtQuoteReserve, simulateSwapExactInQuote } from '@/lib/meteora/dbcMath';
import { 
  Terminal, 
  ArrowUpDown, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Users, 
  Coins, 
  Zap, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';

export const AssetTerminal: React.FC = () => {
  const strategy = CURATED_STRATEGIES[0]; // Conviction Ladder
  const version = strategy.versions[0];

  // Pool state simulation
  const [quoteReserve, setQuoteReserve] = useState<number>(6.45); // 6.45 SOL accumulated out of 10
  const [swapMode, setSwapMode] = useState<'BUY' | 'SELL'>('BUY');
  const [inputAmount, setInputAmount] = useState<string>('0.5'); // 0.5 SOL buy
  const [slippageBps, setSlippageBps] = useState<number>(100); // 1.0%
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [tradeLogs, setTradeLogs] = useState<{ id: string; time: string; type: 'BUY' | 'SELL'; quote: number; base: number; wallet: string }[]>([
    { id: '1', time: '14:22:04', type: 'BUY', quote: 0.75, base: 42_500_000, wallet: '7xK...9mP' },
    { id: '2', time: '14:21:40', type: 'BUY', quote: 1.20, base: 71_200_000, wallet: '9nB...3vA' },
    { id: '3', time: '14:20:15', type: 'SELL', quote: 0.40, base: 25_100_000, wallet: '2wT...1eR' },
    { id: '4', time: '14:18:55', type: 'BUY', quote: 2.10, base: 135_000_000, wallet: '4vM...8rT' },
  ]);

  const calculatedSegments = useMemo(() => {
    return computeSegmentsWithCapacities(version.segments, 1_000_000_000);
  }, [version.segments]);

  const curveState = useMemo(() => {
    return getCurveStateAtQuoteReserve(calculatedSegments, quoteReserve);
  }, [calculatedSegments, quoteReserve]);

  const quoteAmount = parseFloat(inputAmount) || 0;

  // Swap calculation using Meteora DBC formulas
  const swapQuote = useMemo(() => {
    if (quoteAmount <= 0) return null;
    return simulateSwapExactInQuote(
      calculatedSegments,
      quoteReserve,
      quoteAmount,
      version.feeSchedule,
      120, // 2 minutes in
      slippageBps
    );
  }, [calculatedSegments, quoteReserve, quoteAmount, version.feeSchedule, slippageBps]);

  const handleExecuteSwap = () => {
    if (!swapQuote) return;
    setIsSwapping(true);
    setTimeout(() => {
      setQuoteReserve((prev) => Math.min(version.migration.migrationQuoteThreshold, prev + swapQuote.amountIn - swapQuote.feeAmount));
      const newTrade = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        type: swapMode,
        quote: swapQuote.amountIn,
        base: swapQuote.amountOut,
        wallet: 'User...Wallet',
      };
      setTradeLogs([newTrade, ...tradeLogs.slice(0, 7)]);
      setIsSwapping(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f232f] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#10b981] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>LIVE METEORA DBC TRADING POOL</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-black text-white font-mono tracking-tight">
              CYBER / SOL
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-[#ff5c16]/15 text-[#ff5c16] font-mono border border-[#ff5c16]/30 font-bold">
              Conviction Ladder Architecture
            </span>
          </div>
        </div>

        {/* Graduation Progress Pill */}
        <div className="p-3 bg-[#0a0c12] border border-[#1f232f] rounded-xl font-mono text-xs space-y-1.5 w-full md:w-80">
          <div className="flex justify-between items-center">
            <span className="text-[#a5b0c4]">DAMM v2 Graduation:</span>
            <span className="text-white font-bold">{curveState.curveProgressPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-[#12141c] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff5c16] to-[#10b981] rounded-full"
              style={{ width: `${curveState.curveProgressPct}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-[#7f889b]">
            <span>{quoteReserve.toFixed(2)} SOL</span>
            <span>Target: {version.migration.migrationQuoteThreshold} SOL</span>
          </div>
        </div>
      </div>

      {/* Main Trading Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Left 8 Cols: Price & Curve Monitor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#0a0c12] border border-[#1f232f] rounded-xl">
              <span className="text-[10px] text-[#7f889b]">DBC Spot Price:</span>
              <div className="text-lg font-bold text-[#00d2c4] mt-0.5">
                {curveState.currentPrice.toFixed(7)} SOL
              </div>
              <div className="text-[10px] text-[#10b981]">+24.5% from floor</div>
            </div>

            <div className="p-3 bg-[#0a0c12] border border-[#1f232f] rounded-xl">
              <span className="text-[10px] text-[#7f889b]">Tokens Sold:</span>
              <div className="text-lg font-bold text-white mt-0.5">
                {(curveState.baseTokensSold / 1_000_000).toFixed(1)}M
              </div>
              <div className="text-[10px] text-[#7f889b]">of 1,000M total</div>
            </div>

            <div className="p-3 bg-[#0a0c12] border border-[#1f232f] rounded-xl">
              <span className="text-[10px] text-[#7f889b]">Current Trading Fee:</span>
              <div className="text-lg font-bold text-[#ff5c16] mt-0.5">
                {(version.feeSchedule.endingFeeBps / 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-[#7f889b]">Anti-snipe decayed</div>
            </div>

            <div className="p-3 bg-[#0a0c12] border border-[#1f232f] rounded-xl">
              <span className="text-[10px] text-[#7f889b]">DAMM v2 Pool Key:</span>
              <div className="text-sm font-bold text-white mt-1 truncate">
                {version.migration.migratedDammV2ConfigKey.slice(0, 8)}...
              </div>
              <div className="text-[10px] text-[#10b981]">100 bps tier ready</div>
            </div>
          </div>

          {/* Piecewise Segment Orderbook Depth */}
          <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#181b24]">
              <span className="text-white font-bold uppercase text-[11px]">
                Piecewise Curve Depth &amp; Liquidity Shelves
              </span>
              <span className="text-[10px] text-[#00d2c4]">
                Active: Segment {curveState.currentSegmentIndex + 1} of {calculatedSegments.length}
              </span>
            </div>

            <div className="space-y-2">
              {calculatedSegments.map((seg, idx) => {
                const isActive = idx === curveState.currentSegmentIndex;
                const isPassed = idx < curveState.currentSegmentIndex;
                return (
                  <div
                    key={seg.segmentIndex}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#161a25] border-[#ff5c16] text-white'
                        : isPassed
                        ? 'bg-[#0e1017] border-[#181b24] text-[#7f889b] opacity-75'
                        : 'bg-[#11131c] border-[#1f232f] text-[#a5b0c4]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-[#ff5c16] animate-pulse' : isPassed ? 'bg-[#10b981]' : 'bg-[#2b3144]'
                        }`}
                      ></span>
                      <span className="font-bold">Segment #{idx + 1}: {seg.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#0a0c12] rounded border border-[#1f232f] text-[#00d2c4]">
                        {seg.type}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-[11px]">
                      <span>{seg.pLower.toFixed(6)} → {seg.pUpper.toFixed(6)} SOL</span>
                      <span className="text-white font-bold">{seg.quoteCapacity.toFixed(2)} SOL Depth</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Trade Feed */}
          <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-3">
            <span className="text-white font-bold uppercase text-[11px]">Recent On-Chain Swaps</span>
            <div className="divide-y divide-[#181b24]">
              {tradeLogs.map((tx) => (
                <div key={tx.id} className="py-2 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                        tx.type === 'BUY' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tx.type}
                    </span>
                    <span className="text-white font-bold">{tx.quote} SOL</span>
                    <span className="text-[#7f889b]">({(tx.base / 1_000_000).toFixed(1)}M CYBER)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[#7f889b]">
                    <span>{tx.wallet}</span>
                    <span>{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Interactive Swap Terminal */}
        <div className="lg:col-span-4 bg-[#0a0c12] border border-[#1f232f] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
            <span className="text-white font-bold uppercase text-xs">Meteora DBC Swap</span>
            <div className="flex items-center space-x-1 bg-[#12141c] p-0.5 rounded border border-[#1f232f]">
              <button
                onClick={() => setSwapMode('BUY')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  swapMode === 'BUY' ? 'bg-[#10b981] text-black' : 'text-[#7f889b]'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSwapMode('SELL')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  swapMode === 'SELL' ? 'bg-red-500 text-white' : 'text-[#7f889b]'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Amount In */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-xl">
            <div className="flex justify-between text-[11px] text-[#7f889b]">
              <span>You Pay:</span>
              <span>Balance: 12.4 SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
              <span className="text-[#ff5c16] font-bold text-sm ml-2">SOL</span>
            </div>
          </div>

          {/* Amount Out */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-xl">
            <div className="flex justify-between text-[11px] text-[#7f889b]">
              <span>You Receive:</span>
              <span>DBC Quote</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-lg truncate">
                {swapQuote ? (swapQuote.amountOut / 1_000_000).toFixed(2) + 'M' : '0.00'}
              </div>
              <span className="text-[#00d2c4] font-bold text-sm ml-2">CYBER</span>
            </div>
          </div>

          {/* Swap Breakdown */}
          {swapQuote && (
            <div className="p-3 bg-[#0d0f17] border border-[#181b24] rounded-lg space-y-1 text-[11px] text-[#7f889b]">
              <div className="flex justify-between">
                <span>Trading Fee:</span>
                <span className="text-white">{swapQuote.feeAmount.toFixed(4)} SOL ({(swapQuote.effectiveFeeBps / 100).toFixed(2)}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Price Impact:</span>
                <span className={swapQuote.priceImpactPct > 5 ? 'text-red-400 font-bold' : 'text-[#10b981]'}>
                  {swapQuote.priceImpactPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Received:</span>
                <span className="text-white">{(swapQuote.minimumAmountOut / 1_000_000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Segment Cross:</span>
                <span className="text-white">{swapQuote.willCrossSegment ? 'Crosses Boundary' : 'Within Shelf'}</span>
              </div>
            </div>
          )}

          {/* Slippage tolerance chips */}
          <div className="flex items-center justify-between text-[11px] text-[#7f889b]">
            <span>Slippage Tolerance:</span>
            <div className="flex items-center space-x-1">
              {[50, 100, 200].map((bps) => (
                <button
                  key={bps}
                  onClick={() => setSlippageBps(bps)}
                  className={`px-1.5 py-0.5 rounded border ${
                    slippageBps === bps
                      ? 'bg-[#ff5c16] text-white border-[#ff5c16]'
                      : 'bg-[#12141c] text-[#7f889b] border-[#1f232f]'
                  }`}
                >
                  {bps / 100}%
                </button>
              ))}
            </div>
          </div>

          {/* Swap Action Button */}
          <button
            disabled={isSwapping || quoteAmount <= 0}
            onClick={handleExecuteSwap}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff5c16] to-[#ff8c42] hover:opacity-90 text-white font-bold text-sm shadow-glow transition-all cursor-pointer disabled:opacity-40"
          >
            {isSwapping ? 'Swapping on DBC...' : `Swap ${inputAmount} SOL for CYBER`}
          </button>
        </div>
      </div>
    </div>
  );
};
