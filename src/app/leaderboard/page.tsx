import { StrategyLeaderboard } from '@/components/leaderboard/StrategyLeaderboard';

export const metadata = {
  title: 'Strategy Leaderboard — TESSERA',
  description: 'Empirical quantitative leaderboard of Meteora DBC strategies.',
};

export default function LeaderboardPage() {
  return <StrategyLeaderboard />;
}
