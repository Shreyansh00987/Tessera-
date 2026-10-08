'use client';

import React from 'react';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Lock, 
  Clock, 
  Coins 
} from 'lucide-react';
import { 
  METEORA_MIGRATION_KEEPERS, 
  VERIFIED_QUOTE_MINTS, 
  DAMM_V2_FEE_CONFIGS, 
  METEORA_DBC_PROGRAM_ID, 
  METEORA_DAMM_V2_PROGRAM_ID 
} from '@/lib/meteora/constants';

export const GraduationLifecycle: React.FC = () => {
  const lifecycleSteps = [
    {
      num: 1,
      title: '1. Virtual Bonding Curve',
      subtitle: 'DBC Program Execution',
      desc: 'Traders buy and sell along the configured multi-segment curve. Liquidity builds organically in the quote vault.',
      status: 'ACTIVE',
      color: 'border-[#ff5c16] text-[#ff5c16]',
    },
    {
      num: 2,
      title: '2. Threshold Verification',
      subtitle: 'Quote Reserve Breach',
      desc: 'Quote vault crosses the target migration threshold (e.g. 10 SOL or 750 USDC). The bonding curve marks completion.',
      status: 'VERIFIED',
      color: 'border-[#00d2c4] text-[#00d2c4]',
    },
    {
      num: 3,
      title: '3. Autonomous Keepers',
      subtitle: 'Meteora Keepers Trigger',
      desc: 'Off-chain keeper nodes detect eligibility and dispatch migrateToDammV2 instructions trustlessly on Solana.',
      status: 'AUTONOMOUS',
      color: 'border-[#10b981] text-[#10b981]',
    },
    {
      num: 4,
      title: '4. DAMM v2 Migration',
      subtitle: 'Constant-Product AMM',
      desc: 'Remaining base tokens and net quote reserves seed a live DAMM v2 pool. Opening price strictly matches DBC curve exit price.',
      status: 'GRADUATED',
      color: 'border-[#8b5cf6] text-[#8b5cf6]',
    },
    {
      num: 5,
      title: '5. Permanent LP Lock',
      subtitle: 'Post-Graduation Liquidity',
      desc: '100% of migrated LP tokens are locked permanently via Meteora locker PDA, ensuring rug-proof perpetual market depth.',
      status: 'LOCKED',
      color: 'border-[#10b981] text-[#10b981]',
    },
    {
      num: 6,
      title: '6. DLMM Strategy Pack',
      subtitle: 'Concentrated Liquidity Bins',
      desc: 'Optional transition into active DLMM bin strategies for dynamic volatility harvesting post-graduation.',
      status: 'READY',
      color: 'border-[#00d2c4] text-[#00d2c4]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f232f] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#10b981] mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>MIGRATION &amp; POST-GRADUATION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Graduation Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-[#7f889b] mt-1 font-mono">
            How Tessera launch strategies migrate autonomously from Meteora DBC into permanent DAMM v2 pools.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0e1119] border border-[#1f232f] text-[11px] font-mono text-[#a5b0c4]">
          <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
          <span>100% On-Chain Verifiable Keepers</span>
        </div>
      </div>

      {/* 6-STAGE VISUAL LIFECYCLE ROADMAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {lifecycleSteps.map((step) => (
          <div
            key={step.num}
            className={`p-5 bg-[#0a0c12] border rounded-xl space-y-2.5 transition-all hover:shadow-lg ${step.color}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">{step.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#141722] border border-[#232734] font-bold">
                {step.status}
              </span>
            </div>
            <div className="text-[11px] text-[#00d2c4]">{step.subtitle}</div>
            <p className="text-[#a5b0c4] text-xs leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* LIVE KEEPERS & THRESHOLD TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Active Autonomous Keepers */}
        <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
            <span className="text-white font-bold uppercase text-[11px]">
              Meteora Mainnet Keepers
            </span>
            <span className="text-[10px] text-[#10b981] flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              2 Keepers Online
            </span>
          </div>

          <p className="text-[#a5b0c4] text-xs leading-relaxed">
            Meteora operates autonomous background keeper services that automatically detect when DBC pools reach their quote threshold and execute graduation CPIs to DAMM v2.
          </p>

          <div className="space-y-2">
            {METEORA_MIGRATION_KEEPERS.map((k, i) => (
              <div
                key={k.address}
                className="p-3 bg-[#11131c] border border-[#1f232f] rounded-lg flex items-center justify-between text-[11px]"
              >
                <div>
                  <div className="text-white font-bold">{k.label}</div>
                  <div className="text-[#7f889b] text-[10px]">{k.address}</div>
                </div>
                <a
                  href={k.explorer}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded bg-[#161a25] hover:bg-[#222736] text-[#ff5c16] border border-[#232734] flex items-center gap-1 text-[10px]"
                >
                  <span>Solscan</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Quote Migration Thresholds */}
        <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
            <span className="text-white font-bold uppercase text-[11px]">
              Keeper Graduation Thresholds
            </span>
            <span className="text-[10px] text-[#00d2c4]">Official Meteora Standards</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {Object.values(VERIFIED_QUOTE_MINTS).map((q) => (
              <div
                key={q.symbol}
                className="p-2.5 bg-[#11131c] border border-[#1f232f] rounded-lg flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{q.name} ({q.symbol})</span>
                </div>
                <span className="text-[#10b981] font-bold">
                  {q.minKeeperThreshold} {q.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DAMM V2 FEE CONFIG KEYS MAP */}
      <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
          <span className="text-white font-bold uppercase text-[11px]">
            Verified DAMM v2 Migration Fee Config Keys
          </span>
          <span className="text-[10px] text-[#7f889b]">Exact On-Chain Accounts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAMM_V2_FEE_CONFIGS.map((cfg) => (
            <div key={cfg.tier} className="p-3 bg-[#11131c] border border-[#1f232f] rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">{cfg.feePct} ({cfg.feeBps} bps)</span>
                <span className="text-[10px] text-[#ff5c16]">Tier {cfg.tier}</span>
              </div>
              <div className="text-[10px] text-[#00d2c4] truncate">{cfg.address}</div>
              <div className="text-[10px] text-[#7f889b]">{cfg.recommendedFor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
