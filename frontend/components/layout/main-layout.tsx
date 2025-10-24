"use client";

import { FC, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Thread } from "../perplexity/thread";
import { KnowledgeDocsTab } from "../tabs/knowledge-docs-tab";
import { SocialsTab } from "../tabs/socials-tab";
import { SettingsTab } from "../tabs/settings-tab";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}

export const MainLayout: FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "knowledge" | "socials" | "settings"
  >("home");
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatSessions");
    if (saved) {
      try {
        setChatSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat sessions", e);
      }
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  const handleNewChat = () => {
    setCurrentChatId("");
    setActiveTab("home");
  };

  const handleSaveChat = (title: string, messages: unknown[]) => {
    const chatId = Date.now().toString();
    const newSession: ChatSession = {
      id: chatId,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      timestamp: Date.now(),
    };

    // Store chat content in localStorage
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));

    // Add to sessions and keep only last 10
    setChatSessions((prev) => [newSession, ...prev].slice(0, 10));
    setCurrentChatId(chatId);
  };

  const handleLoadChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setActiveTab("home");
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions((prev) => prev.filter((session) => session.id !== chatId));
    localStorage.removeItem(`chat_${chatId}`);
    if (currentChatId === chatId) {
      setCurrentChatId("");
    }
  };

  return (
    <div className="flex h-full w-full bg-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Europe&apos;s Gate Intelligence Platform
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Ask the AI about your megaproject
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "home" && (
            <Thread
              chatId={currentChatId}
              onSaveChat={handleSaveChat}
              onNewChat={handleNewChat}
            />
          )}
          {activeTab === "knowledge" && <KnowledgeDocsTab />}
          {activeTab === "socials" && <SocialsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};
