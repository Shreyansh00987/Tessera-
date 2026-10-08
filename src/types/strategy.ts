import { z } from 'zod';

export type AssetClass = 'MEME' | 'RWA' | 'EQUITY' | 'AI' | 'UTILITY' | 'THIN_MARKET';

export type QuoteTokenSymbol = 'SOL' | 'USDC' | 'TRUMP' | 'JUP' | 'USD1' | 'MET' | 'JupUSD';

export type BaseFeeModeType = 'FEE_SCHEDULER_EXPONENTIAL' | 'FEE_SCHEDULER_LINEAR' | 'FIXED' | 'RATE_LIMITER';

export interface CurveSegment {
  segmentIndex: number;
  label: string;
  type: 'SHELF' | 'RISER' | 'STANDARD';
  pLower: number; // Quote per base (e.g. 0.00001 SOL)
  pUpper: number; // Quote per base (e.g. 0.000025 SOL)
  liquidityWeight: number; // Relative or absolute virtual liquidity L
  targetBaseAmount?: number;
  targetQuoteAmount?: number;
}

export interface FeeSchedule {
  baseFeeMode: BaseFeeModeType;
  startingFeeBps: number;
  endingFeeBps: number;
  totalDurationSeconds: number;
  numberOfPeriods: number;
  dynamicFeeEnabled: boolean;
  creatorTradingFeePercentage: number; // % of trading fee allocated to creator
  partnerTradingFeePercentage: number; // % allocated to partner
  poolCreationFeeSol: number; // 0.001 to 100 SOL
}

export interface MigrationConfig {
  destination: 'MET_DAMM_V2' | 'MET_DAMM_V1';
  quoteMint: string;
  quoteSymbol: QuoteTokenSymbol;
  migrationQuoteThreshold: number; // In quote units, e.g. 10 SOL or 750 USDC
  migrationFeePercentage: number; // Configurable migration fee %
  creatorMigrationFeePercentage: number;
  migratedDammV2FeeBps: number; // e.g. 25, 30, 100, 200, 400, 600 bps
  migratedDammV2ConfigKey: string;
  permanentLockedLiquidityPercentage: number; // e.g. 100%
}

export interface ScoreBreakdown {
  tesseraScore: number; // 0 - 100
  graduationSuccess: number; // max 25
  riskAdjustedOutcome: number; // max 20
  liquidityQuality: number; // max 15
  holderDistribution: number; // max 15
  drawdownControl: number; // max 10
  feeEfficiency: number; // max 5
  consistency: number; // max 10
  confidenceInterval: [number, number]; // e.g. [82.1, 88.4]
  sampleSize: number; // Number of launches observed
  isInsufficientData: boolean; // true if N < 3
  antiGamingFlag?: string;
}

export interface PerformanceMetrics {
  totalLaunches: number;
  graduationRate: number; // 0 - 1 (e.g. 0.84 = 84%)
  avgTimeToGraduationMinutes: number;
  totalVolumeQuote: number;
  totalTradingFeesQuote: number;
  totalMigrationFeesQuote: number;
  maxDrawdownAvg: number; // e.g. 0.18 = 18%
  holderGiniCoefficient: number; // 0 = perfectly distributed, 1 = concentrated
  uniqueTradersCount: number;
  sharpeRatioEstimate: number;
  washTradingDiscount: number; // discount applied to raw volume (0 - 1)
}

export interface StrategyVersion {
  version: string; // e.g. "v1.0", "v1.1", "v2.0"
  releasedAt: string;
  changelog: string;
  segments: CurveSegment[];
  feeSchedule: FeeSchedule;
  migration: MigrationConfig;
  tokenSupply: number;
  metrics: PerformanceMetrics;
  score: ScoreBreakdown;
}

export interface Strategy {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  author: {
    name: string;
    wallet: string;
    verified: boolean;
    reputationScore: number;
    avatarUrl?: string;
  };
  assetClass: AssetClass;
  quoteSymbol: QuoteTokenSymbol;
  quoteMint: string;
  isFlagship?: boolean;
  curveArchetype?: 'STEP_LADDER' | 'FLAT_CURVE' | 'EXPONENTIAL_CURVE' | 'LONG_CURVE';
  presetLicenseCost?: string; // e.g. "Free (OSS)", "0.05 SOL", "0.10 SOL"
  stocklanaGrantEligible?: boolean; // For Stocklana & Colosseum Crypto World's Fair
  currentVersion: string;
  versions: StrategyVersion[];
  tags: string[];
}

export interface HistoricalTrade {
  id: string;
  timestamp: number; // unix timestamp seconds
  slot: number;
  type: 'BUY' | 'SELL';
  wallet: string;
  quoteAmount: number;
  baseAmount: number;
  priceAfter: number;
  feeQuote: number;
  isSniperAttempt?: boolean;
}

export interface BacktestResult {
  strategyId: string;
  strategyName: string;
  poolId: string;
  simulatedPrices: { timestamp: number; price: number; volume: number }[];
  actualPrices: { timestamp: number; price: number; volume: number }[];
  simulatedGraduationTimeMinutes: number;
  actualGraduationTimeMinutes: number;
  simulatedFeesQuote: number;
  actualFeesQuote: number;
  simulatedMaxDrawdown: number;
  actualMaxDrawdown: number;
  simulatedGini: number;
  actualGini: number;
  metricsDelta: {
    feeImprovementPct: number;
    drawdownReductionPct: number;
    graduationSpeedDeltaPct: number;
  };
  assumptions: string[];
}

// Zod Schema for strict validation of Copilot output
export const CurveSegmentSchema = z.object({
  segmentIndex: z.number().int().min(0).max(15),
  label: z.string(),
  type: z.enum(['SHELF', 'RISER', 'STANDARD']),
  pLower: z.number().positive(),
  pUpper: z.number().positive(),
  liquidityWeight: z.number().positive(),
});

export const FeeScheduleSchema = z.object({
  baseFeeMode: z.enum(['FEE_SCHEDULER_EXPONENTIAL', 'FEE_SCHEDULER_LINEAR', 'FIXED', 'RATE_LIMITER']),
  startingFeeBps: z.number().min(10).max(9900),
  endingFeeBps: z.number().min(10).max(9900),
  totalDurationSeconds: z.number().min(0).max(86400),
  numberOfPeriods: z.number().min(0).max(1000),
  dynamicFeeEnabled: z.boolean(),
  creatorTradingFeePercentage: z.number().min(0).max(100),
  partnerTradingFeePercentage: z.number().min(0).max(100),
  poolCreationFeeSol: z.number().min(0.001).max(100),
});

export const MigrationConfigSchema = z.object({
  destination: z.enum(['MET_DAMM_V2', 'MET_DAMM_V1']),
  quoteMint: z.string(),
  quoteSymbol: z.enum(['SOL', 'USDC', 'TRUMP', 'JUP', 'USD1', 'MET', 'JupUSD']),
  migrationQuoteThreshold: z.number().positive(),
  migrationFeePercentage: z.number().min(0).max(50),
  creatorMigrationFeePercentage: z.number().min(0).max(100),
  migratedDammV2FeeBps: z.number().positive(),
  migratedDammV2ConfigKey: z.string(),
  permanentLockedLiquidityPercentage: z.number().min(0).max(100),
});

export const LaunchConfigSchema = z.object({
  name: z.string().min(2).max(64),
  symbol: z.string().min(2).max(16),
  tokenSupply: z.number().positive(),
  assetClass: z.enum(['MEME', 'RWA', 'EQUITY', 'AI', 'UTILITY', 'THIN_MARKET']),
  quoteSymbol: z.enum(['SOL', 'USDC', 'TRUMP', 'JUP', 'USD1', 'MET', 'JupUSD']),
  segments: z.array(CurveSegmentSchema).min(1).max(16),
  feeSchedule: FeeScheduleSchema,
  migration: MigrationConfigSchema,
  rationale: z.string(),
  riskFactors: z.array(z.string()),
});

export type LaunchConfig = z.infer<typeof LaunchConfigSchema>;
