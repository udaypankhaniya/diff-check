import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn, formatFileSize } from "@/lib/utils";

interface FileUploadZoneProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  disabled?: boolean;
  className?: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  label, 
  onFileSelect, 
  file, 
  disabled = false,
  className 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
        onFileSelect(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <motion.div
      className={cn("relative group", className)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div
        className={cn(
          "file-upload-zone relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer min-h-[140px] flex items-center justify-center",
          "bg-gradient-to-br from-card to-muted/30",
          isDragOver && !disabled && "border-primary bg-accent scale-105 shadow-lg",
          !isDragOver && !disabled && "border-border hover:border-primary/50 hover:bg-accent/20",
          file && "border-success bg-success/5 shadow-md",
          disabled && "opacity-50 cursor-not-allowed border-muted"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center space-x-4 w-full"
            >
              <div className="flex-shrink-0">
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-2 rounded-lg bg-success/10"
                >
                  <DocumentIcon className="w-8 h-8 text-success" />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <motion.button
                onClick={handleRemove}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-destructive/10 transition-colors group/remove"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="w-4 h-4 text-muted-foreground group-hover/remove:text-destructive transition-colors" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-center"
            >
              <motion.div
                animate={isDragOver ? { 
                  scale: 1.2, 
                  rotate: 5,
                  y: -5
                } : { 
                  scale: 1, 
                  rotate: 0,
                  y: 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CloudArrowUpIcon className="relative mx-auto w-12 h-12 text-primary mb-4" />
              </motion.div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {label}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                Drag & drop your ZIP file here
              </p>
              <p className="text-xs text-muted-foreground">
                or <span className="text-primary font-medium">click to browse</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated gradient border effect */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none",
            "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
            isDragOver && !disabled && "opacity-100"
          )}
          animate={isDragOver ? {
            background: [
              "linear-gradient(90deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1))",
              "linear-gradient(90deg, hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))",
              "linear-gradient(90deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1))"
            ]
          } : {}}
          transition={{ repeat: isDragOver ? Infinity : 0, duration: 2 }}
        />

        {/* Success checkmark overlay */}
        {file && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 right-3 w-6 h-6 bg-success rounded-full flex items-center justify-center"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-3 h-3 text-success-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FileUploadZone;
