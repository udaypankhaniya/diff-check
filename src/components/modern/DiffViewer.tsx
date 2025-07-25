import React from "react";
import { motion } from "framer-motion";

interface DiffViewerProps {
  diff: string;
}

interface DiffLine {
  oldLine: number | null;
  newLine: number | null;
  content: string;
  type: "added" | "removed" | "unchanged" | "context";
}

const parseDiff = (diff: string): DiffLine[] => {
  const lines = diff.split("\n");
  const result: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;

  for (const line of lines) {
    if (line.startsWith("@@")) {
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        oldLineNum = parseInt(match[1], 10);
        newLineNum = parseInt(match[2], 10);
      }
      result.push({ oldLine: null, newLine: null, content: line, type: "context" });
    } else if (line.startsWith("+")) {
      result.push({ 
        oldLine: null, 
        newLine: newLineNum, 
        content: line.slice(1), 
        type: "added" 
      });
      newLineNum++;
    } else if (line.startsWith("-")) {
      result.push({ 
        oldLine: oldLineNum, 
        newLine: null, 
        content: line.slice(1), 
        type: "removed" 
      });
      oldLineNum++;
    } else if (line.startsWith(" ") || (!line.startsWith("+++") && !line.startsWith("---") && !line.startsWith("index"))) {
      const content = line.startsWith(" ") ? line.slice(1) : line;
      result.push({ 
        oldLine: oldLineNum, 
        newLine: newLineNum, 
        content, 
        type: "unchanged" 
      });
      oldLineNum++;
      newLineNum++;
    }
  }
  return result;
};

const getLineClass = (type: DiffLine["type"]) => {
  switch (type) {
    case "added":
      return "bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500";
    case "removed":
      return "bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500";
    case "context":
      return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold";
    default:
      return "hover:bg-slate-50 dark:hover:bg-slate-800/50";
  }
};

const getTextClass = (type: DiffLine["type"]) => {
  switch (type) {
    case "added":
      return "text-green-800 dark:text-green-200";
    case "removed":
      return "text-red-800 dark:text-red-200";
    case "context":
      return "text-blue-700 dark:text-blue-300";
    default:
      return "text-slate-700 dark:text-slate-300";
  }
};

const DiffViewer: React.FC<DiffViewerProps> = ({ diff }) => {
  if (!diff) {
    return (
      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
        No diff available
      </div>
    );
  }

  const parsedDiff = parseDiff(diff);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-900 font-mono text-xs overflow-x-auto"
    >
      <div className="min-w-full">
        {parsedDiff.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.01, duration: 0.2 }}
            className={`flex ${getLineClass(line.type)} transition-colors`}
          >
            {/* Line Numbers */}
            <div className="flex-shrink-0 w-20 px-2 py-1 text-right text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
              <span className="inline-block w-8">
                {line.oldLine !== null ? line.oldLine : ""}
              </span>
              <span className="inline-block w-8 ml-1">
                {line.newLine !== null ? line.newLine : ""}
              </span>
            </div>
            
            {/* Content */}
            <div className={`flex-1 px-3 py-1 whitespace-pre-wrap ${getTextClass(line.type)}`}>
              {line.type === "added" && <span className="text-green-600 dark:text-green-400 mr-1">+</span>}
              {line.type === "removed" && <span className="text-red-600 dark:text-red-400 mr-1">-</span>}
              {line.content || " "}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DiffViewer;