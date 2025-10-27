"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "nl";

interface Translations {
  [key: string]: {
    en: string;
    nl: string;
  };
}

const translations: Translations = {
  // Sidebar
  "sidebar.aiChat": { en: "AI Chat", nl: "AI Chat" },
  "sidebar.knowledgeBase": { en: "Knowledge Base", nl: "Knowledge Base" },
  "sidebar.socialMedia": { en: "Social Media", nl: "Social Media" },
  "sidebar.recentChats": { en: "Recent Chats", nl: "Recente Chats" },
  "sidebar.comingSoon": { en: "Coming Soon", nl: "Binnenkort" },
  "sidebar.chatHistoryDesc": { en: "Chat history will be available in a future update", nl: "Chat geschiedenis komt beschikbaar in een toekomstige update" },
  "sidebar.credits": { en: "Credits", nl: "Credits" },
  "sidebar.setApiKey": { en: "Set API Key", nl: "Stel API Key in" },
  "sidebar.profileSettings": { en: "Profile Settings", nl: "Profiel Instellingen" },
  "sidebar.logout": { en: "Log out", nl: "Uitloggen" },

  // Thread/Chat
  "thread.greeting": { en: "Hi Matt", nl: "Hi Matt" },
  "thread.subtitle": { en: "Ask me anything about your projects", nl: "Vraag me alles over je projecten" },
  "thread.quickPrompt1": { en: "Give me an executive summary of the project.", nl: "Geef me een executive summary van het project." },
  "thread.quickPrompt2": { en: "What are the key milestones and timeline?", nl: "Wat zijn de belangrijkste milestones en timeline?" },
  "thread.quickPrompt3": { en: "Explain the financial structure and funding strategy.", nl: "Leg de financial structuur en funding strategy uit." },
  "thread.quickPrompt4": { en: "What do I need to know for the next investor meeting?", nl: "Wat moet ik weten voor de volgende investor meeting?" },
  "thread.inputPlaceholder": { en: "Ask me anything...", nl: "Vraag me alles..." },
  "thread.comingSoonTitle": { en: "Coming Soon", nl: "Binnenkort Beschikbaar" },
  "thread.comingSoonDesc": { en: "Enhanced capabilities in development", nl: "Verbeterde functionaliteiten in ontwikkeling" },
  "thread.feature1": { en: "Live Web Search", nl: "Live Web Search" },
  "thread.feature1Desc": { en: "Real-time market data, regulatory updates, and competitor intelligence", nl: "Real-time marktdata, regelgeving updates en concurrent intelligence" },
  "thread.feature2": { en: "Export to Report", nl: "Export naar Rapport" },
  "thread.feature2Desc": { en: "Generate professional PDF/Word reports from conversations", nl: "Genereer professionele PDF/Word rapporten uit gesprekken" },
  "thread.feature3": { en: "Financial Calculator", nl: "Financiële Calculator" },
  "thread.feature3Desc": { en: "Embedded NPV, IRR, and ROI calculators for quick analysis", nl: "Geïntegreerde NPV, IRR en ROI calculators voor snelle analyse" },

  // Settings
  "settings.accountSettings": { en: "Account Settings", nl: "Account Instellingen" },
  "settings.accountSettingsDesc": { en: "Here you can change user account information", nl: "Hier kun je gebruikersaccount informatie wijzigen" },
  "settings.username": { en: "Username", nl: "Gebruikersnaam" },
  "settings.emailAddress": { en: "Email Address", nl: "E-mailadres" },
  "settings.firstName": { en: "First Name", nl: "Voornaam" },
  "settings.lastName": { en: "Last Name", nl: "Achternaam" },
  "settings.job": { en: "Job", nl: "Functie" },
  "settings.aboutMe": { en: "About Me", nl: "Over Mij" },
  "settings.aboutMePlaceholder": { en: "Tell something about yourself in 150 characters!", nl: "Vertel iets over jezelf in 150 karakters!" },
  "settings.accountType": { en: "Account type:", nl: "Account type:" },
  "settings.administrator": { en: "Administrator", nl: "Administrator" },
  "settings.member": { en: "Member", nl: "Member" },

  "settings.socialProfiles": { en: "Social Profiles", nl: "Social Profielen" },
  "settings.socialProfilesDesc": { en: "Here you can set user social profiles", nl: "Hier kun je social media profielen instellen" },
  "settings.twitterUsername": { en: "Twitter Username", nl: "Twitter Gebruikersnaam" },
  "settings.facebookUsername": { en: "Facebook Username", nl: "Facebook Gebruikersnaam" },
  "settings.githubUsername": { en: "Github Username", nl: "Github Gebruikersnaam" },

  "settings.changePassword": { en: "Change Password", nl: "Wachtwoord Wijzigen" },
  "settings.changePasswordDesc": { en: "Here you can set your new password", nl: "Hier kun je je nieuwe wachtwoord instellen" },
  "settings.oldPassword": { en: "Old Password", nl: "Oud Wachtwoord" },
  "settings.newPassword": { en: "New Password", nl: "Nieuw Wachtwoord" },
  "settings.newPasswordConfirmation": { en: "New Password Confirmation", nl: "Nieuw Wachtwoord Bevestigen" },
  "settings.confirmNewPassword": { en: "Confirm New Password", nl: "Bevestig Nieuw Wachtwoord" },

  "settings.language": { en: "Language Preference", nl: "Taalvoorkeur" },
  "settings.languageDesc": { en: "Choose your preferred language", nl: "Kies je voorkeurstaal" },
  "settings.languageLabel": { en: "Language", nl: "Taal" },
  "settings.english": { en: "English", nl: "Engels" },
  "settings.dutch": { en: "Dutch", nl: "Nederlands" },

  "settings.deleteAccount": { en: "Delete Account", nl: "Account Verwijderen" },
  "settings.saveChanges": { en: "Save Changes", nl: "Wijzigingen Opslaan" },
  "settings.deleteConfirm": { en: "Are you sure you want to delete your account? This action cannot be undone.", nl: "Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt." },

  // Knowledge Base
  "knowledge.title": { en: "Knowledge Base", nl: "Knowledge Base" },
  "knowledge.desc": { en: "Upload and manage your project documents", nl: "Upload en beheer je projectdocumenten" },
  "knowledge.uploadButton": { en: "Upload Documents", nl: "Documenten Uploaden" },
  "knowledge.documents": { en: "documents", nl: "documenten" },
  "knowledge.noDocuments": { en: "No documents uploaded yet", nl: "Nog geen documenten geüpload" },
  "knowledge.uploadFirst": { en: "Upload your first document to get started", nl: "Upload je eerste document om te beginnen" },
  "knowledge.delete": { en: "Delete", nl: "Verwijderen" },

  // Social Media
  "social.title": { en: "Social Media Posts", nl: "Social Media Posts" },
  "social.desc": { en: "Generate professional content for your social channels", nl: "Genereer professionele content voor je social media kanalen" },
  "social.comingSoon": { en: "Coming Soon", nl: "Binnenkort" },
  "social.save": { en: "Save", nl: "Opslaan" },
  "social.saving": { en: "Saving...", nl: "Opslaan..." },
  "social.customPrompt": { en: "Custom Prompt", nl: "Custom Prompt" },
  "social.fromChat": { en: "From Chat History", nl: "Vanuit Chat Geschiedenis" },
  "social.generate": { en: "Generate (Coming Soon)", nl: "Genereren (Binnenkort)" },
  "social.copyText": { en: "Copy Text", nl: "Kopieer Tekst" },
  "social.copied": { en: "Copied!", nl: "Gekopieerd!" },

  // API Key Modal
  "apiKey.title": { en: "Enter your OpenAI API Key", nl: "Vul je OpenAI API Key in" },
  "apiKey.save": { en: "Save", nl: "Opslaan" },
  "apiKey.saving": { en: "Saving...", nl: "Opslaan..." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("language") as Language | null;
    if (saved && (saved === "en" || saved === "nl")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
