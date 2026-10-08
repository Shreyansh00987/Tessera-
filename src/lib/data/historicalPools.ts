import { HistoricalTrade } from '@/types/strategy';
import { DbcPoolState } from '@/types/pool';

export interface HistoricalPoolRecord {
  id: string;
  name: string;
  symbol: string;
  baseMint: string;
  quoteSymbol: string;
  quoteMint: string;
  launchTimestamp: number;
  actualGraduationMinutes: number;
  actualFeesQuote: number;
  actualMaxDrawdown: number;
  actualGini: number;
  description: string;
  trades: HistoricalTrade[];
}

export const HISTORICAL_POOLS: HistoricalPoolRecord[] = [
  {
    id: 'pool-meme-snipe-attack',
    name: 'CyberPup Solana',
    symbol: 'CYBER',
    baseMint: 'CybP8mZ7wK4nB1vT9wL6rQ3yZ5cX7vA9eR1tY3uI5o',
    quoteSymbol: 'SOL',
    quoteMint: 'So11111111111111111111111111111111111111112',
    launchTimestamp: 1727780000,
    actualGraduationMinutes: 58,
    actualFeesQuote: 11.45,
    actualMaxDrawdown: 0.384, // 38.4% drawdown due to bot dump
    actualGini: 0.54, // concentrated
    description:
      'High-attention meme launch hit by 3 MEV bot sniper bundles in the first 45 seconds, followed by a 40% panic dump before community clawback and DAMM v2 graduation.',
    trades: [
      {
        id: 'tx-001',
        timestamp: 1727780004,
        slot: 298412010,
        type: 'BUY',
        wallet: 'SnipeBot11111111111111111111111111111111111',
        quoteAmount: 2.5,
        baseAmount: 185_000_000,
        priceAfter: 0.000015,
        feeQuote: 0.05,
        isSniperAttempt: true,
      },
      {
        id: 'tx-002',
        timestamp: 1727780008,
        slot: 298412018,
        type: 'BUY',
        wallet: 'SnipeBot22222222222222222222222222222222222',
        quoteAmount: 2.0,
        baseAmount: 120_000_000,
        priceAfter: 0.000021,
        feeQuote: 0.04,
        isSniperAttempt: true,
      },
      {
        id: 'tx-003',
        timestamp: 1727780020,
        slot: 298412042,
        type: 'BUY',
        wallet: 'SnipeBot33333333333333333333333333333333333',
        quoteAmount: 1.8,
        baseAmount: 85_000_000,
        priceAfter: 0.000029,
        feeQuote: 0.036,
        isSniperAttempt: true,
      },
      {
        id: 'tx-004',
        timestamp: 1727780045,
        slot: 298412092,
        type: 'SELL',
        wallet: 'SnipeBot11111111111111111111111111111111111',
        quoteAmount: 2.1,
        baseAmount: 120_000_000,
        priceAfter: 0.000018, // dumped price
        feeQuote: 0.042,
        isSniperAttempt: true,
      },
      {
        id: 'tx-005',
        timestamp: 1727780060,
        slot: 298412122,
        type: 'BUY',
        wallet: 'OrganicUser9999999999999999999999999999999',
        quoteAmount: 0.75,
        baseAmount: 38_000_000,
        priceAfter: 0.000022,
        feeQuote: 0.015,
      },
      {
        id: 'tx-006',
        timestamp: 1727780120,
        slot: 298412242,
        type: 'BUY',
        wallet: 'CommunityLead44444444444444444444444444444',
        quoteAmount: 1.5,
        baseAmount: 65_000_000,
        priceAfter: 0.000031,
        feeQuote: 0.03,
      },
      {
        id: 'tx-007',
        timestamp: 1727780240,
        slot: 298412482,
        type: 'BUY',
        wallet: 'HolderWallet888888888888888888888888888888',
        quoteAmount: 1.2,
        baseAmount: 42_000_000,
        priceAfter: 0.000042,
        feeQuote: 0.024,
      },
      {
        id: 'tx-008',
        timestamp: 1727780400,
        slot: 298412802,
        type: 'BUY',
        wallet: 'HolderWallet777777777777777777777777777777',
        quoteAmount: 1.6,
        baseAmount: 48_000_000,
        priceAfter: 0.000058,
        feeQuote: 0.032,
      },
      {
        id: 'tx-009',
        timestamp: 1727780800,
        slot: 298413602,
        type: 'BUY',
        wallet: 'RetailWave55555555555555555555555555555555',
        quoteAmount: 2.2,
        baseAmount: 52_000_000,
        priceAfter: 0.000085,
        feeQuote: 0.044,
      },
      {
        id: 'tx-010',
        timestamp: 1727781500,
        slot: 298415002,
        type: 'BUY',
        wallet: 'GraduationPusher66666666666666666666666666',
        quoteAmount: 2.1,
        baseAmount: 35_000_000,
        priceAfter: 0.00012,
        feeQuote: 0.042,
      },
    ],
  },
  {
    id: 'pool-rwa-treasury',
    name: 'Ondo US Treasury Short Term',
    symbol: 'OUSG',
    baseMint: 'Ond9mZ2wK8nB4vT1wL7rQ5yZ9cX3vA1eR6tY8uI0o',
    quoteSymbol: 'USDC',
    quoteMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    launchTimestamp: 1726000000,
    actualGraduationMinutes: 72,
    actualFeesQuote: 32.5,
    actualMaxDrawdown: 0.025, // 2.5% drawdown
    actualGini: 0.21,
    description:
      'Institutional short-term treasury pool launched against USDC with steady, non-speculative capital subscription reaching 750 USDC keeper graduation boundary.',
    trades: [
      {
        id: 'tx-rwa-01',
        timestamp: 1726000100,
        slot: 295000100,
        type: 'BUY',
        wallet: 'InstFundA111111111111111111111111111111111',
        quoteAmount: 150,
        baseAmount: 151.2,
        priceAfter: 0.995,
        feeQuote: 0.375,
      },
      {
        id: 'tx-rwa-02',
        timestamp: 1726000600,
        slot: 295001100,
        type: 'BUY',
        wallet: 'InstFundB222222222222222222222222222222222',
        quoteAmount: 200,
        baseAmount: 200.8,
        priceAfter: 1.001,
        feeQuote: 0.50,
      },
      {
        id: 'tx-rwa-03',
        timestamp: 1726001500,
        slot: 295002900,
        type: 'BUY',
        wallet: 'CorporateTreasury3333333333333333333333333',
        quoteAmount: 250,
        baseAmount: 249.5,
        priceAfter: 1.008,
        feeQuote: 0.625,
      },
      {
        id: 'tx-rwa-04',
        timestamp: 1726003200,
        slot: 295006300,
        type: 'BUY',
        wallet: 'YieldAggregator44444444444444444444444444',
        quoteAmount: 160,
        baseAmount: 158.2,
        priceAfter: 1.014,
        feeQuote: 0.40,
      },
    ],
  },
];
