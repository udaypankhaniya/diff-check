'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const Navbar: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const { toggleModal } = useApp();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const themeOptions = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  ];

  const nextTheme = () => {
    const currentIndex = themeOptions.findIndex(option => option.value === theme);
    const nextIndex = (currentIndex + 1) % themeOptions.length;
    setTheme(themeOptions[nextIndex].value);
  };

  const getCurrentThemeIcon = () => {
    if (!mounted) return SunIcon;
    
    if (theme === 'system') {
      return ComputerDesktopIcon;
    }
    return theme === 'dark' ? MoonIcon : SunIcon;
  };

  const ThemeIcon = getCurrentThemeIcon();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 glass-effect border-b"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
              <DocumentMagnifyingGlassIcon className="relative w-8 h-8 text-primary" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Diff Check
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {[
                { href: '/', label: 'Home' },
                { href: '/app', label: 'Compare' },
                { href: 'https://github.com/udaypankhaniya/diff-check', label: 'GitHub', external: true }
              ].map((link) => (
                <motion.div key={link.href} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 group-hover:w-full transition-all duration-300" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="relative text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Settings Button - Desktop only */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleModal('settings')}
                className="theme-toggle relative overflow-hidden"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </motion.div>
            
            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTheme}
                className="theme-toggle relative overflow-hidden"
                title={`Current theme: ${theme} ${currentTheme ? `(${currentTheme})` : ''}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ThemeIcon className="w-5 h-5" />
                  </motion.div>
                </AnimatePresence>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="theme-toggle"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileMenuOpen ? (
                      <XMarkIcon className="w-5 h-5" />
                    ) : (
                      <Bars3Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/app', label: 'Compare' },
                  { href: 'https://github.com/udaypankhaniya/diff-check', label: 'GitHub', external: true }
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                
                {/* Mobile Settings */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="border-t border-border/50 pt-2 mt-2"
                >
                  <button
                    onClick={() => {
                      toggleModal('settings');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium w-full"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
