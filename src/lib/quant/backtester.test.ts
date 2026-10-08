import test from 'node:test';
import assert from 'node:assert/strict';
import { runHistoricalBacktest } from './backtester';
import { CURATED_STRATEGIES } from '../data/strategies';
import { HISTORICAL_POOLS } from '../data/historicalPools';

test('runHistoricalBacktest simulates trade stream through candidate curve', () => {
  const strategy = CURATED_STRATEGIES[0]; // Conviction Ladder
  const pool = HISTORICAL_POOLS[0]; // CyberPup

  const result = runHistoricalBacktest({
    candidateStrategy: strategy,
    historicalTrades: pool.trades,
    actualPoolMetrics: {
      poolId: pool.id,
      actualGraduationMinutes: pool.actualGraduationMinutes,
      actualFeesQuote: pool.actualFeesQuote,
      actualMaxDrawdown: pool.actualMaxDrawdown,
      actualGini: pool.actualGini,
    },
  });

  assert.equal(result.strategyId, strategy.id);
  assert.equal(result.poolId, pool.id);
  assert.equal(result.simulatedPrices.length, pool.trades.length);
  assert.ok(result.simulatedFeesQuote > 0);
  assert.ok(result.assumptions.length >= 3);
});
