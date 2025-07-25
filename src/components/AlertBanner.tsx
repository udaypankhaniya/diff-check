import React from "react";

interface AlertBannerProps {
    message: string;
    onClose: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, onClose }) => (
    <div className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
        <span>{message}</span>
        <button
            className="ml-4 text-red-700 hover:text-red-900 font-bold"
            onClick={onClose}
            aria-label="Close alert"
        >
            ×
        </button>
    </div>
);

export default AlertBanner; 