import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderIcon,
  DocumentIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getFileIcon } from "@/lib/utils";
import { DiffResult } from "@/services/zipDiff";
import DiffViewer from "./DiffViewer";

interface ComparisonResultsProps {
  result: DiffResult;
  onExport?: () => void;
}

interface FileTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  status: "added" | "removed" | "modified" | "unchanged";
  children: FileTreeNode[];
}

const buildFileTree = (
  files: {
    path: string;
    status: "added" | "removed" | "modified" | "unchanged";
  }[]
): FileTreeNode[] => {
  const root: FileTreeNode[] = [];

  files.forEach((file) => {
    const parts = file.path.split("/");
    let currentChildren = root;

    parts.forEach((part, index) => {
      if (index < parts.length - 1) {
        // Find or create directory node
        let dirNode = currentChildren.find(
          (node) => node.name === part && node.isDir
        );
        if (!dirNode) {
          dirNode = {
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            isDir: true,
            status: "unchanged", // Directories are considered unchanged
            children: [],
          };
          currentChildren.push(dirNode);
        }
        currentChildren = dirNode.children;
      } else {
        // Add file node
        const fileNode = {
          name: part,
          path: file.path,
          isDir: false,
          status: file.status,
          children: [],
        };
        currentChildren.push(fileNode);
      }
    });
  });

  // Sort children: directories first, then files, both alphabetically
  const sortChildren = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.isDir) sortChildren(node.children);
    });
  };
  sortChildren(root);

  return root;
};

const FileTreeItem: React.FC<{
  node: FileTreeNode;
  level: number;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}> = ({ node, level, onFileSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const statusColors = {
    added: "text-green-600 dark:text-green-400",
    removed: "text-red-600 dark:text-red-400",
    modified: "text-yellow-600 dark:text-yellow-400",
    unchanged: "text-slate-600 dark:text-slate-400",
  };

  const statusBadges = {
    added: (
      <Badge variant="success" className="ml-2 text-xs">
        +
      </Badge>
    ),
    removed: (
      <Badge variant="destructive" className="ml-2 text-xs">
        -
      </Badge>
    ),
    modified: (
      <Badge variant="warning" className="ml-2 text-xs">
        ~
      </Badge>
    ),
    unchanged: null,
  };

  return (
    <div>
      <motion.div
        className={cn(
          "flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          selectedFile === node.path && "bg-blue-100 dark:bg-blue-900/50",
          statusColors[node.status]
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.isDir) {
            setIsExpanded(!isExpanded);
          } else {
            onFileSelect(node.path);
          }
        }}
        whileHover={{ x: 2 }}
      >
        {node.isDir ? (
          <>
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 mr-1" />
            )}
            <FolderIcon className="w-4 h-4 mr-2" />
          </>
        ) : (
          <>
            <div className="w-4 mr-1" />
            <span className="mr-2">{getFileIcon(node.name)}</span>
          </>
        )}
        <span className="text-sm font-medium truncate">{node.name}</span>
        {statusBadges[node.status]}
      </motion.div>

      <AnimatePresence>
        {node.isDir && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <FileTreeItem
                key={`${child.path}-${child.isDir}`}
                node={child}
                level={level + 1}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  result,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  type TabKey = "all" | "added" | "removed" | "modified";
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const allFiles = [
    ...result.added.map((path) => ({ path, status: "added" as const })),
    ...result.removed.map((path) => ({ path, status: "removed" as const })),
    ...result.modified.map((path) => ({ path, status: "modified" as const })),
    ...result.unchanged.map((path) => ({ path, status: "unchanged" as const })),
  ];

  const filteredFiles =
    activeTab === "all"
      ? allFiles
      : allFiles.filter((file) => file.status === activeTab);

  const fileTree = buildFileTree(filteredFiles);

  const exportResults = () => {
    const data = {
      summary: result.stats,
      added: result.added,
      removed: result.removed,
      modified: result.modified,
      unchanged: result.unchanged,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zip-diff-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {result.stats.addedCount}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Added
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {result.stats.removedCount}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Removed
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {result.stats.modifiedCount}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Modified
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {result.stats.unchangedCount}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                Unchanged
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Tree */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">File Changes</CardTitle>
              <Button
                onClick={exportResults}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {[
                { key: "all", label: "All", count: result.stats.totalFiles },
                {
                  key: "added",
                  label: "Added",
                  count: result.stats.addedCount,
                },
                {
                  key: "removed",
                  label: "Removed",
                  count: result.stats.removedCount,
                },
                {
                  key: "modified",
                  label: "Modified",
                  count: result.stats.modifiedCount,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    activeTab === tab.key
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {fileTree.map((node) => (
                <FileTreeItem
                  key={`${node.path}-${node.isDir}`}
                  node={node}
                  level={0}
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diff Viewer */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <EyeIcon className="w-5 h-5" />
              Diff Viewer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-auto">
              {selectedFile && result.diffs[selectedFile] ? (
                <DiffViewer diff={result.diffs[selectedFile]} />
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <DocumentIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a modified file to view its diff</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonResults;
