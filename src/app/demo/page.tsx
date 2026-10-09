import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Video Demo & Pitch — TESSERA',
  description: 'Official 1080p walk-through demo video and architecture pitch of Tessera Protocol for Meteora DBC.',
};

export default function DemoPage() {
  const chapters = [
    { time: '00:00', title: 'Welcome to Tessera', desc: 'Quantitative strategy marketplace and intelligence layer for Meteora DBC.' },
    { time: '00:14', title: '3D Holographic Bonding Surface', desc: 'Real-time multi-segment dynamic bonding curve projection engine.' },
    { time: '00:26', title: 'DBC Config Preset Marketplace', desc: 'xStocks long curves, flat RWA curves, and anti-snipe fee schedules.' },
    { time: '00:38', title: 'Interactive Curve Lab', desc: '16-segment piecewise formula simulator, slippage & fee decay math.' },
    { time: '00:48', title: '7-Step On-Chain Launch Terminal', desc: 'Deploying verified DBC pools via official @meteora-ag/dynamic-bonding-curve-sdk.' },
    { time: '00:59', title: 'AI Copilot & Historical Replay', desc: 'MEV attack stress-testing & natural language Zod-validated launch synthesis.' },
    { time: '01:08', title: 'Autonomous DAMM v2 Migration', desc: '100% rug-proof keeper migration to permanent DAMM v2 locked liquidity.' },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            METEORA DBC HACKATHON PITCH & DEMO
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            Tessera Protocol Walkthrough Demo
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
            A complete 1-minute 18-second guided tour of the Tessera quantitative intelligence layer, showcasing live 3D visualization, DBC marketplace, Curve Lab, and DAMM v2 autonomous graduation.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/60 shadow-2xl shadow-cyan-500/10 p-2 sm:p-4 backdrop-blur-md">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/scripts/frame_1.png"
              className="w-full h-full object-contain"
            >
              <source src="/tessera_demo_walkthrough.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">1080p Full HD</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">01:18 Duration</span>
              <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-800">Edge AI Voice</span>
            </div>
            <a
              href="/tessera_demo_walkthrough.mp4"
              download="tessera_demo_walkthrough.mp4"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wide transition shadow-lg shadow-cyan-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download MP4 (3.1 MB)
            </a>
          </div>
        </div>

        {/* Video Chapters */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">⚡</span> Video Chapters & Timestamps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((ch, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/40 transition">
                <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/60 shrink-0">
                  {ch.time}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{ch.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch & Links for Judges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/curvelab"
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase">Live Math Engine</span>
              <h3 className="text-base font-bold text-white mt-1">Interactive Curve Lab</h3>
              <p className="text-xs text-slate-400 mt-2">Simulate 16 curve segments and exponential fee decay schedules.</p>
            </div>
            <span className="text-xs text-cyan-400 font-medium mt-4 flex items-center gap-1">Open Curve Lab →</span>
          </Link>

          <Link
            href="/marketplace"
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase">Preset Catalog</span>
              <h3 className="text-base font-bold text-white mt-1">DBC Preset Marketplace</h3>
              <p className="text-xs text-slate-400 mt-2">Discover battle-tested configs for tokenized equities and RWAs.</p>
            </div>
            <span className="text-xs text-cyan-400 font-medium mt-4 flex items-center gap-1">Explore Marketplace →</span>
          </Link>

          <Link
            href="/launch"
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase">Meteora SDK Deploy</span>
              <h3 className="text-base font-bold text-white mt-1">7-Step Launch Terminal</h3>
              <p className="text-xs text-slate-400 mt-2">Deploy directly to Solana Mainnet & Devnet via official Meteora DBC SDK.</p>
            </div>
            <span className="text-xs text-cyan-400 font-medium mt-4 flex items-center gap-1">Launch Curve →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
