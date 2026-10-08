import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Cpu, Terminal, ArrowUpRight, Sparkles } from 'lucide-react';
import { METEORA_DBC_PROGRAM_ID, METEORA_DAMM_V2_PROGRAM_ID, METEORA_MIGRATION_KEEPERS } from '@/lib/meteora/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#05070a] border-t border-[#161d2d] pt-14 pb-10 text-[#64748b] text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Hackathon Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#9d4edd]/15 via-[#ff4800]/10 to-[#00f0ff]/15 border border-[#9d4edd]/30 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9d4edd]/20 border border-[#9d4edd]/40 flex items-center justify-center text-[#c084fc] shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-white font-bold text-xs">
                Meteora Hackathon • Stocklana &amp; Colosseum Crypto World’s Fair
              </div>
              <div className="text-[11px] text-[#828ea8]">
                Eligible for Discretionary Infrastructure Grants for AI &amp; RWA Builders on Meteora DBC
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#94a3b8] px-3 py-1.5 rounded-xl bg-[#0a0d17] border border-[#1b2236] shrink-0">
            For judging review: Add GitHub ID <span className="text-[#00f0ff] font-bold">dannxbt</span> with Read permissions
          </div>
        </div>

        {/* 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#141a29]">
          {/* Col 1: Project overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-[#ff4800] via-[#ff6224] to-[#00f0ff] rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-[10px] font-black text-white font-mono">T</span>
              </div>
              <span className="font-bold tracking-wider text-white font-mono text-sm">TESSERA</span>
            </div>
            <p className="text-xs text-[#828ea8] leading-relaxed">
              Launch configs as tradable, performance-ranked financial products. A strategy marketplace and quantitative intelligence layer built exclusively for Meteora Dynamic Bonding Curve (DBC), DAMM v2 &amp; DLMM.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#10b981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span>100% Real DBC Mathematics (Zero Hallucinations)</span>
            </div>
          </div>

          {/* Col 2: On-chain architecture */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Verified Program IDs</h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li className="flex flex-col">
                <span className="text-[#828ea8]">Meteora DBC Program:</span>
                <a
                  href={`https://solscan.io/account/${METEORA_DBC_PROGRAM_ID.toBase58()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#ff4800] hover:underline flex items-center gap-1 truncate"
                >
                  {METEORA_DBC_PROGRAM_ID.toBase58().slice(0, 16)}... <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[#828ea8]">DAMM v2 Program (cp-amm):</span>
                <a
                  href={`https://solscan.io/account/${METEORA_DAMM_V2_PROGRAM_ID.toBase58()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00f0ff] hover:underline flex items-center gap-1 truncate"
                >
                  {METEORA_DAMM_V2_PROGRAM_ID.toBase58().slice(0, 16)}... <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[#828ea8]">Autonomous Keepers:</span>
                <span className="text-[#e2e8f0] text-[10px]">
                  {METEORA_MIGRATION_KEEPERS[0].address.slice(0, 8)}... &amp; {METEORA_MIGRATION_KEEPERS[1].address.slice(0, 8)}...
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Modules */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Platform Ecosystem</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/curvelab" className="hover:text-white transition-colors">Curve Lab (Interactive Simulator)</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">DBC Config Preset Marketplace</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white transition-colors">Strategy Performance Leaderboard</Link></li>
              <li><Link href="/replay" className="hover:text-white transition-colors">Historical Order Flow Replay</Link></li>
              <li><Link href="/copilot" className="hover:text-white transition-colors">Tessera Copilot (Zod Validated)</Link></li>
              <li><Link href="/launch" className="hover:text-white transition-colors">7-Step On-Chain Launch Terminal</Link></li>
              <li><Link href="/lifecycle" className="hover:text-white transition-colors">DBC → DAMM v2 → DLMM Pipeline</Link></li>
              <li><Link href="/developer" className="hover:text-white transition-colors">Data Streams &amp; Dev Tooling</Link></li>
            </ul>
          </div>

          {/* Col 4: Official documentation & Audits */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Official Meteora Sources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://docs.meteora.ag/developer-guides/dbc" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Meteora DBC Developer Guide <ArrowUpRight className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <a href="https://docs.meteora.ag/core-products/dbc/formulas" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Meteora DBC Math Formulas <ArrowUpRight className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <a href="https://docs.meteora.ag/developer-guides/damm-v2" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Meteora DAMM v2 Guide <ArrowUpRight className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <a href="https://github.com/MeteoraAg/dynamic-bonding-curve-sdk" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Official DBC TypeScript SDK <ArrowUpRight className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <a href="https://github.com/MeteoraAg/meteora-invent" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  Meteora Invent CLI Scaffold <ArrowUpRight className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#475569] space-y-3 sm:space-y-0 font-mono">
          <div>
            &copy; {new Date().getFullYear()} TESSERA. Built for Meteora Hackathon &amp; Colosseum World’s Fair.
          </div>
          <div className="flex items-center space-x-6">
            <span>Deterministic DBC Math</span>
            <span>Triple-Stack Composition (DBC + DAMM v2 + DLMM)</span>
            <span>Solana Mainnet Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
