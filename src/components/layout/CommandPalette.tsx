'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Rocket, Sparkles, Layers, History, ArrowRightLeft, X, Terminal, Shield } from 'lucide-react';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleLiveMode: () => void;
  isLiveMode: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggleLiveMode,
  isLiveMode,
}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStrategies = CURATED_STRATEGIES.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.tagline.toLowerCase().includes(query.toLowerCase()) ||
      s.assetClass.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    { name: 'Open Curve Lab Simulator', href: '/curvelab', icon: TrendingUp, category: 'Simulation' },
    { name: 'Launch New DBC Pool', href: '/launch', icon: Rocket, category: 'Launch' },
    { name: 'Ask Tessera Copilot (AI Prompt)', href: '/copilot', icon: Sparkles, category: 'AI' },
    { name: 'Replay Historical MEV Attack Pool', href: '/replay', icon: History, category: 'Backtest' },
    { name: 'Explore Strategy Marketplace', href: '/marketplace', icon: Layers, category: 'Marketplace' },
    { name: 'Live Asset Trading Terminal', href: '/terminal', icon: Terminal, category: 'Trading' },
    { name: 'View DAMM v2 Migration Pipeline', href: '/lifecycle', icon: ArrowRightLeft, category: 'Lifecycle' },
  ].filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0e1017] border border-[#232734] rounded-xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#1f232f] bg-[#12151f]">
          <Search className="w-5 h-5 text-[#ff5c16] mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search strategies, pools, actions or ask Copilot..."
            className="w-full bg-transparent text-sm text-white placeholder-[#7f889b] focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#7f889b] hover:text-white hover:bg-[#1a1d27]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#7f889b] px-3 py-1">
                Quick Actions
              </div>
              <div className="space-y-0.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.name}
                      onClick={() => handleSelect(action.href)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-[#181b24] text-[#a5b0c4] hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 text-[#7f889b] group-hover:text-[#ff5c16] transition-colors" />
                        <span>{action.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#12151f] text-[#7f889b] rounded border border-[#1f232f]">
                        {action.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strategies */}
          {filteredStrategies.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#7f889b] px-3 py-1">
                Strategies
              </div>
              <div className="space-y-0.5">
                {filteredStrategies.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => handleSelect(`/curvelab?strategy=${strat.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-[#181b24] text-[#a5b0c4] hover:text-white transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#ff5c16]"></div>
                      <div>
                        <span className="font-medium text-white group-hover:text-[#ff5c16] transition-colors">{strat.name}</span>
                        <span className="text-[11px] text-[#7f889b] ml-2">by {strat.author.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 font-mono text-[11px]">
                      <span className="text-[#00d2c4]">{strat.versions[0].metrics.graduationRate * 100}% Grad</span>
                      <span className="px-1.5 py-0.5 bg-[#ff5c16]/15 text-[#ff5c16] rounded border border-[#ff5c16]/30 font-bold">
                        {strat.versions[0].score.tesseraScore}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Live / Demo */}
          <div className="pt-2 border-t border-[#1f232f]">
            <button
              onClick={() => {
                onToggleLiveMode();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-[#181b24] text-[#a5b0c4] hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-[#00d2c4]" />
                <span>Toggle Environment Mode</span>
              </div>
              <span className="font-mono text-[11px] text-[#ff5c16]">
                Currently: {isLiveMode ? 'Live Mainnet' : 'Demo Mode'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#090b10] border-t border-[#1f232f] flex items-center justify-between text-[11px] text-[#7f889b] font-mono">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center space-x-2">
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
