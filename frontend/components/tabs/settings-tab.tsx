"use client";

import { FC, useState } from "react";
import { User, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export const SettingsTab: FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "@matt.hendrikx",
    email: "matt@europesgate.com",
    firstName: "Matt",
    lastName: "Hendrikx",
    job: "Project Director",
    about: "",
    accountType: "Administrator",
    twitter: "",
    facebook: "",
    github: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Saving changes:", formData);
    // Add save logic here
  };

  const handleDelete = () => {
    if (confirm(t("settings.deleteConfirm"))) {
      console.log("Deleting account");
      // Add delete logic here
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center mb-6">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#868CFF] to-[#4318FF] flex items-center justify-center text-white text-3xl font-bold">
                MH
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Matt Hendrikx</h2>

            {/* Account Type Dropdown */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">{t("settings.accountType")}</p>
              <div className="relative">
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:border-[#4318FF] transition-all cursor-pointer"
                >
                  <option value="Administrator">{t("settings.administrator")}</option>
                  <option value="Member">{t("settings.member")}</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("settings.accountSettings")}</h3>
                <p className="text-sm text-gray-500">{t("settings.accountSettingsDesc")}</p>
              </div>

              <div className="space-y-4">
                {/* Username & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.username")}
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="@matt.hendrikx"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.emailAddress")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hello@horizon-ui.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                    />
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.firstName")}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Matt"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.lastName")}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Hendrikx"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                    />
                  </div>
                </div>

                {/* Job */}
                <div>
                  <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.job")}
                  </label>
                  <input
                    type="text"
                    id="job"
                    name="job"
                    value={formData.job}
                    onChange={handleChange}
                    placeholder="Web Developer"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>

                {/* About Me */}
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.aboutMe")}
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder={t("settings.aboutMePlaceholder")}
                    rows={4}
                    maxLength={150}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Language Preference */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={18} className="text-[#4318FF]" />
                  <h3 className="text-lg font-bold text-gray-900">{t("settings.language")}</h3>
                </div>
                <p className="text-sm text-gray-500">{t("settings.languageDesc")}</p>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("settings.languageLabel")}
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "en" | "nl")}
                    className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:border-[#4318FF] transition-all cursor-pointer"
                  >
                    <option value="en">{t("settings.english")}</option>
                    <option value="nl">{t("settings.dutch")}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("settings.socialProfiles")}</h3>
                <p className="text-sm text-gray-500">{t("settings.socialProfilesDesc")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.twitterUsername")}
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder={t("settings.twitterUsername")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.facebookUsername")}
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder={t("settings.facebookUsername")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.githubUsername")}
                  </label>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder={t("settings.githubUsername")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("settings.changePassword")}</h3>
                <p className="text-sm text-gray-500">{t("settings.changePasswordDesc")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.oldPassword")}
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    placeholder={t("settings.oldPassword")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.newPassword")}
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder={t("settings.newPassword")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.newPasswordConfirmation")}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("settings.confirmNewPassword")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="px-6 py-2.5 rounded-xl text-red-600 text-sm font-semibold border border-red-200 hover:bg-red-50 transition-all"
          >
            {t("settings.deleteAccount")}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
            }}
          >
            {t("settings.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};
