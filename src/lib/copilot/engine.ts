import { LaunchConfig, LaunchConfigSchema, CurveSegment, FeeSchedule, MigrationConfig } from '@/types/strategy';
import { VERIFIED_QUOTE_MINTS, DAMM_V2_FEE_CONFIGS } from '../meteora/constants';

export interface CopilotPromptResult {
  config: LaunchConfig;
  isValid: boolean;
  validationErrors: string[];
  rationale: string;
  riskFactors: string[];
}

/**
 * Intelligent deterministic launch parameter synthesizer.
 * Analyzes natural language intent and outputs strict, mathematically verified DBC configs.
 */
export function processCopilotPrompt(userPrompt: string): CopilotPromptResult {
  const promptLower = userPrompt.toLowerCase();

  // Detect asset class
  let assetClass: LaunchConfig['assetClass'] = 'UTILITY';
  if (promptLower.includes('rwa') || promptLower.includes('treasury') || promptLower.includes('credit') || promptLower.includes('bond')) {
    assetClass = 'RWA';
  } else if (promptLower.includes('stock') || promptLower.includes('equity') || promptLower.includes('ipo')) {
    assetClass = 'EQUITY';
  } else if (promptLower.includes('meme') || promptLower.includes('community') || promptLower.includes('fair')) {
    assetClass = 'MEME';
  } else if (promptLower.includes('ai') || promptLower.includes('agent')) {
    assetClass = 'AI';
  } else if (promptLower.includes('thin') || promptLower.includes('niche')) {
    assetClass = 'THIN_MARKET';
  }

  // Detect quote token
  let quoteSymbol: LaunchConfig['quoteSymbol'] = 'SOL';
  if (assetClass === 'RWA' || assetClass === 'EQUITY' || promptLower.includes('usdc') || promptLower.includes('dollar') || promptLower.includes('$')) {
    quoteSymbol = 'USDC';
  }

  // Detect target quote threshold
  let migrationQuoteThreshold = quoteSymbol === 'SOL' ? 10 : 750;
  const solMatch = promptLower.match(/(\d+)\s*sol/);
  if (solMatch && solMatch[1]) {
    migrationQuoteThreshold = Math.max(10, parseInt(solMatch[1], 10));
    quoteSymbol = 'SOL';
  }
  const usdcMatch = promptLower.match(/(\d+)\s*usdc/);
  if (usdcMatch && usdcMatch[1]) {
    migrationQuoteThreshold = Math.max(750, parseInt(usdcMatch[1], 10));
    quoteSymbol = 'USDC';
  }

  // Detect anti-snipe intent
  const hasAntiSnipe = promptLower.includes('anti-snip') || promptLower.includes('bot') || promptLower.includes('sniper') || promptLower.includes('protection');

  // Synthesize segments
  let segments: CurveSegment[] = [];
  if (assetClass === 'RWA') {
    segments = [
      {
        segmentIndex: 0,
        label: 'Institutional Parity Shelf',
        type: 'SHELF',
        pLower: 0.99,
        pUpper: 1.01,
        liquidityWeight: 30,
      },
    ];
  } else if (hasAntiSnipe || assetClass === 'MEME') {
    // 4-segment step-ladder with deep floor
    segments = [
      {
        segmentIndex: 0,
        label: 'Anti-Snipe Accumulation Shelf',
        type: 'SHELF',
        pLower: 0.000008,
        pUpper: 0.000015,
        liquidityWeight: 12,
      },
      {
        segmentIndex: 1,
        label: 'First Discovery Riser',
        type: 'RISER',
        pLower: 0.000015,
        pUpper: 0.000035,
        liquidityWeight: 3.5,
      },
      {
        segmentIndex: 2,
        label: 'Community Consolidation Shelf',
        type: 'SHELF',
        pLower: 0.000035,
        pUpper: 0.00007,
        liquidityWeight: 8,
      },
      {
        segmentIndex: 3,
        label: 'Graduation Acceleration Riser',
        type: 'RISER',
        pLower: 0.00007,
        pUpper: 0.00012,
        liquidityWeight: 4,
      },
    ];
  } else {
    // Standard 3-segment curve
    segments = [
      {
        segmentIndex: 0,
        label: 'Foundation Floor Shelf',
        type: 'SHELF',
        pLower: 0.00001,
        pUpper: 0.000025,
        liquidityWeight: 10,
      },
      {
        segmentIndex: 1,
        label: 'Expansion Tier',
        type: 'STANDARD',
        pLower: 0.000025,
        pUpper: 0.00006,
        liquidityWeight: 6,
      },
      {
        segmentIndex: 2,
        label: 'DAMM v2 Transition Shelf',
        type: 'SHELF',
        pLower: 0.00006,
        pUpper: 0.00011,
        liquidityWeight: 7,
      },
    ];
  }

  // Synthesize fee schedule
  let feeSchedule: FeeSchedule;
  if (assetClass === 'RWA') {
    feeSchedule = {
      baseFeeMode: 'FIXED',
      startingFeeBps: 25,
      endingFeeBps: 25,
      totalDurationSeconds: 0,
      numberOfPeriods: 0,
      dynamicFeeEnabled: false,
      creatorTradingFeePercentage: 30,
      partnerTradingFeePercentage: 70,
      poolCreationFeeSol: 0.01,
    };
  } else if (hasAntiSnipe) {
    feeSchedule = {
      baseFeeMode: 'FEE_SCHEDULER_EXPONENTIAL',
      startingFeeBps: 800, // 8.0% initial fee
      endingFeeBps: 100, // 1.0% final fee
      totalDurationSeconds: 240, // 4-minute decay
      numberOfPeriods: 40,
      dynamicFeeEnabled: true,
      creatorTradingFeePercentage: 40,
      partnerTradingFeePercentage: 60,
      poolCreationFeeSol: 0.05,
    };
  } else {
    feeSchedule = {
      baseFeeMode: 'FEE_SCHEDULER_LINEAR',
      startingFeeBps: 400,
      endingFeeBps: 100,
      totalDurationSeconds: 180,
      numberOfPeriods: 30,
      dynamicFeeEnabled: true,
      creatorTradingFeePercentage: 50,
      partnerTradingFeePercentage: 50,
      poolCreationFeeSol: 0.02,
    };
  }

  // Synthesize migration config
  const quoteMintInfo = VERIFIED_QUOTE_MINTS[quoteSymbol];
  const dammFeeConfig = assetClass === 'RWA' ? DAMM_V2_FEE_CONFIGS[0] : DAMM_V2_FEE_CONFIGS[2]; // 25 bps for RWA, 100 bps for standard

  const migration: MigrationConfig = {
    destination: 'MET_DAMM_V2',
    quoteMint: quoteMintInfo.mint,
    quoteSymbol,
    migrationQuoteThreshold,
    migrationFeePercentage: assetClass === 'RWA' ? 1 : 4,
    creatorMigrationFeePercentage: 50,
    migratedDammV2FeeBps: dammFeeConfig.feeBps,
    migratedDammV2ConfigKey: dammFeeConfig.address,
    permanentLockedLiquidityPercentage: 100,
  };

  const rationale = `Generated custom DBC architecture for ${assetClass} asset class. Built ${segments.length}-segment curve with ${feeSchedule.baseFeeMode === 'FIXED' ? 'fixed ' + feeSchedule.endingFeeBps + ' bps fee' : 'dynamic ' + feeSchedule.startingFeeBps + ' → ' + feeSchedule.endingFeeBps + ' bps anti-snipe schedule'}. Configured automated migration into Meteora DAMM v2 (${dammFeeConfig.feePct}) at ${migrationQuoteThreshold} ${quoteSymbol} keeper threshold.`;

  const riskFactors: string[] = [];
  if (migrationQuoteThreshold > 50 && quoteSymbol === 'SOL') {
    riskFactors.push('High graduation threshold (>50 SOL) requires substantial organic buying demand to graduate.');
  }
  if (hasAntiSnipe && feeSchedule.startingFeeBps >= 800) {
    riskFactors.push('8%+ initial fee strongly penalizes early retail buyers during the first 60 seconds.');
  }
  if (segments.length === 1) {
    riskFactors.push('Single-segment flat curve limits upside price discovery.');
  }

  const rawConfig: LaunchConfig = {
    name: 'Synthesized DBC Launch',
    symbol: 'TESS-SYNC',
    tokenSupply: 1_000_000_000,
    assetClass,
    quoteSymbol,
    segments,
    feeSchedule,
    migration,
    rationale,
    riskFactors,
  };

  // Run strict Zod schema validation
  const parseResult = LaunchConfigSchema.safeParse(rawConfig);
  const validationErrors: string[] = [];
  if (!parseResult.success) {
    parseResult.error.errors.forEach((err) => {
      validationErrors.push(`${err.path.join('.')}: ${err.message}`);
    });
  }

  return {
    config: rawConfig,
    isValid: parseResult.success,
    validationErrors,
    rationale,
    riskFactors,
  };
}

export interface ConfigDiffItem {
  field: string;
  category: 'CURVE' | 'FEES' | 'MIGRATION' | 'SUPPLY';
  oldValue: string;
  newValue: string;
  isChanged: boolean;
}

/**
 * Computes side-by-side configuration diff between base strategy and proposed config
 */
export function computeConfigDiff(
  base: {
    segments: CurveSegment[];
    feeSchedule: FeeSchedule;
    migration: MigrationConfig;
    tokenSupply: number;
  },
  proposed: LaunchConfig
): ConfigDiffItem[] {
  const diffs: ConfigDiffItem[] = [];

  // Segments count
  diffs.push({
    field: 'Segment Count',
    category: 'CURVE',
    oldValue: `${base.segments.length} Segments`,
    newValue: `${proposed.segments.length} Segments`,
    isChanged: base.segments.length !== proposed.segments.length,
  });

  // Start price
  const oldP0 = base.segments[0]?.pLower.toFixed(6) ?? '0';
  const newP0 = proposed.segments[0]?.pLower.toFixed(6) ?? '0';
  diffs.push({
    field: 'Initial Floor Price',
    category: 'CURVE',
    oldValue: `${oldP0} ${base.migration.quoteSymbol}`,
    newValue: `${newP0} ${proposed.quoteSymbol}`,
    isChanged: oldP0 !== newP0,
  });

  // Base Fee Mode
  diffs.push({
    field: 'Base Fee Mode',
    category: 'FEES',
    oldValue: base.feeSchedule.baseFeeMode,
    newValue: proposed.feeSchedule.baseFeeMode,
    isChanged: base.feeSchedule.baseFeeMode !== proposed.feeSchedule.baseFeeMode,
  });

  // Starting Fee
  diffs.push({
    field: 'Starting Fee',
    category: 'FEES',
    oldValue: `${base.feeSchedule.startingFeeBps / 100}% (${base.feeSchedule.startingFeeBps} bps)`,
    newValue: `${proposed.feeSchedule.startingFeeBps / 100}% (${proposed.feeSchedule.startingFeeBps} bps)`,
    isChanged: base.feeSchedule.startingFeeBps !== proposed.feeSchedule.startingFeeBps,
  });

  // Dynamic fee
  diffs.push({
    field: 'Dynamic Fee (Volatility)',
    category: 'FEES',
    oldValue: base.feeSchedule.dynamicFeeEnabled ? 'Enabled' : 'Disabled',
    newValue: proposed.feeSchedule.dynamicFeeEnabled ? 'Enabled' : 'Disabled',
    isChanged: base.feeSchedule.dynamicFeeEnabled !== proposed.feeSchedule.dynamicFeeEnabled,
  });

  // Quote Token
  diffs.push({
    field: 'Quote Token',
    category: 'MIGRATION',
    oldValue: base.migration.quoteSymbol,
    newValue: proposed.quoteSymbol,
    isChanged: base.migration.quoteSymbol !== proposed.quoteSymbol,
  });

  // Migration Threshold
  diffs.push({
    field: 'Migration Quote Threshold',
    category: 'MIGRATION',
    oldValue: `${base.migration.migrationQuoteThreshold} ${base.migration.quoteSymbol}`,
    newValue: `${proposed.migration.migrationQuoteThreshold} ${proposed.quoteSymbol}`,
    isChanged: base.migration.migrationQuoteThreshold !== proposed.migration.migrationQuoteThreshold,
  });

  // DAMM v2 Fee
  diffs.push({
    field: 'DAMM v2 Pool Fee',
    category: 'MIGRATION',
    oldValue: `${base.migration.migratedDammV2FeeBps} bps`,
    newValue: `${proposed.migration.migratedDammV2FeeBps} bps`,
    isChanged: base.migration.migratedDammV2FeeBps !== proposed.migration.migratedDammV2FeeBps,
  });

  return diffs;
}
