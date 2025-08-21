import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { db } from './firebase.js';
import { doc, setDoc } from "firebase/firestore";
import { encryptPassword } from './utils.js';

import LockIconpng from "./assets/Icons/shield.png"
const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;

export default function CreateMasterPasswordPage({ onMasterPasswordSet }) {
    const { currentUser } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await setDoc(doc(db, "users", currentUser.uid), {
                masterPasswordIsSet: true,
                verification: encryptPassword('test_value', password)
            });
            onMasterPasswordSet(password);
        } catch (err) {
            setError("Failed to set master password. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800/60 p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <LockIcon className="h-8 w-8 text-red-600 dark:text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Create Your Master Password</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">This password will be used to encrypt and decrypt your vault. It cannot be recovered.</p>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="master-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Master Password</label>
                            <input
                                type="password"
                                id="master-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Master Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3"
                            />
                        </div>
                        {error && <p className="text-sm text-center text-red-500 dark:text-red-400">{error}</p>}
                        <div>
                            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg">
                                {loading ? 'Saving...' : 'Set Master Password & Continue'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}