
import React, { useState } from 'react';


import LockIconpng from "./assets/Icons/shield.png"


const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;
export default function UnlockPage({ onUnlock }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password) {
            onUnlock(password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800/60 p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <LockIcon className="h-8 w-8 text-red-600 dark:text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Vault Locked</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Enter your master password to continue.</p>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="master-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Master Password</label>
                            <input
                                type="password"
                                id="master-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                autoFocus
                                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none"
                            />
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                Unlock
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}