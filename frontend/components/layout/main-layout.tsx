"use client";

import { FC, useState } from "react";
import { Sidebar } from "./sidebar";
import { Thread } from "../perplexity/thread";
import { KnowledgeDocsTab } from "../tabs/knowledge-docs-tab";
import { SocialsTab } from "../tabs/socials-tab";
import { SettingsTab } from "../tabs/settings-tab";

export const MainLayout: FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "knowledge" | "socials" | "settings"
  >("home");

  return (
    <div className="flex h-full w-full bg-white">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

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
          {activeTab === "home" && <Thread />}
          {activeTab === "knowledge" && <KnowledgeDocsTab />}
          {activeTab === "socials" && <SocialsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};
