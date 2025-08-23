import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { db } from './firebase.js';
import { doc, setDoc } from "firebase/firestore";
import { encryptPassword } from './utils.js';

import EyeIconpng from "./assets/Icons/view.png";
import EyeSlashIconpng from "./assets/Icons/invisible.png";
import LockIconpng from "./assets/Icons/shield.png"

const EyeIcon = () => <img src={EyeIconpng} alt="Eye Icon" className="h-5 w-5" />;
const EyeSlashIcon = () => <img src={EyeSlashIconpng} alt="Eye Slash Icon" className="h-5 w-5" />;
const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;

export default function CreateMasterPasswordPage({ onMasterPasswordSet }) {
    const { currentUser } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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
                            <div className='relative'>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="master-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-10"
                                />
                                <button
                                    type='button'
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500'

                                >{isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Master Password</label>
                            <div className='relative'>
                                <input
                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500"
                                >
                                    {isConfirmPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
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