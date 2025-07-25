'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartIcon, StarIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: "/app", label: "Compare Files" },
      { href: "/#features", label: "Features" },
      { href: "/", label: "Home" },
    ],
    resources: [
      { href: "https://github.com/udaypankhaniya/diff-check", label: "GitHub", external: true },
      { href: "https://github.com/udaypankhaniya/diff-check/issues", label: "Report Issues", external: true },
      { href: "https://github.com/udaypankhaniya/diff-check/blob/main/README.md", label: "Documentation", external: true },
    ],
    community: [
      { href: "https://github.com/udaypankhaniya/diff-check/discussions", label: "Discussions", external: true },
      { href: "https://github.com/udaypankhaniya/diff-check/blob/main/CONTRIBUTING.md", label: "Contributing", external: true },
      { href: "https://github.com/udaypankhaniya/diff-check/releases", label: "Releases", external: true },
    ]
  };

  return (
    <footer className="glass-effect border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-md" />
                <DocumentMagnifyingGlassIcon className="relative w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Diff Check
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional ZIP file comparison tool with beautiful visual diffs. 
              Built for developers, by developers.
            </p>
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                <CodeBracketIcon className="w-3 h-3" />
                <span>Open Source</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1 text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full"
              >
                <StarIcon className="w-3 h-3" />
                <span>MIT License</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground">Product</h4>
            <div className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.div 
                  key={link.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link 
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground">Resources</h4>
            <div className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.div 
                  key={link.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Community */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground">Community</h4>
            <div className="space-y-3">
              {footerLinks.community.map((link, index) => (
                <motion.div 
                  key={link.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <a 
                    href={link.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Diff Check. All rights reserved.
            </p>
            
            <motion.div 
              className="flex items-center space-x-2 text-sm text-muted-foreground"
              whileHover={{ scale: 1.02 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <HeartIcon className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>by</span>
              <motion.a 
                href="https://github.com/udaypankhaniya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-primary hover:text-primary/80 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                Uday Pankhaniya
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
