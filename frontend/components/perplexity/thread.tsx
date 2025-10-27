"use client";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import { useRef, useState, useEffect } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  RefreshCwIcon,
  BookmarkPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { LoadingMessage } from "@/components/assistant-ui/loading-message";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import { useLanguage } from "@/contexts/language-context";

interface ThreadProps {
  chatId?: string;
  onSaveChat?: (title: string, messages: unknown[]) => void;
  onNewChat?: () => void;
  onSaveConversation?: () => void;
}

export const Thread: FC<ThreadProps> = ({ onSaveConversation }) => {
  return (
    <ThreadPrimitive.Root
      className="box-border h-full bg-gradient-to-b from-white to-gray-50"
      style={{
        ["--thread-max-width" as string]: "48rem",
      }}
    >
      <ThreadPrimitive.Empty>
        <ThreadWelcome />
      </ThreadPrimitive.Empty>
      <ThreadPrimitive.If empty={false}>
        <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-6 pb-4">
          <ThreadPrimitive.Messages
            components={{
              UserMessage: UserMessage,
              AssistantMessage: AssistantMessage,
            }}
          />

          <ThreadPrimitive.If running>
            <LoadingMessage />
          </ThreadPrimitive.If>

          <div className="min-h-8 flex-grow" />

          <div className="sticky bottom-0 mt-4 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end pb-6">
            <ThreadScrollToBottom />
            <Composer onSaveConversation={onSaveConversation} />
          </div>
        </ThreadPrimitive.Viewport>
      </ThreadPrimitive.If>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <button className="absolute -top-12 p-2.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all disabled:invisible">
        <ArrowDownIcon className="w-4 h-4 text-gray-600" />
      </button>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  const { t } = useLanguage();
  const [promptValue, setPromptValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleQuickPrompt = (prompt: string) => {
    if (inputRef.current) {
      // Set the value directly on the DOM element
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(inputRef.current, prompt);
      }

      // Trigger input event that React will recognize
      const inputEvent = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(inputEvent);

      // Update local state
      setPromptValue(prompt);

      // Focus the input
      inputRef.current.focus();
    }
  };

  const greeting = t("thread.greeting");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-col gap-8">
        <div className="flex w-full flex-col items-center justify-center space-y-4 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-6xl font-bold text-center tracking-tight flex">
              {greeting.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    background: char === ' ' ? 'none' : "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
                    WebkitBackgroundClip: char === ' ' ? 'unset' : "text",
                    WebkitTextFillColor: char === ' ' ? 'inherit' : "transparent",
                    backgroundClip: char === ' ' ? 'unset' : "text",
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>
          <p className="text-lg text-gray-600 text-center font-medium opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {t("thread.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            t("thread.quickPrompt1"),
            t("thread.quickPrompt2"),
            t("thread.quickPrompt3"),
            t("thread.quickPrompt4"),
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="p-4 text-left text-sm rounded-2xl bg-white border border-gray-200 text-gray-700 hover:border-[#4318FF] hover:shadow-md transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        <ComposerPrimitive.Root className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
          <ComposerAttachments />
          <div className="flex items-center gap-3 px-4 py-3">
            <ComposerPrimitive.Input
              ref={inputRef}
              value={promptValue}
              onChange={(e) => setPromptValue(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    form.requestSubmit();
                  }
                }
              }}
              rows={1}
              autoFocus
              placeholder={t("thread.inputPlaceholder")}
              className="flex-grow resize-none border-none bg-transparent text-base outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed text-gray-900"
            />
            <ComposerPrimitive.Send asChild>
              <button
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
                }}
              >
                Send
              </button>
            </ComposerPrimitive.Send>
          </div>
        </ComposerPrimitive.Root>
      </div>
    </div>
  );
};

interface ComposerProps {
  onSaveConversation?: () => void;
}

const Composer: FC<ComposerProps> = ({ onSaveConversation }) => {
  return (
    <ComposerPrimitive.Root className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
      <ComposerAttachments />
      <div className="flex items-center gap-3 px-4 py-3">
        <ComposerPrimitive.Input
          rows={1}
          autoFocus
          placeholder="Typ je bericht hier..."
          className="flex-grow resize-none border-none bg-transparent text-base outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed text-gray-900"
        />
        <ComposerAction onSaveConversation={onSaveConversation} />
      </div>
    </ComposerPrimitive.Root>
  );
};

interface ComposerActionProps {
  onSaveConversation?: () => void;
}

const ComposerAction: FC<ComposerActionProps> = ({ onSaveConversation }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Save Conversation Button - Always visible */}
      <ThreadPrimitive.If empty={false}>
        <button
          onClick={onSaveConversation}
          className="px-4 py-2.5 rounded-xl border-2 border-[#4318FF] text-[#4318FF] text-sm font-semibold transition-all hover:bg-[#4318FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          title="Bewaar deze conversatie in de Knowledge Base"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Bewaar</span>
        </button>
      </ThreadPrimitive.If>

      {/* Submit/Stop Button */}
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <button
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
            }}
          >
            Verstuur
          </button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <button className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all hover:shadow-lg">
            Stop
          </button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </div>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative w-full max-w-[var(--thread-max-width)] py-4 flex justify-end">
      <div
        className="rounded-2xl px-5 py-3 max-w-[80%] break-words text-white text-base"
        style={{
          background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
        }}
      >
        <UserMessageAttachments />
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative w-full max-w-[var(--thread-max-width)] py-4">
      <div className="flex flex-col gap-2">
        <div className="rounded-2xl px-5 py-3 bg-gray-50 break-words text-gray-900 text-base leading-relaxed">
          <MessagePrimitive.Parts components={{ Text: MarkdownText }} />
        </div>
        <div className="flex items-center gap-2 px-2">
          <AssistantActionBar />
          <BranchPicker />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="flex gap-1 text-gray-400"
    >
      <ActionBarPrimitive.Copy asChild>
        <button className="p-1.5 hover:text-gray-600 transition-colors" title="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon className="w-4 h-4 text-green-600" />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon className="w-4 h-4" />
          </MessagePrimitive.If>
        </button>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <button className="p-1.5 hover:text-gray-600 transition-colors" title="Regenerate">
          <RefreshCwIcon className="w-4 h-4" />
        </button>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn("inline-flex items-center text-xs text-gray-500", className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <button className="p-1 hover:text-gray-600 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
      </BranchPickerPrimitive.Previous>
      <span className="mx-2 text-xs">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <button className="p-1 hover:text-gray-600 transition-colors">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};

interface SaveToKnowledgeModalProps {
  content: string;
  onClose: () => void;
}

const KNOWLEDGE_CATEGORIES = [
  { id: "economics", label: "📊 Economics", description: "Financiële data, kosten, ROI" },
  { id: "builds", label: "🏗️ Builds", description: "Technische specs, constructie" },
  { id: "subsidies", label: "💰 Subsidies", description: "Grants, funding opties" },
  { id: "regulations", label: "📋 Regulations", description: "Compliance, wettelijke vereisten" },
  { id: "market", label: "🌍 Market Research", description: "Competitie, trends, analyse" },
  { id: "general", label: "📝 Algemeen", description: "Ongecategoriseerde informatie" },
];

const SaveToKnowledgeModal: FC<SaveToKnowledgeModalProps> = ({ content, onClose }) => {
  const [documentName, setDocumentName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saveFormat, setSaveFormat] = useState<"quick" | "brief">("brief");
  const [briefContext, setBriefContext] = useState("");
  const [keyQuestions, setKeyQuestions] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  // AI-suggested category (simplified - in production this would call an AI service)
  const suggestedCategory = (() => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("cost") || lowerContent.includes("price") || lowerContent.includes("budget") || lowerContent.includes("investment")) {
      return "economics";
    }
    if (lowerContent.includes("build") || lowerContent.includes("construction") || lowerContent.includes("technical") || lowerContent.includes("specification")) {
      return "builds";
    }
    if (lowerContent.includes("subsidy") || lowerContent.includes("grant") || lowerContent.includes("funding") || lowerContent.includes("eu funding")) {
      return "subsidies";
    }
    if (lowerContent.includes("regulation") || lowerContent.includes("compliance") || lowerContent.includes("legal") || lowerContent.includes("law")) {
      return "regulations";
    }
    if (lowerContent.includes("market") || lowerContent.includes("competition") || lowerContent.includes("trend") || lowerContent.includes("analysis")) {
      return "market";
    }
    return "general";
  })();

  // Set suggested category on mount
  useEffect(() => {
    setSelectedCategory(suggestedCategory);
  }, [suggestedCategory]);

  const handleSave = async () => {
    if (!documentName.trim()) {
      alert("Please enter a document name");
      return;
    }

    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Format content based on save format
      let finalContent = content;
      if (saveFormat === "brief") {
        // Create Intelligence Brief format
        finalContent = `# ${documentName}\n\n`;
        finalContent += `**Category:** ${KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}\n`;
        finalContent += `**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;

        finalContent += `---\n\n`;

        if (briefContext.trim()) {
          finalContent += `## Context & Background\n\n${briefContext.trim()}\n\n`;
        }

        finalContent += `## Key Information\n\n${content}\n\n`;

        if (keyQuestions.trim()) {
          finalContent += `## Open Questions & Considerations\n\n${keyQuestions.trim()}\n\n`;
        }

        if (nextSteps.trim()) {
          finalContent += `## Next Steps for Research\n\n${nextSteps.trim()}\n\n`;
        }

        finalContent += `---\n\n`;
        finalContent += `*This intelligence brief was created from AI chat conversation to support iterative project scoping and decision-making for Europe's Gate.*\n`;
      }

      // Create a markdown file with the formatted content
      const blob = new Blob([finalContent], { type: "text/markdown" });
      const file = new File([blob], `${documentName}.md`, { type: "text/markdown" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);

      const response = await fetch(`${apiUrl}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      alert("Successfully saved to Knowledge Base!");
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Bewaar in Knowledge Base</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Save Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSaveFormat("quick")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  saveFormat === "quick"
                    ? "border-[#4318FF] bg-gradient-to-r from-[#868CFF]/10 to-[#4318FF]/10 shadow-md"
                    : "border-gray-200 hover:border-[#4318FF]/50 hover:bg-gray-50"
                }`}
              >
                <div className="text-base font-semibold text-gray-900 mb-1">
                  📝 Quick Note
                </div>
                <div className="text-xs text-gray-500">
                  Bewaar as-is voor referentie
                </div>
              </button>
              <button
                onClick={() => setSaveFormat("brief")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  saveFormat === "brief"
                    ? "border-[#4318FF] bg-gradient-to-r from-[#868CFF]/10 to-[#4318FF]/10 shadow-md"
                    : "border-gray-200 hover:border-[#4318FF]/50 hover:bg-gray-50"
                }`}
              >
                <div className="text-base font-semibold text-gray-900 mb-1">
                  📊 Intelligence Brief
                </div>
                <div className="text-xs text-gray-500">
                  Met context + vragen
                </div>
              </button>
            </div>
          </div>

          {/* Document Name */}
          <div>
            <label htmlFor="docName" className="block text-sm font-semibold text-gray-900 mb-2">
              Document Naam
            </label>
            <input
              id="docName"
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="bijv. Steel Island Economics Overzicht"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Categorie {suggestedCategory !== "general" && (
                <span className="text-xs font-normal text-[#4318FF]">
                  (AI Suggestie: {KNOWLEDGE_CATEGORIES.find(c => c.id === suggestedCategory)?.label})
                </span>
              )}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KNOWLEDGE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedCategory === category.id
                      ? "border-[#4318FF] bg-gradient-to-r from-[#868CFF]/10 to-[#4318FF]/10 shadow-md"
                      : "border-gray-200 hover:border-[#4318FF]/50 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-base font-semibold text-gray-900 mb-1">
                    {category.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Intelligence Brief Additional Fields */}
          {saveFormat === "brief" && (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-[#4318FF]">Intelligence Briefs</strong> maken rijke, verhaal-gedreven documentatie waar de AI over kan redeneren.
                  Voeg context, open vragen en volgende stappen toe om uitgebreide project intelligence op te bouwen.
                </p>
              </div>

              <div>
                <label htmlFor="briefContext" className="block text-sm font-semibold text-gray-900 mb-2">
                  Context & Achtergrond <span className="text-xs font-normal text-gray-500">(Optioneel)</span>
                </label>
                <textarea
                  id="briefContext"
                  value={briefContext}
                  onChange={(e) => setBriefContext(e.target.value)}
                  placeholder="Waarom is deze info belangrijk? Wat is de bredere context? Welk probleem lost het op?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="keyQuestions" className="block text-sm font-semibold text-gray-900 mb-2">
                  Open Vragen <span className="text-xs font-normal text-gray-500">(Optioneel)</span>
                </label>
                <textarea
                  id="keyQuestions"
                  value={keyQuestions}
                  onChange={(e) => setKeyQuestions(e.target.value)}
                  placeholder="Welke vragen blijven onbeantwoord? Welke onzekerheden bestaan? Welke aannames moeten gevalideerd?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="nextSteps" className="block text-sm font-semibold text-gray-900 mb-2">
                  Volgende Stappen <span className="text-xs font-normal text-gray-500">(Optioneel)</span>
                </label>
                <textarea
                  id="nextSteps"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Welk onderzoek of acties moeten volgen? Met wie moeten we praten? Welke data hebben we nodig?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Content Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              AI Response Preview
            </label>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">
                {content.substring(0, 500)}{content.length > 500 ? "..." : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Annuleer
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
            }}
          >
            {saving
              ? "Bezig met opslaan..."
              : saveFormat === "brief"
                ? "Bewaar Intelligence Brief"
                : "Bewaar Quick Note"
            }
          </button>
        </div>
      </div>
    </div>
  );
};
