'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRightIcon,
  FolderIcon,
  EyeIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
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
  searchTerm: string;
}> = ({ node, level, onFileSelect, selectedFile, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  // Check if this node or any of its children match the search
  const matchesSearch = searchTerm === '' || 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.children.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!matchesSearch && searchTerm !== '') return null;

  const statusColors = {
    added: 'text-[hsl(var(--diff-added-text))]',
    removed: 'text-[hsl(var(--diff-removed-text))]',
    modified: 'text-warning',
    unchanged: 'text-muted-foreground',
  };

  const statusBadges = {
    added: <Badge className="ml-2 text-xs bg-[hsl(var(--diff-added-bg))] text-[hsl(var(--diff-added-text))] border-[hsl(var(--diff-added-text))]">+</Badge>,
    removed: <Badge className="ml-2 text-xs bg-[hsl(var(--diff-removed-bg))] text-[hsl(var(--diff-removed-text))] border-[hsl(var(--diff-removed-text))]">-</Badge>,
    modified: <Badge variant="warning" className="ml-2 text-xs">~</Badge>,
    unchanged: null,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: level * 0.05 }}
    >
      <motion.div
        className={cn(
          'flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group',
          'hover:bg-accent/50',
          selectedFile === node.path && 'bg-primary/10 border-l-4 border-primary shadow-sm',
          statusColors[node.status]
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => {
          if (node.isDir) {
            setIsExpanded(!isExpanded);
          } else {
            onFileSelect(node.path);
          }
        }}
        whileHover={{ x: 2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {node.isDir ? (
          <>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            >
              <ChevronRightIcon className="w-4 h-4 mr-2" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mr-2"
            >
              <FolderIcon className="w-4 h-4 text-primary" />
            </motion.div>
          </>
        ) : (
          <>
            <div className="w-4 mr-2" />
            <motion.span 
              className="mr-2 text-sm"
              whileHover={{ scale: 1.2 }}
            >
              {getFileIcon(node.name)}
            </motion.span>
          </>
        )}
        <span className="text-sm font-medium truncate flex-1 group-hover:text-foreground transition-colors">
          {node.name}
        </span>
        {statusBadges[node.status]}
      </motion.div>

      <AnimatePresence>
        {node.isDir && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {node.children.map((child) => (
              <FileTreeItem
                key={`${child.path}-${child.isDir}`}
                node={child}
                level={level + 1}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                searchTerm={searchTerm}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FileTreeSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { result, selectedFile, showUnchanged } = useAppSelector((state) => state.diff);
  const { sidebarCollapsed } = useAppSelector((state) => state.settings);
  const [searchTerm, setSearchTerm] = useState('');

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
        'glass-effect border-r flex flex-col',
        'transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-12' : 'w-80'
      )}
      initial={false}
      animate={{ width: sidebarCollapsed ? 48 : 320 }}
    >
      {/* Modern Header */}
      <motion.div 
        className="p-6 border-b border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          {!sidebarCollapsed && (
            <motion.h3 
              className="font-bold text-lg text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              File Changes
            </motion.h3>
          )}
          <div className="flex items-center space-x-2">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(toggleShowUnchanged())}
                  className={cn(
                    'h-8 w-8 transition-all duration-200',
                    showUnchanged && 'bg-primary/10 text-primary'
                  )}
                  title={showUnchanged ? 'Hide unchanged files' : 'Show unchanged files'}
                >
                  {showUnchanged ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(toggleSidebar())}
                className="h-8 w-8"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Search Bar */}
        {!sidebarCollapsed && (
          <motion.div 
            className="relative mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
              >
                <XMarkIcon className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        )}

        {/* Stats Grid */}
        {!sidebarCollapsed && (
          <motion.div 
            className="grid grid-cols-2 gap-3 text-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center space-x-2 p-2 rounded-lg bg-[hsl(var(--diff-added-bg))]/50 border border-[hsl(var(--diff-added-text))]/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-2 h-2 bg-[hsl(var(--diff-added-text))] rounded-full" />
              <span className="text-[hsl(var(--diff-added-text))] font-medium">
                {result.stats.addedCount} added
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 p-2 rounded-lg bg-[hsl(var(--diff-removed-bg))]/50 border border-[hsl(var(--diff-removed-text))]/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-2 h-2 bg-[hsl(var(--diff-removed-text))] rounded-full" />
              <span className="text-[hsl(var(--diff-removed-text))] font-medium">
                {result.stats.removedCount} removed
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 p-2 rounded-lg bg-warning/10 border border-warning/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span className="text-warning font-medium">
                {result.stats.modifiedCount} modified
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 p-2 rounded-lg bg-muted/20 border border-muted-foreground/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              <span className="text-muted-foreground font-medium">
                {result.stats.unchangedCount} unchanged
              </span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* File Tree */}
      {!sidebarCollapsed && (
        <motion.div 
          className="flex-1 overflow-y-auto p-4 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {fileTree.map((node) => (
              <FileTreeItem
                key={`${node.path}-${node.isDir}`}
                node={node}
                level={0}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                searchTerm={searchTerm}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileTreeSidebar;
