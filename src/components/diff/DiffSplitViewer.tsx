'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';
import { 
  DocumentIcon, 
  ClipboardDocumentIcon,
  EyeIcon,
  CodeBracketIcon,
  Squares2X2Icon,
  ListBulletIcon,
  BookmarkIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks/redux';
import { useApp } from '@/context/AppContext';

interface DiffLine {
  oldLine: number | null;
  newLine: number | null;
  content: string;
  type: 'added' | 'removed' | 'unchanged' | 'context';
}

const parseDiff = (diff: string): DiffLine[] => {
  const lines = diff.split('\n');
  const result: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        oldLineNum = parseInt(match[1], 10);
        newLineNum = parseInt(match[2], 10);
      }
      result.push({ oldLine: null, newLine: null, content: line, type: 'context' });
    } else if (line.startsWith('+')) {
      result.push({ 
        oldLine: null, 
        newLine: newLineNum, 
        content: line.slice(1), 
        type: 'added' 
      });
      newLineNum++;
    } else if (line.startsWith('-')) {
      result.push({ 
        oldLine: oldLineNum, 
        newLine: null, 
        content: line.slice(1), 
        type: 'removed' 
      });
      oldLineNum++;
    } else if (line.startsWith(' ') || (!line.startsWith('+++') && !line.startsWith('---') && !line.startsWith('index'))) {
      const content = line.startsWith(' ') ? line.slice(1) : line;
      result.push({ 
        oldLine: oldLineNum, 
        newLine: newLineNum, 
        content, 
        type: 'unchanged' 
      });
      oldLineNum++;
      newLineNum++;
    }
  }
  return result;
};

const getLanguageFromPath = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    sh: 'bash',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
  };
  return languageMap[ext || ''] || 'text';
};

const DiffSplitViewer: React.FC = () => {
  const { theme } = useTheme();
  const { addToast } = useApp();
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [syncScroll, setSyncScroll] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('unified');

  const { result, selectedFile } = useAppSelector((state) => state.diff);
  const { showLineNumbers, wrapLines, highlightSyntax, fontSize } = useAppSelector(
    (state) => state.settings
  );

  const diff = selectedFile && result?.diffs[selectedFile] ? result.diffs[selectedFile] : null;
  const parsedDiff = diff ? parseDiff(diff) : [];

  // Calculate diff stats for current file
  const diffStats = parsedDiff.reduce(
    (acc, line) => {
      if (line.type === 'added') acc.additions++;
      else if (line.type === 'removed') acc.deletions++;
      return acc;
    },
    { additions: 0, deletions: 0 }
  );

  // Synchronized scrolling
  useEffect(() => {
    if (!syncScroll || viewMode !== 'split') return;

    const handleScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      return () => {
        target.scrollTop = source.scrollTop;
      };
    };

    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (leftPanel && rightPanel) {
      const leftScrollHandler = handleScroll(leftPanel, rightPanel);
      const rightScrollHandler = handleScroll(rightPanel, leftPanel);

      leftPanel.addEventListener('scroll', leftScrollHandler);
      rightPanel.addEventListener('scroll', rightScrollHandler);

      return () => {
        leftPanel.removeEventListener('scroll', leftScrollHandler);
        rightPanel.removeEventListener('scroll', rightScrollHandler);
      };
    }
  }, [syncScroll, viewMode]);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      addToast({
        type: 'success',
        message: 'Diff copied to clipboard',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to copy diff',
        duration: 3000,
      });
    }
  };

  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  if (!selectedFile || !diff) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl" />
            <DocumentIcon className="relative w-20 h-20 mx-auto text-muted-foreground" />
          </motion.div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              No file selected
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Choose a modified file from the sidebar to view its detailed diff comparison
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const language = getLanguageFromPath(selectedFile);

  if (viewMode === 'unified') {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Modern Header with Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect border-b sticky top-0 z-10"
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-2 rounded-lg bg-primary/10"
                whileHover={{ scale: 1.05 }}
              >
                <CodeBracketIcon className="w-5 h-5 text-primary" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground truncate max-w-md">
                  {selectedFile}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    <span>+{diffStats.additions}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-destructive rounded-full"></span>
                    <span>-{diffStats.deletions}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('split')}
                className="flex items-center gap-2"
              >
                <Squares2X2Icon className="w-4 h-4" />
                Split View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(diff)}
                className="flex items-center gap-2"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>
        </motion.div>

        {/* GitHub-style Unified Diff View */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-none">
            {parsedDiff.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.001 }}
                className={cn(
                  'flex items-center border-b border-border/30 hover:bg-muted/30 transition-colors',
                  // GitHub-style diff colors using exact specifications
                  line.type === 'added' && 'bg-[hsl(var(--diff-added-bg))] border-l-4 border-[hsl(var(--diff-added-text))]',
                  line.type === 'removed' && 'bg-[hsl(var(--diff-removed-bg))] border-l-4 border-[hsl(var(--diff-removed-text))]',
                  line.type === 'context' && 'bg-muted/20'
                )}
              >
                {/* Line Numbers */}
                {showLineNumbers && (
                  <>
                    <div className="w-12 px-2 py-1 text-xs text-right text-muted-foreground bg-muted/20 border-r border-border/30 select-none">
                      {line.oldLine || ''}
                    </div>
                    <div className="w-12 px-2 py-1 text-xs text-right text-muted-foreground bg-muted/20 border-r border-border/30 select-none">
                      {line.newLine || ''}
                    </div>
                  </>
                )}
                
                {/* Diff Marker */}
                <div className="w-8 px-2 py-1 text-xs text-center font-mono select-none">
                  {line.type === 'added' && (
                    <span className="text-[hsl(var(--diff-added-text))] font-bold">+</span>
                  )}
                  {line.type === 'removed' && (
                    <span className="text-[hsl(var(--diff-removed-text))] font-bold">-</span>
                  )}
                  {line.type === 'unchanged' && (
                    <span className="text-muted-foreground/50"> </span>
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    'flex-1 px-4 py-1 font-mono',
                    fontSizeClasses[fontSize],
                    line.type === 'added' && 'text-[hsl(var(--diff-added-text))]',
                    line.type === 'removed' && 'text-[hsl(var(--diff-removed-text))]',
                    line.type === 'context' && 'text-muted-foreground font-semibold',
                    line.type === 'unchanged' && 'text-foreground/70',
                    wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'
                  )}
                >
                  {line.content || ' '}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Split view
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Modern Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b sticky top-0 z-10"
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="p-2 rounded-lg bg-primary/10"
              whileHover={{ scale: 1.05 }}
            >
              <CodeBracketIcon className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground truncate max-w-md">
                {selectedFile}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>+{diffStats.additions}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-destructive rounded-full"></span>
                  <span>-{diffStats.deletions}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('unified')}
              className="flex items-center gap-2"
            >
              <ListBulletIcon className="w-4 h-4" />
              Unified
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSyncScroll(!syncScroll)}
              className={cn(
                'flex items-center gap-2',
                syncScroll && 'bg-primary/10 text-primary'
              )}
            >
              <ChevronUpDownIcon className="w-4 h-4" />
              Sync Scroll
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(diff)}
              className="flex items-center gap-2"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
              Copy
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Split Diff View */}
      <div className="flex-1 flex">
        {/* Left Panel (Original) */}
        <div className="flex-1 border-r border-border">
          <div className="glass-effect px-6 py-3 text-sm font-semibold text-muted-foreground border-b border-border">
            <div className="flex items-center justify-between">
              <span>Original</span>
              <Badge variant="outline" className="text-xs">
                Before
              </Badge>
            </div>
          </div>
          <div
            ref={leftPanelRef}
            className={cn(
              'overflow-auto h-full font-mono bg-background',
              fontSizeClasses[fontSize]
            )}
          >
            {parsedDiff.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.001 }}
                className={cn(
                  'flex border-b border-border/20 hover:bg-muted/20 transition-colors',
                  line.type === 'removed' && 'bg-[hsl(var(--diff-removed-bg))]',
                  line.type === 'context' && 'bg-muted/10'
                )}
              >
                {showLineNumbers && (
                  <div className="w-12 px-2 py-1 text-xs text-right text-muted-foreground bg-muted/20 border-r border-border/30 select-none">
                    {line.oldLine || ''}
                  </div>
                )}
                <div
                  className={cn(
                    'flex-1 px-4 py-1',
                    line.type === 'removed' && 'text-[hsl(var(--diff-removed-text))]',
                    line.type === 'context' && 'text-muted-foreground font-semibold',
                    line.type === 'unchanged' && 'text-foreground/70',
                    wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'
                  )}
                >
                  {line.type !== 'added' ? line.content || ' ' : ''}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel (Modified) */}
        <div className="flex-1">
          <div className="glass-effect px-6 py-3 text-sm font-semibold text-muted-foreground border-b border-border">
            <div className="flex items-center justify-between">
              <span>Modified</span>
              <Badge variant="outline" className="text-xs">
                After
              </Badge>
            </div>
          </div>
          <div
            ref={rightPanelRef}
            className={cn(
              'overflow-auto h-full font-mono bg-background',
              fontSizeClasses[fontSize]
            )}
          >
            {parsedDiff.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.001 }}
                className={cn(
                  'flex border-b border-border/20 hover:bg-muted/20 transition-colors',
                  line.type === 'added' && 'bg-[hsl(var(--diff-added-bg))]',
                  line.type === 'context' && 'bg-muted/10'
                )}
              >
                {showLineNumbers && (
                  <div className="w-12 px-2 py-1 text-xs text-right text-muted-foreground bg-muted/20 border-r border-border/30 select-none">
                    {line.newLine || ''}
                  </div>
                )}
                <div
                  className={cn(
                    'flex-1 px-4 py-1',
                    line.type === 'added' && 'text-[hsl(var(--diff-added-text))]',
                    line.type === 'context' && 'text-muted-foreground font-semibold',
                    line.type === 'unchanged' && 'text-foreground/70',
                    wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'
                  )}
                >
                  {line.type !== 'removed' ? line.content || ' ' : ''}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffSplitViewer;
