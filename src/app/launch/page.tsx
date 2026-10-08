'use client';

import React, { Suspense } from 'react';
import { LaunchTerminal } from '@/components/launch/LaunchTerminal';

export default function LaunchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-xs font-mono text-[#7f889b]">
          Loading Launch Terminal...
        </div>
      }
    >
      <LaunchTerminal
        isLiveMode={false}
        walletConnected={true}
        walletAddress="Au6y8RRdGUFMm4jKVbguCVcwUbiGtyz9VCPLSF388Cka"
      />
    </Suspense>
  );
}
