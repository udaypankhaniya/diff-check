import React, { useState } from "react";

export type FileStatus = "added" | "removed" | "modified" | "unchanged";

export interface FileNode {
    name: string;
    path: string;
    children?: FileNode[];
    isDir: boolean;
    status?: FileStatus;
}
function buildTree(files: { path: string; status: FileStatus }[]): FileNode[] {
    const root: Record<string, FileNode> = {};
    for (const { path, status } of files) {
        const parts = path.split("/");
        let curr: Record<string, FileNode> = root;
        let currPath = "";
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currPath = currPath ? currPath + "/" + part : part;
            if (!curr[part]) {
                curr[part] = {
                    name: part,
                    path: currPath,
                    isDir: i < parts.length - 1,
                    children: i < parts.length - 1 ? [] : [],
                };
            }
            if (i === parts.length - 1) {
                curr[part].status = status;
            }
            curr = curr[part].children as unknown as Record<string, FileNode>;
        }
    }
    function toArray(obj: Record<string, FileNode>): FileNode[] {
        return Object.values(obj).map(node =>
            node.isDir
                ? { ...node, children: toArray(node.children as unknown as Record<string, FileNode>) }
                : node
        );
    }
    return toArray(root);
}

const statusColor = {
    added: "text-green-600",
    removed: "text-red-600",
    modified: "text-yellow-600",
    unchanged: "text-gray-600",
};

function Folder({ node, onSelect, selected }: { node: FileNode; onSelect: (path: string) => void; selected: string | null }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="ml-2">
            <div className="flex items-center cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
                <span className="mr-1">{open ? "▼" : "▶"}</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">{node.name}</span>
            </div>
            {open && node.children && (
                <div className="ml-4">
                    {node.children.map(child =>
                        child.isDir ? (
                            <Folder key={child.path} node={child} onSelect={onSelect} selected={selected} />
                        ) : (
                            <div
                                key={child.path}
                                className={`pl-5 py-0.5 cursor-pointer rounded ${selected === child.path ? "bg-blue-100 dark:bg-blue-900/30" : ""} ${child.status ? statusColor[child.status] : ""}`}
                                onClick={() => onSelect(child.path)}
                            >
                                {child.name}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

const FileTreeView: React.FC<{
    files: { path: string; status: FileStatus }[];
    onSelect: (path: string) => void;
    selected: string | null;
}> = ({ files, onSelect, selected }) => {
    const tree = buildTree(files);
    
    return (
        <div className="text-xs font-mono">
            {tree.map(node =>
                node.isDir ? (
                    <Folder key={node.path} node={node} onSelect={onSelect} selected={selected} />
                ) : (
                    <div
                        key={node.path}
                        className={`pl-2 py-0.5 cursor-pointer rounded ${selected === node.path ? "bg-blue-100 dark:bg-blue-900/30" : ""} ${node.status ? statusColor[node.status] : ""}`}
                        onClick={() => onSelect(node.path)}
                    >
                        {node.name}
                    </div>
                )
            )}
        </div>
    );
};

export default FileTreeView; 