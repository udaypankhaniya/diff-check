import React from "react";

interface DiffDetailsPanelProps {
    diff: string;
}

const DiffDetailsPanel: React.FC<DiffDetailsPanelProps> = ({ diff }) => (
    <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 min-h-[120px]">
        {/* TODO: Render diff details (unified diff format) */}
        <pre className="whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-200">{diff || "Diff Details Panel"}</pre>
    </div>
);

export default DiffDetailsPanel; 