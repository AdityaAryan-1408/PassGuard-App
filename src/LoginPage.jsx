import React, { useState } from 'react';
import { getAdditionalUserInfo } from 'firebase/auth';
import { db } from './firebase.js';
import { doc, setDoc } from "firebase/firestore";

import GoogleIconpng from "./assets/Icons/search.png"
import LockIconpng from "./assets/Icons/shield.png"
import EyeIconpng from "./assets/Icons/view.png"
import EyeSlashIconpng from "./assets/Icons/invisible.png"


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
    signOut
} from "firebase/auth";
import { auth } from './firebase';

const GoogleIcon = () => <img src={GoogleIconpng} alt="Google Icon" className="w-6 h-6" />;
const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;
const EyeIcon = () => <img src={EyeIconpng} alt="Eye Icon" className="h-5 w-5" />;
const EyeSlashIcon = () => <img src={EyeSlashIconpng} alt="Eye Slash Icon" className="h-5 w-5" />;

export default function LoginPage({ onClose, onLoginSuccess }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    setError("Passwords do not match.");
                    setLoading(false);
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                await sendEmailVerification(userCredential.user);
                alert("Account created! Please check your inbox to verify your email address.");
                await auth.signOut();

            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user.emailVerified) {
                    onLoginSuccess(password);
                }
                else {
                    setError("Please verify your email address before logging in. Check your inbox for a verification link.");
                    auth.signOut();
                }
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <div className="relative w-[448px] max-w-md bg-white dark:bg-slate-800/60 p-8 rounded-2xl shadow-xl dark:shadow-2xl shadow-slate-300 dark:shadow-red-900/20 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex justify-center mb-6">
                    <LockIcon className="h-8 w-8 text-red-600 dark:text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
                    {isSignUp ? 'Get started by creating a new account.' : 'Sign in to access your vault.'}
                </p>

                <form onSubmit={handleEmailLogin}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none pr-10"
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
                        {isSignUp && (
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                                <div className='relative'>
                                    <input
                                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none pr-10"
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
                        )}
                        {error && <p className="text-sm text-center text-red-500 dark:text-red-400">{error}</p>}
                        <div>
                            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/30 dark:shadow-red-600/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50">
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="mx-4 text-sm text-slate-500 dark:text-slate-400">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>

                <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors duration-300 disabled:opacity-50">
                    <GoogleIcon />
                    <span className="ml-3">Sign In with Google</span>
                </button>
                <div className="mt-6 text-center">
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-red-600 dark:text-red-500 hover:underline">
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
