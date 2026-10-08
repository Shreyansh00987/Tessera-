import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTesseraScore } from './scoring';

test('calculateTesseraScore calculates composite score within 0-100', () => {
  const result = calculateTesseraScore({
    totalLaunches: 30,
    graduationRate: 0.85,
    avgTimeToGraduationMinutes: 40,
    totalVolumeQuote: 500,
    totalTradingFeesQuote: 12,
    totalMigrationFeesQuote: 10,
    maxDrawdownAvg: 0.15,
    holderGiniCoefficient: 0.25,
    uniqueTradersCount: 1200,
    sharpeRatioEstimate: 2.2,
    washTradingDiscount: 0.02,
  });

  assert.ok(result.tesseraScore > 70 && result.tesseraScore <= 100);
  assert.equal(result.isInsufficientData, false);
  assert.ok(result.confidenceInterval[0] < result.tesseraScore);
  assert.ok(result.confidenceInterval[1] > result.tesseraScore);
});

test('calculateTesseraScore flags insufficient data for sample size N < 3', () => {
  const result = calculateTesseraScore({
    totalLaunches: 1, // N = 1!
    graduationRate: 1.0,
    avgTimeToGraduationMinutes: 15,
    totalVolumeQuote: 20,
    totalTradingFeesQuote: 0.5,
    totalMigrationFeesQuote: 0.5,
    maxDrawdownAvg: 0.05,
    holderGiniCoefficient: 0.3,
    uniqueTradersCount: 50,
    sharpeRatioEstimate: 3.0,
    washTradingDiscount: 0.0,
  });

  assert.equal(result.isInsufficientData, true);
  assert.ok(result.antiGamingFlag?.includes('INSUFFICIENT_SAMPLE_SIZE'));
});

test('calculateTesseraScore applies wash trading discount penalty', () => {
  const cleanResult = calculateTesseraScore({
    totalLaunches: 20,
    graduationRate: 0.8,
    avgTimeToGraduationMinutes: 30,
    totalVolumeQuote: 1000,
    totalTradingFeesQuote: 20,
    totalMigrationFeesQuote: 10,
    maxDrawdownAvg: 0.2,
    holderGiniCoefficient: 0.3,
    uniqueTradersCount: 800,
    sharpeRatioEstimate: 2.0,
    washTradingDiscount: 0.0,
  });

  const washedResult = calculateTesseraScore({
    totalLaunches: 20,
    graduationRate: 0.8,
    avgTimeToGraduationMinutes: 30,
    totalVolumeQuote: 1000,
    totalTradingFeesQuote: 20,
    totalMigrationFeesQuote: 10,
    maxDrawdownAvg: 0.2,
    holderGiniCoefficient: 0.3,
    uniqueTradersCount: 800,
    sharpeRatioEstimate: 2.0,
    washTradingDiscount: 0.50, // 50% wash volume!
  });

  assert.ok(washedResult.liquidityQuality < cleanResult.liquidityQuality);
  assert.ok(washedResult.tesseraScore < cleanResult.tesseraScore);
  assert.ok(washedResult.antiGamingFlag?.includes('WASH_TRADING'));
});
