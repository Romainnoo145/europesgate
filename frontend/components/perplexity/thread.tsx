"use client";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PaperclipIcon,
  RefreshCwIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";

interface ThreadProps {
  chatId?: string;
  onSaveChat?: (title: string, messages: unknown[]) => void;
  onNewChat?: () => void;
}

export const Thread: FC<ThreadProps> = () => {
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

          <div className="min-h-8 flex-grow" />

          <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end pb-4">
            <ThreadScrollToBottom />
            <div className="w-full rounded-2xl bg-white border border-gray-200 shadow-sm p-3 focus-within:shadow-lg focus-within:border-gray-300 transition-all duration-200">
              <Composer />
            </div>
          </div>
        </ThreadPrimitive.Viewport>
      </ThreadPrimitive.If>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  const prompts = [
    "What's the steel island synergy with hydrogen?",
    "Tell me about the investment phases",
    "How does EU funding work for this project?",
    "What are the main risks and mitigations?",
  ];

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-white to-gray-50">
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col gap-12">
          <div className="flex w-full flex-col items-center justify-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent text-center">
              Hi Matt,
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 text-center font-light">
              Let&apos;s iterate some more on Europe&apos;s gate
            </p>
            <p className="text-sm text-gray-500 text-center mt-4 max-w-md">
              Ask questions about the megaproject, explore financials, technical specs, or strategic implications. The AI knows all 11 documents in the knowledge base.
            </p>
          </div>

          {/* Quick start prompts */}
          <div className="flex w-full flex-col gap-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Quick start prompts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  className="p-3 text-left text-sm rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <ComposerPrimitive.Root className="w-full rounded-2xl border border-gray-200 bg-white px-3 shadow-sm transition-all duration-200 focus-within:shadow-lg focus-within:border-gray-300">
            <ComposerAttachments />
            <ComposerPrimitive.Input
              rows={1}
              autoFocus
              placeholder="Ask about Europe's Gate..."
              className="max-h-40 w-full flex-grow resize-none border-none bg-transparent px-4 py-4 text-base outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed text-gray-900"
            />
            <div className="mx-1.5 flex gap-2">
              <div className="flex-grow" />
              <ComposerPrimitive.AddAttachment asChild>
                <TooltipIconButton
                  className="my-2.5 size-8 p-2 text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-100"
                  tooltip="Add Attachment"
                  variant="ghost"
                >
                  <PaperclipIcon className="size-4" />
                </TooltipIconButton>
              </ComposerPrimitive.AddAttachment>
              <ComposerPrimitive.Send asChild>
                <TooltipIconButton
                  className="my-2.5 size-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 hover:scale-105 text-white p-2 transition-all"
                  tooltip="Send"
                  variant="ghost"
                >
                  <ArrowRightIcon className="size-4" />
                </TooltipIconButton>
              </ComposerPrimitive.Send>
            </div>
          </ComposerPrimitive.Root>
        </div>
      </div>
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="flex w-full flex-wrap items-end rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 focus-within:border-gray-300 focus-within:shadow-md">
      <ComposerAttachments />
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Ask follow-up"
        className="max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-3 text-base outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed text-gray-900"
      />
      <div className="flex gap-2">
        <ComposerPrimitive.AddAttachment asChild>
          <TooltipIconButton
            className="my-1.5 size-8 p-2 text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            tooltip="Add Attachment"
            variant="ghost"
          >
            <PaperclipIcon className="size-4" />
          </TooltipIconButton>
        </ComposerPrimitive.AddAttachment>
        <ComposerAction />
      </div>
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="ghost"
            className="my-1.5 size-8 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 hover:scale-105 text-white p-2 transition-all"
          >
            <ArrowUpIcon className="size-4" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Stop"
            variant="ghost"
            className="my-1.5 size-8 rounded-lg bg-red-500 hover:bg-red-600 hover:scale-105 text-white p-2 transition-all"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative w-full max-w-[var(--thread-max-width)] gap-y-2 py-3 flex justify-end">
      <div className="rounded-2xl px-4 py-2.5 bg-blue-50 border border-blue-100 max-w-[80%] break-words text-gray-900 text-base">
        <UserMessageAttachments />
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-[var(--thread-max-width)] grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-3">
      <div className="col-span-2 col-start-2 row-start-1 my-1.5 max-w-[calc(var(--thread-max-width)*0.9)] leading-7 break-words text-gray-900">
        <MessagePrimitive.Parts components={{ Text: MarkdownText }} />
      </div>

      <AssistantActionBar />

      <BranchPicker className="col-start-2 row-start-2 mr-2 -ml-2" />
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="col-start-3 row-start-2 -ml-1 flex gap-1 text-gray-400"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton
          tooltip="Copy"
          className="hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <MessagePrimitive.If copied>
            <CheckIcon className="text-green-600" />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton
          tooltip="Refresh"
          className="hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCwIcon />
        </TooltipIconButton>
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
      className={cn(
        "inline-flex items-center text-xs text-gray-500",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton
          tooltip="Previous"
          className="hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium mx-1">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton
          tooltip="Next"
          className="hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRightIcon />
        </TooltipIconButton>
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