import React, { useRef } from "react";

interface FileUploadAreaProps {
    label: string;
    onFileSelect: (file: File | null) => void;
    file: File | null;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ label, onFileSelect, file }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 transition-colors min-h-[120px]"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            tabIndex={0}
            role="button"
            aria-label={label}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={handleChange}
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium mb-2">{label}</span>
            {file ? (
                <span className="text-green-600 dark:text-green-400 text-sm truncate max-w-[90%]">{file.name}</span>
            ) : (
                <span className="text-gray-400 text-xs">Drag & drop or click to select ZIP</span>
            )}
        </div>
    );
};

export default FileUploadArea; 