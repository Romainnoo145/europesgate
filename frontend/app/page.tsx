'use client';

import { Perplexity } from '@/components/perplexity/Perplexity';
import { AssistantProvider } from './assistant-provider';

export default function Home() {
  return (
    <AssistantProvider>
      <Perplexity />
    </AssistantProvider>
  );
}