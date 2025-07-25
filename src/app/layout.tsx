"use client";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/store';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/ui/toast';
import SettingsModal from '@/components/modals/SettingsModal';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Diff Check - Professional ZIP File Comparison Tool | Free & Privacy-Focused</title>
        <meta
          name="description"
          content="Compare ZIP files instantly with beautiful visual diffs. Professional tool for developers featuring syntax highlighting, file tree navigation, and complete privacy. 100% client-side processing."
        />
        <meta name="keywords" content="zip file comparison, diff tool, file compare, visual diff, code comparison, developer tools, open source, privacy-focused, client-side processing" />
        <meta name="author" content="Diff Check" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Diff Check - Professional ZIP File Comparison Tool" />
        <meta property="og:description" content="Compare ZIP files instantly with beautiful visual diffs. Professional tool for developers featuring syntax highlighting and complete privacy." />
        <meta property="og:url" content="https://diffcheck.com" />
        <meta property="og:site_name" content="Diff Check" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Diff Check - Professional ZIP File Comparison Tool" />
        <meta name="twitter:description" content="Compare ZIP files instantly with beautiful visual diffs. Professional tool for developers featuring syntax highlighting and complete privacy." />

        {/* Additional SEO */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="application-name" content="Diff Check" />
        <meta name="apple-mobile-web-app-title" content="Diff Check" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://diffcheck.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Diff Check",
              "description": "Professional ZIP file comparison tool with visual diffs, syntax highlighting, and complete privacy protection",
              "url": "https://diffcheck.com",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Diff Check"
              },
              "featureList": [
                "ZIP file comparison",
                "Visual diff viewer",
                "Syntax highlighting",
                "File tree navigation",
                "Privacy-focused processing",
                "Mobile responsive design"
              ]
            })
          }}
        />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <ToastContainer />
              <SettingsModal />
            </AppProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
