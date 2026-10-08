'use client';

import React, { useState } from 'react';
import { CURATED_STRATEGIES } from '@/lib/data/strategies';
import { Code2, Copy, Check, Terminal, ExternalLink, Cpu, Radio, Sparkles, Workflow } from 'lucide-react';

export const DeveloperTerminal: React.FC = () => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('conviction-ladder');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'SDK' | 'WEBSOCKET' | 'INVENT' | 'REST'>('SDK');

  const strategy = CURATED_STRATEGIES.find((s) => s.id === selectedStrategyId) || CURATED_STRATEGIES[0];
  const version = strategy.versions[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const tsCodeSnippet = `// Integrate Tessera Strategy via Official Meteora DBC TypeScript SDK
import { Connection, PublicKey } from "@solana/web3.js";
import { 
  DynamicBondingCurveClient, 
  buildCurveWithCustomSqrtPrices, 
  createSqrtPrices, 
  TokenDecimal, 
  TokenType 
} from "@meteora-ag/dynamic-bonding-curve-sdk";

const connection = new Connection(process.env.RPC_URL!, "confirmed");
const client = DynamicBondingCurveClient.create(connection, "confirmed");

// 1. Fetch Verified Tessera Strategy: "${strategy.name}" (${version.version})
const strategyConfig = ${JSON.stringify(
    {
      strategyId: strategy.id,
      version: version.version,
      segments: version.segments,
      feeSchedule: version.feeSchedule,
      migration: version.migration,
    },
    null,
    2
  )};

// 2. Build on-chain transaction instruction
const sqrtPrices = createSqrtPrices(
  [${version.segments.map((s) => s.pLower).join(', ')}, ${version.segments[version.segments.length - 1].pUpper}],
  TokenDecimal.SIX,
  TokenDecimal.NINE
);

console.log("Ready to deploy DBC pool with Tessera strategy:", strategyConfig.strategyId);`;

  const wsSnippet = `// Connect to Tessera Low-Latency WebSocket Data Streams
const ws = new WebSocket('wss://stream.tessera.fi/v1/dbc/pool/F9xK8...uI2/trades');

ws.onopen = () => {
  console.log('Subscribed to Tessera DBC Trade Stream');
  ws.send(JSON.stringify({
    action: 'subscribe',
    channels: ['trades', 'depth', 'graduation_progress'],
    strategyId: '${strategy.id}'
  }));
};

ws.onmessage = (event) => {
  const tick = JSON.parse(event.data);
  console.log('Real-Time DBC Tick:', {
    priceQuote: tick.priceQuote,
    segment: tick.segmentIndex,
    dammeGraduationPct: tick.curveProgressPct
  });
};`;

  const inventSnippet = `# Deploy DBC pool with Tessera preset using Meteora Invent CLI
meteora-invent launch \\
  --preset "tessera://${strategy.slug}" \\
  --quote-mint ${version.migration.quoteMint} \\
  --keeper-threshold ${version.migration.migrationQuoteThreshold} \\
  --fee-tier ${version.migration.migratedDammV2FeeBps} \\
  --network mainnet-beta`;

  const curlSnippet = `curl -X GET "https://api.tessera.ag/v1/strategies/${strategy.id}/config" \\
  -H "Accept: application/json"`;

  const snippets: Record<string, string> = {
    SDK: tsCodeSnippet,
    WEBSOCKET: wsSnippet,
    INVENT: inventSnippet,
    REST: curlSnippet,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1b2236] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00f0ff] mb-1 font-bold">
            <Code2 className="w-3.5 h-3.5" />
            <span>DEVELOPER TOOLING &amp; WEBSOCKET STREAMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Developer Tooling &amp; Data Streams
          </h1>
          <p className="text-xs sm:text-sm text-[#828ea8] mt-1 font-mono">
            Integrate performance-ranked DBC configurations into your own launchpad, trading terminal, or bot.
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-[#64748b]">Strategy:</span>
          <select
            value={selectedStrategyId}
            onChange={(e) => setSelectedStrategyId(e.target.value)}
            className="bg-[#0f1422] border border-[#1e2740] rounded-xl px-3 py-1.5 text-white focus:outline-none cursor-pointer"
          >
            {CURATED_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.versions[0].version})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* API Reference & Identifiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#080b12] border border-[#1b2236] rounded-xl space-y-1">
          <span className="text-[#64748b]">Strategy Identifier:</span>
          <div className="text-white font-bold">{strategy.id}</div>
          <div className="text-[10px] text-[#00f0ff]">Version: {version.version} • Archetype: {strategy.curveArchetype || 'LADDER'}</div>
        </div>

        <div className="p-4 bg-[#080b12] border border-[#1b2236] rounded-xl space-y-1">
          <span className="text-[#64748b]">DBC Program Authority:</span>
          <div className="text-white font-bold truncate">FhVo3mqL...HLuM</div>
          <div className="text-[10px] text-[#10b981]">PDA Verified</div>
        </div>

        <div className="p-4 bg-[#080b12] border border-[#1b2236] rounded-xl space-y-1">
          <span className="text-[#64748b]">DAMM v2 Target Key:</span>
          <div className="text-white font-bold truncate">{version.migration.migratedDammV2ConfigKey}</div>
          <div className="text-[10px] text-[#10b981]">{version.migration.migratedDammV2FeeBps} bps pool tier</div>
        </div>
      </div>

      {/* Interactive Tabs for Developer Tools */}
      <div className="bg-[#080b12] border border-[#1b2236] rounded-2xl overflow-hidden font-mono text-xs shadow-2xl">
        <div className="flex flex-wrap justify-between items-center p-3 bg-[#0c101c] border-b border-[#182033] gap-2">
          <div className="flex items-center gap-1.5 bg-[#05070a] p-1 rounded-xl border border-[#161c2d]">
            <button
              onClick={() => setActiveTab('SDK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'SDK' ? 'bg-[#ff4800] text-white shadow-glow' : 'text-[#828ea8] hover:text-white'
              }`}
            >
              TypeScript SDK
            </button>
            <button
              onClick={() => setActiveTab('WEBSOCKET')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'WEBSOCKET' ? 'bg-[#00f0ff] text-black shadow-glowCyan' : 'text-[#828ea8] hover:text-white'
              }`}
            >
              WebSocket Streams
            </button>
            <button
              onClick={() => setActiveTab('INVENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'INVENT' ? 'bg-[#a855f7] text-white shadow-glowPurple' : 'text-[#828ea8] hover:text-white'
              }`}
            >
              Invent CLI Action
            </button>
            <button
              onClick={() => setActiveTab('REST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'REST' ? 'bg-[#10b981] text-black shadow-glowGreen' : 'text-[#828ea8] hover:text-white'
              }`}
            >
              REST API
            </button>
          </div>

          <button
            onClick={() => handleCopy(snippets[activeTab], activeTab)}
            className="flex items-center gap-1.5 text-xs text-[#828ea8] hover:text-white cursor-pointer px-3 py-1.5 rounded-xl bg-[#111624] border border-[#1d273e]"
          >
            {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === activeTab ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 text-[11px] text-[#00f0ff] overflow-x-auto max-h-96 leading-relaxed bg-[#05070a] font-mono">
          {snippets[activeTab]}
        </pre>
      </div>
    </div>
  );
};
