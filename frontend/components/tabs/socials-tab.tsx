"use client";

import { FC, useState } from "react";
import { FileText, Linkedin, Mail, ArrowRight, Clock, ArrowLeft, Copy, Check, MessageSquare, Edit3 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const socialChannels = [
  {
    id: "blog" as const,
    title: "Blog Post",
    description: "Export insights and knowledge as beautifully formatted blog articles",
    icon: FileText,
    gradient: "from-[#868CFF] to-[#4318FF]",
    placeholderTopic: "Write about the latest developments in green hydrogen production...",
    outputPlaceholder: "Your blog post will appear here with proper formatting, headings, and structure..."
  },
  {
    id: "linkedin" as const,
    title: "LinkedIn Post",
    description: "Share Europe&apos;s Gate insights directly to LinkedIn as engaging posts",
    icon: Linkedin,
    gradient: "from-blue-500 to-blue-600",
    placeholderTopic: "Share insights about sustainable steel production...",
    outputPlaceholder: "Your LinkedIn post will appear here with hashtags and professional formatting..."
  },
  {
    id: "newsletter" as const,
    title: "Newsletter",
    description: "Compile knowledge updates into a professional newsletter format",
    icon: Mail,
    gradient: "from-purple-500 to-pink-500",
    placeholderTopic: "Create a newsletter about project milestones and updates...",
    outputPlaceholder: "Your newsletter will appear here with sections, highlights, and call-to-actions..."
  },
];

type PostType = "blog" | "linkedin" | "newsletter";
type InputMode = "prompt" | "chat";

export const SocialsTab: FC = () => {
  const { t } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState<PostType | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("prompt");
  const [customPrompt, setCustomPrompt] = useState("");
  const [paragraphs, setParagraphs] = useState("3");
  const [tone, setTone] = useState("");
  const [copied, setCopied] = useState(false);

  const currentChannel = socialChannels.find(ch => ch.id === selectedChannel);

  const handleBack = () => {
    setSelectedChannel(null);
    setCustomPrompt("");
    setParagraphs("3");
    setTone("");
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Step 1: Selection View
  if (!selectedChannel) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("social.title")}</h2>
          <p className="text-sm text-gray-600">
            {t("social.desc")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {socialChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white border-2 border-gray-200 hover:border-[#4318FF] text-left"
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-r ${channel.gradient} p-6 h-32 flex flex-col justify-end relative overflow-hidden`}>
                    <div className="absolute top-4 right-4 opacity-20">
                      <Icon size={48} className="text-white" />
                    </div>
                    <Icon size={28} className="text-white mb-2 relative z-10" />
                    <h3 className="text-white font-bold text-lg relative z-10">
                      {channel.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6 min-h-[48px]">
                      {channel.description}
                    </p>

                    {/* Coming Soon badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                          {t("social.comingSoon")}
                        </span>
                      </div>
                      <ArrowRight size={18} className="text-gray-400 group-hover:text-[#4318FF] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info box */}
          <div className="mt-8 p-6 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white max-w-6xl">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Preview Mode</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Click any card to preview the generation interface. The actual AI generation functionality will be available in a future update. You&apos;ll be able to take chat conversations or write custom prompts to create professional content for your social channels.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Generation View
  const Icon = currentChannel!.icon;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with back button */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${currentChannel!.gradient}`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentChannel!.title} Generator</h2>
            <p className="text-sm text-gray-500">Preview interface - Coming soon</p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Content Input</h3>
                <p className="text-sm text-gray-500">Choose your input method below</p>
              </div>

              {/* Input Mode Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                <button
                  onClick={() => setInputMode("prompt")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    inputMode === "prompt"
                      ? "bg-white text-[#4318FF] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Edit3 size={16} />
                  {t("social.customPrompt")}
                </button>
                <button
                  onClick={() => setInputMode("chat")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    inputMode === "chat"
                      ? "bg-white text-[#4318FF] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MessageSquare size={16} />
                  {t("social.fromChat")}
                </button>
              </div>

              {/* Input Area */}
              {inputMode === "prompt" ? (
                <div className="flex-1 flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Topic
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={currentChannel!.placeholderTopic}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Sections
                    </label>
                    <div className="relative">
                      <select
                        id="paragraphs"
                        value={paragraphs}
                        onChange={(e) => setParagraphs(e.target.value)}
                        className="appearance-none w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:border-[#4318FF] transition-all cursor-pointer"
                      >
                        <option value="">Select option</option>
                        <option value="3">3 Sections</option>
                        <option value="4">4 Sections</option>
                        <option value="5">5 Sections</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                      Writing Tone
                    </label>
                    <div className="relative">
                      <select
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="appearance-none w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:border-[#4318FF] transition-all cursor-pointer"
                      >
                        <option value="">Select option</option>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="technical">Technical</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="informative">Informative</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all opacity-60 cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
                    }}
                  >
                    {t("social.generate")}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Select from Chat History
                      </p>
                      <p className="text-xs text-gray-400">
                        Feature coming soon - Select any chat conversation to generate content
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Output Preview */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Output</h3>
                <p className="text-sm text-gray-500">Your generated content will appear here</p>
              </div>

              {/* Output Area */}
              <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50 overflow-y-auto mb-4">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {currentChannel!.outputPlaceholder}
                </p>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold cursor-not-allowed opacity-60"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    {t("social.copied")}
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    {t("social.copyText")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
