import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import {
  DynamicBondingCurveClient,
  deriveDbcPoolAddress,
  ActivationType,
  BaseFeeMode,
  CollectFeeMode,
  MigrationOption,
  MigrationFeeOption,
  TokenType,
  TokenDecimal,
  TokenAuthorityOption,
  DammV2BaseFeeMode,
  DammV2DynamicFeeMode,
  MigratedCollectFeeMode,
  buildCurveWithCustomSqrtPrices,
  createSqrtPrices,
} from '@meteora-ag/dynamic-bonding-curve-sdk';

import {
  METEORA_DBC_PROGRAM_ID,
  METEORA_DAMM_V2_PROGRAM_ID,
  DAMM_V2_FEE_CONFIGS,
} from './constants';
import { CurveSegment, FeeSchedule, MigrationConfig } from '@/types/strategy';

export interface CreatePoolParams {
  name: string;
  symbol: string;
  uri: string;
  tokenSupply: number;
  quoteMint: PublicKey;
  payer: PublicKey;
  segments: CurveSegment[];
  feeSchedule: FeeSchedule;
  migration: MigrationConfig;
}

export class TesseraMeteoraService {
  private connection: Connection;
  private client: DynamicBondingCurveClient | null = null;
  private isConnectedToLiveRpc: boolean = false;

  constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
    try {
      this.client = DynamicBondingCurveClient.create(this.connection, 'confirmed');
      this.isConnectedToLiveRpc = true;
    } catch (err) {
      console.warn('Initializing offline/demo mode client:', err);
      this.client = null;
      this.isConnectedToLiveRpc = false;
    }
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public getClient(): DynamicBondingCurveClient | null {
    return this.client;
  }

  /**
   * Derives deterministic DBC Pool PDA
   */
  public derivePoolAddress(
    quoteMint: PublicKey,
    baseMint: PublicKey,
    config: PublicKey
  ): PublicKey {
    return deriveDbcPoolAddress(quoteMint, baseMint, config);
  }

  /**
   * Prepares on-chain parameters for buildCurveWithCustomSqrtPrices
   */
  public buildCurveConfig(
    segments: CurveSegment[],
    feeSchedule: FeeSchedule,
    migration: MigrationConfig,
    tokenSupply: number = 1_000_000_000
  ) {
    // Extract price boundaries
    const pricePoints: number[] = [segments[0].pLower];
    const liquidityWeights: number[] = [];

    for (const seg of segments) {
      pricePoints.push(seg.pUpper);
      liquidityWeights.push(Math.max(1, Math.round(seg.liquidityWeight)));
    }

    const sqrtPrices = createSqrtPrices(
      pricePoints,
      TokenDecimal.SIX, // 6 decimals base token
      migration.quoteSymbol === 'SOL' ? TokenDecimal.NINE : TokenDecimal.SIX
    );

    const isFixedFee = feeSchedule.startingFeeBps === feeSchedule.endingFeeBps;
    let sdkBaseFeeMode = BaseFeeMode.FeeSchedulerLinear;
    if (!isFixedFee && feeSchedule.baseFeeMode === 'FEE_SCHEDULER_EXPONENTIAL') {
      sdkBaseFeeMode = BaseFeeMode.FeeSchedulerExponential;
    } else {
      sdkBaseFeeMode = BaseFeeMode.FeeSchedulerLinear;
    }

    const numberOfPeriod = isFixedFee ? 0 : (feeSchedule.numberOfPeriods || 60);
    const totalDuration = isFixedFee ? 0 : (feeSchedule.totalDurationSeconds || 300);

    return buildCurveWithCustomSqrtPrices({
      token: {
        tokenType: TokenType.SPLToken,
        tokenBaseDecimal: TokenDecimal.SIX,
        tokenQuoteDecimal: migration.quoteSymbol === 'SOL' ? TokenDecimal.NINE : TokenDecimal.SIX,
        tokenAuthorityOption: TokenAuthorityOption.PartnerUpdateAuthority,
        totalTokenSupply: tokenSupply,
        leftover: 100, // Safe integer rounding buffer for on-chain arithmetic
      },
      fee: {
        baseFeeParams: {
          baseFeeMode: sdkBaseFeeMode,
          feeSchedulerParam: {
            startingFeeBps: feeSchedule.startingFeeBps,
            endingFeeBps: feeSchedule.endingFeeBps,
            numberOfPeriod,
            totalDuration,
          },
        },
        dynamicFeeEnabled: feeSchedule.dynamicFeeEnabled,
        collectFeeMode: CollectFeeMode.QuoteToken,
        creatorTradingFeePercentage: feeSchedule.creatorTradingFeePercentage,
        poolCreationFee: feeSchedule.poolCreationFeeSol,
        enableFirstSwapWithMinFee: false,
      },
      migration: {
        migrationOption: MigrationOption.MET_DAMM_V2,
        migrationFeeOption: MigrationFeeOption.Customizable,
        migrationFee: {
          feePercentage: migration.migrationFeePercentage,
          creatorFeePercentage: migration.creatorMigrationFeePercentage,
        },
        migratedPoolFee: {
          collectFeeMode: MigratedCollectFeeMode.QuoteToken,
          dynamicFee: DammV2DynamicFeeMode.Enabled,
          poolFeeBps: migration.migratedDammV2FeeBps,
          baseFeeMode: DammV2BaseFeeMode.FeeTimeSchedulerLinear,
        },
      },
      liquidityDistribution: {
        partnerLiquidityPercentage: 0,
        partnerPermanentLockedLiquidityPercentage: migration.permanentLockedLiquidityPercentage,
        creatorLiquidityPercentage: 0,
        creatorPermanentLockedLiquidityPercentage: 0,
      },
      lockedVesting: {
        totalLockedVestingAmount: 0,
        numberOfVestingPeriod: 0,
        cliffUnlockAmount: 0,
        totalVestingDuration: 0,
        cliffDurationFromMigrationTime: 0,
      },
      activationType: ActivationType.Timestamp,
      sqrtPrices,
      liquidityWeights,
    });
  }

  /**
   * Constructs the full transaction instructions to create DBC config and pool
   */
  public async prepareCreatePoolInstructions(params: CreatePoolParams) {
    const configKeypair = Keypair.generate();
    const baseMintKeypair = Keypair.generate();

    const curveConfig = this.buildCurveConfig(
      params.segments,
      params.feeSchedule,
      params.migration,
      params.tokenSupply
    );

    const poolAddress = this.derivePoolAddress(
      params.quoteMint,
      baseMintKeypair.publicKey,
      configKeypair.publicKey
    );

    return {
      configPublicKey: configKeypair.publicKey.toBase58(),
      baseMintPublicKey: baseMintKeypair.publicKey.toBase58(),
      poolAddress: poolAddress.toBase58(),
      curveConfig,
      dammV2TargetKey: params.migration.migratedDammV2ConfigKey,
      dbcProgramId: METEORA_DBC_PROGRAM_ID.toBase58(),
      dammV2ProgramId: METEORA_DAMM_V2_PROGRAM_ID.toBase58(),
    };
  }
}

export const tesseraMeteoraService = new TesseraMeteoraService();
