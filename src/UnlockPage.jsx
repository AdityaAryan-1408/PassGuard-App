
import React, { useState } from 'react';

import EyeIconpng from "./assets/Icons/view.png"
import EyeSlashIconpng from "./assets/Icons/invisible.png"
import LockIconpng from "./assets/Icons/shield.png"



const EyeIcon = () => <img src={EyeIconpng} alt="Eye Icon" className="h-5 w-5" />;
const EyeSlashIcon = () => <img src={EyeSlashIconpng} alt="Eye Slash Icon" className="h-5 w-5" />;
const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;


export default function UnlockPage({ onUnlock }) {
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (password) {
            await onUnlock(password, setError);
        }
        setLoading(false);
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
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="master-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    autoFocus
                                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400"
                                    aria-label="Toggle password visibility"
                                >
                                    {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        <div className="h-5">
                            {error && <p className="text-sm text-center text-red-500 dark:text-red-400">{error}</p>}
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                {loading ? 'Unlocking...' : 'Unlock'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}