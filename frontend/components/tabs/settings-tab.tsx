"use client";

import { FC } from "react";
import { Settings, User, Bell, Lock } from "lucide-react";

export const SettingsTab: FC = () => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings size={24} />
          Settings
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-4">
          {/* User settings */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">User Profile</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage your Europe&apos;s Gate account settings
            </p>
            <button className="px-5 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95">
              Edit Profile
            </button>
          </div>

          {/* Notifications */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell size={20} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Control how you receive updates about the project
            </p>
            <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95">
              Notification Settings
            </button>
          </div>

          {/* Privacy & Security */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Lock size={20} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage your privacy settings and security preferences
            </p>
            <button className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95">
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
