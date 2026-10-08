'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  History, 
  Rocket, 
  ArrowRightLeft, 
  Cpu, 
  CheckCircle2, 
  Coins,
  ExternalLink,
  Code2,
  Lock,
  Workflow,
  Copy,
  Check,
  Zap,
  Globe2,
  DollarSign
} from 'lucide-react';
import { InteractiveHeroCurve } from './InteractiveHeroCurve';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { METEORA_DBC_PROGRAM_ID, METEORA_DAMM_V2_PROGRAM_ID, METEORA_MIGRATION_KEEPERS } from '@/lib/meteora/constants';
import { Card3D } from '@/components/ui/Card3D';

export const LandingPage: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeDevTab, setActiveDevTab] = useState<'COMPONENT' | 'WEBSOCKET' | 'INVENT' | 'SDK'>('COMPONENT');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const devSnippets = {
    COMPONENT: `<TesseraTradingTerminal
  poolAddress="F9xK...8uI2"
  curveArchetype="STEP_LADDER"
  quoteMint="So11111111111111111111111111111111111111112"
  theme="obsidian-glow"
  onGraduation={(dammV2Pool) => console.log('Graduated to DAMM v2:', dammV2Pool)}
/>`,
    WEBSOCKET: `const ws = new WebSocket('wss://stream.tessera.fi/v1/dbc/pool/F9xK...8uI2/trades');
ws.onmessage = (event) => {
  const trade = JSON.parse(event.data);
  console.log('Live DBC Tick:', trade.priceQuote, 'Segment:', trade.segmentIndex);
};`,
    INVENT: `# Generate and deploy via Meteora Invent CLI
meteora-invent launch \\
  --preset "tessera://xstocks-equity-discovery" \\
  --quote-mint EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v \\
  --keeper-threshold 750 \\
  --migrate-to MET_DAMM_V2`,
    SDK: `import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
import { PublicKey } from '@solana/web3.js';

// Derived from Tessera Config Preset
const dbc = new DynamicBondingCurveClient(connection);
const { txHash } = await dbc.createPoolWithCustomSqrtPrices({
  quoteMint: new PublicKey('EPjFWdd...'),
  segments: tesseraPreset.segments,
  baseFeeMode: tesseraPreset.feeMode,
});`
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 0. DISCRETIONARY BUILDER GRANTS & COLOSSEUM WORLD'S FAIR BANNER */}
      <div className="w-full bg-gradient-to-r from-[#9d4edd]/20 via-[#ff4800]/15 to-[#00f0ff]/20 border-b border-[#9d4edd]/30 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-mono">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#9d4edd]/30 border border-[#9d4edd]/50 text-white font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#c084fc] animate-pulse" />
            <span>STOCKLANA &amp; COLOSSEUM CRYPTO WORLD’S FAIR</span>
          </div>
          <span className="text-[#e2e8f0]">
            Eligible for Discretionary Infrastructure Grants for AI &amp; RWA Builders on Meteora DBC
          </span>
          <span className="text-[#64748b] hidden md:inline">•</span>
          <span className="text-[#00f0ff] font-medium hidden md:inline">
            Judging Access: GitHub ID <span className="underline font-bold text-white">dannxbt</span>
          </span>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ff4800]/10 border border-[#ff4800]/30 text-xs font-mono text-[#ff4800] mb-5 shadow-glow">
            <span className="w-2 h-2 rounded-full bg-[#ff4800] animate-pulse"></span>
            <span>BUILT EXCLUSIVELY FOR METEORA DBC, DAMM V2 &amp; DLMM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-sans leading-[1.05]">
            LAUNCH CONFIGS AS <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4800] via-[#ff8c42] via-40% via-[#a855f7] to-[#00f0ff]">
              PERFORMANCE-RANKED
            </span>
            <br />
            FINANCIAL PRODUCTS.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#94a3b8] font-normal max-w-2xl mx-auto leading-relaxed">
            Tessera is the quantitative strategy marketplace and intelligence layer for Meteora DBC.
            Discover, backtest, simulate, and monetize programmable launch mechanics across tokenized stocks, RWAs, AI, and conviction pools.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/marketplace"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4800] to-[#ff6224] hover:from-[#ff6224] hover:to-[#ff7a45] text-white font-mono text-sm font-bold flex items-center gap-2 shadow-glow transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Preset Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/curvelab"
              className="px-6 py-3 rounded-xl bg-[#0e1320] hover:bg-[#141a2c] text-white border border-[#222a42] hover:border-[#ff4800]/50 font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-[#ff4800]" />
              <span>Open Curve Lab</span>
            </Link>

            <Link
              href="/launch"
              className="px-6 py-3 rounded-xl bg-[#0e1320] hover:bg-[#141a2c] text-[#00f0ff] border border-[#222a42] hover:border-[#00f0ff]/50 font-mono text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-[#00f0ff]" />
              <span>Launch Terminal</span>
            </Link>
          </div>
        </div>

        {/* Hero Interactive Visualization Widget */}
        <div className="mt-4 max-w-5xl mx-auto">
          <InteractiveHeroCurve />
        </div>
      </section>

      {/* 2. LIVE ON-CHAIN STATS TICKER */}
      <section className="w-full bg-[#07090e] border-y border-[#161c2d] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">$64.2M</div>
            <div className="text-[11px] text-[#64748b] uppercase tracking-wider mt-1">DBC Volume Powered</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#10b981]">88.2%</div>
            <div className="text-[11px] text-[#64748b] uppercase tracking-wider mt-1">Flagship Grad Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#00f0ff]">100%</div>
            <div className="text-[11px] text-[#64748b] uppercase tracking-wider mt-1">Permanent DAMM v2 LP</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#a855f7]">16 Segments</div>
            <div className="text-[11px] text-[#64748b] uppercase tracking-wider mt-1">Max Native DBC Depth</div>
          </div>
        </div>
      </section>

      {/* 3. THE 5 HACKATHON INNOVATION PILLARS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] mb-3">
            <span>EXPANDING SOLANA TOKENIZATION ON METEORA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Engineered For Every New Asset Class
          </h2>
          <p className="mt-2 text-sm text-[#828ea8] font-mono">
            Meteora makes Dynamic Bonding Curves programmable. Tessera turns those primitives into production-ready architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Stocklana & Thin Equity Discovery */}
          <Card3D maxTilt={8} glowColor="rgba(168, 85, 247, 0.4)" className="rounded-2xl h-full">
            <div className="p-6 bg-gradient-to-b from-[#0e1322] to-[#090c14] border border-[#1e273e] hover:border-[#a855f7]/50 rounded-2xl space-y-3 transition-all h-full flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(18px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#a855f7]/15 flex items-center justify-center text-[#c084fc]">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/30 font-bold">
                    STOCKLANA / RFQ
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#c084fc] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                  Tokenized Stocks &amp; Thin Equity
                </h3>
                <p className="text-xs text-[#828ea8] leading-relaxed mt-2" style={{ transform: 'translateZ(10px)' }}>
                  Tuned for thinly traded or newly tokenized equities (xStocks, Backpack Onchain, Ondo RFQ catalogs like $xTSLA &amp; $xNVDA).
                  Continuous DBC price discovery eliminates order-book illiquidity freezes and enables orderly keeper graduation into USDC DAMM v2.
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-[#182136]" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-[#a855f7]">Anchor: 750 USDC Keeper</span>
                <Link href="/curvelab?strategy=xstocks-equity-discovery" className="text-[#e2e8f0] hover:text-[#c084fc] flex items-center gap-1 font-bold">
                  <span>View Curve</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Pillar 2: Novel Curve Archetypes */}
          <Card3D maxTilt={8} glowColor="rgba(255, 72, 0, 0.4)" className="rounded-2xl h-full">
            <div className="p-6 bg-gradient-to-b from-[#0e1322] to-[#090c14] border border-[#1e273e] hover:border-[#ff4800]/50 rounded-2xl space-y-3 transition-all h-full flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(18px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#ff4800]/15 flex items-center justify-center text-[#ff4800]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff4800]/15 text-[#ff4800] border border-[#ff4800]/30 font-bold">
                    NOVEL CURVES
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#ff4800] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                  Flat, Exponential &amp; Step Curves
                </h3>
                <p className="text-xs text-[#828ea8] leading-relaxed mt-2" style={{ transform: 'translateZ(10px)' }}>
                  Explore out-of-distribution DBC curves: uniform zero-slippage Flat Curves for RWA institutional credit, steep Exponential Curves with dynamic volatility fee decay for anti-snipe meme virality, and Step Ladders for conviction.
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-[#182136]" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-[#ff4800]">4 Standard Archetypes</span>
                <Link href="/curvelab" className="text-[#e2e8f0] hover:text-[#ff4800] flex items-center gap-1 font-bold">
                  <span>Design in Lab</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Pillar 3: DBC + DAMM v2 + DLMM Composition */}
          <Card3D maxTilt={8} glowColor="rgba(16, 185, 129, 0.4)" className="rounded-2xl h-full">
            <div className="p-6 bg-gradient-to-b from-[#0e1322] to-[#090c14] border border-[#1e273e] hover:border-[#10b981]/50 rounded-2xl space-y-3 transition-all h-full flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(18px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-[#10b981]">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold">
                    TRIPLE STACK
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#10b981] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                  DBC + DAMM v2 + DLMM Flows
                </h3>
                <p className="text-xs text-[#828ea8] leading-relaxed mt-2" style={{ transform: 'translateZ(10px)' }}>
                  Conviction Pools with post-graduation DLMM compounding. Liquidity graduates autonomously from DBC into permanent DAMM v2 AMM pools, then routes concentrated depth into Meteora DLMM dynamic bins for high-efficiency volatility fee capture.
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-[#182136]" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-[#10b981]">100% Permanently Locked</span>
                <Link href="/lifecycle" className="text-[#e2e8f0] hover:text-[#10b981] flex items-center gap-1 font-bold">
                  <span>Inspect Pipeline</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Pillar 4: Developer Tooling & WebSocket Streams */}
          <Card3D maxTilt={8} glowColor="rgba(0, 240, 255, 0.4)" className="rounded-2xl h-full">
            <div className="p-6 bg-gradient-to-b from-[#0e1322] to-[#090c14] border border-[#1e273e] hover:border-[#00f0ff]/50 rounded-2xl space-y-3 transition-all h-full flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(18px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/15 flex items-center justify-center text-[#00f0ff]">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
                    DEV TOOLING
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#00f0ff] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                  Data Streams &amp; Terminal Embeds
                </h3>
                <p className="text-xs text-[#828ea8] leading-relaxed mt-2" style={{ transform: 'translateZ(10px)' }}>
                  Drop-in developer tooling for builders creating custom launchpads and trading terminals. Includes live WebSocket order streams, React component kits, and automated Meteora Invent CLI launch script generators.
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-[#182136]" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-[#00f0ff]">Zero-Config Plug &amp; Play</span>
                <Link href="/developer" className="text-[#e2e8f0] hover:text-[#00f0ff] flex items-center gap-1 font-bold">
                  <span>Explore Tools</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Pillar 5: DBC Preset Marketplace */}
          <Card3D maxTilt={8} glowColor="rgba(245, 158, 11, 0.4)" className="rounded-2xl h-full">
            <div className="p-6 bg-gradient-to-b from-[#0e1322] to-[#090c14] border border-[#1e273e] hover:border-[#f59e0b]/50 rounded-2xl space-y-3 transition-all h-full flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(18px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 font-bold">
                    MARKETPLACE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#f59e0b] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                  Pay-to-Use Config Marketplace
                </h3>
                <p className="text-xs text-[#828ea8] leading-relaxed mt-2" style={{ transform: 'translateZ(10px)' }}>
                  Launchpad founders license audited, battle-tested bonding curve presets directly from quantitative creators. Creators earn on-chain licensing fees and ongoing partner trading fees whenever their curves power volume.
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-[#182136]" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-[#f59e0b]">Creator Monetization</span>
                <Link href="/marketplace" className="text-[#e2e8f0] hover:text-[#f59e0b] flex items-center gap-1 font-bold">
                  <span>Browse Presets</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Pillar 6: AI Copilot & Deterministic Math */}
          <Card3D maxTilt={8} glowColor="rgba(16, 185, 129, 0.4)" className="rounded-2xl h-full">
            <div className="p-6 bg-gradient-to-b from-[#0e1322] to-[#090c14] border border-[#1e273e] hover:border-[#10b981]/50 rounded-2xl space-y-3 transition-all h-full flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(18px)' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-[#10b981]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold">
                    ZERO HALLUCINATION
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans group-hover:text-[#10b981] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                  Copilot &amp; Rigorous Audits
                </h3>
                <p className="text-xs text-[#828ea8] leading-relaxed mt-2" style={{ transform: 'translateZ(10px)' }}>
                  Synthesize natural language launch objectives into strictly validated Meteora DBC configurations. Every curve segment, sqrt price, and fee schedule is verified against official DBC mathematics with zero hallucinated parameters.
                </p>
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-[#182136]" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-[#10b981]">Zod Schema Validated</span>
                <Link href="/copilot" className="text-[#e2e8f0] hover:text-[#10b981] flex items-center gap-1 font-bold">
                  <span>Ask Copilot</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* 4. TRIPLE-STACK ARCHITECTURE FLOW: DBC -> DAMM v2 -> DLMM */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-[#0c101c] via-[#090c15] to-[#07090f] border border-[#1d253b] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ff4800]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-mono text-[#10b981] mb-2 font-bold">
              <span>END-TO-END METEORA PROTOCOL LIFECYCLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
              Conviction Pools: DBC → DAMM v2 → DLMM Composition
            </h2>
            <p className="text-xs sm:text-sm text-[#828ea8] mt-2 font-mono">
              How Tessera harnesses Meteora’s full stack to provide continuous liquidity compounding across a token’s entire lifecycle.
            </p>
          </div>

          {/* Interactive 4-Stage Step Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 bg-[#080b12] border border-[#182033] rounded-2xl relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#ff4800]/20 text-[#ff4800] font-mono font-bold text-xs flex items-center justify-center border border-[#ff4800]/40">
                  01
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141a2a] text-[#ff4800] font-bold">
                  DBC LAUNCH
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Multi-Segment Curve</h4>
              <p className="text-[11px] text-[#717d98] leading-relaxed">
                Initial token offering on Meteora DBC program. Up to 16 configurable segments regulate accumulation shelves and breakout velocity.
              </p>
              <div className="pt-1 text-[10px] font-mono text-[#a855f7]">
                • BaseFeeMode: Exponential Decay<br />
                • Anti-Sniper Volatility Damping
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-[#080b12] border border-[#182033] rounded-2xl relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] font-mono font-bold text-xs flex items-center justify-center border border-[#00f0ff]/40">
                  02
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141a2a] text-[#00f0ff] font-bold">
                  AUTONOMOUS KEEPER
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Graduation Trigger</h4>
              <p className="text-[11px] text-[#717d98] leading-relaxed">
                When quote reserves reach threshold (e.g. 10 SOL or 750 USDC), autonomous keepers call DBC graduation instructions without admin keys.
              </p>
              <div className="pt-1 text-[10px] font-mono text-[#00f0ff]">
                • Asi5DT...3aQs &amp; DeQ8dP...2uSW<br />
                • Automated on-chain execution
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-[#080b12] border border-[#182033] rounded-2xl relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#10b981]/20 text-[#10b981] font-mono font-bold text-xs flex items-center justify-center border border-[#10b981]/40">
                  03
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141a2a] text-[#10b981] font-bold">
                  DAMM V2 AMM
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Permanent Liquidity</h4>
              <p className="text-[11px] text-[#717d98] leading-relaxed">
                Curve liquidity migrates into Meteora DAMM v2 (cp-amm). 100% of initial LP tokens are permanently locked into the pool authority PDA.
              </p>
              <div className="pt-1 text-[10px] font-mono text-[#10b981]">
                • cpamdpZCGKUy5JxQXB...sGG<br />
                • Fixed 25 to 600 bps fee tier
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 bg-[#080b12] border border-[#182033] rounded-2xl relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] font-mono font-bold text-xs flex items-center justify-center border border-[#f59e0b]/40">
                  04
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141a2a] text-[#f59e0b] font-bold">
                  DLMM COMPOUNDING
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Concentrated Bins</h4>
              <p className="text-[11px] text-[#717d98] leading-relaxed">
                Post-graduation protocol fees compound into dynamic DLMM discrete price bins, maximizing capital efficiency and market-making depth.
              </p>
              <div className="pt-1 text-[10px] font-mono text-[#f59e0b]">
                • Active bin fee auto-compounding<br />
                • Concentrated zero-slippage depth
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DBC CONFIG PRESET MARKETPLACE SHOWCASE */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff4800]/10 border border-[#ff4800]/30 text-xs font-mono text-[#ff4800] mb-2 font-bold">
              <span>POPULAR LAUNCHPAD PRESETS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
              Pay-to-Use Config Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-[#828ea8] font-mono mt-1">
              Popular bonding curve configs builders can easily license or fork to launch their own tokens.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="px-4 py-2 rounded-xl bg-[#141a29] hover:bg-[#1a2236] border border-[#232c45] text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>View All Curated Presets</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff4800]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CURATED_STRATEGIES.slice(0, 3).map((strategy) => (
            <Card3D key={strategy.id} maxTilt={9} glowColor="rgba(255, 72, 0, 0.35)" className="rounded-2xl h-full">
              <div className="bg-[#0b0e18] border border-[#1b2236] hover:border-[#ff4800]/40 rounded-2xl p-5 flex flex-col justify-between transition-all h-full group shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3" style={{ transform: 'translateZ(18px)' }}>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff4800]/15 text-[#ff4800] border border-[#ff4800]/30 font-bold">
                      {strategy.assetClass}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-black">
                      SCORE {strategy.versions[0].score.tesseraScore}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#ff4800] transition-colors" style={{ transform: 'translateZ(14px)' }}>
                    {strategy.name}
                  </h3>
                  <p className="text-xs text-[#828ea8] mt-1 line-clamp-2 leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                    {strategy.tagline}
                  </p>

                  <div className="mt-4 p-3 bg-[#070910] border border-[#161d2d] rounded-xl font-mono text-[11px] space-y-1.5" style={{ transform: 'translateZ(12px)' }}>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Graduation Rate:</span>
                      <span className="text-[#10b981] font-bold">
                        {(strategy.versions[0].metrics.graduationRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Max Drawdown:</span>
                      <span className="text-white font-medium">
                        {(strategy.versions[0].metrics.maxDrawdownAvg * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Preset License Cost:</span>
                      <span className="text-[#00f0ff] font-bold">
                        {strategy.presetLicenseCost || 'Free (OSS)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#161c2d] flex items-center gap-2 font-mono text-xs" style={{ transform: 'translateZ(20px)' }}>
                  <Link
                    href={`/launch?strategy=${strategy.id}`}
                    className="w-full py-2 px-3 rounded-lg bg-[#ff4800] hover:bg-[#ff6224] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-glow"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Pay &amp; Launch</span>
                  </Link>
                  <Link
                    href={`/curvelab?strategy=${strategy.id}`}
                    className="py-2 px-3 rounded-lg bg-[#141a29] hover:bg-[#1c243a] border border-[#232c45] text-white font-medium flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#ff4800]" />
                  </Link>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 6. PLUG-AND-PLAY DEVELOPER TOOLING SHOWCASE */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#080b12] border border-[#1b2236] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] mb-2 font-bold">
                <span>DEVELOPER INFRASTRUCTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                Data Streams &amp; Developer Tooling
              </h2>
              <p className="text-xs sm:text-sm text-[#828ea8] font-mono mt-1">
                Easily plug-and-play when building trading terminals, launchpads, or analytics dashboards.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 bg-[#05070a] border border-[#161c2d] rounded-xl text-xs font-mono">
              {(['COMPONENT', 'WEBSOCKET', 'INVENT', 'SDK'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDevTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeDevTab === tab
                      ? 'bg-[#00f0ff] text-black font-bold'
                      : 'text-[#828ea8] hover:text-white'
                  }`}
                >
                  {tab === 'COMPONENT' ? 'React Widget' : tab === 'WEBSOCKET' ? 'WS Stream' : tab === 'INVENT' ? 'Invent CLI' : 'DBC SDK'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Code Window */}
          <div className="relative bg-[#040508] border border-[#161c2c] rounded-2xl p-4 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#121622] text-[#64748b] text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="ml-2 text-white font-bold">
                  {activeDevTab === 'COMPONENT' ? 'TradingTerminal.tsx' : activeDevTab === 'WEBSOCKET' ? 'stream-client.ts' : activeDevTab === 'INVENT' ? 'launch.sh' : 'meteora-dbc.ts'}
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(devSnippets[activeDevTab], activeDevTab)}
                className="flex items-center gap-1.5 text-xs text-[#828ea8] hover:text-white transition-colors cursor-pointer px-2 py-1 rounded bg-[#0d111a] border border-[#192133]"
              >
                {copiedSnippet === activeDevTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-[#10b981]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-[#00f0ff] overflow-x-auto p-2 leading-relaxed whitespace-pre font-mono text-xs">
              {devSnippets[activeDevTab]}
            </pre>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION & HACKATHON MISSION FOOTER BANNER */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-14 bg-gradient-to-r from-[#0d111d] via-[#121727] to-[#0d111d] border border-[#232d47] rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4800]/15 border border-[#ff4800]/40 text-xs font-mono text-[#ff4800]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>METEORA HACKATHON &amp; COLOSSEUM WORLD’S FAIR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
            Ready To Launch On Meteora DBC?
          </h2>

          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-2xl mx-auto font-mono leading-relaxed">
            Deploy token launches with backtested conviction, explore tokenized equity price discovery, or monetize your own curve presets today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/launch"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff4800] to-[#ff6224] hover:from-[#ff6224] hover:to-[#ff7a45] text-white font-mono text-sm font-bold shadow-glow transition-all cursor-pointer flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Open Launch Terminal</span>
            </Link>

            <Link
              href="/copilot"
              className="px-7 py-3.5 rounded-xl bg-[#090c14] hover:bg-[#101422] border border-[#222b44] text-white font-mono text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span>Ask Tessera Copilot</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
