import { CurveSegment, FeeSchedule, MigrationConfig } from '@/types/strategy';
import { SwapQuoteResult } from '@/types/pool';
import { PROTOCOL_TRADING_FEE_SHARE, PROTOCOL_MIGRATION_FEE_FIXED } from './constants';

export interface CalculatedSegment {
  segmentIndex: number;
  label: string;
  type: 'SHELF' | 'RISER' | 'STANDARD';
  pLower: number;
  pUpper: number;
  sqrtPLower: number;
  sqrtPUpper: number;
  virtualLiquidity: number; // L
  baseCapacity: number; // Total base tokens in segment
  quoteCapacity: number; // Total quote tokens needed to traverse segment
  cumulativeQuoteThreshold: number; // Running sum of quote tokens
}

/**
 * Calculates absolute virtual liquidity and capacities for curve segments
 * adhering strictly to Meteora DBC formulas:
 * Base = L * (1/sqrt(P_lower) - 1/sqrt(P_upper))
 * Quote = L * (sqrt(P_upper) - sqrt(P_lower))
 */
export function computeSegmentsWithCapacities(
  rawSegments: CurveSegment[],
  targetSupplyAllocation: number = 800_000_000 // default 800M base tokens on curve
): CalculatedSegment[] {
  // 1. Calculate unscaled base capacity per segment based on relative liquidityWeight
  const unscaled = rawSegments.map((seg, idx) => {
    const sqrtPLower = Math.sqrt(seg.pLower);
    const sqrtPUpper = Math.sqrt(seg.pUpper);
    const priceFactorBase = (1 / sqrtPLower) - (1 / sqrtPUpper);
    const priceFactorQuote = sqrtPUpper - sqrtPLower;
    const rawBase = seg.liquidityWeight * priceFactorBase;

    return {
      seg,
      idx,
      sqrtPLower,
      sqrtPUpper,
      priceFactorBase,
      priceFactorQuote,
      rawBase,
    };
  });

  const totalRawBase = unscaled.reduce((sum, item) => sum + item.rawBase, 0);
  const scale = targetSupplyAllocation / (totalRawBase || 1);

  let runningQuote = 0;
  return unscaled.map((item) => {
    const virtualLiquidity = item.seg.liquidityWeight * scale;
    const baseCapacity = virtualLiquidity * item.priceFactorBase;
    const quoteCapacity = virtualLiquidity * item.priceFactorQuote;
    runningQuote += quoteCapacity;

    return {
      segmentIndex: item.idx,
      label: item.seg.label,
      type: item.seg.type,
      pLower: item.seg.pLower,
      pUpper: item.seg.pUpper,
      sqrtPLower: item.sqrtPLower,
      sqrtPUpper: item.sqrtPUpper,
      virtualLiquidity,
      baseCapacity,
      quoteCapacity,
      cumulativeQuoteThreshold: runningQuote,
    };
  });
}

/**
 * Derives current price, base tokens sold, and remaining curve progress
 * from the accumulated quote reserve.
 */
export function getCurveStateAtQuoteReserve(
  segments: CalculatedSegment[],
  quoteReserve: number
): {
  currentPrice: number;
  currentSegmentIndex: number;
  baseTokensSold: number;
  baseReserveRemaining: number;
  curveProgressPct: number;
  totalQuoteThreshold: number;
} {
  const totalQuoteThreshold = segments.length > 0
    ? segments[segments.length - 1].cumulativeQuoteThreshold
    : 0;

  if (quoteReserve <= 0 || segments.length === 0) {
    return {
      currentPrice: segments[0]?.pLower ?? 0,
      currentSegmentIndex: 0,
      baseTokensSold: 0,
      baseReserveRemaining: segments.reduce((sum, s) => sum + s.baseCapacity, 0),
      curveProgressPct: 0,
      totalQuoteThreshold,
    };
  }

  let accumulatedQuote = 0;
  let baseTokensSold = 0;
  const totalBaseCapacity = segments.reduce((sum, s) => sum + s.baseCapacity, 0);

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segmentQuoteStart = accumulatedQuote;
    const segmentQuoteEnd = accumulatedQuote + seg.quoteCapacity;

    if (quoteReserve <= segmentQuoteEnd || i === segments.length - 1) {
      // Current point is inside this segment
      const deltaQuoteInSegment = Math.min(
        quoteReserve - segmentQuoteStart,
        seg.quoteCapacity
      );
      
      const currentSqrtP = seg.sqrtPLower + (deltaQuoteInSegment / seg.virtualLiquidity);
      const currentPrice = currentSqrtP * currentSqrtP;
      
      const baseSoldInSegment = seg.virtualLiquidity * ((1 / seg.sqrtPLower) - (1 / currentSqrtP));
      baseTokensSold += baseSoldInSegment;

      const progressPct = Math.min(100, (quoteReserve / totalQuoteThreshold) * 100);

      return {
        currentPrice,
        currentSegmentIndex: i,
        baseTokensSold,
        baseReserveRemaining: Math.max(0, totalBaseCapacity - baseTokensSold),
        curveProgressPct: progressPct,
        totalQuoteThreshold,
      };
    } else {
      accumulatedQuote += seg.quoteCapacity;
      baseTokensSold += seg.baseCapacity;
    }
  }

  const lastSeg = segments[segments.length - 1];
  return {
    currentPrice: lastSeg.pUpper,
    currentSegmentIndex: segments.length - 1,
    baseTokensSold: totalBaseCapacity,
    baseReserveRemaining: 0,
    curveProgressPct: 100,
    totalQuoteThreshold,
  };
}

/**
 * Calculates trading fee at a given elapsed time (seconds) since activation
 */
export function calculateCurrentTradingFeeBps(
  feeSchedule: FeeSchedule,
  elapsedSeconds: number,
  volatilityAccumulator: number = 0
): {
  totalFeeBps: number;
  baseFeeBps: number;
  dynamicFeeBps: number;
} {
  let baseFeeBps = feeSchedule.endingFeeBps;

  if (feeSchedule.baseFeeMode === 'FIXED') {
    baseFeeBps = feeSchedule.endingFeeBps;
  } else if (feeSchedule.baseFeeMode === 'FEE_SCHEDULER_LINEAR') {
    if (feeSchedule.totalDurationSeconds <= 0 || elapsedSeconds >= feeSchedule.totalDurationSeconds) {
      baseFeeBps = feeSchedule.endingFeeBps;
    } else {
      const progress = elapsedSeconds / feeSchedule.totalDurationSeconds;
      baseFeeBps = Math.round(
        feeSchedule.startingFeeBps -
          progress * (feeSchedule.startingFeeBps - feeSchedule.endingFeeBps)
      );
    }
  } else if (feeSchedule.baseFeeMode === 'FEE_SCHEDULER_EXPONENTIAL') {
    if (feeSchedule.totalDurationSeconds <= 0 || elapsedSeconds >= feeSchedule.totalDurationSeconds) {
      baseFeeBps = feeSchedule.endingFeeBps;
    } else {
      // Exponential decay: starts steep, flattens out
      const decayFactor = Math.exp(-3 * (elapsedSeconds / feeSchedule.totalDurationSeconds));
      baseFeeBps = Math.round(
        feeSchedule.endingFeeBps +
          decayFactor * (feeSchedule.startingFeeBps - feeSchedule.endingFeeBps)
      );
    }
  }

  // Dynamic fee calculation (Meteora formula: (volatility * binStep)^2 * varControl / 10^11)
  let dynamicFeeBps = 0;
  if (feeSchedule.dynamicFeeEnabled && volatilityAccumulator > 0) {
    // Dynamic fee scaling factor
    dynamicFeeBps = Math.min(
      500, // cap dynamic fee at 5% (500 bps)
      Math.round((volatilityAccumulator * volatilityAccumulator * 10) / 100)
    );
  }

  const totalFeeBps = Math.min(9900, baseFeeBps + dynamicFeeBps);

  return {
    totalFeeBps,
    baseFeeBps,
    dynamicFeeBps,
  };
}

/**
 * Simulates an exact-in swap (Buying base tokens with quote tokens)
 */
export function simulateSwapExactInQuote(
  segments: CalculatedSegment[],
  currentQuoteReserve: number,
  quoteAmountIn: number,
  feeSchedule: FeeSchedule,
  elapsedSeconds: number = 60,
  slippageBps: number = 100
): SwapQuoteResult {
  const { totalFeeBps } = calculateCurrentTradingFeeBps(feeSchedule, elapsedSeconds);
  const feeRate = totalFeeBps / 10000;
  const feeAmount = quoteAmountIn * feeRate;
  const netQuoteIn = quoteAmountIn - feeAmount;

  const stateBefore = getCurveStateAtQuoteReserve(segments, currentQuoteReserve);
  const stateAfter = getCurveStateAtQuoteReserve(segments, currentQuoteReserve + netQuoteIn);

  const baseAmountOut = Math.max(0, stateAfter.baseTokensSold - stateBefore.baseTokensSold);
  const priceBefore = stateBefore.currentPrice;
  const priceAfter = stateAfter.currentPrice;
  const priceImpactPct = priceBefore > 0 ? ((priceAfter - priceBefore) / priceBefore) * 100 : 0;

  const minAmountOut = baseAmountOut * (1 - slippageBps / 10000);
  const willCrossSegment = stateBefore.currentSegmentIndex !== stateAfter.currentSegmentIndex;
  const willTriggerGraduation = stateAfter.curveProgressPct >= 100;

  return {
    amountIn: quoteAmountIn,
    amountOut: baseAmountOut,
    feeAmount,
    effectiveFeeBps: totalFeeBps,
    priceBefore,
    priceAfter,
    priceImpactPct,
    minimumAmountOut: Math.max(0, minAmountOut),
    willCrossSegment,
    willTriggerGraduation,
  };
}

/**
 * Calculates Creator vs Partner vs Protocol fee distribution
 */
export function calculateFeeDistribution(
  totalFeeAmount: number,
  creatorTradingFeePct: number
): {
  protocolFee: number;
  creatorFee: number;
  partnerFee: number;
} {
  const protocolFee = totalFeeAmount * PROTOCOL_TRADING_FEE_SHARE;
  const lpFeePool = totalFeeAmount - protocolFee;
  const creatorFee = lpFeePool * (creatorTradingFeePct / 100);
  const partnerFee = lpFeePool - creatorFee;

  return {
    protocolFee,
    creatorFee,
    partnerFee,
  };
}

/**
 * Calculates graduation and migration economics into DAMM v2
 */
export function calculateGraduationEconomics(
  migrationThresholdQuote: number,
  migrationFeePct: number,
  creatorMigrationFeePct: number
): {
  grossQuoteReserve: number;
  configurableMigrationFee: number;
  creatorMigrationFee: number;
  partnerMigrationFee: number;
  protocolFixedMigrationFee: number;
  netQuoteMigratedToDammV2: number;
} {
  const grossQuoteReserve = migrationThresholdQuote;
  const configurableMigrationFee = grossQuoteReserve * (migrationFeePct / 100);
  const creatorMigrationFee = configurableMigrationFee * (creatorMigrationFeePct / 100);
  const partnerMigrationFee = configurableMigrationFee - creatorMigrationFee;
  const protocolFixedMigrationFee = grossQuoteReserve * PROTOCOL_MIGRATION_FEE_FIXED;
  const netQuoteMigratedToDammV2 = grossQuoteReserve - configurableMigrationFee - protocolFixedMigrationFee;

  return {
    grossQuoteReserve,
    configurableMigrationFee,
    creatorMigrationFee,
    partnerMigrationFee,
    protocolFixedMigrationFee,
    netQuoteMigratedToDammV2: Math.max(0, netQuoteMigratedToDammV2),
  };
}
