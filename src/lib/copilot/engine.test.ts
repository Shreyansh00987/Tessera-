import test from 'node:test';
import assert from 'node:assert/strict';
import { processCopilotPrompt, computeConfigDiff } from './engine';
import { CURATED_STRATEGIES } from '../data/strategies';

test('processCopilotPrompt synthesizes valid launch config matching Zod schema', () => {
  const prompt = 'Create a fair developer-token launch with 50 SOL target, anti-sniping fees and stable early price discovery.';
  const result = processCopilotPrompt(prompt);

  assert.equal(result.isValid, true);
  assert.equal(result.validationErrors.length, 0);
  assert.equal(result.config.quoteSymbol, 'SOL');
  assert.equal(result.config.migration.migrationQuoteThreshold, 50);
  assert.ok(result.config.segments.length >= 3);
  assert.ok(result.rationale.length > 20);
});

test('computeConfigDiff identifies altered parameters between baseline and proposed', () => {
  const baseline = CURATED_STRATEGIES[0].versions[0];
  const proposed = processCopilotPrompt('Institutional RWA token launch with deep initial liquidity and 750 USDC migration threshold.').config;

  const diffs = computeConfigDiff(
    {
      segments: baseline.segments,
      feeSchedule: baseline.feeSchedule,
      migration: baseline.migration,
      tokenSupply: baseline.tokenSupply,
    },
    proposed
  );

  assert.ok(diffs.length >= 5);
  const quoteDiff = diffs.find((d) => d.field === 'Quote Token');
  assert.ok(quoteDiff?.isChanged);
  assert.equal(quoteDiff?.oldValue, 'SOL');
  assert.equal(quoteDiff?.newValue, 'USDC');
});
