'use client';

import React, { useState, useMemo } from 'react';
import { processCopilotPrompt, computeConfigDiff, CopilotPromptResult } from '@/lib/copilot/engine';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { ConfigDiffViewer } from './ConfigDiffViewer';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Rocket, 
  Layers, 
  FileCode,
  Info
} from 'lucide-react';
import Link from 'next/link';

export const TesseraCopilot: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(
    'Create a fair developer-token launch with 50 SOL target, anti-sniping fees and stable early price discovery.'
  );

  const [copilotResult, setCopilotResult] = useState<CopilotPromptResult>(() =>
    processCopilotPrompt(prompt)
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleRunCopilot = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = processCopilotPrompt(prompt);
      setCopilotResult(res);
      setIsProcessing(false);
    }, 400);
  };

  const samplePrompts = [
    'Create a fair developer-token launch with 50 SOL target, anti-sniping fees and stable early price discovery.',
    'Institutional RWA token launch with deep initial liquidity and 750 USDC migration threshold.',
    'Viral community meme launch with 100% curve allocation, zero creator rent, and 10 SOL target.',
    'Stock token pre-IPO launch with conservative pricing bands and 750 USD equivalent keeper migration.',
  ];

  // Baseline strategy for diff comparison (Conviction Ladder)
  const baselineStrategy = CURATED_STRATEGIES[0];
  const baselineVersion = baselineStrategy.versions[0];

  const configDiffs = useMemo(() => {
    return computeConfigDiff(
      {
        segments: baselineVersion.segments,
        feeSchedule: baselineVersion.feeSchedule,
        migration: baselineVersion.migration,
        tokenSupply: baselineVersion.tokenSupply,
      },
      copilotResult.config
    );
  }, [copilotResult, baselineVersion]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f232f] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00d2c4] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI QUANT LAUNCH CO-PILOT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Tessera Copilot
          </h1>
          <p className="text-xs sm:text-sm text-[#7f889b] mt-1 font-mono">
            Translate natural-language launch intent into mathematically validated Meteora DBC configurations.
          </p>
        </div>

        {/* Guarantee Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0e1119] border border-[#1f232f] text-[11px] font-mono text-[#a5b0c4]">
          <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
          <span>Strict JSON Schema Validation • Zero Hallucinated APIs</span>
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="bg-[#0a0c12] border border-[#1f232f] rounded-2xl p-5 font-mono space-y-4 shadow-xl">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#a5b0c4]">Describe your desired launch mechanics:</span>
          <span className="text-[10px] text-[#7f889b]">DBC Parameters Autocompleted</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a fair developer-token launch with 50 SOL target, anti-sniping fees and stable early price discovery."
            className="w-full bg-[#11131d] border border-[#232734] focus:border-[#ff5c16] rounded-xl p-3 text-xs text-white placeholder-[#7f889b] focus:outline-none resize-none leading-relaxed"
          />
          <button
            onClick={handleRunCopilot}
            disabled={isProcessing}
            className="sm:w-44 px-4 py-3 bg-[#ff5c16] hover:bg-[#ff7438] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-glow shrink-0 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Validating...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Config</span>
              </>
            )}
          </button>
        </div>

        {/* Quick prompt chip templates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-[#7f889b] shrink-0">Try:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                const res = processCopilotPrompt(p);
                setCopilotResult(res);
              }}
              className="px-2.5 py-1 rounded bg-[#131622] hover:bg-[#1c202e] border border-[#1f232f] text-[#a5b0c4] hover:text-white whitespace-nowrap transition-colors cursor-pointer"
            >
              {p.slice(0, 42)}...
            </button>
          ))}
        </div>
      </div>

      {/* PIPELINE STAGES BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-[#0d0f17] border border-[#1f232f] rounded-xl flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-white font-bold text-[11px]">1. Schema Check</div>
            <div className="text-[10px] text-[#10b981]">ZOD VALIDATED</div>
          </div>
        </div>

        <div className="p-3 bg-[#0d0f17] border border-[#1f232f] rounded-xl flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-white font-bold text-[11px]">2. DBC Segments</div>
            <div className="text-[10px] text-[#00d2c4]">{copilotResult.config.segments.length} PIECEWISE ZONES</div>
          </div>
        </div>

        <div className="p-3 bg-[#0d0f17] border border-[#1f232f] rounded-xl flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-white font-bold text-[11px]">3. DAMM v2 Target</div>
            <div className="text-[10px] text-[#ff5c16]">{copilotResult.config.migration.migratedDammV2FeeBps} BPS CONFIG</div>
          </div>
        </div>

        <div className="p-3 bg-[#0d0f17] border border-[#1f232f] rounded-xl flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-[#00d2c4]/20 flex items-center justify-center text-[#00d2c4]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-white font-bold text-[11px]">4. User Authorization</div>
            <div className="text-[10px] text-[#7f889b]">NO DIRECT TX</div>
          </div>
        </div>
      </div>

      {/* SYNTHESIZED RATIONALE & RISK DIAGNOSTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rationale Card */}
        <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl font-mono text-xs space-y-2">
          <div className="flex items-center space-x-2 text-[#00d2c4] font-bold">
            <Info className="w-4 h-4" />
            <span>Synthesized Economic Rationale</span>
          </div>
          <p className="text-[#a5b0c4] leading-relaxed">
            {copilotResult.rationale}
          </p>
        </div>

        {/* Risk Audit Card */}
        <div className="p-5 bg-[#0a0c12] border border-[#1f232f] rounded-xl font-mono text-xs space-y-2">
          <div className="flex items-center space-x-2 text-yellow-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Risk Diagnostics &amp; Warnings</span>
          </div>
          {copilotResult.riskFactors.length > 0 ? (
            <ul className="space-y-1 list-disc list-inside text-[#a5b0c4]">
              {copilotResult.riskFactors.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[#10b981]">No abnormal economic parameters detected. Safe for launch.</p>
          )}
        </div>
      </div>

      {/* CONFIGURATION DIFF: BASELINE VS PROPOSED */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-[#ff5c16]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Configuration Diff (Baseline vs Proposed)
            </h3>
          </div>
          <span className="text-[11px] text-[#7f889b]">
            Visual Inspection of Changed DBC Variables
          </span>
        </div>

        <ConfigDiffViewer
          diffs={configDiffs}
          baseName={baselineStrategy.name}
          proposedName={copilotResult.config.name}
        />
      </div>

      {/* PROCEED ACTIONS */}
      <div className="p-6 bg-[#0f1118] border border-[#1f232f] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div>
          <div className="text-white font-bold text-sm">Ready to deploy or inspect this configuration?</div>
          <p className="text-[#7f889b] text-[11px] mt-0.5">
            Test in the Curve Lab simulator or jump straight into the 7-Step Launch Terminal.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/curvelab"
            className="px-4 py-2.5 rounded-lg bg-[#141722] hover:bg-[#1a1e2d] border border-[#232734] text-white flex items-center gap-2 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#ff5c16]" />
            <span>Open in Curve Lab</span>
          </Link>

          <Link
            href="/launch"
            className="px-4 py-2.5 rounded-lg bg-[#ff5c16] hover:bg-[#ff7438] text-white font-bold flex items-center gap-2 shadow-glow cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Proceed to Launch Terminal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
