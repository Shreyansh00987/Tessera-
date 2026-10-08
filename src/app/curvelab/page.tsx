import React, { Suspense } from 'react';
import { CurveLab } from '@/components/curvelab/CurveLab';

export const metadata = {
  title: 'Curve Lab — TESSERA',
  description: 'Interactive DBC bonding curve designer, simulator, and replay engine.',
};

export default function CurveLabPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-xs font-mono text-[#7f889b]">
          Loading Curve Lab Simulator...
        </div>
      }
    >
      <CurveLab />
    </Suspense>
  );
}
