import React from "react";

interface FileDiffViewerProps {
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
    let oldLineNum: number | null = null;
    let newLineNum: number | null = null;

    for (const line of lines) {
        if (line.startsWith("@@")) {
            const match = line.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);
            if (match) {
                oldLineNum = parseInt(match[1], 10);
                newLineNum = parseInt(match[2], 10);
            }
            result.push({ oldLine: null, newLine: null, content: line, type: "context" });
        } else if (line.startsWith("+")) {
            result.push({ oldLine: null, newLine: newLineNum, content: line.slice(1), type: "added" });
            newLineNum = newLineNum !== null ? newLineNum + 1 : null;
        } else if (line.startsWith("-")) {
            result.push({ oldLine: oldLineNum, newLine: null, content: line.slice(1), type: "removed" });
            oldLineNum = oldLineNum !== null ? oldLineNum + 1 : null;
        } else {
            result.push({ oldLine: oldLineNum, newLine: newLineNum, content: line, type: "unchanged" });
            oldLineNum = oldLineNum !== null ? oldLineNum + 1 : null;
            newLineNum = newLineNum !== null ? newLineNum + 1 : null;
        }
    }
    return result;
};

const getLineClass = (type: DiffLine["type"]) => {
    switch (type) {
        case "added":
            return "bg-[rgba(var(--success),0.1)] text-[var(--success)]";
        case "removed":
            return "bg-[rgba(var(--destructive),0.1)] text-[var(--destructive)]";
        case "context":
            return "bg-[rgba(var(--primary),0.1)] text-[var(--primary)] font-mono";
        default:
            return "text-[var(--foreground)]";
    }
};
const FileDiffViewer: React.FC<FileDiffViewerProps> = ({ diff }) => {
    if (!diff) return <div className="italic text-gray-400 text-center p-4">No diff available.</div>;

    const parsedDiff = parseDiff(diff);

    return (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 overflow-x-auto text-xs font-mono shadow-sm">
            <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-2">
                {/* Old file line numbers */}
                <div className="text-right text-gray-500 dark:text-gray-400 pr-2 border-r border-gray-200 dark:border-gray-600">
                    {parsedDiff.map((line, idx) => (
                        <div key={`old-${idx}`} className={`py-0.5 ${getLineClass(line.type)}`}>
                            {line.oldLine !== null ? line.oldLine : ""}
                        </div>
                    ))}
                </div>
                {/* Old file content */}
                <div className="pr-4">
                    {parsedDiff.map((line, idx) => (
                        <div
                            key={`old-content-${idx}`}
                            className={`py-0.5 whitespace-pre-wrap ${line.type === "added" ? "bg-gray-100 dark:bg-gray-700 opacity-50" : getLineClass(line.type)}`}
                        >
                            {line.type !== "added" ? line.content : ""}
                        </div>
                    ))}
                </div>
                {/* New file line numbers */}
                <div className="text-right text-gray-500 dark:text-gray-400 pr-2 border-r border-gray-200 dark:border-gray-600">
                    {parsedDiff.map((line, idx) => (
                        <div key={`new-${idx}`} className={`py-0.5 ${getLineClass(line.type)}`}>
                            {line.newLine !== null ? line.newLine : ""}
                        </div>
                    ))}
                </div>
                {/* New file content */}
                <div>
                    {parsedDiff.map((line, idx) => (
                        <div
                            key={`new-content-${idx}`}
                            className={`py-0.5 whitespace-pre-wrap ${line.type === "removed" ? "bg-gray-100 dark:bg-gray-700 opacity-50" : getLineClass(line.type)}`}
                        >
                            {line.type !== "removed" ? line.content : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileDiffViewer;