'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  Cog6ToothIcon,
  EyeIcon,
  DocumentTextIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import {
  setFontSize,
  toggleLineNumbers,
  toggleWrapLines,
  toggleSyntaxHighlight,
} from '@/store/settingsSlice';
import { setViewMode } from '@/store/diffSlice';

const SettingsModal: React.FC = () => {
  const { state, toggleModal } = useApp();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const { viewMode } = useAppSelector((state) => state.diff);

  const isOpen = state.modals.settings;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => toggleModal('settings', false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl mx-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Settings</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleModal('settings', false)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* View Mode */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4" />
                    <span>View Mode</span>
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={viewMode === 'split' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => dispatch(setViewMode('split'))}
                    >
                      Split View
                    </Button>
                    <Button
                      variant={viewMode === 'unified' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => dispatch(setViewMode('unified'))}
                    >
                      Unified View
                    </Button>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Font Size</span>
                  </h3>
                  <div className="flex space-x-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <Button
                        key={size}
                        variant={settings.fontSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => dispatch(setFontSize(size))}
                        className="capitalize"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Display Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <PaintBrushIcon className="w-4 h-4" />
                    <span>Display Options</span>
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showLineNumbers}
                        onChange={() => dispatch(toggleLineNumbers())}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Show line numbers
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.wrapLines}
                        onChange={() => dispatch(toggleWrapLines())}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Wrap long lines
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.highlightSyntax}
                        onChange={() => dispatch(toggleSyntaxHighlight())}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Syntax highlighting
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => toggleModal('settings', false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;