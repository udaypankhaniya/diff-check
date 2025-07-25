'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRightIcon,
  FolderIcon,
  EyeIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, getFileIcon } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setSelectedFile, toggleShowUnchanged } from '@/store/diffSlice';
import { toggleSidebar } from '@/store/settingsSlice';

interface FileTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
  children: FileTreeNode[];
  size?: number;
}

const buildFileTree = (
  files: { path: string; status: 'added' | 'removed' | 'modified' | 'unchanged' }[]
): FileTreeNode[] => {
  const root: FileTreeNode[] = [];

  files.forEach((file) => {
    const parts = file.path.split('/');
    let currentChildren = root;

    parts.forEach((part, index) => {
      if (index < parts.length - 1) {
        let dirNode = currentChildren.find(
          (node) => node.name === part && node.isDir
        );
        if (!dirNode) {
          dirNode = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            isDir: true,
            status: 'unchanged',
            children: [],
          };
          currentChildren.push(dirNode);
        }
        currentChildren = dirNode.children;
      } else {
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
    added: 'text-green-600 dark:text-green-400',
    removed: 'text-red-600 dark:text-red-400',
    modified: 'text-yellow-600 dark:text-yellow-400',
    unchanged: 'text-slate-600 dark:text-slate-400',
  };

  const statusBadges = {
    added: <Badge variant="success" className="ml-2 text-xs">+</Badge>,
    removed: <Badge variant="destructive" className="ml-2 text-xs">-</Badge>,
    modified: <Badge variant="warning" className="ml-2 text-xs">~</Badge>,
    unchanged: null,
  };

  return (
    <div>
      <motion.div
        className={cn(
          'flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          selectedFile === node.path && 'bg-blue-100 dark:bg-blue-900/50 border-l-2 border-blue-500',
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
        whileTap={{ scale: 0.98 }}
      >
        {node.isDir ? (
          <>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRightIcon className="w-4 h-4 mr-1" />
            </motion.div>
            <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
          </>
        ) : (
          <>
            <div className="w-4 mr-1" />
            <span className="mr-2 text-sm">{getFileIcon(node.name)}</span>
          </>
        )}
        <span className="text-sm font-medium truncate flex-1">{node.name}</span>
        {statusBadges[node.status]}
      </motion.div>

      <AnimatePresence>
        {node.isDir && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
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

const FileTreeSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { result, selectedFile, showUnchanged } = useAppSelector((state) => state.diff);
  const { sidebarCollapsed } = useAppSelector((state) => state.settings);

  const allFiles = useMemo(() => {
    if (!result) return [];
    
    return [
      ...result.added.map((path) => ({ path, status: 'added' as const })),
      ...result.removed.map((path) => ({ path, status: 'removed' as const })),
      ...result.modified.map((path) => ({ path, status: 'modified' as const })),
      ...(showUnchanged ? result.unchanged.map((path) => ({ path, status: 'unchanged' as const })) : []),
    ];
  }, [result, showUnchanged]);

  const fileTree = useMemo(() => buildFileTree(allFiles), [allFiles]);

  const handleFileSelect = (path: string) => {
    dispatch(setSelectedFile(path));
  };

  if (!result) return null;

  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col',
        'transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-12' : 'w-80'
      )}
      initial={false}
      animate={{ width: sidebarCollapsed ? 48 : 320 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              File Changes
            </h3>
          )}
          <div className="flex items-center space-x-1">
            
        {!sidebarCollapsed && (
            <Button
        
              size="icon"
              onClick={() => dispatch(toggleShowUnchanged())}
              className={cn(
                'h-8 w-8',
                showUnchanged && 'bg-blue-100 dark:bg-blue-900/50'
              )}
              title={showUnchanged ? 'Hide unchanged files' : 'Show unchanged files'}
            >
              {showUnchanged ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </Button>
          )}
            <Button
            
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              className="h-8 w-8"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-slate-600 dark:text-slate-400">
                {result.stats.addedCount} added
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-slate-600 dark:text-slate-400">
                {result.stats.removedCount} removed
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-slate-600 dark:text-slate-400">
                {result.stats.modifiedCount} modified
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full" />
              <span className="text-slate-600 dark:text-slate-400">
                {result.stats.unchangedCount} unchanged
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File Tree */}
      {!sidebarCollapsed && (
        <div className="flex-1 overflow-y-auto p-2">
          {fileTree.map((node) => (
            <FileTreeItem
              key={`${node.path}-${node.isDir}`}
              node={node}
              level={0}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FileTreeSidebar;