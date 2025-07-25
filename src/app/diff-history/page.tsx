"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TagIcon,
  ClockIcon,
  DocumentTextIcon,
  FolderIcon,
  ChevronLeftIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  diffHistoryService,
  DiffHistoryEntry,
  DiffHistoryFilter,
  formatTimestamp,
  formatDuration,
} from '@/services/diffHistory';
import { useApp } from '@/context/AppContext';

const DiffHistoryPage: React.FC = () => {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'timestamp' | 'name' | 'fileCount'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load history with filters
  const filter: DiffHistoryFilter = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sortBy,
    sortOrder,
  }), [searchTerm, selectedTags, sortBy, sortOrder]);

  const history = useMemo(() => {
    if (!mounted) return [];
    return diffHistoryService.getHistory(filter);
  }, [filter, mounted]);

  const historyStats = useMemo(() => {
    if (!mounted) return { totalEntries: 0, totalFilesCompared: 0, avgProcessingTime: 0, mostRecentComparison: null, oldestComparison: null };
    return diffHistoryService.getHistoryStats();
  }, [mounted]);

  // Get all unique tags from history
  const allTags = useMemo(() => {
    if (!mounted) return [];
    const allHistoryEntries = diffHistoryService.getHistory();
    const tagSet = new Set<string>();
    allHistoryEntries.forEach(entry => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [mounted]);

  const handleDeleteEntry = (id: string) => {
    if (diffHistoryService.deleteHistoryEntry(id)) {
      addToast({
        type: 'success',
        message: 'Comparison deleted successfully',
        duration: 3000,
      });
      setShowDeleteModal(null);
    } else {
      addToast({
        type: 'error',
        message: 'Failed to delete comparison',
        duration: 3000,
      });
    }
  };

  const handleClearAllHistory = () => {
    diffHistoryService.clearHistory();
    addToast({
      type: 'info',
      message: 'All history cleared',
      duration: 3000,
    });
    // Force re-render by resetting search term
    setSearchTerm('');
  };

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  const handleExportHistory = () => {
    try {
      const exportData = diffHistoryService.exportHistory();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diff-check-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addToast({
        type: 'success',
        message: 'History exported successfully',
        duration: 3000,
      });
      setShowExportModal(false);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to export history',
        duration: 3000,
      });
    }
  };

  const handleImportHistory = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const result = diffHistoryService.importHistory(jsonData, true);
        
        if (result.success) {
          addToast({
            type: 'success',
            message: `Imported ${result.entriesImported} comparisons successfully`,
            duration: 3000,
          });
          // Force refresh
          setSearchTerm('');
        } else {
          addToast({
            type: 'error',
            message: result.error || 'Failed to import history',
            duration: 3000,
          });
        }
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Invalid file format',
          duration: 3000,
        });
      }
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ChevronLeftIcon className="w-4 h-4" />
                  Back to Compare
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Diff History</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage your previous file comparisons
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2"
              >
                <ArrowUpTrayIcon className="w-4 h-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export
              </Button>
              {history.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAllHistory}
                  className="flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Comparisons', value: historyStats.totalEntries, icon: DocumentTextIcon },
              { label: 'Files Compared', value: historyStats.totalFilesCompared, icon: FolderIcon },
              { 
                label: 'Avg Processing Time', 
                value: historyStats.avgProcessingTime > 0 ? formatDuration(historyStats.avgProcessingTime) : 'N/A', 
                icon: ClockIcon 
              },
              { 
                label: 'Most Recent', 
                value: historyStats.mostRecentComparison ? formatTimestamp(historyStats.mostRecentComparison) : 'None', 
                icon: CalendarIcon 
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 glass-effect">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card glass-effect p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search comparisons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="fileCount-desc">Most Files</option>
              <option value="fileCount-asc">Least Files</option>
            </select>

            {/* Tags Filter */}
            <div className="relative">
              <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && !selectedTags.includes(e.target.value)) {
                    setSelectedTags([...selectedTags, e.target.value]);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Add tag filter...</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
                setSortBy('timestamp');
                setSortOrder('desc');
              }}
              className="text-sm"
            >
              Clear Filters
            </Button>
          </div>

          {/* Active Tag Filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    className="ml-1 hover:text-destructive"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* History List */}
        <div className="space-y-4">
          <AnimatePresence>
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <DocumentTextIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No comparisons found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedTags.length > 0 
                    ? "Try adjusting your filters or search terms" 
                    : "Start comparing files to see your history here"
                  }
                </p>
                <Link href="/app">
                  <Button className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Create New Comparison
                  </Button>
                </Link>
              </motion.div>
            ) : (
              history.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HistoryEntryCard
                    entry={entry}
                    onDelete={() => setShowDeleteModal(entry.id)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass-effect p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Delete Comparison</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this comparison? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEntry(showDeleteModal)}
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass-effect p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Export History</h3>
              <p className="text-muted-foreground mb-6">
                Export all your comparison history as a JSON file.
              </p>
              <div className="flex space-x-3">
                <Button onClick={handleExportHistory} className="flex-1">
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card glass-effect p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Import History</h3>
              <p className="text-muted-foreground mb-6">
                Import comparison history from a JSON file.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportHistory}
                className="w-full p-2 border border-border rounded-lg mb-4"
              />
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// History Entry Card Component
const HistoryEntryCard: React.FC<{
  entry: DiffHistoryEntry;
  onDelete: () => void;
}> = ({ entry, onDelete }) => {
  return (
    <Card className="p-6 glass-effect hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-lg font-semibold text-foreground">{entry.name}</h3>
            <span className="text-sm text-muted-foreground">
              {formatTimestamp(entry.timestamp)}
            </span>
          </div>

          {entry.description && (
            <p className="text-muted-foreground text-sm mb-3">{entry.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Files:</span>
              <div className="font-mono text-xs text-foreground mt-1">
                <div className="truncate">{entry.files.zip1.name}</div>
                <div className="truncate">{entry.files.zip2.name}</div>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Files:</span>
              <div className="font-semibold text-foreground">{entry.stats.totalFiles}</div>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Changes:</span>
              <div className="flex space-x-3 text-xs mt-1">
                <span className="text-[hsl(var(--diff-added-text))]">+{entry.stats.addedCount}</span>
                <span className="text-[hsl(var(--diff-removed-text))]">-{entry.stats.removedCount}</span>
                <span className="text-warning">~{entry.stats.modifiedCount}</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Processing:</span>
              <div className="font-semibold text-foreground">
                {entry.metadata.duration ? formatDuration(entry.metadata.duration) : 'N/A'}
              </div>
            </div>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" size="sm" title="View Details">
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} title="Delete">
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DiffHistoryPage;
