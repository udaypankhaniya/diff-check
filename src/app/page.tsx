"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  PlusIcon, 
  StarIcon, 
  EyeIcon, 
  ExclamationCircleIcon, 
  CodeBracketIcon, 
  ArrowRightIcon,
  SparklesIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  CheckIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* SEO-optimized Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              className="relative mr-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl" />
              <DocumentMagnifyingGlassIcon className="relative w-16 h-16 text-primary" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Diff Check
              </span>
            </h1>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            Professional ZIP File Comparison Tool - Compare Files with Beautiful Visual Diffs
            <br className="hidden md:block" />
            <span className="font-semibold text-foreground">Free, Fast, and Privacy-Focused</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/compare">
                <Button
                  size="xl"
                  variant="gradient"
                  className="shadow-2xl"
                >
                  <SparklesIcon className="w-6 h-6" />
                  Start Comparing Files
                  <ArrowRightIcon className="w-6 h-6" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://github.com/udaypankhaniya/diff-check"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="xl"
                  variant="ghost"
                  className="glass-effect shadow-lg"
                >
                  <StarIcon className="w-6 h-6" />
                  Star on GitHub
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                100%
              </div>
              <div className="font-semibold text-foreground mb-1">
                Client-Side Processing
              </div>
              <div className="text-sm text-muted-foreground">
                Your files never leave your browser
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                0ms
              </div>
              <div className="font-semibold text-foreground mb-1">
                Server Latency
              </div>
              <div className="text-sm text-muted-foreground">
                Everything runs locally for maximum speed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Free
              </div>
              <div className="font-semibold text-foreground mb-1">
                Forever
              </div>
              <div className="text-sm text-muted-foreground">
                No limits, no subscriptions
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Features Section - SEO Optimized */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose Diff Check for File Comparison?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Built with modern web technologies, Diff Check offers the most comprehensive ZIP file comparison experience available.
            </p>
          </header>
          
          <div className="space-y-24">
            {/* Feature 1: ZIP File Comparison */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 mr-4">
                    <PlusIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Advanced ZIP File Comparison</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Upload two ZIP files and get instant, detailed comparisons with syntax highlighting, 
                  line-by-line diffs, and intelligent binary file detection. Perfect for code reviews, 
                  version comparisons, and project analysis.
                </p>
                <ul className="space-y-3">
                  {[
                    "Side-by-side and unified diff views",
                    "Syntax highlighting for 50+ languages",
                    "Smart binary file detection",
                    "Interactive file tree navigation"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <CheckIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="glass-effect rounded-2xl p-8 border">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                        <PlusIcon className="w-6 h-6 text-green-500" />
                      </div>
                      <span className="text-green-600 font-mono text-sm">+ Added files</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-red-500 font-bold">−</span>
                      </div>
                      <span className="text-red-600 font-mono text-sm">− Removed files</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                        <ExclamationCircleIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <span className="text-blue-600 font-mono text-sm">~ Modified files</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Performance & Privacy */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row-reverse items-center gap-12"
            >
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-accent/10 mr-4">
                    <ShieldCheckIcon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Privacy-First & High Performance</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  All processing happens directly in your browser - no files are uploaded to servers. 
                  Enjoy blazing-fast comparisons with complete privacy and security for your sensitive code and data.
                </p>
                <ul className="space-y-3">
                  {[
                    "100% client-side processing",
                    "No file size limitations",
                    "Optimized algorithms for speed",
                    "Works completely offline"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <CheckIcon className="w-5 h-5 text-accent-foreground mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="glass-effect rounded-2xl p-8 border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <CpuChipIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">Fast</div>
                      <div className="text-sm text-muted-foreground">Optimized Processing</div>
                    </div>
                    <div className="text-center">
                      <ShieldCheckIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">Secure</div>
                      <div className="text-sm text-muted-foreground">Client-Side Only</div>
                    </div>
                    <div className="text-center">
                      <DevicePhoneMobileIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">Responsive</div>
                      <div className="text-sm text-muted-foreground">Any Device</div>
                    </div>
                    <div className="text-center">
                      <ClockIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground">History</div>
                      <div className="text-sm text-muted-foreground">Save Comparisons</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Developer-Focused */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 mr-4">
                    <CodeBracketIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Built for Developers</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  From code reviews to deployment comparisons, Diff Check understands your workflow. 
                  Advanced features like history management, export options, and mobile-responsive design 
                  make it the perfect tool for modern development teams.
                </p>
                <ul className="space-y-3">
                  {[
                    "Comprehensive comparison history",
                    "Export results in multiple formats",
                    "Mobile-first responsive design",
                    "Open source and customizable"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <CheckIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="glass-effect rounded-2xl p-8 border">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Supported Languages</span>
                      <span className="text-primary font-semibold">50+</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP", "Ruby"].map((lang) => (
                        <span key={lang} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Processing Speed</span>
                        <span className="text-green-500 font-semibold">Ultra Fast</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-[95%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <SparklesIcon className="w-16 h-16 text-primary mx-auto" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Start Comparing Your ZIP Files Today
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who trust Diff Check for their file comparison needs. 
            Fast, secure, and completely free - no registration required.
          </p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/compare">
                <Button
                  size="xl"
                  variant="gradient"
                  className="shadow-2xl"
                >
                  <SparklesIcon className="w-6 h-6" />
                  Compare Files Now
                  <ArrowRightIcon className="w-6 h-6" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://github.com/udaypankhaniya/diff-check"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="xl"
                  variant="outline"
                  className="glass-effect"
                >
                  <StarIcon className="w-6 h-6" />
                  View Source Code
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
