"use client";

import { FC } from "react";
import { Settings, User, Bell, Lock } from "lucide-react";

export const SettingsTab: FC = () => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={24} />
          Settings
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* User settings */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">User Profile</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage your Europe&apos;s Gate account settings
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
              Edit Profile
            </button>
          </div>

          {/* Notifications */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Control how you receive updates about the project
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
              Notification Settings
            </button>
          </div>

          {/* Privacy & Security */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage your privacy settings and security preferences
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
