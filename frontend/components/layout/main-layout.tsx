"use client";

import { FC, useState, useEffect } from "react";
import { useThread } from "@assistant-ui/react";
import { ModernSidebar } from "./modern-sidebar";
import { PageHeader } from "./page-header";
import { Thread } from "../perplexity/thread";
import { KnowledgeDocsTab } from "../tabs/knowledge-docs-tab";
import { SocialsTab } from "../tabs/socials-tab";
import { SettingsTab } from "../tabs/settings-tab";
import { SaveConversationModal, type ConversationMessage } from "../knowledge-base/save-conversation-modal";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}

interface MainLayoutProps {
  onResetChat?: () => void;
}

export const MainLayout: FC<MainLayoutProps> = ({ onResetChat }) => {
  const [activeTab, setActiveTab] = useState<
    "home" | "knowledge" | "socials" | "settings"
  >("home");
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [newChatCounter, setNewChatCounter] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveConversationModalOpen, setSaveConversationModalOpen] = useState(false);
  const [conversationToSave, setConversationToSave] = useState<ConversationMessage[]>([]);

  // Get current thread messages from Assistant UI
  const thread = useThread();

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
    setNewChatCounter((prev) => prev + 1); // Force Thread remount
    setActiveTab("home");
    onResetChat?.(); // Reset the runtime
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

  const handleSaveConversation = () => {
    // Extract messages from the current thread
    const messages: ConversationMessage[] = [];

    if (thread.messages) {
      thread.messages.forEach((msg) => {
        if (msg.role === "user" || msg.role === "assistant") {
          // Extract text content from message parts
          const textContent = msg.content
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join("\n\n");

          if (textContent.trim()) {
            messages.push({
              role: msg.role as "user" | "assistant",
              content: textContent,
            });
          }
        }
      });
    }

    if (messages.length === 0) {
      alert("No conversation to save yet! Start chatting first.");
      return;
    }

    setConversationToSave(messages);
    setSaveConversationModalOpen(true);
  };

  const getPageConfig = () => {
    switch (activeTab) {
      case "home":
        return {
          breadcrumbs: [{ label: "Pages", href: "#" }, { label: "AI Chat" }],
          title: "AI Chat",
        };
      case "knowledge":
        return {
          breadcrumbs: [{ label: "Pages", href: "#" }, { label: "Knowledge Base" }],
          title: "Knowledge Base",
        };
      case "socials":
        return {
          breadcrumbs: [{ label: "Pages", href: "#" }, { label: "Social Media" }],
          title: "Social Media",
        };
      case "settings":
        return {
          breadcrumbs: [{ label: "Pages", href: "#" }, { label: "Settings" }],
          title: "Settings",
        };
      default:
        return {
          breadcrumbs: [],
          title: "Europe's Gate",
        };
    }
  };

  const pageConfig = getPageConfig();

  return (
    <div className="flex h-full w-full bg-white">
      {/* Sidebar - Full height */}
      <ModernSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main content area with page header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <PageHeader
          breadcrumbs={pageConfig.breadcrumbs}
          title={pageConfig.title}
          onMobileMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateToSettings={() => setActiveTab("settings")}
        />

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {activeTab === "home" && (
            <Thread
              key={`${currentChatId}-${newChatCounter}`}
              chatId={currentChatId}
              onSaveChat={handleSaveChat}
              onNewChat={handleNewChat}
              onSaveConversation={handleSaveConversation}
            />
          )}
          {activeTab === "knowledge" && <KnowledgeDocsTab />}
          {activeTab === "socials" && <SocialsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>

      {/* Save Conversation Modal */}
      {saveConversationModalOpen && (
        <SaveConversationModal
          messages={conversationToSave}
          onClose={() => setSaveConversationModalOpen(false)}
        />
      )}
    </div>
  );
};
