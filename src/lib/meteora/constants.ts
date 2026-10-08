import { PublicKey } from '@solana/web3.js';

// Official Meteora Program IDs (verified from docs.meteora.ag)
export const METEORA_DBC_PROGRAM_ID = new PublicKey('dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN');
export const METEORA_DBC_AUTHORITY = new PublicKey('FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM');

export const METEORA_DAMM_V2_PROGRAM_ID = new PublicKey('cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG');
export const METEORA_DAMM_V2_AUTHORITY = new PublicKey('HLnpSz9h2S4hiLQ43rnSD9XkcUThA7B8hQMKmDaiTLcC');

// Official Meteora Migration Keepers (run autonomously on Mainnet)
export const METEORA_MIGRATION_KEEPERS = [
  {
    address: 'Asi5DTGEeiso6k7ya6ndDabEZ7DRCgfTpCBLPH5E3aQs',
    label: 'Meteora Primary Keeper #1',
    explorer: 'https://solscan.io/account/Asi5DTGEeiso6k7ya6ndDabEZ7DRCgfTpCBLPH5E3aQs',
  },
  {
    address: 'DeQ8dPv6ReZNQ45NfiWwS5CchWpB2BVq1QMyNV8L2uSW',
    label: 'Meteora Secondary Keeper #2',
    explorer: 'https://solscan.io/account/DeQ8dPv6ReZNQ45NfiWwS5CchWpB2BVq1QMyNV8L2uSW',
  },
] as const;

// Verified quote mints supported by automated migration keepers
export const VERIFIED_QUOTE_MINTS = {
  SOL: {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Wrapped SOL',
    decimals: 9,
    minKeeperThreshold: 10, // 10 SOL
    coingeckoId: 'solana',
  },
  USDC: {
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    minKeeperThreshold: 750, // 750 USDC
    coingeckoId: 'usd-coin',
  },
  TRUMP: {
    mint: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
    symbol: 'TRUMP',
    name: 'OFFICIAL TRUMP',
    decimals: 6,
    minKeeperThreshold: 100, // 100 TRUMP
    coingeckoId: 'official-trump',
  },
  JUP: {
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    minKeeperThreshold: 1500, // 1500 JUP
    coingeckoId: 'jupiter-exchange-solana',
  },
  USD1: {
    mint: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
    symbol: 'USD1',
    name: 'World Liberty Financial USD',
    decimals: 6,
    minKeeperThreshold: 750, // 750 USD1
    coingeckoId: 'usd1',
  },
  MET: {
    mint: 'METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL',
    symbol: 'MET',
    name: 'Meteora',
    decimals: 6,
    minKeeperThreshold: 1500, // 1500 MET
    coingeckoId: 'meteora',
  },
  JupUSD: {
    mint: 'JuprjznTrTSp2UFa3ZBUFgwdAmtZCq4MQCwysN55USD',
    symbol: 'JupUSD',
    name: 'Jupiter USD',
    decimals: 6,
    minKeeperThreshold: 750, // 750 JupUSD
    coingeckoId: 'jup-usd',
  },
} as const;

// Verified DAMM v2 Fee Config Keys from Meteora Documentation
export const DAMM_V2_FEE_CONFIGS = [
  {
    tier: 0,
    feeBps: 25,
    feePct: '0.25%',
    address: '7F6dnUcRuyM2TwR8myT1dYypFXpPSxqwKNSFNkxyNESd',
    recommendedFor: 'RWA, Stable, Deep Liquidity pairs',
  },
  {
    tier: 1,
    feeBps: 30,
    feePct: '0.30%',
    address: '2nHK1kju6XjphBLbNxpM5XRGFj7p9U8vvNzyZiha1z6k',
    recommendedFor: 'Standard Utility Tokens, Blue chips',
  },
  {
    tier: 2,
    feeBps: 100,
    feePct: '1.00%',
    address: 'Hv8Lmzmnju6m7kcokVKvwqz7QPmdX9XfKjJsXz8RXcjp',
    recommendedFor: 'Standard Community & Growth Launches',
  },
  {
    tier: 3,
    feeBps: 200,
    feePct: '2.00%',
    address: '2c4cYd4reUYVRAB9kUUkrq55VPyy2FNQ3FDL4o12JXmq',
    recommendedFor: 'Volatile & High Velocity Launches',
  },
  {
    tier: 4,
    feeBps: 400,
    feePct: '4.00%',
    address: 'AkmQWebAwFvWk55wBoCr5D62C6VVDTzi84NJuD9H7cFD',
    recommendedFor: 'High Slippage & Meme Cannon pairs',
  },
  {
    tier: 5,
    feeBps: 600,
    feePct: '6.00%',
    address: 'DbCRBj8McvPYHJG1ukj8RE15h2dCNUdTAESG49XpQ44u',
    recommendedFor: 'Extreme Volatility / Anti-Arbitrage',
  },
  {
    tier: 6,
    feeBps: 0,
    feePct: 'Customizable',
    address: 'A8gMrEPJkacWkcb3DGwtJwTe16HktSEfvwtuDh2MCtck',
    recommendedFor: 'Dynamic Scheduler on DAMM v2',
  },
] as const;

// Fee split constants
export const PROTOCOL_TRADING_FEE_SHARE = 0.20; // 20% protocol share
export const PROTOCOL_MIGRATION_FEE_FIXED = 0.002; // 0.2% fixed protocol liquidity migration fee
export const PROTOCOL_CREATION_FEE_SHARE = 0.10; // 10% protocol share of pool creation fee
export const MAX_FEE_NUMERATOR = 990_000_000; // 99% cap
export const FEE_DENOMINATOR = 1_000_000_000; // 10^9
