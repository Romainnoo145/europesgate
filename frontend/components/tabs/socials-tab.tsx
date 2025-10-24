"use client";

import { FC } from "react";
import { FileText, Linkedin, Mail, ArrowRight, Clock } from "lucide-react";

const socialChannels = [
  {
    id: "blog",
    title: "Blog Post",
    description: "Export insights and knowledge as beautifully formatted blog articles",
    icon: FileText,
    gradient: "from-blue-400 to-teal-500",
    status: "Coming Soon",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Share Europe's Gate insights directly to LinkedIn as rich posts",
    icon: Linkedin,
    gradient: "from-purple-400 to-pink-500",
    status: "Coming Soon",
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Compile knowledge updates into a professional newsletter format",
    icon: Mail,
    gradient: "from-orange-400 to-amber-500",
    status: "Coming Soon",
  },
];

export const SocialsTab: FC = () => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Social Exports</h2>
        <p className="text-sm text-gray-600">
          Share Europe&apos;s Gate insights across different channels (Coming soon)
        </p>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <div
                key={channel.id}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white border border-gray-100"
              >
                {/* Gradient header */}
                <div
                  className={`bg-gradient-to-r ${channel.gradient} p-6 h-32 flex flex-col justify-end`}
                >
                  <Icon size={32} className="text-white mb-2" />
                  <h3 className="text-white font-bold text-lg">
                    {channel.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">
                    {channel.description}
                  </p>

                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      {channel.status}
                    </span>
                  </div>

                  {/* Disabled button */}
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed opacity-70 hover:opacity-70 transition-opacity"
                  >
                    Coming Soon <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h3>
          <p className="text-sm text-blue-800">
            These export features are coming soon. You&apos;ll be able to take any
            insight from the AI and export it as a blog post, LinkedIn post, or
            add it to a newsletter template. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};
