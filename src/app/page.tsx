"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusIcon, 
  StarIcon, 
  EyeIcon, 
  ExclamationCircleIcon, 
  CodeBracketIcon, 
  ArrowRightIcon,
  SparklesIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import GitHubStats from "@/components/diff/GitHubStats";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <CpuChipIcon className="w-8 h-8 text-primary" />,
    title: "High Performance",
    desc: "Optimized algorithms for fast processing of large ZIP files with real-time progress tracking.",
  },
  {
    icon: <StarIcon className="w-8 h-8 text-warning" />,
    title: "Live GitHub Stats",
    desc: "See real-time stars, forks, and watchers. Join our growing community of developers.",
  },
  {
    icon: <PlusIcon className="w-8 h-8 text-success" />,
    title: "Modern ZIP Diff",
    desc: "Upload two ZIPs, get a beautiful, color-coded diff with interactive file tree and unified view.",
  },
  {
    icon: <ExclamationCircleIcon className="w-8 h-8 text-primary" />,
    title: "Smart Detection",
    desc: "Intelligent binary file detection with syntax highlighting for code files.",
  },
  {
    icon: <DevicePhoneMobileIcon className="w-8 h-8 text-accent-foreground" />,
    title: "Mobile-First Design",
    desc: "Fully responsive, touch-friendly interface that works beautifully on any device size.",
  },
  {
    icon: <CodeBracketIcon className="w-8 h-8 text-primary" />,
    title: "Open Source",
    desc: "MIT licensed, transparent, and community-driven. Contributions and feedback welcome!",
  },
];

const stats = [
  { value: "100%", label: "Client-Side", desc: "No data leaves your browser" },
  { value: "0ms", label: "Server Latency", desc: "Everything runs locally" },
  { value: "∞", label: "File Size", desc: "No upload size limits" },
];

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
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
              <SparklesIcon className="relative w-16 h-16 text-primary" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Diff Check
              </span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            Professional ZIP file comparison with beautiful visual diffs. 
            <br className="hidden md:block" />
            <span className="font-semibold text-foreground">Open source, privacy-focused, and built for developers.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/app">
                <Button
                  size="xl"
                  variant="gradient"
                  className="shadow-2xl"
                >
                  <SparklesIcon className="w-6 h-6" />
                  Start Comparing
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
                  className="glass-effect shadow-xl"
                >
                  <StarIcon className="w-6 h-6" />
                  View Source
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.desc}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* GitHub Stats Section */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <GitHubStats />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose <span className="text-primary">Diff Check?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built with modern web technologies and designed for professional developers who demand the best tools.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              viewport={{ once: true }}
              className="card glass-effect p-8 text-center group relative overflow-hidden"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div 
                className="relative z-10"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-3 rounded-xl bg-card border border-border/50 group-hover:border-primary/30 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
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
            Ready to Compare Your Files?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who trust Diff Check for their file comparison needs. 
            Start comparing files in seconds, completely free.
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
              <Link href="/app">
                <Button
                  size="xl"
                  variant="gradient"
                  className="shadow-2xl"
                >
                  <SparklesIcon className="w-6 h-6" />
                  Get Started Now
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
                  Star on GitHub
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
