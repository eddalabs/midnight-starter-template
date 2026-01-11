import { createFileRoute } from '@tanstack/react-router';
import { Counter } from '@/pages/counter';

export const Route = createFileRoute('/counter')({
  component: Counter,
});
