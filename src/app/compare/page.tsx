"use client";
import React, { useEffect, useState } from "react";
import DiffSummaryBar from "@/components/DiffSummaryBar";
import FileTreeView, { FileStatus } from "@/components/FileTreeView";
import DiffDetailsPanel from "@/components/DiffDetailsPanel";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/Tooltip";

interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
  diffs: Record<string, string>;
}

const ComparePage = () => {
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("zipDiffResult");
    if (data) {
      setDiff(JSON.parse(data));
    }
  }, []);

  if (!diff) {
    return (
      <div className="text-center text-gray-400 mt-20">
        No diff data found. Please upload ZIPs on the home page.
      </div>
    );
  }

  // For now, just show lists. Later, use a real tree structure.
  const allFiles = [
    ...diff.added.map((f) => ({ path: f, status: "added" as FileStatus })),
    ...diff.removed.map((f) => ({ path: f, status: "removed" as FileStatus })),
    ...diff.modified.map((f) => ({
      path: f,
      status: "modified" as FileStatus,
    })),
    ...diff.unchanged.map((f) => ({
      path: f,
      status: "unchanged" as FileStatus,
    })),
  ];
  console.log(allFiles);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-6xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-12 relative">
        <button
          className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={() => {
            localStorage.removeItem("zipDiffResult");
            router.push("/");
          }}
        >
          Clear
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100 tracking-tight">
          Compare ZIP Files
        </h1>
        <div className="mb-8">
          <DiffSummaryBar
            added={diff.added.length}
            removed={diff.removed.length}
            modified={diff.modified.length}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          <section className="flex-1">
            <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200 text-lg flex items-center gap-2">
              Files
              <Tooltip content="Click a file to view its diff. Folders can be expanded/collapsed.">
                <span className="text-gray-400 cursor-help">?</span>
              </Tooltip>
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 border rounded p-4 min-h-[200px] max-h-[400px] overflow-auto shadow-inner">
              <FileTreeView
                files={allFiles}
                onSelect={setSelectedFile}
                selected={selectedFile}
              />
            </div>
          </section>
          <div className="w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block" />
          <section className="flex-1">
            <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200 text-lg flex items-center gap-2">
              Diff Details
              <Tooltip content="Shows the unified diff for the selected file.">
                <span className="text-gray-400 cursor-help">?</span>
              </Tooltip>
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 min-h-[120px] max-h-[400px] overflow-auto shadow-inner">
              <DiffDetailsPanel
                diff={
                  selectedFile && diff.diffs[selectedFile]
                    ? diff.diffs[selectedFile]
                    : "Select a file to view diff."
                }
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ComparePage;
