'use client';

import React, { useState } from 'react';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { 
  UserCheck, 
  Coins, 
  TrendingUp, 
  Layers, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';

export const AuthorDashboard: React.FC = () => {
  const authorStrategies = CURATED_STRATEGIES.slice(0, 2);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f232f] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#ff4800] mb-1 font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>STRATEGY CREATOR ECONOMY &amp; MONETIZATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Author Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#828ea8] mt-1 font-mono">
            Publish, version, license, and monetize high-performance Meteora DBC launch strategies.
          </p>
        </div>

        <Link
          href="/curvelab"
          className="px-4 py-2 rounded-lg bg-[#ff5c16] hover:bg-[#ff7438] text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-glow cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish New Strategy</span>
        </Link>
      </div>

      {/* Revenue & Volume Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-1">
          <span className="text-[10px] text-[#7f889b]">Total Volume Driven:</span>
          <div className="text-2xl font-black text-white">1,550.7 SOL</div>
          <div className="text-[10px] text-[#10b981]">+18.4% this week</div>
        </div>

        <div className="p-4 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-1">
          <span className="text-[10px] text-[#7f889b]">Total Pools Launched:</span>
          <div className="text-2xl font-black text-[#00d2c4]">62 Pools</div>
          <div className="text-[10px] text-[#7f889b]">84.8% Graduated</div>
        </div>

        <div className="p-4 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-1">
          <span className="text-[10px] text-[#7f889b]">Lifetime Partner Revenue:</span>
          <div className="text-2xl font-black text-[#ff5c16]">39.45 SOL</div>
          <div className="text-[10px] text-[#7f889b]">Trading &amp; Migration Fees</div>
        </div>

        <div className="p-4 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#7f889b]">Claimable Partner Share:</span>
            <div className="text-xl font-bold text-[#10b981]">4.82 SOL</div>
          </div>
          <button
            onClick={() => setClaimSuccess(true)}
            disabled={claimSuccess}
            className="w-full py-1.5 rounded bg-[#161a25] hover:bg-[#212636] border border-[#10b981]/40 text-[#10b981] font-bold text-[11px] transition-colors cursor-pointer"
          >
            {claimSuccess ? 'Claimed via CPI ✓' : 'Claim Partner Share'}
          </button>
        </div>
      </div>

      {/* Published Strategies Versioning Table */}
      <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#181b24]">
          <span className="text-white font-bold uppercase text-[11px]">
            Your Published Strategies &amp; Version History
          </span>
          <span className="text-[10px] text-[#7f889b]">Versioned Immutable Records</span>
        </div>

        <div className="divide-y divide-[#181b24]">
          {authorStrategies.map((strat) => {
            const v = strat.versions[0];
            return (
              <div key={strat.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-white font-sans">{strat.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#ff5c16]/15 text-[#ff5c16] text-[10px] font-bold">
                      {v.version}
                    </span>
                    <span className="text-[11px] text-[#7f889b]">Released: {v.releasedAt}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-[#00d2c4] font-bold">Tessera Score: {v.score.tesseraScore}</span>
                    <Link
                      href={`/curvelab?strategy=${strat.id}`}
                      className="px-2.5 py-1 rounded bg-[#141722] hover:bg-[#1f2436] border border-[#232734] text-white"
                    >
                      Inspect in Lab
                    </Link>
                  </div>
                </div>

                <p className="text-[#a5b0c4] text-xs leading-relaxed">{strat.tagline}</p>
                <div className="text-[11px] text-[#7f889b] bg-[#11131c] p-2 rounded border border-[#181b24]">
                  Changelog: {v.changelog}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
