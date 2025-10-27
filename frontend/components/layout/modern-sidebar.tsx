"use client";

import { FC, useState, useEffect } from "react";
import {
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import { BridgeLogo } from "@/components/icons/bridge-logo";
import { ChatSession } from "./main-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiKeyModal } from "@/components/modals/api-key-modal";
import { useLanguage } from "@/contexts/language-context";
import { getApiUrl } from "@/lib/utils";

interface ModernSidebarProps {
  activeTab: "home" | "knowledge" | "socials" | "settings";
  onTabChange: (tab: "home" | "knowledge" | "socials" | "settings") => void;
  onNewChat?: () => void;
  chatSessions?: ChatSession[];
  currentChatId?: string;
  onLoadChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

export const ModernSidebar: FC<ModernSidebarProps> = ({
  activeTab,
  onTabChange,
  onNewChat,
  chatSessions = [],
  currentChatId,
  onLoadChat,
  onDeleteChat,
}) => {
  const { t } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [usageData, setUsageData] = useState({
    total_credits: 100000,
    used_credits: 0,
    usage_percentage: 0,
    total_cost_eur: 0,
    daily_usage: Array(7).fill({ tokens: 0, cost_eur: 0 })
  });

  // Fetch usage data on mount and every 30 seconds
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/api/usage/credits`);
        if (response.ok) {
          const data = await response.json();
          // Ensure daily_usage always has 7 days
          const dailyUsage = data.daily_usage || [];
          const paddedDailyUsage = Array(7).fill(null).map((_, i) =>
            dailyUsage[i] || { tokens: 0, cost_eur: 0 }
          );
          setUsageData({
            total_credits: data.total_credits || 100000,
            used_credits: data.used_credits || 0,
            usage_percentage: data.usage_percentage || 0,
            total_cost_eur: data.total_cost_eur || 0,
            daily_usage: paddedDailyUsage
          });
        }
      } catch (error) {
        console.error("Failed to fetch usage data:", error);
      }
    };

    fetchUsage();
    const interval = setInterval(fetchUsage, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex h-full w-64 flex-col"
      style={{
        background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-8">
        <BridgeLogo className="w-16 h-16" variant="gradient" />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {/* AI Chat */}
        <button
          onClick={() => onTabChange("home")}
          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all mb-2 ${
            activeTab === "home"
              ? "bg-white text-[#4318FF]"
              : "text-white hover:bg-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                activeTab === "home"
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              <MessageSquare size={18} />
            </div>
            <span>{t("sidebar.aiChat")}</span>
          </div>
          {onNewChat && activeTab === "home" && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onNewChat();
              }}
              className="rounded-lg p-1 hover:bg-gray-100/10 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onNewChat();
                }
              }}
            >
              <Plus size={16} />
            </div>
          )}
        </button>

        {/* Knowledge Base */}
        <button
          onClick={() => onTabChange("knowledge")}
          className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all mb-2 ${
            activeTab === "knowledge"
              ? "bg-white text-[#4318FF]"
              : "text-white hover:bg-white/10"
          }`}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              activeTab === "knowledge"
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            <BookOpen size={18} />
          </div>
          <span>{t("sidebar.knowledgeBase")}</span>
        </button>

        {/* Social Media */}
        <button
          onClick={() => onTabChange("socials")}
          className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all mb-2 ${
            activeTab === "socials"
              ? "bg-white text-[#4318FF]"
              : "text-white hover:bg-white/10"
          }`}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              activeTab === "socials"
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            <Users size={18} />
          </div>
          <span>{t("sidebar.socialMedia")}</span>
        </button>

        {/* Divider */}
        <div className="my-6 h-px bg-white/20" />

        {/* Recent Chats */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
            {t("sidebar.recentChats")}
          </h3>
          {chatSessions.length > 0 ? (
            <div className="space-y-1">
              {chatSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className={`group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    currentChatId === session.id
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <button
                    onClick={() => onLoadChat?.(session.id)}
                    className="flex-1 text-left truncate"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="flex-shrink-0" />
                      <span className="truncate">{session.title}</span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat?.(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-xl bg-white/10">
                  <Clock size={20} className="text-white/60" />
                </div>
              </div>
              <p className="text-xs text-white/60 font-medium mb-1">
                {t("sidebar.comingSoon")}
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                {t("sidebar.chatHistoryDesc")}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        {/* Credits Widget */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
          <p className="text-xs font-semibold text-white mb-2">{t("sidebar.credits")}</p>
          <div
            className="h-1.5 w-full rounded-full mb-2 bg-white/20"
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${usageData.usage_percentage}%`,
                background: "linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)"
              }}
            />
          </div>
          <p className="text-xs text-white/70">
            €{usageData.total_cost_eur.toFixed(2)} ({usageData.used_credits.toLocaleString()} tokens)
          </p>

          {/* Mini Chart */}
          <div className="mt-4 space-y-1">
            <div className="flex items-end justify-between gap-1 h-16">
              {usageData.daily_usage.map((day, i) => {
                const maxCost = Math.max(...usageData.daily_usage.map(d => d.cost_eur || 0));
                const heightPx = maxCost > 0 && day.cost_eur > 0 ? (day.cost_eur / maxCost) * 64 : 2;
                return (
                  <div
                    key={i}
                    className="flex-1 relative group flex items-end"
                  >
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                      style={{
                        height: `${heightPx}px`,
                        background: day.cost_eur > 0
                          ? `linear-gradient(180deg, rgba(96, 165, 250, ${0.4 + (i * 0.05)}) 0%, rgba(167, 139, 250, ${0.4 + (i * 0.05)}) 100%)`
                          : 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      €{day.cost_eur.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-white/50 px-0.5">
              {(() => {
                const dayNames = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
                const today = new Date();
                const labels = [];
                for (let i = 6; i >= 0; i--) {
                  const date = new Date(today);
                  date.setDate(date.getDate() - i);
                  labels.push(dayNames[date.getDay()]);
                }
                return labels.map((day, i) => (
                  <span key={i} className="flex-1 text-center">{day}</span>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Set API Key Button */}
        <button
          onClick={() => setApiKeyModalOpen(true)}
          className="w-full px-4 py-2.5 rounded-xl bg-white text-[#4318FF] text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          {t("sidebar.setApiKey")}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm p-3 transition-colors hover:bg-white/20"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
              MH
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white">Matt Hendrikx</p>
            </div>
            <Settings size={16} className="text-white/70" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 z-20 rounded-2xl bg-white shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    onTabChange("settings");
                    setUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Settings size={16} />
                  <span>{t("sidebar.profileSettings")}</span>
                </button>
                <div className="border-t border-gray-200" />
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50">
                  <LogOut size={16} />
                  <span>{t("sidebar.logout")}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />
    </div>
  );
};
