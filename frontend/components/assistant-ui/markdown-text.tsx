"use client";

import { FC, memo, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type MarkdownTextProps = {
  text: string;
  className?: string;
};

const CodeBlock: FC<{ language: string; value: string }> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = value.split("\n");

  return (
    <div className="group relative mb-4">
      <div className="flex items-center justify-between rounded-t-2xl bg-gray-800 px-4 py-2.5">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-2.5 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-600"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative overflow-x-auto rounded-b-2xl bg-gray-900">
        <pre className="p-4">
          <code className="text-sm text-gray-100 font-mono leading-relaxed">
            {lines.map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 text-right text-gray-500 select-none w-8">
                  {i + 1}
                </span>
                <span className="table-cell text-gray-100">
                  {line || " "}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownText: FC<MarkdownTextProps> = memo(({ text, className }) => {
  const components: Partial<Components> = {
    p: ({ children }) => <p className="mb-4 leading-7 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>,
    li: ({ children }) => <li className="leading-7">{children}</li>,
    h1: ({ children }) => <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight first:mt-0">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-bold tracking-tight first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-4 text-lg font-semibold tracking-tight first:mt-0">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 mt-4 font-semibold first:mt-0">{children}</h4>,
    h5: ({ children }) => <h5 className="mb-2 mt-3 font-medium first:mt-0">{children}</h5>,
    h6: ({ children }) => <h6 className="mb-2 mt-3 text-sm font-medium first:mt-0">{children}</h6>,
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 pr-4 italic text-gray-700 rounded-r-xl">
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const value = String(children).replace(/\n$/, "");

      return match ? (
        <CodeBlock language={match[1]} value={value} />
      ) : (
        <code
          className="rounded-lg bg-blue-50 px-2 py-0.5 text-sm font-mono text-blue-700"
          {...props}
        >
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline decoration-blue-300 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-500"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-6 border-t border-gray-200" />,
    table: ({ children }) => (
      <div className="mb-4 overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
    ),
  };

  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        components={components}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
});

MarkdownText.displayName = "MarkdownText";