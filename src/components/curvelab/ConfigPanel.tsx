'use client';

import React, { useState } from 'react';
import { CurveSegment, FeeSchedule, MigrationConfig, QuoteTokenSymbol } from '@/types/strategy';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { VERIFIED_QUOTE_MINTS, DAMM_V2_FEE_CONFIGS } from '@/lib/meteora/constants';
import { Plus, Trash2, Sliders, Zap, ShieldCheck, ArrowRightLeft, Sparkles, RefreshCw } from 'lucide-react';

interface ConfigPanelProps {
  segments: CurveSegment[];
  setSegments: React.Dispatch<React.SetStateAction<CurveSegment[]>>;
  feeSchedule: FeeSchedule;
  setFeeSchedule: React.Dispatch<React.SetStateAction<FeeSchedule>>;
  migration: MigrationConfig;
  setMigration: React.Dispatch<React.SetStateAction<MigrationConfig>>;
  onLoadStrategy: (strategyId: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  segments,
  setSegments,
  feeSchedule,
  setFeeSchedule,
  migration,
  setMigration,
  onLoadStrategy,
}) => {
  const [activeTab, setActiveTab] = useState<'CURVE' | 'FEES' | 'MIGRATION'>('CURVE');

  // Add a new segment
  const handleAddSegment = () => {
    if (segments.length >= 16) return; // Meteora DBC 16 max segments
    const lastSeg = segments[segments.length - 1];
    const newLower = lastSeg ? lastSeg.pUpper : 0.00001;
    const newUpper = newLower * 1.5;

    const newSeg: CurveSegment = {
      segmentIndex: segments.length,
      label: `Segment ${segments.length + 1}`,
      type: 'STANDARD',
      pLower: newLower,
      pUpper: newUpper,
      liquidityWeight: 5,
    };
    setSegments([...segments, newSeg]);
  };

  // Remove segment
  const handleRemoveSegment = (idx: number) => {
    if (segments.length <= 1) return;
    const filtered = segments.filter((_, i) => i !== idx).map((s, i) => ({ ...s, segmentIndex: i }));
    setSegments(filtered);
  };

  // Update specific segment field
  const handleUpdateSegment = (idx: number, field: keyof CurveSegment, val: any) => {
    const updated = [...segments];
    updated[idx] = { ...updated[idx], [field]: val };
    setSegments(updated);
  };

  return (
    <div className="w-full bg-[#0a0c12] border border-[#1f232f] rounded-xl p-5 font-mono text-xs space-y-4">
      {/* Top row: Presets & Section Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#181b24]">
        {/* Preset Loader Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[#7f889b] text-[11px]">Load Preset:</span>
          <select
            onChange={(e) => onLoadStrategy(e.target.value)}
            className="bg-[#12151f] border border-[#232734] rounded px-2.5 py-1 text-white text-xs focus:outline-none cursor-pointer"
            defaultValue="conviction-ladder"
          >
            {CURATED_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.versions[0].version})
              </option>
            ))}
          </select>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center space-x-1 bg-[#12141c] p-1 rounded-lg border border-[#1f232f]">
          <button
            onClick={() => setActiveTab('CURVE')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeTab === 'CURVE' ? 'bg-[#ff5c16] text-white font-bold' : 'text-[#a5b0c4] hover:text-white'
            }`}
          >
            1. Curve Segments ({segments.length})
          </button>
          <button
            onClick={() => setActiveTab('FEES')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeTab === 'FEES' ? 'bg-[#ff5c16] text-white font-bold' : 'text-[#a5b0c4] hover:text-white'
            }`}
          >
            2. Fee Schedule
          </button>
          <button
            onClick={() => setActiveTab('MIGRATION')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeTab === 'MIGRATION' ? 'bg-[#ff5c16] text-white font-bold' : 'text-[#a5b0c4] hover:text-white'
            }`}
          >
            3. DAMM v2 Migration
          </button>
        </div>
      </div>

      {/* TAB 1: CURVE SEGMENTS */}
      {activeTab === 'CURVE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a5b0c4]">
              Meteora DBC supports 1 to 16 piecewise price segments.
            </span>
            {segments.length < 16 && (
              <button
                onClick={handleAddSegment}
                className="px-2.5 py-1 bg-[#141722] hover:bg-[#1f2436] border border-[#232734] text-[#00d2c4] rounded flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Segment
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {segments.map((seg, idx) => (
              <div
                key={seg.segmentIndex}
                className="p-3 bg-[#11131c] border border-[#1f232f] rounded-lg grid grid-cols-1 sm:grid-cols-6 gap-3 items-center"
              >
                {/* Segment label & type */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#ff5c16] font-bold">#{idx + 1}</span>
                    <input
                      type="text"
                      value={seg.label}
                      onChange={(e) => handleUpdateSegment(idx, 'label', e.target.value)}
                      className="bg-transparent text-white font-medium border-b border-[#232734] focus:border-[#ff5c16] focus:outline-none w-full"
                    />
                  </div>
                  <select
                    value={seg.type}
                    onChange={(e) => handleUpdateSegment(idx, 'type', e.target.value)}
                    className="bg-[#161924] border border-[#232734] rounded px-1.5 py-0.5 text-[10px] text-[#00d2c4] focus:outline-none cursor-pointer"
                  >
                    <option value="SHELF">SHELF (Deep Accumulation)</option>
                    <option value="RISER">RISER (Velocity Breakout)</option>
                    <option value="STANDARD">STANDARD (Constant Depth)</option>
                  </select>
                </div>

                {/* Lower price */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#7f889b]">P Lower:</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={seg.pLower}
                    onChange={(e) => handleUpdateSegment(idx, 'pLower', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#161924] border border-[#232734] rounded px-2 py-1 text-white text-[11px] focus:outline-none"
                  />
                </div>

                {/* Upper price */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#7f889b]">P Upper:</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={seg.pUpper}
                    onChange={(e) => handleUpdateSegment(idx, 'pUpper', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#161924] border border-[#232734] rounded px-2 py-1 text-white text-[11px] focus:outline-none"
                  />
                </div>

                {/* Liquidity weight */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#7f889b]">Liquidity Weight (L):</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={seg.liquidityWeight}
                    onChange={(e) => handleUpdateSegment(idx, 'liquidityWeight', parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#161924] border border-[#232734] rounded px-2 py-1 text-white text-[11px] focus:outline-none"
                  />
                </div>

                {/* Delete button */}
                <div className="flex justify-end sm:justify-center">
                  <button
                    disabled={segments.length <= 1}
                    onClick={() => handleRemoveSegment(idx)}
                    className="p-1.5 rounded hover:bg-[#202434] text-[#7f889b] hover:text-red-400 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FEE SCHEDULE */}
      {activeTab === 'FEES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Base Fee Mode */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-lg">
            <span className="text-[#a5b0c4] font-bold">Base Fee Mode:</span>
            <select
              value={feeSchedule.baseFeeMode}
              onChange={(e) => setFeeSchedule({ ...feeSchedule, baseFeeMode: e.target.value as any })}
              className="w-full bg-[#161924] border border-[#232734] rounded px-2 py-1 text-white focus:outline-none cursor-pointer"
            >
              <option value="FEE_SCHEDULER_EXPONENTIAL">Exponential Decay (Anti-Snipe)</option>
              <option value="FEE_SCHEDULER_LINEAR">Linear Decay</option>
              <option value="FIXED">Fixed Fee (Standard / RWA)</option>
            </select>
            <p className="text-[10px] text-[#7f889b]">
              Exponential decay sharply suppresses MEV bot front-running in the first seconds.
            </p>
          </div>

          {/* Starting vs Ending Fee Bps */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-lg">
            <div className="flex justify-between text-[#a5b0c4]">
              <span>Starting Fee:</span>
              <span className="text-white font-bold">{feeSchedule.startingFeeBps / 100}% ({feeSchedule.startingFeeBps} bps)</span>
            </div>
            <input
              type="range"
              min="25"
              max="1500"
              step="25"
              value={feeSchedule.startingFeeBps}
              onChange={(e) => setFeeSchedule({ ...feeSchedule, startingFeeBps: parseInt(e.target.value, 10) })}
              className="w-full accent-[#ff5c16] cursor-pointer"
            />
            <div className="flex justify-between text-[#a5b0c4] pt-1">
              <span>Ending Fee:</span>
              <span className="text-white font-bold">{feeSchedule.endingFeeBps / 100}% ({feeSchedule.endingFeeBps} bps)</span>
            </div>
            <input
              type="range"
              min="25"
              max="500"
              step="25"
              value={feeSchedule.endingFeeBps}
              onChange={(e) => setFeeSchedule({ ...feeSchedule, endingFeeBps: parseInt(e.target.value, 10) })}
              className="w-full accent-[#00d2c4] cursor-pointer"
            />
          </div>

          {/* Duration Seconds */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-lg">
            <div className="flex justify-between text-[#a5b0c4]">
              <span>Decay Duration:</span>
              <span className="text-white font-bold">{feeSchedule.totalDurationSeconds}s ({Math.round(feeSchedule.totalDurationSeconds / 60)} min)</span>
            </div>
            <input
              type="range"
              min="30"
              max="900"
              step="30"
              value={feeSchedule.totalDurationSeconds}
              onChange={(e) => setFeeSchedule({ ...feeSchedule, totalDurationSeconds: parseInt(e.target.value, 10) })}
              className="w-full accent-[#ff5c16] cursor-pointer"
            />
          </div>

          {/* Dynamic Volatility Fee Toggle */}
          <div className="p-3 bg-[#11131c] border border-[#1f232f] rounded-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-white font-bold">Dynamic Fee (Volatility Engine)</span>
              <p className="text-[10px] text-[#7f889b]">Automatically scales fee upwards during violent swings.</p>
            </div>
            <input
              type="checkbox"
              checked={feeSchedule.dynamicFeeEnabled}
              onChange={(e) => setFeeSchedule({ ...feeSchedule, dynamicFeeEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#ff5c16] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* TAB 3: DAMM V2 MIGRATION */}
      {activeTab === 'MIGRATION' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quote Mint selector */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-lg">
            <span className="text-[#a5b0c4] font-bold">Quote Asset:</span>
            <select
              value={migration.quoteSymbol}
              onChange={(e) => {
                const sym = e.target.value as QuoteTokenSymbol;
                const info = VERIFIED_QUOTE_MINTS[sym];
                setMigration({
                  ...migration,
                  quoteSymbol: sym,
                  quoteMint: info.mint,
                  migrationQuoteThreshold: info.minKeeperThreshold,
                });
              }}
              className="w-full bg-[#161924] border border-[#232734] rounded px-2 py-1 text-white focus:outline-none cursor-pointer"
            >
              {Object.keys(VERIFIED_QUOTE_MINTS).map((k) => (
                <option key={k} value={k}>
                  {k} ({VERIFIED_QUOTE_MINTS[k as QuoteTokenSymbol].name})
                </option>
              ))}
            </select>
          </div>

          {/* Migration Threshold */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-lg">
            <div className="flex justify-between text-[#a5b0c4]">
              <span>Migration Quote Threshold:</span>
              <span className="text-white font-bold">{migration.migrationQuoteThreshold} {migration.quoteSymbol}</span>
            </div>
            <input
              type="number"
              min="1"
              value={migration.migrationQuoteThreshold}
              onChange={(e) => setMigration({ ...migration, migrationQuoteThreshold: parseFloat(e.target.value) || 10 })}
              className="w-full bg-[#161924] border border-[#232734] rounded px-2 py-1 text-white focus:outline-none"
            />
          </div>

          {/* Migrated DAMM v2 Fee config */}
          <div className="space-y-1.5 p-3 bg-[#11131c] border border-[#1f232f] rounded-lg sm:col-span-2">
            <span className="text-[#a5b0c4] font-bold">Graduated DAMM v2 Pool Fee Tier:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {DAMM_V2_FEE_CONFIGS.slice(0, 6).map((cfg) => (
                <button
                  key={cfg.tier}
                  onClick={() =>
                    setMigration({
                      ...migration,
                      migratedDammV2FeeBps: cfg.feeBps,
                      migratedDammV2ConfigKey: cfg.address,
                    })
                  }
                  className={`p-2 rounded text-left border transition-all cursor-pointer ${
                    migration.migratedDammV2ConfigKey === cfg.address
                      ? 'bg-[#161a25] border-[#ff5c16] text-white font-bold'
                      : 'bg-[#11131c] border-[#1f232f] text-[#7f889b] hover:text-[#f1f3f9]'
                  }`}
                >
                  <div className="text-white text-xs">{cfg.feePct} ({cfg.feeBps} bps)</div>
                  <div className="text-[9px] text-[#7f889b] truncate">{cfg.recommendedFor}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
