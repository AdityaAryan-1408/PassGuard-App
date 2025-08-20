import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
                <div className="text-slate-500 dark:text-slate-400 mb-6">
                    {children}
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;