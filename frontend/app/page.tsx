'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { AssistantProvider } from './assistant-provider';

export default function Home() {
  const [chatResetKey, setChatResetKey] = useState(0);

  const handleResetChat = () => {
    setChatResetKey(prev => prev + 1);
  };

  return (
    <AssistantProvider key={chatResetKey}>
      <MainLayout onResetChat={handleResetChat} />
    </AssistantProvider>
  );
}