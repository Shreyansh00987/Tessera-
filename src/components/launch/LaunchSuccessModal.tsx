'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, ArrowRight, Rocket, ShieldCheck, Copy, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LaunchSuccessModalProps {
  poolAddress: string;
  baseMint: string;
  configKey: string;
  signature: string;
  symbol: string;
  name: string;
  isLiveMode: boolean;
  onClose: () => void;
}

export const LaunchSuccessModal: React.FC<LaunchSuccessModalProps> = ({
  poolAddress,
  baseMint,
  configKey,
  signature,
  symbol,
  name,
  isLiveMode,
  onClose,
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const explorerUrl = isLiveMode
    ? `https://solscan.io/tx/${signature}`
    : `https://solscan.io/tx/${signature}?cluster=devnet`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div 
        className="w-full max-w-xl bg-[#0e1017] border border-[#232734] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white font-mono uppercase tracking-tight">
            Meteora DBC Pool Live!
          </h2>
          <p className="text-xs text-[#a5b0c4] font-mono">
            {name} (${symbol}) successfully initialized on Solana using verified DBC primitives.
          </p>
        </div>

        {/* Addresses Box */}
        <div className="p-4 bg-[#090b10] border border-[#1f232f] rounded-xl font-mono text-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#181b24]">
            <span className="text-[#7f889b]">DBC Pool PDA:</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#00d2c4] font-bold truncate max-w-[180px]">{poolAddress}</span>
              <button
                onClick={() => copyToClipboard(poolAddress)}
                className="p-1 hover:text-white text-[#7f889b]"
                title="Copy Address"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#181b24]">
            <span className="text-[#7f889b]">Base Token Mint:</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-white font-bold truncate max-w-[180px]">{baseMint}</span>
              <button
                onClick={() => copyToClipboard(baseMint)}
                className="p-1 hover:text-white text-[#7f889b]"
                title="Copy Mint"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#181b24]">
            <span className="text-[#7f889b]">DBC Config Key:</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#a5b0c4] truncate max-w-[180px]">{configKey}</span>
              <button
                onClick={() => copyToClipboard(configKey)}
                className="p-1 hover:text-white text-[#7f889b]"
                title="Copy Config"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#7f889b]">Transaction Signature:</span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#ff5c16] hover:underline flex items-center gap-1 truncate max-w-[180px]"
            >
              {signature.slice(0, 12)}... <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <Link
            href="/terminal"
            className="py-3 px-4 rounded-xl bg-[#ff5c16] hover:bg-[#ff7438] text-white font-bold flex items-center justify-center gap-2 shadow-glow cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>Open Asset Terminal</span>
          </Link>

          <Link
            href="/lifecycle"
            className="py-3 px-4 rounded-xl bg-[#141722] hover:bg-[#1a1e2d] border border-[#232734] text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Track DAMM v2 Migration</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00d2c4]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
