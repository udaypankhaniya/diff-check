import React from "react";

interface DiffSummaryBarProps {
    added: number;
    removed: number;
    modified: number;
}

const DiffSummaryBar: React.FC<DiffSummaryBarProps> = ({ added, removed, modified }) => (
    <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 flex justify-between mb-6">
        <span>🟢 Added: {added}</span>
        <span>🔴 Removed: {removed}</span>
        <span>🟡 Modified: {modified}</span>
    </div>
);

export default DiffSummaryBar; 