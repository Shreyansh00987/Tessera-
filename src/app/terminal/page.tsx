import { AssetTerminal } from '@/components/terminal/AssetTerminal';

export const metadata = {
  title: 'Asset Terminal — TESSERA',
  description: 'Live DBC trading pool monitor with real swaps and bonding curve orderbook depth.',
};

export default function TerminalPage() {
  return <AssetTerminal />;
}
