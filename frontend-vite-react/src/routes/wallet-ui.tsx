import { createFileRoute } from '@tanstack/react-router';
import { WalletUI } from '@/pages/wallet-ui';

export const Route = createFileRoute('/wallet-ui')({
  component: WalletUI,
});
