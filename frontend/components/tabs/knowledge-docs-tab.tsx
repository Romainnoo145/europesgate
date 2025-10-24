"use client";

import { FC } from "react";
import { FileText, Search } from "lucide-react";

const documents = [
  {
    id: "00",
    name: "README.md",
    description: "Overview and quick facts about the Europe's Gate project",
    category: "Overview",
  },
  {
    id: "01",
    name: "Financial_Costs_Budget.md",
    description: "Financial structures, investment models, cost strategies",
    category: "Finance",
  },
  {
    id: "02",
    name: "EU_Subsidies_Funding.md",
    description: "European Union funding opportunities and application strategies",
    category: "Funding",
  },
  {
    id: "03",
    name: "Construction_Engineering_Technical.md",
    description: "Technical specifications, construction methods, engineering approaches",
    category: "Technical",
  },
  {
    id: "04",
    name: "Energy_Sustainability_Green.md",
    description: "Green technologies, sustainability frameworks, environmental excellence",
    category: "Sustainability",
  },
  {
    id: "05",
    name: "Economic_Impact_Industry.md",
    description: "Economic benefits, industry transformation, regional development",
    category: "Economics",
  },
  {
    id: "06",
    name: "Urban_Development_Tourism.md",
    description: "Urban planning, design, tourism infrastructure, and living lab concept",
    category: "Urban",
  },
  {
    id: "07",
    name: "Governance_Management_ADDED_Romano.md",
    description: "Organizational structure, decision-making, SPV management",
    category: "Governance",
  },
  {
    id: "08",
    name: "Risk_Mitigation_ADDED_Romano.md",
    description: "Comprehensive risk analysis and mitigation strategies",
    category: "Risk",
  },
  {
    id: "09",
    name: "Partnerships_Stakeholders_ADDED_Romano.md",
    description: "Partnership ecosystem and stakeholder engagement",
    category: "Partnerships",
  },
];

export const KnowledgeDocsTab: FC = () => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Documents list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <FileText
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {doc.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
