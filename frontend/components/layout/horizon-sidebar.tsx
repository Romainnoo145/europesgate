"use client";

import { FC, useState } from "react";
import {
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BridgeLogo } from "@/components/icons/bridge-logo";

interface HorizonSidebarProps {
  activeTab: "home" | "knowledge" | "socials" | "settings";
  onTabChange: (tab: "home" | "knowledge" | "socials" | "settings") => void;
  onNewChat?: () => void;
}

export const HorizonSidebar: FC<HorizonSidebarProps> = ({
  activeTab,
  onTabChange,
  onNewChat,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-8">
        <BridgeLogo className="w-16 h-16" />
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {/* AI Chat with New Chat button */}
        <button
          onClick={() => onTabChange("home")}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all",
            activeTab === "home"
              ? "bg-gradient-to-r from-blue-50 to-teal-50 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              activeTab === "home"
                ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            )}
          >
            <MessageSquare size={18} />
          </div>
          <span>AI Chat</span>
          {onNewChat && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNewChat();
              }}
              className="ml-auto rounded-xl p-1.5 hover:bg-gray-100"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z" />
              </svg>
            </button>
          )}
        </button>

        {/* Knowledge Base */}
        <button
          onClick={() => onTabChange("knowledge")}
          className={cn(
            "group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all",
            activeTab === "knowledge"
              ? "bg-gradient-to-r from-purple-50 to-pink-50 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              activeTab === "knowledge"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            )}
          >
            <BookOpen size={18} />
          </div>
          <span>Knowledge Base</span>
        </button>

        {/* Social Media */}
        <button
          onClick={() => onTabChange("socials")}
          className={cn(
            "group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all",
            activeTab === "socials"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              activeTab === "socials"
                ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            )}
          >
            <Users size={18} />
          </div>
          <span>Social Media</span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-4 mt-auto">
        {/* Usage Stats */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-4">
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700">API Usage</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
                style={{ width: "65%" }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-600">
              6,500/10,000 queries used
            </p>
          </div>

          {/* Mini Chart */}
          <div className="flex items-end justify-between gap-1 h-12">
            {[40, 55, 70, 45, 85, 60, 50].map((height, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-blue-200"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex w-full items-center gap-3 rounded-2xl bg-gray-50 p-3 transition-colors hover:bg-gray-100"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-sm font-semibold text-white">
              MH
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">Matt Hendrikx</p>
            </div>
            <Settings size={16} className="text-gray-400" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 z-20 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <BarChart3 size={16} />
                  <span>Usage Stats</span>
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Users size={16} />
                  <span>Profile</span>
                </button>
                <div className="border-t border-gray-200" />
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
