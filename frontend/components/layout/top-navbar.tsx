"use client";

import { FC, useState } from "react";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Grid3x3,
  User,
  Settings,
  LogOut,
  MessageSquare,
  ChevronRight,
  X,
  Check,
  BookOpen,
  DollarSign,
  FileText,
  AlertTriangle,
  Calendar,
  Users,
  Archive,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  onMobileMenuToggle?: () => void;
  onNewChat?: () => void;
}

export const TopNavbar: FC<TopNavbarProps> = ({
  onMobileMenuToggle,
  onNewChat,
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Change theme"
            >
              {theme === "light" && <Sun size={20} className="text-gray-700" />}
              {theme === "dark" && <Moon size={20} className="text-gray-700" />}
              {theme === "auto" && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gray-700 to-gray-300" />
              )}
            </button>

            {themeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setThemeMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 py-2">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setThemeMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                      theme === "light" && "bg-gray-50"
                    )}
                  >
                    <Sun size={16} />
                    <span className="flex-1 text-left">Light</span>
                    {theme === "light" && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setThemeMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                      theme === "dark" && "bg-gray-50"
                    )}
                  >
                    <Moon size={16} />
                    <span className="flex-1 text-left">Dark</span>
                    {theme === "dark" && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setTheme("auto");
                      setThemeMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                      theme === "auto" && "bg-gray-50"
                    )}
                  >
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-300" />
                    <span className="flex-1 text-left">Auto</span>
                    {theme === "auto" && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h6 className="font-semibold text-gray-900">
                        Notifications
                      </h6>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {/* NEW Section */}
                    <div className="p-3 border-b border-gray-100">
                      <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        New
                      </h6>
                      <a
                        href="#"
                        className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-1">
                            <strong>New document:</strong> Phase 2 Investment Strategy uploaded
                          </p>
                          <span className="text-xs text-gray-500">
                            📄 Just now
                          </span>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <BarChart3 size={20} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-1">
                            <strong>Financial update:</strong> Q4 funding approved
                          </p>
                          <span className="text-xs text-gray-500">
                            💰 2hr
                          </span>
                        </div>
                      </a>
                    </div>

                    {/* EARLIER Section */}
                    <div className="p-3">
                      <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Earlier
                      </h6>
                      <a
                        href="#"
                        className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={20} className="text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-1">
                            <strong>Risk Alert:</strong> Environmental assessment due next week
                          </p>
                          <span className="text-xs text-gray-500">
                            ⚠️ 1d
                          </span>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-1">
                            3 new documents added to Knowledge Base
                          </p>
                          <span className="text-xs text-gray-500">
                            📚 2d
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-200 text-center">
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Apps Launcher (Nine Dots) */}
          <div className="relative">
            <button
              onClick={() => setAppsOpen(!appsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Apps"
            >
              <Grid3x3 size={20} className="text-gray-700" />
            </button>

            {appsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setAppsOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <div className="p-4">
                    <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      Europe&apos;s Gate Modules
                    </h6>
                    <div className="grid grid-cols-3 gap-3">
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <MessageSquare className="text-blue-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          AI Chat
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <BookOpen className="text-purple-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Knowledge Base
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <DollarSign className="text-green-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Financials
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <FileText className="text-indigo-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Tech Specs
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <AlertTriangle className="text-orange-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Risk Analysis
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Calendar className="text-teal-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Timeline
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                          <Users className="text-pink-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Team
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Archive className="text-gray-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Archive
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                          <BarChart3 className="text-cyan-600" size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          Analytics
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                MH
              </div>
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-2">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} />
                    <span>Profile & account</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                  <div className="my-1 border-t border-gray-200" />
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
