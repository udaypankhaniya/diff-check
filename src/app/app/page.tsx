"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import FileUploadZone from "@/components/modern/FileUploadZone";
import LoadingSpinner from "@/components/modern/LoadingSpinner";
import FileTreeSidebar from "@/components/diff/FileTreeSidebar";
import DiffSplitViewer from "@/components/diff/DiffSplitViewer";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useApp } from "@/context/AppContext";
import { setUploadedFile, processZipFiles, reset as resetZip } from "@/store/zipSlice";
import { generateDiff, reset as resetDiff } from "@/store/diffSlice";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Squares2X2Icon as CompareIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { addToast } = useApp();
    
    const { files, uploadedFiles, loading: zipLoading, progress, error: zipError } = useAppSelector(
        (state) => state.zip
    );
    const { result, loading: diffLoading, error: diffError } = useAppSelector(
        (state) => state.diff
    );

    // Auto-generate diff when both ZIP files are processed
    useEffect(() => {
        if (files.zip1 && files.zip2 && !result) {
            dispatch(generateDiff({ zip1: files.zip1, zip2: files.zip2 }));
        }
    }, [files.zip1, files.zip2, result, dispatch]);

    // Handle errors
    useEffect(() => {
        if (zipError) {
            addToast({ type: 'error', message: zipError });
        }
        if (diffError) {
            addToast({ type: 'error', message: diffError });
        }
    }, [zipError, diffError, addToast]);

    const handleCompare = async () => {
        if (!uploadedFiles.zip1 || !uploadedFiles.zip2) {
            addToast({ type: 'error', message: 'Please upload both ZIP files.' });
            return;
        }

        try {
            addToast({ type: 'info', message: 'Processing ZIP files...' });
            await dispatch(
                processZipFiles({ 
                    zip1: uploadedFiles.zip1, 
                    zip2: uploadedFiles.zip2 
                })
            ).unwrap();
            
            addToast({ 
                type: 'success', 
                message: 'ZIP files processed successfully!' 
            });
        } catch (error) {
            addToast({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'Failed to process ZIP files' 
            });
        }
    };

    const handleFileSelect = (key: 'zip1' | 'zip2') => (file: File | null) => {
        dispatch(setUploadedFile({ key, file }));
    };

    const handleReset = () => {
        dispatch(resetZip());
        dispatch(resetDiff());
        addToast({ type: 'info', message: 'Reset complete' });
    };

    const isLoading = zipLoading || diffLoading;
    const canCompare = uploadedFiles.zip1 && uploadedFiles.zip2 && !isLoading;
    const hasResult = result && files.zip1 && files.zip2;

    if (hasResult) {
        return (
            <div className="h-screen flex flex-col bg-background">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-6 glass-effect border-b z-10"
                >
                    <div className="flex items-center space-x-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="flex items-center space-x-3"
                        >
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CompareIcon className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Comparison Results
                            </h1>
                        </motion.div>
                        <div className="hidden md:flex items-center space-x-3 text-sm">
                            <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                {uploadedFiles.zip1?.name}
                            </div>
                            <span className="text-muted-foreground">vs</span>
                            <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                {uploadedFiles.zip2?.name}
                            </div>
                        </div>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="flex items-center gap-2 btn-secondary"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            New Comparison
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    <FileTreeSidebar />
                    <DiffSplitViewer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <motion.div
                        className="flex items-center justify-center mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <SparklesIcon className="w-12 h-12 text-primary mr-4" />
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                            Compare ZIP Files
                        </h1>
                    </motion.div>
                    <motion.p 
                        className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Upload two ZIP files to see a detailed comparison with visual diffs, 
                        interactive file trees, and comprehensive change summaries.
                    </motion.p>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="card glass-effect p-8 md:p-12 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-2xl" />
                        
                        <div className="relative z-10">
                            {isLoading ? (
                                <LoadingSpinner
                                    message={zipLoading ? "Processing ZIP files..." : "Generating diff..."}
                                    progress={progress}
                                />
                            ) : (
                                <>
                                    <motion.div 
                                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-12"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    >
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FileUploadZone
                                                label="First ZIP File"
                                                onFileSelect={handleFileSelect('zip1')}
                                                file={uploadedFiles.zip1}
                                                disabled={isLoading}
                                            />
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FileUploadZone
                                                label="Second ZIP File"
                                                onFileSelect={handleFileSelect('zip2')}
                                                file={uploadedFiles.zip2}
                                                disabled={isLoading}
                                            />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div 
                                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={handleCompare}
                                                disabled={!canCompare}
                                                size="lg"
                                                className="btn-primary px-8 py-3 text-lg font-semibold shadow-xl"
                                            >
                                                <CompareIcon className="w-5 h-5 mr-2" />
                                                Compare Files
                                            </Button>
                                        </motion.div>

                                        {(uploadedFiles.zip1 || uploadedFiles.zip2) && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    onClick={handleReset}
                                                    variant="outline"
                                                    size="lg"
                                                    className="btn-secondary px-6 py-3"
                                                >
                                                    <ArrowPathIcon className="w-5 h-5 mr-2" />
                                                    Reset
                                                </Button>
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    <motion.div 
                                        className="bg-accent/30 rounded-xl p-8 border border-accent-foreground/10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <h3 className="font-bold text-lg text-foreground mb-6 flex items-center">
                                            <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
                                            Powerful Features:
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { title: "Visual Diff", desc: "Color-coded line-by-line comparisons" },
                                                { title: "Binary Detection", desc: "Smart handling of binary files" },
                                                { title: "Directory Trees", desc: "Interactive file structure analysis" },
                                                { title: "Syntax Highlighting", desc: "Code-aware formatting" }
                                            ].map((feature, index) => (
                                                <motion.div
                                                    key={feature.title}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors"
                                                >
                                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-foreground text-sm mb-1">
                                                            {feature.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {feature.desc}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
