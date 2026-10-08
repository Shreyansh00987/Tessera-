'use client';

import React, { useState, useMemo } from 'react';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { Strategy } from '@/types/strategy';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  Info, 
  CheckCircle2, 
  HelpCircle,
  Flame,
  Award
} from 'lucide-react';
import Link from 'next/link';

type LeaderboardMode =
  | 'BEST_OVERALL'
  | 'HIGHEST_GRADUATION'
  | 'LOWEST_DRAWDOWN'
  | 'HIGHEST_VOLUME'
  | 'BEST_RISK_ADJUSTED'
  | 'MOST_CONSISTENT'
  | 'NEW_STRATEGIES';

export const StrategyLeaderboard: React.FC = () => {
  const [mode, setMode] = useState<LeaderboardMode>('BEST_OVERALL');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const modeDescriptions: Record<LeaderboardMode, { title: string; methodology: string }> = {
    BEST_OVERALL: {
      title: 'Best Overall (Tessera Score Composite)',
      methodology:
        'Ranked by composite Tessera Score (0-100) combining Graduation (25%), Risk (20%), Liquidity (15%), Holder Gini (15%), Drawdown (10%), Fee (5%), and Consistency (10%). Sample size discounted.',
    },
    HIGHEST_GRADUATION: {
      title: 'Highest Graduation Rate',
      methodology:
        'Ranked strictly by verified percentage of pool launches reaching the quote threshold and migrating into Meteora DAMM v2. Filtered for minimum 5 observed launches.',
    },
    LOWEST_DRAWDOWN: {
      title: 'Lowest Drawdown (Capital Preservation)',
      methodology:
        'Ranked by smallest average peak-to-trough price drawdown across curve trading phases. Prioritizes deep shelf stabilization and anti-dump buffer curves.',
    },
    HIGHEST_VOLUME: {
      title: 'Highest Volume Powered',
      methodology:
        'Ranked by total quote token volume routed across all pools utilizing the strategy. Volume discounted by detected circular and wash-trading ratio.',
    },
    BEST_RISK_ADJUSTED: {
      title: 'Best Risk-Adjusted Outcome',
      methodology:
        'Ranked by normalized Sharpe ratio proxy (price upward progression divided by volatility and maximum downside deviation).',
    },
    MOST_CONSISTENT: {
      title: 'Most Consistent (High Sample Size)',
      methodology:
        'Prioritizes strategies tested across at least 20+ independent market launches with the lowest standard deviation in time-to-graduation.',
    },
    NEW_STRATEGIES: {
      title: 'New & Experimental Strategies',
      methodology:
        'Recently registered configurations with small sample sizes (N < 3). Clearly flagged as INSUFFICIENT DATA until proven across multiple launches.',
    },
  };

  const sortedStrategies = useMemo(() => {
    return [...CURATED_STRATEGIES].sort((a, b) => {
      const vA = a.versions[0];
      const vB = b.versions[0];

      if (mode === 'BEST_OVERALL') {
        return vB.score.tesseraScore - vA.score.tesseraScore;
      } else if (mode === 'HIGHEST_GRADUATION') {
        return vB.metrics.graduationRate - vA.metrics.graduationRate;
      } else if (mode === 'LOWEST_DRAWDOWN') {
        return vA.metrics.maxDrawdownAvg - vB.metrics.maxDrawdownAvg;
      } else if (mode === 'HIGHEST_VOLUME') {
        return vB.metrics.totalVolumeQuote - vA.metrics.totalVolumeQuote;
      } else if (mode === 'BEST_RISK_ADJUSTED') {
        return vB.metrics.sharpeRatioEstimate - vA.metrics.sharpeRatioEstimate;
      } else if (mode === 'MOST_CONSISTENT') {
        return vB.metrics.totalLaunches - vA.metrics.totalLaunches;
      } else if (mode === 'NEW_STRATEGIES') {
        return vA.metrics.totalLaunches - vB.metrics.totalLaunches;
      }
      return 0;
    });
  }, [mode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Title & Tagline */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f232f] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff5c16] mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>EMPIRICAL PERFORMANCE RANKINGS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Strategy Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#7f889b] mt-1 font-mono">
            Transparent quantitative ranking derived from real on-chain Meteora DBC &amp; DAMM v2 outcomes.
          </p>
        </div>

        {/* Methodology link */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0e1119] border border-[#1f232f] text-[11px] font-mono text-[#a5b0c4]">
          <Info className="w-4 h-4 text-[#00d2c4] shrink-0" />
          <span>Zero Paid Boosts • Verifiable Confidence Intervals</span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'BEST_OVERALL', label: 'Best Overall' },
          { id: 'HIGHEST_GRADUATION', label: 'Highest Graduation' },
          { id: 'LOWEST_DRAWDOWN', label: 'Lowest Drawdown' },
          { id: 'HIGHEST_VOLUME', label: 'Highest Volume' },
          { id: 'BEST_RISK_ADJUSTED', label: 'Best Risk-Adjusted' },
          { id: 'MOST_CONSISTENT', label: 'Most Consistent' },
          { id: 'NEW_STRATEGIES', label: 'New Strategies' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as LeaderboardMode)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
              mode === tab.id
                ? 'bg-[#161923] text-white border-[#ff5c16] shadow-sm font-bold'
                : 'bg-[#0b0d13] text-[#7f889b] border-[#181b24] hover:text-[#f1f3f9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Methodology Banner for Current Mode */}
      <div className="p-4 bg-[#0d0f17] border border-[#1f232f] rounded-xl flex items-start space-x-3 text-xs font-mono">
        <Info className="w-4 h-4 text-[#ff5c16] mt-0.5 shrink-0" />
        <div>
          <div className="text-white font-bold">{modeDescriptions[mode].title}</div>
          <div className="text-[#a5b0c4] mt-0.5 leading-relaxed">{modeDescriptions[mode].methodology}</div>
        </div>
      </div>

      {/* Leaderboard Data Table */}
      <div className="w-full bg-[#0d0f16] border border-[#1f232f] rounded-xl overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1f232f] bg-[#12151e] text-[10px] uppercase tracking-wider text-[#7f889b]">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Strategy &amp; Author</th>
                <th className="py-3 px-4">Asset Class</th>
                <th className="py-3 px-4">Launches (N)</th>
                <th className="py-3 px-4">Graduation Rate</th>
                <th className="py-3 px-4">Avg Drawdown</th>
                <th className="py-3 px-4">Holder Gini</th>
                <th className="py-3 px-4">Total Volume</th>
                <th className="py-3 px-4 text-right">Tessera Score</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b24]">
              {sortedStrategies.map((strat, index) => {
                const v = strat.versions[0];
                const { score, metrics, migration } = v;
                return (
                  <tr
                    key={strat.id}
                    className="hover:bg-[#131622] transition-colors cursor-pointer group"
                    onClick={() => setSelectedStrategy(strat)}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center font-bold text-sm">
                      {index === 0 ? (
                        <span className="text-[#ff5c16]">#1</span>
                      ) : index === 1 ? (
                        <span className="text-[#00d2c4]">#2</span>
                      ) : index === 2 ? (
                        <span className="text-[#10b981]">#3</span>
                      ) : (
                        <span className="text-[#7f889b]">#{index + 1}</span>
                      )}
                    </td>

                    {/* Strategy info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="font-bold text-white group-hover:text-[#ff5c16] transition-colors">
                          {strat.name}
                        </div>
                        {strat.isFlagship && (
                          <span className="text-[9px] px-1 py-0.2 bg-[#ff5c16]/20 text-[#ff5c16] rounded border border-[#ff5c16]/40 font-bold">
                            FLAGSHIP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#7f889b] flex items-center space-x-1 mt-0.5">
                        <span>by {strat.author.name}</span>
                        {strat.author.verified && (
                          <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                        )}
                        <span>• {v.version}</span>
                      </div>
                    </td>

                    {/* Asset Class */}
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-[#161924] border border-[#232734] text-[10px] text-[#a5b0c4]">
                        {strat.assetClass}
                      </span>
                    </td>

                    {/* Sample Size */}
                    <td className="py-3 px-4 text-[#a5b0c4]">
                      {metrics.totalLaunches}
                    </td>

                    {/* Graduation Rate */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#10b981] font-bold">
                          {(metrics.graduationRate * 100).toFixed(1)}%
                        </span>
                        <div className="w-12 h-1 bg-[#181b24] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-[#10b981] rounded-full"
                            style={{ width: `${metrics.graduationRate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Max Drawdown */}
                    <td className="py-3 px-4 text-white">
                      {(metrics.maxDrawdownAvg * 100).toFixed(1)}%
                    </td>

                    {/* Holder Gini */}
                    <td className="py-3 px-4 text-[#a5b0c4]">
                      {metrics.holderGiniCoefficient.toFixed(2)}
                    </td>

                    {/* Total Volume */}
                    <td className="py-3 px-4 text-white font-medium">
                      {metrics.totalVolumeQuote.toLocaleString()} {migration.quoteSymbol}
                    </td>

                    {/* Score */}
                    <td className="py-3 px-4 text-right">
                      {score.isInsufficientData ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold">
                          <AlertTriangle className="w-2.5 h-2.5" /> N &lt; 3
                        </div>
                      ) : (
                        <div className="inline-block px-2 py-0.5 rounded bg-[#ff5c16]/15 text-[#ff5c16] border border-[#ff5c16]/30 font-black text-sm">
                          {score.tesseraScore}
                        </div>
                      )}
                      <div className="text-[9px] text-[#7f889b] mt-0.5">
                        CI: [{score.confidenceInterval[0]}-{score.confidenceInterval[1]}]
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedStrategy(strat)}
                          className="px-2 py-1 rounded bg-[#161a25] hover:bg-[#202534] text-[#00d2c4] hover:text-white border border-[#232734] transition-colors cursor-pointer text-[10px]"
                        >
                          Audit Math
                        </button>
                        <Link
                          href={`/curvelab?strategy=${strat.id}`}
                          className="px-2 py-1 rounded bg-[#ff5c16]/15 hover:bg-[#ff5c16]/25 text-[#ff5c16] border border-[#ff5c16]/30 transition-colors cursor-pointer text-[10px] font-bold"
                        >
                          Simulate
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Breakdown Modal when row clicked */}
      {selectedStrategy && (
        <ScoreBreakdownModal
          strategy={selectedStrategy}
          onClose={() => setSelectedStrategy(null)}
        />
      )}
    </div>
  );
};
