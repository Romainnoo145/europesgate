"use client";

import { FC, useState, useEffect } from "react";
import { X } from "lucide-react";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface SaveConversationModalProps {
  messages: ConversationMessage[];
  onClose: () => void;
}

const KNOWLEDGE_CATEGORIES = [
  { id: "economics", label: "📊 Economics", description: "Financial data, costs, ROI" },
  { id: "builds", label: "🏗️ Builds", description: "Technical specs, construction" },
  { id: "subsidies", label: "💰 Subsidies", description: "Grants, funding opportunities" },
  { id: "regulations", label: "📋 Regulations", description: "Compliance, legal requirements" },
  { id: "market", label: "🌍 Market Research", description: "Competition, trends, analysis" },
  { id: "general", label: "📝 General", description: "Uncategorized information" },
];

export const SaveConversationModal: FC<SaveConversationModalProps> = ({ messages, onClose }) => {
  const [documentName, setDocumentName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saveFormat, setSaveFormat] = useState<"transcript" | "brief">("brief");
  const [briefContext, setBriefContext] = useState("");
  const [keyQuestions, setKeyQuestions] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // AI-suggested category based on conversation content
  const suggestedCategory = (() => {
    const conversationText = messages.map(m => m.content).join(" ").toLowerCase();

    if (conversationText.includes("cost") || conversationText.includes("price") || conversationText.includes("budget") || conversationText.includes("investment")) {
      return "economics";
    }
    if (conversationText.includes("build") || conversationText.includes("construction") || conversationText.includes("technical") || conversationText.includes("specification")) {
      return "builds";
    }
    if (conversationText.includes("subsidy") || conversationText.includes("grant") || conversationText.includes("funding") || conversationText.includes("eu funding")) {
      return "subsidies";
    }
    if (conversationText.includes("regulation") || conversationText.includes("compliance") || conversationText.includes("legal") || conversationText.includes("law")) {
      return "regulations";
    }
    if (conversationText.includes("market") || conversationText.includes("competition") || conversationText.includes("trend") || conversationText.includes("analysis")) {
      return "market";
    }
    return "general";
  })();

  // Auto-generate title from first user message
  const suggestedTitle = (() => {
    const firstUserMessage = messages.find(m => m.role === "user")?.content || "";
    const title = firstUserMessage.substring(0, 60);
    return title + (firstUserMessage.length > 60 ? "..." : "");
  })();

  // AI auto-generate metadata
  const handleAIGenerate = async () => {
    setAiGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8006";

      // Build conversation context for AI
      const conversationText = messages.map(m =>
        `${m.role === "user" ? "Q" : "A"}: ${m.content}`
      ).join("\n\n");

      const response = await fetch(`${apiUrl}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze this conversation and generate:
1. A concise title (max 60 chars)
2. Context & Background (2-3 sentences about why this matters)
3. Open Questions (what remains unanswered)
4. Next Steps (what should be researched next)

Format as JSON: {"title": "...", "context": "...", "questions": "...", "nextSteps": "..."}

Conversation:
${conversationText}`,
          history: [],
          use_rag: false,
          stream: false
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");

      const data = await response.json();

      // Strip markdown code blocks if present
      let jsonString = data.response.trim();
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString.replace(/^```json\n/, "").replace(/\n```$/, "");
      } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```\n/, "").replace(/\n```$/, "");
      }

      const parsed = JSON.parse(jsonString);

      setDocumentName(parsed.title || suggestedTitle);
      setBriefContext(parsed.context || "");
      setKeyQuestions(parsed.questions || "");
      setNextSteps(parsed.nextSteps || "");
    } catch (error) {
      console.error("AI generation error:", error);
      alert("AI generation failed. Using defaults.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Set suggested category and title on mount + auto-generate if brief format
  useEffect(() => {
    setSelectedCategory(suggestedCategory);
    if (!documentName) {
      setDocumentName(suggestedTitle);
    }

    // Auto-generate AI metadata for intelligence briefs
    if (saveFormat === "brief" && messages.length > 0) {
      handleAIGenerate();
    }
  }, [suggestedCategory, suggestedTitle]);

  const handleSave = async () => {
    if (!documentName.trim()) {
      alert("Please enter a document name");
      return;
    }

    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8006";

      let finalContent = "";

      if (saveFormat === "transcript") {
        // Full Q&A Transcript
        finalContent = `# ${documentName}\n\n`;
        finalContent += `**Category:** ${KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}\n`;
        finalContent += `**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
        finalContent += `**Format:** Conversation Transcript\n\n`;
        finalContent += `---\n\n`;

        // Add each message as Q&A
        messages.forEach((msg) => {
          if (msg.role === "user") {
            finalContent += `## 🧑 Question\n\n${msg.content}\n\n`;
          } else {
            finalContent += `## 🤖 Answer\n\n${msg.content}\n\n`;
          }
        });

        finalContent += `---\n\n`;
        finalContent += `*This conversation transcript was saved from the Europe&apos;s Gate Intelligence Platform.*\n`;
      } else {
        // Intelligence Brief format
        finalContent = `# ${documentName}\n\n`;
        finalContent += `**Category:** ${KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}\n`;
        finalContent += `**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
        finalContent += `**Format:** Intelligence Brief\n\n`;
        finalContent += `---\n\n`;

        if (briefContext.trim()) {
          finalContent += `## Context & Background\n\n${briefContext.trim()}\n\n`;
        }

        finalContent += `## Conversation Summary\n\n`;

        // Add conversation as structured Q&A
        messages.forEach((msg, idx) => {
          if (msg.role === "user") {
            finalContent += `**Q${Math.floor(idx / 2) + 1}:** ${msg.content}\n\n`;
          } else {
            finalContent += `**A:** ${msg.content}\n\n`;
          }
        });

        if (keyQuestions.trim()) {
          finalContent += `## Open Questions & Considerations\n\n${keyQuestions.trim()}\n\n`;
        }

        if (nextSteps.trim()) {
          finalContent += `## Next Steps for Research\n\n${nextSteps.trim()}\n\n`;
        }

        finalContent += `---\n\n`;
        finalContent += `*This intelligence brief was created from AI chat conversation to support iterative project scoping and decision-making for Europe&apos;s Gate.*\n`;
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

      alert("Successfully saved conversation to Knowledge Base!");
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save conversation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Save Conversation to Knowledge Base</h2>
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
                onClick={() => setSaveFormat("transcript")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  saveFormat === "transcript"
                    ? "border-[#4318FF] bg-gradient-to-r from-[#868CFF]/10 to-[#4318FF]/10 shadow-md"
                    : "border-gray-200 hover:border-[#4318FF]/50 hover:bg-gray-50"
                }`}
              >
                <div className="text-base font-semibold text-gray-900 mb-1">
                  💬 Full Transcript
                </div>
                <div className="text-xs text-gray-500">
                  Complete Q&A conversation
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
                  Rich context + insights
                </div>
              </button>
            </div>
          </div>

          {/* AI Generation Status */}
          {aiGenerating && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
              <div className="animate-spin h-4 w-4 border-2 border-[#4318FF] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-700">AI is generating metadata for you...</span>
            </div>
          )}

          {/* Document Name */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="docName" className="text-sm font-semibold text-gray-900">
                Document Name
              </label>
              {saveFormat === "brief" && (
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerating}
                  className="text-xs text-[#4318FF] hover:text-[#868CFF] font-medium transition-colors disabled:opacity-50"
                >
                  {aiGenerating ? "Generating..." : "🔄 Regenerate with AI"}
                </button>
              )}
            </div>
            <input
              id="docName"
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., Steel Island Economics Discussion"
              disabled={aiGenerating}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all disabled:opacity-60"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Category {suggestedCategory !== "general" && (
                <span className="text-xs font-normal text-[#4318FF]">
                  (AI Suggested: {KNOWLEDGE_CATEGORIES.find(c => c.id === suggestedCategory)?.label})
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
                  <strong className="text-[#4318FF]">Intelligence Briefs</strong> create rich, narrative-driven documentation that the AI can reason about.
                  AI has auto-generated context, questions, and next steps from your conversation. Edit or regenerate as needed.
                </p>
              </div>

              <div>
                <label htmlFor="briefContext" className="block text-sm font-semibold text-gray-900 mb-2">
                  Context & Background <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="briefContext"
                  value={briefContext}
                  onChange={(e) => setBriefContext(e.target.value)}
                  placeholder="Why did you explore this topic? What's the broader context? What problem are you trying to solve?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="keyQuestions" className="block text-sm font-semibold text-gray-900 mb-2">
                  Open Questions <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="keyQuestions"
                  value={keyQuestions}
                  onChange={(e) => setKeyQuestions(e.target.value)}
                  placeholder="What questions remain unanswered? What uncertainties exist? What assumptions need validation?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="nextSteps" className="block text-sm font-semibold text-gray-900 mb-2">
                  Next Steps <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="nextSteps"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="What research or actions should follow? Who should we talk to? What data do we need?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#4318FF] transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Conversation Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Conversation Preview ({messages.length} messages)
            </label>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 max-h-48 overflow-y-auto space-y-2">
              {messages.slice(0, 4).map((msg, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-gray-600">
                    {msg.role === "user" ? "Q:" : "A:"}
                  </span>
                  <span className="text-gray-700 ml-2">
                    {msg.content.substring(0, 100)}{msg.content.length > 100 ? "..." : ""}
                  </span>
                </div>
              ))}
              {messages.length > 4 && (
                <p className="text-xs text-gray-500 italic">... and {messages.length - 4} more messages</p>
              )}
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
            Cancel
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
              ? "Saving..."
              : saveFormat === "brief"
                ? "Save Intelligence Brief"
                : "Save Transcript"
            }
          </button>
        </div>
      </div>
    </div>
  );
};
