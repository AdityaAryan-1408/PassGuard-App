// src/SuccessModal.jsx

import React from 'react';

const SuccessModal = ({ isOpen, onClose, onNavigate, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
                <div className="text-slate-500 dark:text-slate-400 mb-6">
                    {children}
                </div>

                <button
                    onClick={onNavigate}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                >
                    View Saved Info
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;