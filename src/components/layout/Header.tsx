'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Terminal, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Rocket, 
  History, 
  ArrowRightLeft, 
  Code2, 
  UserCheck, 
  Layers, 
  Search, 
  Wallet,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  onOpenCommandPalette: () => void;
  walletConnected: boolean;
  setWalletConnected: (connected: boolean) => void;
  walletAddress: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLiveMode,
  setIsLiveMode,
  onOpenCommandPalette,
  walletConnected,
  setWalletConnected,
  walletAddress,
}) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Marketplace', href: '/marketplace', icon: Layers },
    { name: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
    { name: 'Curve Lab', href: '/curvelab', icon: TrendingUp, highlight: true },
    { name: 'Replay', href: '/replay', icon: History },
    { name: 'Copilot', href: '/copilot', icon: Sparkles },
    { name: 'Launch', href: '/launch', icon: Rocket },
    { name: 'Asset Terminal', href: '/terminal', icon: Terminal },
    { name: 'DAMM v2', href: '/lifecycle', icon: ArrowRightLeft },
    { name: 'Authors', href: '/author', icon: UserCheck },
    { name: 'Dev Tools', href: '/developer', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#06080e]/95 backdrop-blur-xl border-b border-[#1b2236]">
      {/* Top utility ticker strip */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-[#090c15] border-b border-[#151b2c] text-[11px] text-[#64748b] font-mono">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-[#828ea8]">METEORA DBC:</span>
            <span className="text-white">dbcij3...aqN</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="text-[#828ea8]">DAMM v2:</span>
            <span className="text-white">cpamdp...sGG</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="text-[#828ea8]">KEEPERS:</span>
            <span className="text-[#10b981] font-semibold">2 ACTIVE</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="text-[#828ea8]">WORLD’S FAIR:</span>
            <span className="text-[#a855f7] font-semibold">GRANTS ELIGIBLE</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-[#0f1422] px-2.5 py-0.5 rounded-lg border border-[#1e2740]">
            <span className="text-[#64748b]">NETWORK:</span>
            {isLiveMode ? (
              <span className="text-[#10b981] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> LIVE MAINNET
              </span>
            ) : (
              <span className="text-[#ff4800] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800]"></span> DEMO SIMULATION
              </span>
            )}
          </div>
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="text-[10px] text-[#828ea8] hover:text-white underline cursor-pointer"
          >
            Switch to {isLiveMode ? 'Demo Mode' : 'Live Mode'}
          </button>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff4800] via-[#ff6224] to-[#00f0ff] p-[1.5px] flex items-center justify-center shadow-glow">
              <div className="w-full h-full bg-[#06080e] rounded-[10px] flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-tr from-[#ff4800] to-[#00f0ff] rotate-45 rounded-[2px] transition-transform duration-300 group-hover:rotate-90"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black tracking-wider text-white font-mono">TESSERA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#ff4800]/15 text-[#ff4800] border border-[#ff4800]/40 rounded font-bold">DBC</span>
              </div>
              <p className="text-[10px] text-[#64748b] font-medium leading-none -mt-0.5">Strategy Intelligence Layer</p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#151b2c] text-white border border-[#232c45] shadow-sm'
                    : 'text-[#828ea8] hover:text-white hover:bg-[#0e1320]'
                } ${item.highlight ? 'text-[#ff4800] hover:text-[#ff6224]' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff4800]' : 'text-[#64748b]'}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800] animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0e1320] hover:bg-[#141a2c] border border-[#1b2236] text-xs text-[#828ea8] hover:text-white transition-colors cursor-pointer"
            title="Search Strategies or Commands"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Quick Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#182033] text-[#94a3b8] rounded border border-[#242f4c]">⌘K</kbd>
          </button>

          {/* Wallet Connect */}
          <button
            onClick={() => setWalletConnected(!walletConnected)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              walletConnected
                ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 hover:bg-[#10b981]/25'
                : 'bg-gradient-to-r from-[#ff4800] to-[#ff6224] text-white hover:from-[#ff6224] hover:to-[#ff7a45] shadow-glow font-bold'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {walletConnected ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
              ) : (
                'Connect Wallet'
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for tablet / mobile */}
      <div className="xl:hidden flex items-center overflow-x-auto px-4 py-2 bg-[#090c14] border-t border-[#151b2c] space-x-2 scrollbar-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-[#151b2c] text-white border border-[#232c45]'
                  : 'text-[#828ea8] hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
