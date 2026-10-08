'use client';

import React from 'react';
import { Strategy } from '@/types/strategy';
import { X, ShieldCheck, AlertTriangle, Info, CheckCircle2, Calculator } from 'lucide-react';

interface ScoreBreakdownModalProps {
  strategy: Strategy;
  onClose: () => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({ strategy, onClose }) => {
  const v = strategy.versions[0];
  const { score, metrics } = v;

  const components = [
    {
      name: 'Graduation Success',
      weight: '25%',
      maxPts: 25,
      actualPts: score.graduationSuccess,
      formula: 'Graduation Rate × 25',
      metricValue: `${(metrics.graduationRate * 100).toFixed(1)}%`,
      description: 'Percentage of pools launched with this curve that reached the quote threshold and migrated to DAMM v2.',
    },
    {
      name: 'Risk-Adjusted Outcome',
      weight: '20%',
      maxPts: 20,
      actualPts: score.riskAdjustedOutcome,
      formula: 'Normalized Sharpe Estimate × 20',
      metricValue: `${metrics.sharpeRatioEstimate.toFixed(2)} Sharpe`,
      description: 'Price trajectory stability relative to volatility and max drawdown across all observed launches.',
    },
    {
      name: 'Liquidity Quality',
      weight: '15%',
      maxPts: 15,
      actualPts: score.liquidityQuality,
      formula: '15 × (1 - Wash Trading Discount)',
      metricValue: `-${(metrics.washTradingDiscount * 100).toFixed(0)}% Discount`,
      description: 'Measures organic buy depth and discounts volume from circular or suspected wash-trading wallets.',
    },
    {
      name: 'Holder Distribution',
      weight: '15%',
      maxPts: 15,
      actualPts: score.holderDistribution,
      formula: '15 × (1 - Gini Coefficient)',
      metricValue: `${metrics.holderGiniCoefficient.toFixed(2)} Gini`,
      description: 'Degree of token supply decentralization among unique buyers. Lower concentration = higher score.',
    },
    {
      name: 'Drawdown Control',
      weight: '10%',
      maxPts: 10,
      actualPts: score.drawdownControl,
      formula: '10 × (1 - Avg Max Drawdown / 0.50)',
      metricValue: `${(metrics.maxDrawdownAvg * 100).toFixed(1)}% Max DD`,
      description: 'Ability of the bonding curve piecewise shelves to cushion against dump cascades.',
    },
    {
      name: 'Fee Efficiency',
      weight: '5%',
      maxPts: 5,
      actualPts: score.feeEfficiency,
      formula: 'Normalized Trading Fee Capture Ratio',
      metricValue: `${((metrics.totalTradingFeesQuote / (metrics.totalVolumeQuote || 1)) * 100).toFixed(2)}% Captured`,
      description: 'Healthy trading fee capture for partners and creators without strangling trading velocity.',
    },
    {
      name: 'Consistency',
      weight: '10%',
      maxPts: 10,
      actualPts: score.consistency,
      formula: 'Sample Size Significance Factor (N / 20)',
      metricValue: `${metrics.totalLaunches} Observed Launches`,
      description: 'Reward for empirical repeatability across multiple independent market environments.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div 
        className="w-full max-w-2xl bg-[#0e1017] border border-[#232734] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1f232f] bg-[#12151f]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff5c16]/15 flex items-center justify-center text-[#ff5c16]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>Tessera Score Audit: {strategy.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#ff5c16]/20 text-[#ff5c16]">
                  {score.tesseraScore} / 100
                </span>
              </h3>
              <p className="text-xs text-[#7f889b]">Version {v.version} • Author: {strategy.author.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7f889b] hover:text-white hover:bg-[#1f232f] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confidence & Anti-gaming warning bar */}
        <div className="px-5 py-3 bg-[#0a0c12] border-b border-[#181b24] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[#7f889b]">Confidence Interval (95% CI):</span>
            <span className="text-[#00d2c4] font-bold">
              [{score.confidenceInterval[0]} — {score.confidenceInterval[1]}]
            </span>
          </div>

          <div>
            {score.isInsufficientData ? (
              <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3 h-3" /> INSUFFICIENT DATA (N &lt; 3)
              </span>
            ) : (
              <span className="text-[#10b981] flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Statistically Verified (N={score.sampleSize})
              </span>
            )}
          </div>
        </div>

        {/* 7 Component Breakdown List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 font-mono">
          {components.map((comp) => (
            <div
              key={comp.name}
              className="p-3 bg-[#12151e] border border-[#1f232f] rounded-xl space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold">{comp.name}</span>
                  <span className="text-[10px] text-[#7f889b]">({comp.weight})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-[#00d2c4]">{comp.metricValue}</span>
                  <span className="text-white font-bold bg-[#1a1e2b] px-1.5 py-0.5 rounded border border-[#262c3e]">
                    {comp.actualPts} / {comp.maxPts} pts
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#090a0f] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff5c16] to-[#00d2c4] rounded-full"
                  style={{ width: `${(comp.actualPts / comp.maxPts) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[10px] text-[#7f889b]">
                <span>{comp.formula}</span>
                <span className="text-right truncate max-w-xs">{comp.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Anti-gaming policy footer */}
        <div className="p-4 bg-[#090b10] border-t border-[#1f232f] flex items-center justify-between text-[11px] font-mono text-[#7f889b]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#00d2c4]" />
            <span>Outliers trimmed. Survivorship bias discounted. Zero paid promotion.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#181b24] hover:bg-[#232734] text-white rounded-lg cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
