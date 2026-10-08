'use client';

import React, { useState, useMemo } from 'react';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { StrategyCard } from './StrategyCard';
import { AssetClass, QuoteTokenSymbol } from '@/types/strategy';
import { Search, Filter, Layers, AlertCircle, ArrowUpDown, ShieldCheck, Sparkles, DollarSign } from 'lucide-react';

export const StrategyMarketplace: React.FC = () => {
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass | 'ALL'>('ALL');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('ALL');
  const [onlyGrantEligible, setOnlyGrantEligible] = useState<boolean>(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteTokenSymbol | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'SCORE' | 'GRADUATION' | 'DRAWDOWN' | 'LAUNCHES'>('SCORE');

  const assetClasses: (AssetClass | 'ALL')[] = [
    'ALL',
    'EQUITY',
    'RWA',
    'UTILITY',
    'MEME',
    'AI',
    'THIN_MARKET',
  ];

  const archetypes = [
    { id: 'ALL', label: 'All Curves' },
    { id: 'STEP_LADDER', label: 'Step Ladder' },
    { id: 'FLAT_CURVE', label: 'Flat Curve' },
    { id: 'EXPONENTIAL_CURVE', label: 'Exponential' },
    { id: 'LONG_CURVE', label: 'Long Curve (xStocks)' },
  ];

  const filteredStrategies = useMemo(() => {
    return CURATED_STRATEGIES.filter((s) => {
      // Asset class filter
      if (selectedAssetClass !== 'ALL' && s.assetClass !== selectedAssetClass) {
        return false;
      }
      // Curve archetype filter
      if (selectedArchetype !== 'ALL' && s.curveArchetype !== selectedArchetype) {
        return false;
      }
      // Grant eligibility filter
      if (onlyGrantEligible && !s.stocklanaGrantEligible) {
        return false;
      }
      // Quote token filter
      if (selectedQuote !== 'ALL' && s.quoteSymbol !== selectedQuote) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesTagline = s.tagline.toLowerCase().includes(q);
        const matchesAuthor = s.author.name.toLowerCase().includes(q);
        const matchesTags = s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesAuthor && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const vA = a.versions[0];
      const vB = b.versions[0];
      if (sortBy === 'SCORE') {
        return vB.score.tesseraScore - vA.score.tesseraScore;
      } else if (sortBy === 'GRADUATION') {
        return vB.metrics.graduationRate - vA.metrics.graduationRate;
      } else if (sortBy === 'DRAWDOWN') {
        return vA.metrics.maxDrawdownAvg - vB.metrics.maxDrawdownAvg; // lower is better
      } else if (sortBy === 'LAUNCHES') {
        return vB.metrics.totalLaunches - vA.metrics.totalLaunches;
      }
      return 0;
    });
  }, [selectedAssetClass, selectedArchetype, onlyGrantEligible, selectedQuote, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Title & Tagline */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1b2236] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff4800] mb-1 font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>DISCOVER, PAY-TO-USE &amp; FORK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            DBC Config Preset Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[#828ea8] mt-1 font-mono">
            Performance-ranked bonding curve presets for tokenized stocks, RWAs, and conviction pools on Meteora DBC.
          </p>
        </div>

        {/* Stocklana Grant & Anti-gaming banner */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#9d4edd]/15 border border-[#9d4edd]/35 text-[11px] font-mono text-[#c084fc]">
            <Sparkles className="w-4 h-4 text-[#c084fc] shrink-0 animate-pulse" />
            <span>Stocklana &amp; World’s Fair Discretionary Grant Eligible</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0e1424] border border-[#1e2740] text-[11px] font-mono text-[#94a3b8]">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span>Anti-Gaming 95% CI</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4">
        {/* Search & Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, tag, author, or archetype..."
              className="w-full bg-[#0a0d17] border border-[#1b2236] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#ff4800] font-mono"
            />
          </div>

          {/* Quote, Grant Toggle & Sort selectors */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto font-mono text-xs">
            {/* Grant Only Toggle */}
            <button
              onClick={() => setOnlyGrantEligible(!onlyGrantEligible)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyGrantEligible
                  ? 'bg-[#9d4edd]/25 border-[#9d4edd] text-[#c084fc] font-bold shadow-glowPurple'
                  : 'bg-[#0a0d17] border-[#1b2236] text-[#828ea8] hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Grants Only</span>
            </button>

            {/* Quote Token selector */}
            <div className="flex items-center space-x-1 bg-[#0a0d17] border border-[#1b2236] rounded-xl p-1">
              <span className="text-[#64748b] px-2 text-[10px]">Quote:</span>
              {(['ALL', 'SOL', 'USDC'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuote(q)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedQuote === q
                      ? 'bg-[#ff4800] text-white font-bold'
                      : 'text-[#828ea8] hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Sort selector */}
            <div className="flex items-center space-x-1.5 bg-[#0a0d17] border border-[#1b2236] rounded-xl px-3 py-1.5 text-xs text-[#828ea8]">
              <ArrowUpDown className="w-3 h-3 text-[#ff4800]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
              >
                <option value="SCORE" className="bg-[#0a0d17]">Tessera Score (Highest)</option>
                <option value="GRADUATION" className="bg-[#0a0d17]">Graduation Rate</option>
                <option value="DRAWDOWN" className="bg-[#0a0d17]">Lowest Drawdown</option>
                <option value="LAUNCHES" className="bg-[#0a0d17]">Most Launches</option>
              </select>
            </div>
          </div>
        </div>

        {/* Archetype Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
          <span className="text-[10px] text-[#64748b] uppercase font-bold shrink-0">Archetype:</span>
          {archetypes.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchetype(arch.id)}
              className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer text-[11px] ${
                selectedArchetype === arch.id
                  ? 'bg-[#151b2c] text-[#00f0ff] border-[#00f0ff] font-bold shadow-sm'
                  : 'bg-[#080b13] text-[#828ea8] border-[#182033] hover:text-white'
              }`}
            >
              {arch.label}
            </button>
          ))}
        </div>

        {/* Asset Class Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          <span className="text-[10px] text-[#64748b] uppercase font-bold shrink-0">Asset Class:</span>
          {assetClasses.map((ac) => (
            <button
              key={ac}
              onClick={() => setSelectedAssetClass(ac)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                selectedAssetClass === ac
                  ? 'bg-[#151b2c] text-white border-[#ff4800] shadow-sm font-bold'
                  : 'bg-[#080b13] text-[#828ea8] border-[#182033] hover:text-white hover:border-[#242f4c]'
              }`}
            >
              {ac === 'ALL' ? 'All Asset Classes' : ac}
            </button>
          ))}
        </div>
      </div>

      {/* Strategies Grid */}
      {filteredStrategies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0a0d17] border border-[#1b2236] rounded-2xl text-xs font-mono space-y-2">
          <AlertCircle className="w-6 h-6 text-[#ff4800] mx-auto" />
          <div className="text-white font-bold">No strategies match your filters</div>
          <div className="text-[#828ea8]">Try clearing your search or switching curve archetypes.</div>
        </div>
      )}
    </div>
  );
};
