import { TesseraCopilot } from '@/components/copilot/TesseraCopilot';

export const metadata = {
  title: 'Tessera Copilot — AI Launch Parameterizer',
  description: 'Natural language launch requirements synthesized into validated DBC configurations.',
};

export default function CopilotPage() {
  return <TesseraCopilot />;
}
