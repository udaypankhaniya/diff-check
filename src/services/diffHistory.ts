import { DiffResult } from './zipDiff';


export interface DiffHistoryEntry {
  id: string;
  timestamp: number;
  name: string;
  description?: string;
  tags?: string[];
  files: {
    zip1: {
      name: string;
      size: number;
    };
    zip2: {
      name: string;
      size: number;
    };
  };
  stats: {
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    unchangedCount: number;
    totalFiles: number;
  };
  result: DiffResult;
  metadata: {
    duration?: number; // Processing time in ms
    version: string; // App version
    userAgent?: string;
  };
}

export interface DiffHistoryFilter {
  searchTerm?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  sortBy?: 'timestamp' | 'name' | 'fileCount';
  sortOrder?: 'asc' | 'desc';
}

const STORAGE_KEY = 'diff-check-history';
const MAX_HISTORY_ENTRIES = 100; // Prevent localStorage from growing too large
const CURRENT_VERSION = '1.0.0';

class DiffHistoryService {
  /**
   * Save a new diff comparison to history
   */
  saveDiffToHistory(
    result: DiffResult,
    zip1File: File,
    zip2File: File,
    options?: {
      name?: string;
      description?: string;
      tags?: string[];
      duration?: number;
    }
  ): string {
    const entry: DiffHistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      name: options?.name || this.generateDefaultName(zip1File.name, zip2File.name),
      description: options?.description,
      tags: options?.tags || [],
      files: {
        zip1: {
          name: zip1File.name,
          size: zip1File.size,
        },
        zip2: {
          name: zip2File.name,
          size: zip2File.size,
        },
      },
      stats: {
        addedCount: result.stats.addedCount,
        removedCount: result.stats.removedCount,
        modifiedCount: result.stats.modifiedCount,
        unchangedCount: result.stats.unchangedCount,
        totalFiles: result.stats.addedCount + result.stats.removedCount + result.stats.modifiedCount + result.stats.unchangedCount,
      },
      result,
      metadata: {
        duration: options?.duration,
        version: CURRENT_VERSION,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    const history = this.getHistory();
    history.unshift(entry); // Add to beginning

    // Trim to max entries
    if (history.length > MAX_HISTORY_ENTRIES) {
      history.splice(MAX_HISTORY_ENTRIES);
    }

    this.saveHistory(history);
    return entry.id;
  }

  /**
   * Get all history entries with optional filtering
   */
  getHistory(filter?: DiffHistoryFilter): DiffHistoryEntry[] {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        return [];
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      let history: DiffHistoryEntry[] = stored ? JSON.parse(stored) : [];

      // Apply filters
      if (filter) {
        history = this.applyFilters(history, filter);
      }

      return history;
    } catch (error) {
      console.error('Error loading diff history:', error);
      return [];
    }
  }

  /**
   * Get a specific history entry by ID
   */
  getHistoryEntry(id: string): DiffHistoryEntry | null {
    const history = this.getHistory();
    return history.find(entry => entry.id === id) || null;
  }

  /**
   * Update an existing history entry
   */
  updateHistoryEntry(id: string, updates: Partial<Pick<DiffHistoryEntry, 'name' | 'description' | 'tags'>>): boolean {
    const history = this.getHistory();
    const index = history.findIndex(entry => entry.id === id);
    
    if (index === -1) return false;

    history[index] = {
      ...history[index],
      ...updates,
    };

    this.saveHistory(history);
    return true;
  }

  /**
   * Delete a history entry
   */
  deleteHistoryEntry(id: string): boolean {
    const history = this.getHistory();
    const filteredHistory = history.filter(entry => entry.id !== id);
    
    if (filteredHistory.length === history.length) {
      return false; // Entry not found
    }

    this.saveHistory(filteredHistory);
    return true;
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get history statistics
   */
  getHistoryStats() {
    const history = this.getHistory();
    
    if (history.length === 0) {
      return {
        totalEntries: 0,
        totalFilesCompared: 0,
        avgProcessingTime: 0,
        mostRecentComparison: null,
        oldestComparison: null,
      };
    }

    const totalFilesCompared = history.reduce((sum, entry) => sum + entry.stats.totalFiles, 0);
    const entriesWithDuration = history.filter(entry => entry.metadata.duration);
    const avgProcessingTime = entriesWithDuration.length > 0 
      ? entriesWithDuration.reduce((sum, entry) => sum + (entry.metadata.duration || 0), 0) / entriesWithDuration.length
      : 0;

    return {
      totalEntries: history.length,
      totalFilesCompared,
      avgProcessingTime,
      mostRecentComparison: history[0]?.timestamp || null,
      oldestComparison: history[history.length - 1]?.timestamp || null,
    };
  }

  /**
   * Export history as JSON
   */
  exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify({
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      entries: history,
    }, null, 2);
  }

  /**
   * Import history from JSON
   */
  importHistory(jsonData: string, merge = false): { success: boolean; entriesImported: number; error?: string } {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.entries || !Array.isArray(data.entries)) {
        return { success: false, entriesImported: 0, error: 'Invalid import format' };
      }

      const existingHistory = merge ? this.getHistory() : [];
      const importedEntries = data.entries as DiffHistoryEntry[];
      
      // Validate entries and assign new IDs to prevent conflicts
      const validEntries = importedEntries
        .filter(entry => this.validateHistoryEntry(entry))
        .map(entry => ({
          ...entry,
          id: this.generateId(), // Generate new ID to prevent conflicts
        }));

      const newHistory = [...validEntries, ...existingHistory];
      
      // Trim to max entries
      if (newHistory.length > MAX_HISTORY_ENTRIES) {
        newHistory.splice(MAX_HISTORY_ENTRIES);
      }

      this.saveHistory(newHistory);
      
      return { success: true, entriesImported: validEntries.length };
    } catch (error) {
      return { 
        success: false, 
        entriesImported: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Private methods

  private generateId(): string {
    return `diff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDefaultName(zip1Name: string, zip2Name: string): string {
    const cleanName1 = zip1Name.replace(/\.zip$/i, '');
    const cleanName2 = zip2Name.replace(/\.zip$/i, '');
    return `${cleanName1} vs ${cleanName2}`;
  }

  private saveHistory(history: DiffHistoryEntry[]): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving diff history:', error);
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Remove oldest entries and try again
        history.splice(Math.floor(history.length / 2));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (retryError) {
          console.error('Failed to save history even after cleanup:', retryError);
        }
      }
    }
  }

  private applyFilters(history: DiffHistoryEntry[], filter: DiffHistoryFilter): DiffHistoryEntry[] {
    let filtered = [...history];

    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.name.toLowerCase().includes(searchLower) ||
        entry.description?.toLowerCase().includes(searchLower) ||
        entry.files.zip1.name.toLowerCase().includes(searchLower) ||
        entry.files.zip2.name.toLowerCase().includes(searchLower) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Date range filter
    if (filter.dateRange) {
      const { start, end } = filter.dateRange;
      filtered = filtered.filter(entry => 
        entry.timestamp >= start.getTime() && entry.timestamp <= end.getTime()
      );
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(entry =>
        filter.tags!.some(tag => entry.tags?.includes(tag))
      );
    }

    // Sorting
    if (filter.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filter.sortBy) {
          case 'timestamp':
            comparison = a.timestamp - b.timestamp;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'fileCount':
            comparison = a.stats.totalFiles - b.stats.totalFiles;
            break;
        }

        return filter.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }

 private validateHistoryEntry(entry: unknown): entry is DiffHistoryEntry {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }

  const e = entry as Partial<DiffHistoryEntry>;

  return (
    // Required top-level fields
    typeof e.id === 'string' &&
    e.id.length > 0 &&
    typeof e.timestamp === 'number' &&
    !isNaN(e.timestamp) &&
    typeof e.name === 'string' &&
    e.name.length > 0 &&
    
    // Files object
    typeof e.files === 'object' &&
    e.files !== null &&
    typeof e.files.zip1 === 'object' &&
    e.files.zip1 !== null &&
    typeof e.files.zip1.name === 'string' &&
    typeof e.files.zip1.size === 'number' &&
    !isNaN(e.files.zip1.size) &&
    typeof e.files.zip2 === 'object' &&
    e.files.zip2 !== null &&
    typeof e.files.zip2.name === 'string' &&
    typeof e.files.zip2.size === 'number' &&
    !isNaN(e.files.zip2.size) &&

    // Stats object
    typeof e.stats === 'object' &&
    e.stats !== null &&
    typeof e.stats.addedCount === 'number' &&
    !isNaN(e.stats.addedCount) &&
    typeof e.stats.removedCount === 'number' &&
    !isNaN(e.stats.removedCount) &&
    typeof e.stats.modifiedCount === 'number' &&
    !isNaN(e.stats.modifiedCount) &&
    typeof e.stats.unchangedCount === 'number' &&
    !isNaN(e.stats.unchangedCount) &&
    typeof e.stats.totalFiles === 'number' &&
    !isNaN(e.stats.totalFiles) &&

    // Result object
    typeof e.result === 'object' &&
    e.result !== null &&

    // Optional fields
    (e.description === undefined || typeof e.description === 'string') &&
    (e.tags === undefined || (Array.isArray(e.tags) && e.tags.every(tag => typeof tag === 'string'))) &&
    
    // Metadata object
    typeof e.metadata === 'object' &&
    e.metadata !== null &&
    typeof e.metadata.version === 'string' &&
    (e.metadata.duration === undefined || (typeof e.metadata.duration === 'number' && !isNaN(e.metadata.duration))) &&
    (e.metadata.userAgent === undefined || typeof e.metadata.userAgent === 'string') &&
    // Ensure stats consistency
    e.stats.totalFiles === e.stats.addedCount + e.stats.removedCount + e.stats.modifiedCount + e.stats.unchangedCount
  );
}
}

// Export singleton instance
export const diffHistoryService = new DiffHistoryService();

// Export helper functions

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
};
