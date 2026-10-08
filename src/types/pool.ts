import { CurveSegment, FeeSchedule, MigrationConfig } from './strategy';

export type PoolStatus = 'ACTIVE_BONDING' | 'GRADUATION_PENDING' | 'MIGRATED_DAMM_V2' | 'TERMINATED';

export interface DbcPoolState {
  address: string;
  configAddress: string;
  creator: string;
  baseMint: string;
  baseName: string;
  baseSymbol: string;
  baseDecimals: number;
  quoteMint: string;
  quoteSymbol: string;
  quoteDecimals: number;
  status: PoolStatus;
  createdAt: number;
  
  // Curve state
  currentPriceQuote: number;
  startPriceQuote: number;
  migrationPriceQuote: number;
  quoteReserve: number;
  baseReserve: number;
  migrationQuoteThreshold: number;
  curveProgressPct: number; // 0 - 100%
  
  // Segment info
  currentSegmentIndex: number;
  totalSegments: number;
  segments: CurveSegment[];
  
  // Fees
  currentTradingFeeBps: number;
  totalTradingFeesQuote: number;
  partnerUnclaimedFeesQuote: number;
  creatorUnclaimedFeesQuote: number;
  
  // Activity
  volume24hQuote: number;
  totalTransactions: number;
  holderCount: number;
  
  // DAMM v2 Migration
  migratedDammV2PoolAddress?: string;
  migrationSignature?: string;
  migrationTimestamp?: number;
  keeperAddress?: string;
}

export interface SwapQuoteResult {
  amountIn: number;
  amountOut: number;
  feeAmount: number;
  effectiveFeeBps: number;
  priceBefore: number;
  priceAfter: number;
  priceImpactPct: number;
  minimumAmountOut: number;
  willCrossSegment: boolean;
  willTriggerGraduation: boolean;
}
