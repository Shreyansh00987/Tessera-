import { HistoricalReplay } from '@/components/replay/HistoricalReplay';

export const metadata = {
  title: 'Historical Replay — TESSERA',
  description: 'Deterministic backtest replaying historical DBC order flow against candidate strategies.',
};

export default function ReplayPage() {
  return <HistoricalReplay />;
}
