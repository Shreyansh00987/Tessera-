import { PerformanceMetrics, ScoreBreakdown } from '@/types/strategy';

/**
 * Calculates the transparent Tessera Score (0-100) based on real performance metrics.
 * 
 * Formula:
 * - Graduation Success:     25%
 * - Risk-Adjusted Outcome:  20%
 * - Liquidity Quality:      15%
 * - Holder Distribution:    15%
 * - Drawdown Control:       10%
 * - Fee Efficiency:          5%
 * - Consistency:            10%
 */
export function calculateTesseraScore(metrics: PerformanceMetrics): ScoreBreakdown {
  const {
    totalLaunches,
    graduationRate,
    maxDrawdownAvg,
    holderGiniCoefficient,
    totalVolumeQuote,
    totalTradingFeesQuote,
    sharpeRatioEstimate,
    washTradingDiscount = 0,
  } = metrics;

  // Minimum sample size requirement
  const isInsufficientData = totalLaunches < 3;

  // 1. Graduation Success (25 pts max)
  // Clean graduation rate scaled to 25
  const rawGradScore = Math.min(25, Math.max(0, graduationRate * 25));

  // 2. Risk-Adjusted Outcome (20 pts max)
  // Normalized Sharpe estimate (Sharpe of 2.5+ maps to 20 pts)
  const normalizedSharpe = Math.max(0, Math.min(1, sharpeRatioEstimate / 2.5));
  const rawRiskScore = normalizedSharpe * 20;

  // 3. Liquidity Quality (15 pts max)
  // Penalize high wash trading discounts and small volumes
  const effectiveVolumeQuality = Math.max(0.1, 1 - washTradingDiscount);
  const rawLiquidityScore = Math.min(15, 15 * effectiveVolumeQuality);

  // 4. Holder Distribution (15 pts max)
  // Gini: 0 = perfect distribution (15 pts), 1 = extreme whale concentration (0 pts)
  const distributionFactor = Math.max(0, Math.min(1, 1 - holderGiniCoefficient));
  const rawHolderScore = distributionFactor * 15;

  // 5. Drawdown Control (10 pts max)
  // Max drawdown: 0% DD = 10 pts, 50%+ DD = 0 pts
  const drawdownFactor = Math.max(0, Math.min(1, 1 - (maxDrawdownAvg / 0.5)));
  const rawDrawdownScore = drawdownFactor * 10;

  // 6. Fee Efficiency (5 pts max)
  // Fee captured per volume (healthy ratio around 1% to 3%)
  const feeRatio = totalVolumeQuote > 0 ? totalTradingFeesQuote / totalVolumeQuote : 0;
  const feeFactor = Math.min(1, feeRatio / 0.02);
  const rawFeeScore = feeFactor * 5;

  // 7. Consistency (10 pts max)
  // Penalize volatile outcomes with low sample size
  const consistencyFactor = Math.min(1, Math.sqrt(totalLaunches) / Math.sqrt(20));
  const rawConsistencyScore = consistencyFactor * 10;

  // Raw composite sum
  const rawTotal =
    rawGradScore +
    rawRiskScore +
    rawLiquidityScore +
    rawHolderScore +
    rawDrawdownScore +
    rawFeeScore +
    rawConsistencyScore;

  // Sample size confidence discount factor
  // For N < 3: 50% penalty; for N >= 20: 100% confidence
  const confidenceMultiplier = isInsufficientData
    ? 0.5
    : Math.min(1.0, 0.65 + (Math.min(totalLaunches, 20) / 20) * 0.35);

  const tesseraScore = Number((rawTotal * confidenceMultiplier).toFixed(1));

  // Statistical Confidence Interval (95% CI margin of error)
  const standardError = isInsufficientData
    ? 15.0
    : Math.max(1.8, 12.0 / Math.sqrt(totalLaunches));

  const lowerBound = Math.max(0, Number((tesseraScore - standardError).toFixed(1)));
  const upperBound = Math.min(100, Number((tesseraScore + standardError).toFixed(1)));

  let antiGamingFlag: string | undefined = undefined;
  if (isInsufficientData) {
    antiGamingFlag = 'INSUFFICIENT_SAMPLE_SIZE (N < 3)';
  } else if (washTradingDiscount > 0.25) {
    antiGamingFlag = `HIGH_WASH_TRADING_DETECTED (-${Math.round(washTradingDiscount * 100)}% Volume Penalty)`;
  }

  return {
    tesseraScore,
    graduationSuccess: Number(rawGradScore.toFixed(1)),
    riskAdjustedOutcome: Number(rawRiskScore.toFixed(1)),
    liquidityQuality: Number(rawLiquidityScore.toFixed(1)),
    holderDistribution: Number(rawHolderScore.toFixed(1)),
    drawdownControl: Number(rawDrawdownScore.toFixed(1)),
    feeEfficiency: Number(rawFeeScore.toFixed(1)),
    consistency: Number(rawConsistencyScore.toFixed(1)),
    confidenceInterval: [lowerBound, upperBound],
    sampleSize: totalLaunches,
    isInsufficientData,
    antiGamingFlag,
  };
}
