"use client";

import { FC, useState } from "react";
import {
  Search,
  Settings,
  LogOut,
  Menu,
  BookmarkPlus,
} from "lucide-react";
import { BridgeLogo } from "@/components/icons/bridge-logo";

interface PageHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  title: string;
  onSearch?: (query: string) => void;
  onMobileMenuToggle?: () => void;
  onNavigateToSettings?: () => void;
  onSaveConversation?: () => void;
  showSaveButton?: boolean;
}

export const PageHeader: FC<PageHeaderProps> = ({
  breadcrumbs = [],
  title,
  onSearch,
  onMobileMenuToggle,
  onNavigateToSettings,
  onSaveConversation,
  showSaveButton = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left Section: Logo + Breadcrumbs + Title */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <BridgeLogo className="w-12 h-12 flex-shrink-0" />

          {/* Breadcrumbs + Title */}
          <div className="flex flex-col gap-1">
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-gray-500">{crumb.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-gray-400">/</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Section: Search + Actions */}
        <div className="flex items-center gap-2">
          {/* Search Input with Icon Button Inside */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <div className="relative flex items-center">
              <button
                type="button"
                className="absolute left-2 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="search"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-72 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-all"
              />
            </div>
          </form>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Save Conversation Button */}
          {showSaveButton && (
            <button
              onClick={onSaveConversation}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#868CFF] to-[#4318FF] text-white text-sm font-semibold hover:shadow-lg transition-all"
              title="Save this conversation to Knowledge Base"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save Conversation</span>
            </button>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#868CFF] to-[#4318FF] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              MH
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      👋 Hey, Matt Hendrikx
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigateToSettings?.();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profile Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
