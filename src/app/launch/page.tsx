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
        walletAddress="Tess9kQ2L4vM7nB6rT8wP1yZ3cX5vA0eR2tY4uI6oP5"
      />
    </Suspense>
  );
}
