'use client';

import React from 'react';
import { ConfigDiffItem } from '@/lib/copilot/engine';
import { Check, ArrowRight, Minus, AlertCircle } from 'lucide-react';

interface ConfigDiffViewerProps {
  diffs: ConfigDiffItem[];
  baseName: string;
  proposedName: string;
}

export const ConfigDiffViewer: React.FC<ConfigDiffViewerProps> = ({
  diffs,
  baseName,
  proposedName,
}) => {
  return (
    <div className="w-full bg-[#090b10] border border-[#1f232f] rounded-xl overflow-hidden font-mono text-xs">
      {/* Header bar */}
      <div className="grid grid-cols-12 p-3 bg-[#12151f] border-b border-[#1f232f] text-[11px] text-[#7f889b] font-bold uppercase">
        <div className="col-span-4">Parameter</div>
        <div className="col-span-4 text-zinc-400">Baseline ({baseName})</div>
        <div className="col-span-4 text-[#00d2c4]">Proposed ({proposedName})</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#161822]">
        {diffs.map((d) => (
          <div
            key={d.field}
            className={`grid grid-cols-12 p-3 items-center transition-colors ${
              d.isChanged ? 'bg-[#ff5c16]/5 hover:bg-[#ff5c16]/10' : 'hover:bg-[#0f1118]'
            }`}
          >
            {/* Field name & category */}
            <div className="col-span-4 flex items-center space-x-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  d.isChanged ? 'bg-[#ff5c16]' : 'bg-[#2a2f3e]'
                }`}
              ></span>
              <span className={d.isChanged ? 'text-white font-bold' : 'text-[#7f889b]'}>
                {d.field}
              </span>
              <span className="text-[9px] px-1 py-0.2 bg-[#141722] text-[#7f889b] rounded border border-[#1f232f]">
                {d.category}
              </span>
            </div>

            {/* Old Value */}
            <div className="col-span-4 text-[#a5b0c4] truncate pr-2">
              {d.oldValue}
            </div>

            {/* New Value */}
            <div className="col-span-4 flex items-center space-x-2 truncate">
              {d.isChanged && (
                <ArrowRight className="w-3 h-3 text-[#ff5c16] shrink-0" />
              )}
              <span className={d.isChanged ? 'text-[#00d2c4] font-bold' : 'text-[#7f889b]'}>
                {d.newValue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
