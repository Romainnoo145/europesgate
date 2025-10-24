'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { AssistantProvider } from './assistant-provider';

export default function Home() {
  return (
    <AssistantProvider>
      <MainLayout />
    </AssistantProvider>
  );
}