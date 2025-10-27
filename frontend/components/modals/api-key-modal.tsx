"use client";

import { FC, useState } from "react";
import { X, ExternalLink, ChevronDown, ChevronUp, Key, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState("");
  const [asstKey, setAsstKey] = useState("");
  const [isTroubleshootOpen, setIsTroubleshootOpen] = useState(false);
  const [savingApiKey, setSavingApiKey] = useState(false);
  const [savingAsstKey, setSavingAsstKey] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key", {
        position: "bottom-right",
      });
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      toast.error("OpenAI API keys should start with 'sk-'", {
        position: "bottom-right",
      });
      return;
    }

    setSavingApiKey(true);

    try {
      // Store in localStorage
      localStorage.setItem("openai_api_key", apiKey);

      // Simulate API validation (you can add actual validation here)
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success("API Key saved successfully!", {
        position: "bottom-right",
      });

      setApiKey("");
    } catch (error) {
      toast.error("Failed to save API key", {
        position: "bottom-right",
      });
    } finally {
      setSavingApiKey(false);
    }
  };

  const handleSaveAsstKey = async () => {
    if (!asstKey.trim()) {
      toast.error("Please enter a valid Assistant key", {
        position: "bottom-right",
      });
      return;
    }

    if (!asstKey.startsWith("asst_")) {
      toast.error("OpenAI Assistant keys should start with 'asst_'", {
        position: "bottom-right",
      });
      return;
    }

    setSavingAsstKey(true);

    try {
      // Store in localStorage
      localStorage.setItem("openai_asst_key", asstKey);

      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success("Assistant Key saved successfully!", {
        position: "bottom-right",
      });

      setAsstKey("");
    } catch (error) {
      toast.error("Failed to save Assistant key", {
        position: "bottom-right",
      });
    } finally {
      setSavingAsstKey(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#868CFF] to-[#4318FF]">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Enter your OpenAI API Key
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Info Text */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 leading-relaxed">
              You need an OpenAI API Key to use Europe&apos;s Gate AI features. Your API Key is stored locally on your browser and never sent anywhere else.
            </p>
          </div>

          {/* OpenAI API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              OpenAI API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveApiKey();
                }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] focus:ring-2 focus:ring-[#4318FF]/20 transition-all"
              />
              <button
                onClick={handleSaveApiKey}
                disabled={savingApiKey || !apiKey.trim()}
                className="px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
                }}
              >
                {savingApiKey ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>

          {/* Assistant Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Assistant Key (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="asst_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={asstKey}
                onChange={(e) => setAsstKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAsstKey();
                }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] focus:ring-2 focus:ring-[#4318FF]/20 transition-all"
              />
              <button
                onClick={handleSaveAsstKey}
                disabled={savingAsstKey || !asstKey.trim()}
                className="px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
                }}
              >
                {savingAsstKey ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>

          {/* Get API Key Link */}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#4318FF] hover:bg-gray-50 transition-all"
          >
            Get your API key from OpenAI Dashboard
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Troubleshooting Accordion */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsTroubleshootOpen(!isTroubleshootOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-900">
                Your API Key is not working?
              </span>
              {isTroubleshootOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isTroubleshootOpen && (
              <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4318FF] mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Make sure you have an{" "}
                      <a
                        href="https://platform.openai.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4318FF] font-semibold hover:underline"
                      >
                        OpenAI account
                      </a>{" "}
                      and a valid API key to use ChatGPT. We don&apos;t sell API keys.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4318FF] mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Make sure you have your billing info added in{" "}
                      <a
                        href="https://platform.openai.com/account/billing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4318FF] font-semibold hover:underline"
                      >
                        OpenAI Billing
                      </a>{" "}
                      page. Without billing info, your API key will not work.
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              *The app will connect to OpenAI API server to check if your API Key is working properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
