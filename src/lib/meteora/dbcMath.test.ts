import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSegmentsWithCapacities,
  getCurveStateAtQuoteReserve,
  calculateCurrentTradingFeeBps,
  simulateSwapExactInQuote,
  calculateFeeDistribution,
  calculateGraduationEconomics,
} from './dbcMath';
import { CurveSegment, FeeSchedule } from '@/types/strategy';

test('computeSegmentsWithCapacities accurately scales multi-segment curve', () => {
  const segments: CurveSegment[] = [
    {
      segmentIndex: 0,
      label: 'Shelf 1',
      type: 'SHELF',
      pLower: 0.00001,
      pUpper: 0.00002,
      liquidityWeight: 10,
    },
    {
      segmentIndex: 1,
      label: 'Riser 1',
      type: 'RISER',
      pLower: 0.00002,
      pUpper: 0.00005,
      liquidityWeight: 2,
    },
  ];

  const calculated = computeSegmentsWithCapacities(segments, 800_000_000);
  assert.equal(calculated.length, 2);
  const totalBase = calculated.reduce((acc, s) => acc + s.baseCapacity, 0);
  assert.ok(Math.abs(totalBase - 800_000_000) < 1, 'Total base capacity should match 800M');
  assert.ok(calculated[0].cumulativeQuoteThreshold > 0);
  assert.ok(calculated[1].cumulativeQuoteThreshold > calculated[0].cumulativeQuoteThreshold);
});

test('getCurveStateAtQuoteReserve moves price monotonically as reserve increases', () => {
  const segments: CurveSegment[] = [
    {
      segmentIndex: 0,
      label: 'Segment 1',
      type: 'STANDARD',
      pLower: 0.00001,
      pUpper: 0.00005,
      liquidityWeight: 5,
    },
  ];
  const calculated = computeSegmentsWithCapacities(segments, 100_000_000);
  const halfThreshold = calculated[0].cumulativeQuoteThreshold / 2;

  const state0 = getCurveStateAtQuoteReserve(calculated, 0);
  const stateHalf = getCurveStateAtQuoteReserve(calculated, halfThreshold);
  const stateFull = getCurveStateAtQuoteReserve(calculated, calculated[0].cumulativeQuoteThreshold);

  assert.equal(state0.currentPrice, 0.00001);
  assert.ok(stateHalf.currentPrice > state0.currentPrice);
  assert.ok(stateFull.currentPrice >= 0.000049);
  assert.equal(stateFull.curveProgressPct, 100);
});

test('calculateCurrentTradingFeeBps handles exponential decay correctly', () => {
  const schedule: FeeSchedule = {
    baseFeeMode: 'FEE_SCHEDULER_EXPONENTIAL',
    startingFeeBps: 800,
    endingFeeBps: 100,
    totalDurationSeconds: 120,
    numberOfPeriods: 10,
    dynamicFeeEnabled: true,
    creatorTradingFeePercentage: 50,
    partnerTradingFeePercentage: 50,
    poolCreationFeeSol: 0.1,
  };

  const initialFee = calculateCurrentTradingFeeBps(schedule, 0);
  assert.equal(initialFee.baseFeeBps, 800);

  const midFee = calculateCurrentTradingFeeBps(schedule, 60);
  assert.ok(midFee.baseFeeBps < 800 && midFee.baseFeeBps > 100);

  const finalFee = calculateCurrentTradingFeeBps(schedule, 120);
  assert.equal(finalFee.baseFeeBps, 100);
});

test('calculateGraduationEconomics computes protocol and partner fees according to docs', () => {
  const economics = calculateGraduationEconomics(10, 10, 50); // 10 SOL threshold, 10% migration fee, 50% creator split
  assert.equal(economics.grossQuoteReserve, 10);
  assert.equal(economics.configurableMigrationFee, 1.0); // 1 SOL
  assert.equal(economics.creatorMigrationFee, 0.5); // 0.5 SOL
  assert.equal(economics.partnerMigrationFee, 0.5); // 0.5 SOL
  assert.equal(economics.protocolFixedMigrationFee, 0.02); // 0.2% = 0.02 SOL
  assert.equal(economics.netQuoteMigratedToDammV2, 8.98); // 10 - 1.0 - 0.02 = 8.98 SOL
});
