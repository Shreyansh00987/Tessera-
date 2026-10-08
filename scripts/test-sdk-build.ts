import { tesseraMeteoraService } from '../src/lib/meteora/client';
import { CURATED_STRATEGIES } from '../src/lib/data/strategies';
import { VERIFIED_QUOTE_MINTS } from '../src/lib/meteora/constants';
import { PublicKey } from '@solana/web3.js';

async function main() {
  const payer = new PublicKey('Au6y8RRdGUFMm4jKVbguCVcwUbiGtyz9VCPLSF388Cka');
  console.log('Testing prepareCreatePoolInstructions for all 6 curated strategies:');
  for (const s of CURATED_STRATEGIES) {
    const v = s.versions[0];
    const qMint = new PublicKey(VERIFIED_QUOTE_MINTS[v.migration.quoteSymbol].mint);
    const plan = await tesseraMeteoraService.prepareCreatePoolInstructions({
      name: 'Apex Test',
      symbol: 'APEX',
      uri: 'https://arweave.net/apex.json',
      tokenSupply: 1_000_000_000,
      quoteMint: qMint,
      payer,
      segments: v.segments,
      feeSchedule: v.feeSchedule,
      migration: v.migration,
    });
    console.log(`[PASS] ${s.name} (${s.id}) => Pool PDA: ${plan.poolAddress}`);
  }
  console.log('All 6 strategies successfully prepared Meteora DBC instructions!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
