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
          "fixed md:relative flex flex-col h-full w-64 bg-white border-r border-gray-100 transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={onNewChat}
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 transition-all duration-200 active:scale-95"
            title="New chat"
          >
            <Zap size={28} className="text-blue-600 flex-shrink-0" />
            <div className="text-left min-w-0">
              <h2 className="text-sm font-bold text-gray-900">Europe&apos;s Gate</h2>
              <p className="text-xs text-gray-500 truncate">New chat</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md hover:shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                )}
              >
                <Icon size={20} />
                <span className="flex-1 text-left text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Recent Chats */}
        {chatSessions.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 overflow-hidden">
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">
                Recent
              </p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer active:scale-95",
                      currentChatId === session.id
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={() => onLoadChat(session.id)}
                  >
                    <span className="truncate flex-1 text-xs leading-tight">
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(session.id);
                      }}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 hover:text-red-600 rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
          <p>📄 11 documents</p>
          <p>v0.1.0</p>
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
