'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';
import { 
  DocumentIcon, 
  ClipboardDocumentIcon,
  EyeIcon,
  CodeBracketIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
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

  const { result, selectedFile, viewMode } = useAppSelector((state) => state.diff);
  const { showLineNumbers, wrapLines, highlightSyntax, fontSize } = useAppSelector(
    (state) => state.settings
  );

  const diff = selectedFile && result?.diffs[selectedFile] ? result.diffs[selectedFile] : null;
  const parsedDiff = diff ? parseDiff(diff) : [];

  // Synchronized scrolling
  useEffect(() => {
    if (!syncScroll) return;

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
  }, [syncScroll]);

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
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <DocumentIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No file selected
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Select a modified file from the sidebar to view its diff
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const language = getLanguageFromPath(selectedFile);

  if (viewMode === 'unified') {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {selectedFile}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSyncScroll(!syncScroll)}
              className={cn(syncScroll && 'bg-blue-100 dark:bg-blue-900/50')}
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Sync Scroll
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(diff)}
            >
              <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {/* Unified Diff View */}
        <div className="flex-1 overflow-auto font-mono">
          {highlightSyntax ? (
            <SyntaxHighlighter
              language={language}
              style={theme === 'dark' ? oneDark : oneLight}
              showLineNumbers={showLineNumbers}
              wrapLines={wrapLines}
              className={cn('!m-0 !bg-transparent', fontSizeClasses[fontSize])}
            >
              {diff}
            </SyntaxHighlighter>
          ) : (
            <pre className={cn('p-4 whitespace-pre-wrap', fontSizeClasses[fontSize])}>
              {diff}
            </pre>
          )}
        </div>
      </div>
    );
  }

  // Split view
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <CodeBracketIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {selectedFile}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSyncScroll(!syncScroll)}
            className={cn(syncScroll && 'bg-blue-100 dark:bg-blue-900/50')}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            Sync Scroll
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(diff)}
          >
            <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>

      {/* Split Diff View */}
      <div className="flex-1 flex">
        {/* Left Panel (Original) */}
        <div className="flex-1 border-r border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Original
          </div>
          <div
            ref={leftPanelRef}
            className={cn('overflow-auto h-full font-mono', fontSizeClasses[fontSize])}
          >
            {parsedDiff.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex border-b border-slate-100 dark:border-slate-800',
                  line.type === 'removed' && 'bg-red-50 dark:bg-red-950/30',
                  line.type === 'context' && 'bg-blue-50 dark:bg-blue-950/30'
                )}
              >
                {showLineNumbers && (
                  <div className="w-12 px-2 py-1 text-right text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    {line.oldLine || ''}
                  </div>
                )}
                <div
                  className={cn(
                    'flex-1 px-3 py-1',
                    line.type === 'removed' && 'text-red-800 dark:text-red-200',
                    line.type === 'context' && 'text-blue-700 dark:text-blue-300 font-semibold',
                    wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'
                  )}
                >
                  {line.type !== 'added' ? line.content || ' ' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel (Modified) */}
        <div className="flex-1">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Modified
          </div>
          <div
            ref={rightPanelRef}
            className={cn('overflow-auto h-full font-mono', fontSizeClasses[fontSize])}
          >
            {parsedDiff.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex border-b border-slate-100 dark:border-slate-800',
                  line.type === 'added' && 'bg-green-50 dark:bg-green-950/30',
                  line.type === 'context' && 'bg-blue-50 dark:bg-blue-950/30'
                )}
              >
                {showLineNumbers && (
                  <div className="w-12 px-2 py-1 text-right text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    {line.newLine || ''}
                  </div>
                )}
                <div
                  className={cn(
                    'flex-1 px-3 py-1',
                    line.type === 'added' && 'text-green-800 dark:text-green-200',
                    line.type === 'context' && 'text-blue-700 dark:text-blue-300 font-semibold',
                    wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'
                  )}
                >
                  {line.type !== 'removed' ? line.content || ' ' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffSplitViewer;