import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Processing...", 
  progress 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-indigo-200 dark:border-blue-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-indigo-700 dark:text-blue-300">
          {message}
        </p>
        
        {progress !== undefined && (
          <div className="w-48 bg-indigo-200 dark:bg-blue-700 rounded-full h-2">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;