"use client";

import { FC, useState } from "react";
import { Home, BookOpen, Share2, Settings, Menu, X, Zap, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatSession } from "./main-layout";

interface SidebarProps {
  activeTab: "home" | "knowledge" | "socials" | "settings";
  onTabChange: (tab: "home" | "knowledge" | "socials" | "settings") => void;
  onNewChat: () => void;
  chatSessions: ChatSession[];
  currentChatId: string;
  onLoadChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onNewChat,
  chatSessions,
  currentChatId,
  onLoadChat,
  onDeleteChat,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    {
      id: "home" as const,
      label: "Home",
      icon: Home,
      shortcut: "⌘H",
    },
    {
      id: "knowledge" as const,
      label: "Knowledge Docs",
      icon: BookOpen,
      shortcut: "⌘K",
    },
    {
      id: "socials" as const,
      label: "Socials",
      icon: Share2,
      shortcut: "⌘S",
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: Settings,
      shortcut: "⌘,",
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-100 md:hidden"
      >
        {isOpen ? (
          <X size={24} className="text-gray-700" />
        ) : (
          <Menu size={24} className="text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative flex flex-col h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onNewChat}
            className="flex items-center gap-3 mb-4 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full"
            title="New chat"
          >
            <Zap size={28} className="text-blue-600 fill-blue-100" />
            <div className="text-left">
              <h2 className="text-lg font-bold text-gray-900">Europe&apos;s Gate</h2>
              <p className="text-xs text-gray-500">Click logo for new chat</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-teal-50 text-blue-900 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto text-xs text-gray-500">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Recent Chats */}
        {chatSessions.length > 0 && (
          <div className="flex flex-col border-t border-gray-200 overflow-hidden">
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Recent Chats
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-center justify-between gap-2 p-2 rounded-lg text-sm transition-colors cursor-pointer",
                      currentChatId === session.id
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => onLoadChat(session.id)}
                  >
                    <span className="truncate flex-1 text-xs">
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 mt-auto">
          <p>Documents loaded: 11</p>
          <p className="mt-1">v0.1.0 - Beta</p>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
