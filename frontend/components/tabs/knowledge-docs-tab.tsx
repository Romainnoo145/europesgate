"use client";

import { FC, useState, useEffect } from "react";
import { FileText, Search, Upload, Trash2, AlertCircle, Loader2, ChevronLeft, ChevronRight, File, Eye, X, Grid3x3, LayoutGrid, MoreHorizontal, Clock, Folder, FolderOpen, ChevronDown, ChevronUp, FolderInput } from "lucide-react";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { EmptyState } from "@/components/ui/empty-state";

interface Document {
  filename: string;
  size: number;
  modified: number;
  type: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

const KNOWLEDGE_CATEGORIES = [
  { id: "all", label: "All Files", icon: "📁", color: "from-gray-400 to-gray-600" },
  { id: "economics", label: "Economics", icon: "📊", color: "from-blue-400 to-blue-600" },
  { id: "builds", label: "Builds", icon: "🏗️", color: "from-orange-400 to-orange-600" },
  { id: "subsidies", label: "Subsidies", icon: "💰", color: "from-green-400 to-green-600" },
  { id: "regulations", label: "Regulations", icon: "📋", color: "from-red-400 to-red-600" },
  { id: "market", label: "Market Research", icon: "🌍", color: "from-purple-400 to-purple-600" },
  { id: "general", label: "General", icon: "📝", color: "from-gray-400 to-gray-600" },
];

const ITEMS_PER_PAGE = 10;

export const KnowledgeDocsTab: FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [viewingLoading, setViewingLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"a_to_z" | "z_to_a">("a_to_z");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "folders">("folders");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [openMenuDoc, setOpenMenuDoc] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["economics", "builds", "subsidies", "regulations", "market", "general"]));

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/documents/list`);
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadProgress({ current: 0, total: files.length });

    let successCount = 0;
    const failedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length });
      const formData = new FormData();
      formData.append("file", file);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/documents/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Upload failed");
        }

        successCount++;
      } catch (error) {
        console.error("Upload error:", error);
        failedFiles.push(file.name);
      }
    }

    setUploading(false);
    setUploadProgress(null);

    // Show appropriate toast messages
    if (successCount > 0 && failedFiles.length === 0) {
      toast.success(`Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}`, {
        position: "bottom-right",
      });
    } else if (successCount > 0 && failedFiles.length > 0) {
      toast.warning(`Uploaded ${successCount} file${successCount > 1 ? 's' : ''}, ${failedFiles.length} failed`, {
        position: "bottom-right",
      });
    } else if (failedFiles.length > 0) {
      toast.error(`Failed to upload: ${failedFiles.join(', ')}`, {
        position: "bottom-right",
      });
    }

    fetchDocuments(); // Refresh the list
    // Reset file input
    event.target.value = '';
  };

  const handleViewFile = async (filename: string) => {
    setViewingFile(filename);
    setViewingLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/documents/download/${filename}`);

      if (!response.ok) {
        throw new Error("Failed to load file content");
      }

      const content = await response.text();
      setFileContent(content);
    } catch (error) {
      console.error("Error loading file:", error);
      toast.error("Failed to load file content", {
        position: "bottom-right",
      });
      setViewingFile(null);
    } finally {
      setViewingLoading(false);
    }
  };

  const closeViewFile = () => {
    setViewingFile(null);
    setFileContent("");
  };

  const handleDelete = (filename: string) => {
    setDeletingFile(filename);
  };

  const confirmDelete = async (filename: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/api/documents/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast.success(`${filename} deleted successfully`, {
        position: "bottom-right",
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete ${filename}`, {
        position: "bottom-right",
      });
    } finally {
      setDeletingFile(null);
    }
  };

  const cancelDelete = () => {
    setDeletingFile(null);
  };

  const handleMoveToCategory = async (filename: string, newCategory: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/documents/update-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, category: newCategory }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      toast.success(`Moved ${filename} to ${KNOWLEDGE_CATEGORIES.find(c => c.id === newCategory)?.label}`, {
        position: "bottom-right",
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Category update error:", error);
      toast.error(`Failed to move ${filename}`, {
        position: "bottom-right",
      });
    }
  };

  const toggleDocSelection = (filename: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedDocs(newSelected);
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Helper to toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter documents based on search query and category
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || (doc.category || "general") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group documents by category for folder view
  const documentsByCategory = documents
    .filter((doc) => {
      const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || (doc.category || "general") === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .reduce((acc, doc) => {
      const category = doc.category || "general";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);

  // Apply sorting - alphabetical order
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const nameA = a.filename.toLowerCase();
    const nameB = b.filename.toLowerCase();

    if (sortOrder === "a_to_z") {
      // A-Z alphabetical
      return nameA.localeCompare(nameB);
    } else {
      // Z-A alphabetical
      return nameB.localeCompare(nameA);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with title and upload button */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            All Documents ({sortedDocuments.length})
          </h2>
          <label
            htmlFor="header-upload-file"
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
            }}
          >
            Upload Document
            <input
              id="header-upload-file"
              type="file"
              multiple
              accept=".txt,.md,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-100">
          {KNOWLEDGE_CATEGORIES.map((category) => {
            const count = category.id === "all"
              ? documents.length
              : documents.filter((doc) => (doc.category || "general") === category.id).length;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[#868CFF] to-[#4318FF] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#4318FF]/50 hover:bg-gray-50"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search + Filters + View Mode */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="search"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-all"
            />
          </div>

          {/* Sort Order Select */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "a_to_z" | "z_to_a")}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-full bg-white text-sm text-gray-700 focus:outline-none focus:border-gray-300 transition-all cursor-pointer"
            >
              <option value="a_to_z">A-Z</option>
              <option value="z_to_a">Z-A</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
              </svg>
            </div>
          </div>

          {/* View Mode Toggles */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("folders")}
              className={`p-2.5 rounded-full transition-all ${
                viewMode === "folders"
                  ? "bg-gray-100 text-[#4318FF]"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              title="Folder view"
            >
              <Folder className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-full transition-all ${
                viewMode === "grid"
                  ? "bg-gray-100 text-[#4318FF]"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-full transition-all ${
                viewMode === "list"
                  ? "bg-gray-100 text-[#4318FF]"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              title="List view"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Progress (if uploading) */}
      {uploading && uploadProgress && (
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="p-6 border-2 border-dashed rounded-lg bg-blue-50">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm font-medium mb-1">
                Uploading {uploadProgress.current} of {uploadProgress.total} file{uploadProgress.total > 1 ? 's' : ''}...
              </p>
              <div className="w-full max-w-xs mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${(uploadProgress.current / uploadProgress.total) * 100}%`
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Processing and indexing documents...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Documents list */}
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 mb-4 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload your first document to start building your knowledge base. Supported formats: TXT, MD, PDF, DOC, DOCX"
          />
        ) : (
          <>
            <div className="space-y-3">
              {currentDocuments.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No results found"
                  description={`No documents match "${searchQuery}". Try a different search term.`}
                />
              ) : viewMode === "folders" ? (
                <div className="space-y-4">
                  {KNOWLEDGE_CATEGORIES.filter(cat => cat.id !== "all").map((category) => {
                    const categoryDocs = documentsByCategory[category.id] || [];
                    if (categoryDocs.length === 0) return null;

                    const isExpanded = expandedCategories.has(category.id);
                    const CategoryIcon = isExpanded ? FolderOpen : Folder;

                    return (
                      <div key={category.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                {category.icon} {category.label}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        {/* Category Documents */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            {categoryDocs.map((doc) => (
                              <div
                                key={doc.filename}
                                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 flex-shrink-0">
                                    {getFileIcon(doc.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{doc.filename}</p>
                                    <p className="text-xs text-gray-500">
                                      {formatBytes(doc.size)} • {formatDate(doc.modified)}
                                    </p>
                                  </div>
                                </div>
                                {deletingFile === doc.filename ? (
                                  <div className="flex items-center gap-2 ml-4">
                                    <button
                                      onClick={() => confirmDelete(doc.filename)}
                                      className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={cancelDelete}
                                      className="px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 ml-4">
                                    <button
                                      onClick={() => handleViewFile(doc.filename)}
                                      className="p-2 text-gray-500 hover:text-[#4318FF] hover:bg-white rounded-lg transition-all"
                                      title="View document"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <div className="relative">
                                      <button
                                        onClick={() => setOpenMenuDoc(openMenuDoc === doc.filename ? null : doc.filename)}
                                        className="p-2 text-gray-500 hover:text-[#4318FF] hover:bg-white rounded-lg transition-all"
                                        title="More actions"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </button>
                                      {openMenuDoc === doc.filename && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setOpenMenuDoc(null)}
                                          />
                                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                                            <div className="px-3 py-2 border-b border-gray-100">
                                              <p className="text-xs font-semibold text-gray-500 uppercase">Move to Category</p>
                                            </div>
                                            {KNOWLEDGE_CATEGORIES.filter(cat => cat.id !== "all" && cat.id !== (doc.category || "general")).map(cat => (
                                              <button
                                                key={cat.id}
                                                onClick={() => {
                                                  handleMoveToCategory(doc.filename, cat.id);
                                                  setOpenMenuDoc(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                              >
                                                <span>{cat.icon}</span>
                                                <span>{cat.label}</span>
                                              </button>
                                            ))}
                                            <div className="border-t border-gray-100">
                                              <button
                                                onClick={() => {
                                                  handleDelete(doc.filename);
                                                  setOpenMenuDoc(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentDocuments.map((doc) => {
                    const isSelected = selectedDocs.has(doc.filename);
                    return (
                      <div
                        key={doc.filename}
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "border-[#4318FF] shadow-lg"
                            : "border-gray-200 hover:border-[#4318FF] hover:shadow-md"
                        }`}
                        style={
                          isSelected
                            ? {
                                background: "linear-gradient(135deg, rgba(134, 140, 255, 0.05) 0%, rgba(67, 24, 255, 0.05) 100%)",
                              }
                            : { background: "white" }
                        }
                      >
                        <div className="flex items-start justify-between mb-4">
                          <p className={`text-sm font-semibold truncate flex-1 pr-2 ${isSelected ? "text-[#4318FF]" : "text-gray-900"}`}>
                            {doc.filename}
                          </p>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDocSelection(doc.filename)}
                            className="w-4 h-4 rounded border-gray-300 text-[#4318FF] focus:ring-[#4318FF] cursor-pointer flex-shrink-0"
                          />
                        </div>

                        <div className={`flex items-center gap-2 mb-4 ${isSelected ? "text-[#4318FF]" : "text-gray-500"}`}>
                          <Clock className="w-4 h-4" />
                          <p className="text-xs">{formatDate(doc.modified)}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${isSelected ? "text-[#4318FF]" : "text-gray-500"}`}>{formatBytes(doc.size)}</p>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuDoc(openMenuDoc === doc.filename ? null : doc.filename)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSelected
                                ? "text-[#4318FF] hover:text-[#4318FF] hover:bg-purple-50"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMenuDoc === doc.filename && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuDoc(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                                <button
                                  onClick={() => {
                                    handleViewFile(doc.filename);
                                    setOpenMenuDoc(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <div className="border-t border-gray-100">
                                  <div className="px-3 py-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Move to Category</p>
                                  </div>
                                  {KNOWLEDGE_CATEGORIES.filter(cat => cat.id !== "all" && cat.id !== (doc.category || "general")).map(cat => (
                                    <button
                                      key={cat.id}
                                      onClick={() => {
                                        handleMoveToCategory(doc.filename, cat.id);
                                        setOpenMenuDoc(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <span>{cat.icon}</span>
                                      <span>{cat.label}</span>
                                    </button>
                                  ))}
                                </div>
                                <div className="border-t border-gray-100">
                                  <button
                                    onClick={() => {
                                      handleDelete(doc.filename);
                                      setOpenMenuDoc(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDocuments.map((doc) => (
                    <div
                      key={doc.filename}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#4318FF] hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] text-white flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate mb-1">{doc.filename}</p>
                          <p className="text-xs text-gray-500">
                            {formatBytes(doc.size)} • {formatDate(doc.modified)}
                          </p>
                        </div>
                      </div>
                      {deletingFile === doc.filename ? (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => confirmDelete(doc.filename)}
                            className="px-4 py-2 text-xs font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 hover:shadow-lg transition-all"
                          >
                            Delete
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="px-4 py-2 text-xs font-semibold border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => handleViewFile(doc.filename)}
                            className="p-2.5 text-gray-500 hover:text-[#4318FF] hover:bg-gray-50 rounded-xl transition-all"
                            title="View document"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuDoc(openMenuDoc === doc.filename ? null : doc.filename)}
                              className="p-2.5 text-gray-500 hover:text-[#4318FF] hover:bg-gray-50 rounded-xl transition-all"
                              title="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {openMenuDoc === doc.filename && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuDoc(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                                  <div className="px-3 py-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Move to Category</p>
                                  </div>
                                  {KNOWLEDGE_CATEGORIES.filter(cat => cat.id !== "all" && cat.id !== (doc.category || "general")).map(cat => (
                                    <button
                                      key={cat.id}
                                      onClick={() => {
                                        handleMoveToCategory(doc.filename, cat.id);
                                        setOpenMenuDoc(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <span>{cat.icon}</span>
                                      <span>{cat.label}</span>
                                    </button>
                                  ))}
                                  <div className="border-t border-gray-100">
                                    <button
                                      onClick={() => {
                                        handleDelete(doc.filename);
                                        setOpenMenuDoc(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#4318FF] hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#4318FF] hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* View File Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                {viewingFile.endsWith('.md') ? (
                  <FileText className="h-5 w-5 text-blue-600" />
                ) : (
                  <File className="h-5 w-5 text-gray-600" />
                )}
                <h2 className="text-lg font-semibold text-gray-900">{viewingFile}</h2>
              </div>
              <button
                onClick={closeViewFile}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {viewingLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : viewingFile.endsWith('.md') ? (
                <div className="max-w-none text-gray-900 [&_*]:text-gray-900 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_p]:text-gray-900 [&_li]:text-gray-900 [&_strong]:text-gray-900 [&_code]:text-gray-900 [&_a]:text-blue-600">
                  <ReactMarkdown>{fileContent}</ReactMarkdown>
                </div>
              ) : (
                <pre className="bg-gray-50 rounded p-4 text-sm overflow-auto text-gray-900 whitespace-pre-wrap break-words font-mono border border-gray-200">
                  {fileContent}
                </pre>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-white flex justify-end gap-2 flex-shrink-0">
              <button
                onClick={closeViewFile}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/documents/download/${viewingFile}`}
                download={viewingFile}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:shadow-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
                }}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
