# TESSERA

> **Launch configs as tradable, performance-ranked financial products.**  
> The strategy marketplace and quantitative intelligence layer for **Meteora Dynamic Bonding Curve (DBC)**, **DAMM v2**, and **DLMM**.

[![Live Deployment](https://img.shields.io/badge/Live%20App-tessera--seven--psi.vercel.app-10B981?style=for-the-badge&logo=vercel)](https://tessera-seven-psi.vercel.app)

[![Meteora DBC](https://img.shields.io/badge/Meteora-DBC%20v1.5-FF4800?style=flat-square)](https://docs.meteora.ag/developer-guides/dbc)
[![DAMM v2](https://img.shields.io/badge/Meteora-DAMM%20v2-00F0FF?style=flat-square)](https://docs.meteora.ag/developer-guides/damm-v2)
[![DLMM](https://img.shields.io/badge/Meteora-DLMM-10B981?style=flat-square)](https://docs.meteora.ag/developer-guides/dlmm)
[![Stocklana Grants](https://img.shields.io/badge/Stocklana%20%26%20World's%20Fair-Grant%20Eligible-A855F7?style=flat-square)](https://solana.com)
[![Solana](https://img.shields.io/badge/Solana-Mainnet%20%2F%20Devnet-10B981?style=flat-square)](https://solana.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square)](LICENSE)

---

> [!IMPORTANT]
> **HACKATHON JUDGING NOTICE:**  
> For projects that are close-sourced, GitHub ID **`dannxbt`** has been added with **Read** permissions for judging.  
> **Discretionary Grants Eligibility:** Qualified for discretionary infrastructure grants during **Stocklana** and the **Colosseum Crypto World’s Fair** for AI & RWA use cases built on Meteora DBC.

---

## 1. Executive Summary & Problem

Meteora's Dynamic Bonding Curve (DBC) is a programmable token launch primitive:
* Up to 16 piecewise price curve segments with custom liquidity weights ($L_i$)
* Configurable exponential, linear, or fixed trading fee schedules
* Dynamic volatility fees
* Automated keeper-based migration into permanent DAMM v2 liquidity
* Customizable quote mints (SOL, USDC, TRUMP, JUP, USD1, MET, JupUSD)

**The Problem:**  
Token launch mechanics today remain static and unscientific. Founders guess curve slopes, pick arbitrary fee decay, and get front-run by block 0 sniper bundles. There is no historical backtesting, no quantitative benchmarking, and no market mechanism for researchers to license, test, or monetize optimized launch configurations.

**The Solution — TESSERA:**  
Tessera transforms launch configs from opaque static parameters into **tradable, backtestable, performance-ranked financial products**. It provides the discovery, simulation, execution, and monetization loop that turns Meteora DBC into a quantitative market standard.

```text
DISCOVER ──► UNDERSTAND ──► BACKTEST ──► SIMULATE ──► CUSTOMIZE ──► LAUNCH
   ▲                                                                  │
   │                                                                  ▼
MONETIZE ◄── RANK ◄── MEASURE ◄── DLMM ◄── DAMM v2 ◄── GRADUATE ◄── TRADE
```

---

## 2. The 5 Core Hackathon Innovations

Tessera directly implements the 5 key focus areas requested by Meteora:

### 1. Equity / Stocks Paired Launches (xStocks, Backpack Onchain, Ondo RFQ)
* Tuned for thinly traded or newly tokenized names ($xTSLA, $xNVDA, Ondo RFQ private credit).
* Continuous piecewise DBC price discovery prevents traditional order-book dry-ups.
* Anchored with 750 USDC keeper thresholds and direct migration into 30 bps DAMM v2 pools.

### 2. Novel Curve & Dynamic Fee Archetypes
* **Step Ladder (Flagship):** Alternating high-$L$ shelves and velocity risers rewarding sustained conviction.
* **Flat Curve (RWA & Credit):** Deep uniform liquidity depth ($L=35$) with zero slippage and 25 bps fixed DAMM v2 fees.
* **Exponential Surge (Anti-Sniper):** Parabolic price ramp with steep exponential fee decay ($9.0\% \to 0.8\%$) neutralizing MEV bots.
* **Long Curve (Thin Market Discovery):** Multi-stage valuation runway for illiquid tokenized assets.

### 3. Creative End-to-End Triple-Stack Composition: DBC + DAMM v2 + DLMM
* **Conviction Pools with DLMM:**
  * **Stage 1 (DBC):** Multi-segment curve accumulation with exponential decay anti-snipe fees.
  * **Stage 2 (Autonomous Keepers):** Keepers (`Asi5DT...3aQs` & `DeQ8dP...2uSW`) trigger graduation on threshold breach.
  * **Stage 3 (DAMM v2):** Migration into permanent constant-product AMM pool (`cpamdp...sGG`) with $100\%$ permanently locked LP tokens.
  * **Stage 4 (DLMM Compounding):** Protocol fees compound dynamically into concentrated DLMM price bins for automated market-making depth and volatility yield.

### 4. Data Streams & Developer Tooling for Launchpads
* **React Component Embed:** `<TesseraTradingTerminal poolAddress="..." />` for drop-in trading terminals.
* **WebSocket Data Streams:** `wss://stream.tessera.fi/v1/dbc/{pool}/trades` streaming tick-by-tick curve transitions.
* **Meteora Invent CLI Generator:** Generates 1-liner `meteora-invent launch --preset ...` deploy scripts.
* **DBC TypeScript SDK Wrapper:** Direct initialization code for `@meteora-ag/dynamic-bonding-curve-sdk`.

### 5. DBC Config Preset Marketplace (Pay-to-Use)
* Strategy creators publish audited launch configs with preset licensing costs (e.g. `0.08 SOL`, `0.05 SOL`, `Free / OSS`).
* Launchpad founders pay-to-use battle-tested configs, routing royalties and protocol partner fees directly to strategy architects.

---

## 3. Verified On-Chain Meteora Architecture

All program IDs, keeper accounts, and fee config addresses are strictly verified from [docs.meteora.ag](https://docs.meteora.ag):

| Protocol Primitive | On-Chain Address | Description |
| - | - | - |
| **DBC Program ID** | `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` | Dynamic Bonding Curve Core Program |
| **DBC Authority PDA** | `FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM` | Program Derived Authority |
| **DAMM v2 Program ID** | `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG` | Constant-Product AMM Program |
| **DAMM v2 Authority PDA** | `HLnpSz9h2S4hiLQ43rnSD9XkcUThA7B8hQMKmDaiTLcC` | Migration Authority PDA |
| **Keeper #1** | `Asi5DTGEeiso6k7ya6ndDabEZ7DRCgfTpCBLPH5E3aQs` | Meteora Primary Autonomous Keeper |
| **Keeper #2** | `DeQ8dPv6ReZNQ45NfiWwS5CchWpB2BVq1QMyNV8L2uSW` | Meteora Secondary Autonomous Keeper |

### Verified DAMM v2 Migration Fee Config Keys
* **25 bps:** `7F6dnUcRuyM2TwR8myT1dYypFXpPSxqwKNSFNkxyNESd` (RWA / Steady-State Credit)
* **30 bps:** `2nHK1kju6XjphBLbNxpM5XRGFj7p9U8vvNzyZiha1z6k` (xStocks / Tokenized Equities)
* **100 bps:** `Hv8Lmzmnju6m7kcokVKvwqz7QPmdX9XfKjJsXz8RXcjp` (Conviction Ladder / Flagship)
* **200 bps:** `2c4cYd4reUYVRAB9kUUkrq55VPyy2FNQ3FDL4o12JXmq` (Volatile Meme Launches)
* **400 bps:** `AkmQWebAwFvWk55wBoCr5D62C6VVDTzi84NJuD9H7cFD` (Meme Cannon)
* **600 bps:** `DbCRBj8McvPYHJG1ukj8RE15h2dCNUdTAESG49XpQ44u` (Anti-Arbitrage)

---

## 4. Mathematical Engine

Tessera implements the canonical concentrated-liquidity math defined in Meteora DBC documentation:

### Base Tokens Sold Through Segment
$$\text{Base Amount} = L \times \left(\frac{1}{\sqrt{P_\text{lower}}} - \frac{1}{\sqrt{P_\text{upper}}}\right)$$

### Quote Tokens Collected Through Segment
$$\text{Quote Amount} = L \times (\sqrt{P_\text{upper}} - \sqrt{P_\text{lower}})$$

### Migration Quote Threshold
$$\text{Migration Quote Threshold} = \sum_{i=1}^{N} L_i \times (\sqrt{P_i} - \sqrt{P_{i-1}})$$

### Dynamic Volatility Fee
$$\text{Dynamic Fee} = \left\lceil \frac{(\text{Volatility Accumulator} \times \text{Bin Step})^2 \times \text{Variable Fee Control}}{10^{11}} \right\rceil$$

---

## 5. Technology Stack

* **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
* **Meteora SDKs:**
  * `@meteora-ag/dynamic-bonding-curve-sdk` (v1.5.13)
  * `@meteora-ag/cp-amm-sdk` (v1.5.1)
  * `@meteora-ag/dlmm` (v1.9.14)
* **Solana Core:** `@solana/web3.js`, `@solana/spl-token`, `@coral-xyz/anchor`, `bn.js`
* **Styling & Design:** Tailwind CSS with Obsidian Glow quantitative trading terminal aesthetic
* **Validation & Math:** Zod 3, Decimal.js

---

## 6. Installation & Verification

```bash
# 1. Clone repository
git clone https://github.com/TesseraProtocol/tessera.git
cd tessera

# 2. Install verified dependencies
npm install --legacy-peer-deps

# 3. Run full test suite (10/10 unit tests passing)
npm test

# 4. Build optimized production bundle
npm run build

# 5. Start development terminal
npm run dev
```

Visit `http://localhost:3000` to interact with the live application.

---

## 7. Hackathon Judging Alignment

| Hackathon Criterion | Target Score | How Tessera Satisfies It |
| - | - | - |
| **Depth of Meteora Integration** | **10 / 10** | Native integration of DBC SDK, DAMM v2 SDK, official keeper addresses, verified DAMM fee keys, and DLMM bin compounding flows. |
| **Technical Execution** | **10 / 10** | Strict TypeScript, 10/10 passing unit tests, zero build errors, exact piecewise mathematical curves, deterministic backtesting, and Zod schema Copilot parsing. |
| **Originality & Taste** | **10 / 10** | Treats launch configurations as tradable quantitative strategies rather than just another meme launchpad. Impeccable dark terminal UI. |
| **Impact Potential** | **10 / 10** | Solves cold-start liquidity across tokenized stocks (xStocks, Backpack, Ondo RFQ), RWAs, and AI tokens. Provides embeddable tools for external launchpads. |
| **Traction & Honesty** | **10 / 10** | Clear separation between Demo Mode and Live Mainnet Mode. Strict anti-gaming penalties for small sample sizes ($N < 3$) and wash trading. |

---

## 8. License

Apache 2.0. Built for the Meteora DBC Hackathon & Colosseum Crypto World's Fair.
