import asyncio
import edge_tts

VOICE = "en-US-ChristopherNeural"

SCENES = [
    {
        "id": "scene_1",
        "title": "Welcome to Tessera",
        "subtitle": "Quantitative Strategy Marketplace for Meteora DBC",
        "text": "Meet TESSERA, the quantitative strategy marketplace and intelligence layer built for Meteora Dynamic Bonding Curve, DAMM v2, and DLMM. Tessera turns launch configurations into tradable, backtestable, performance-ranked financial products."
    },
    {
        "id": "scene_2",
        "title": "3D Holographic Bonding Surface",
        "subtitle": "Real-Time Multi-Segment Projection Engine",
        "text": "In our interactive 3D terminal, builders project multi-segment bonding curves in real-time. Explore price discovery bands, liquidity depth, and graduation beacons with full 3D camera controls."
    },
    {
        "id": "scene_3",
        "title": "DBC Config Preset Marketplace",
        "subtitle": "Tokenized Stocks, RWAs, and Anti-Snipe Curves",
        "text": "The Preset Marketplace features battle-tested curves for every asset class: xStocks long curves for tokenized equities, flat curves for RWAs, and anti-snipe curves, ranked by our transparent Tessera Score."
    },
    {
        "id": "scene_4",
        "title": "Interactive Curve Lab",
        "subtitle": "Piecewise Math & Dynamic Exponential Fee Decays",
        "text": "In the Curve Lab, quantitative modelers customize up to sixteen curve segments, simulating slippage, dynamic exponential fee decays, and exact DAMM v2 opening prices."
    },
    {
        "id": "scene5_launch",
        "title": "7-Step On-Chain Launch Terminal",
        "subtitle": "Official Meteora DBC TypeScript SDK Integration",
        "text": "Our guided Launch Terminal deploys verified on-chain DBC pools using the official Meteora SDK. In one click, your custom curve is live on Solana with zero fabricated calls."
    },
    {
        "id": "scene_6",
        "title": "AI Copilot & Historical Replay",
        "subtitle": "MEV Attack Backtesting & Natural Language Synthesis",
        "text": "Stress-test against real MEV attacks in our Historical Replay backtester, or prompt Tessera Copilot to synthesize Zod-validated launch parameters from natural language."
    },
    {
        "id": "scene_7",
        "title": "Autonomous DAMM v2 Migration",
        "subtitle": "100% Rug-Proof Permanent Liquidity Lock",
        "text": "Once quote thresholds are breached, autonomous keepers migrate one hundred percent of liquidity into permanent DAMM v2 pools. Tessera: Programmable Liquidity, Quantified."
    }
]

async def main():
    print("Generating concise AI audio matching 1:10 target duration...")
    for i, s in enumerate(SCENES):
        comm = edge_tts.Communicate(s["text"], VOICE, rate="+20%")
        filename = f"scripts/scene_{i+1}.mp3"
        await comm.save(filename)
        print(f"Generated {filename}")

if __name__ == "__main__":
    asyncio.run(main())
