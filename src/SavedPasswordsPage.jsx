
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { db } from './firebase.js';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { decryptPassword } from './utils.js';
import ConfirmationModal from './ConfirmationModal.jsx';

import EyeIconpng from "./assets/Icons/view.png"
import EyeSlashIconpng from "./assets/Icons/invisible.png"
import BinIconpng from "./assets/Icons/bin.png"

const BinIcon = () => <img src={BinIconpng} alt="Bin Icon" className="h-5 w-5" />;
const EyeIcon = () => <img src={EyeIconpng} alt="Eye Icon" className="h-5 w-5" />;
const EyeSlashIcon = () => <img src={EyeSlashIconpng} alt="Eye Slash Icon" className="h-5 w-5" />;


const maskUsername = (username) => {
    if (username.length <= 5) return username;
    return `${username.substring(0, 2)}***${username.substring(username.length - 2)}`;
};

export default function SavedPasswordsPage({ onBack, masterPassword }) {
    const { currentUser } = useAuth();
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revealedPasswordId, setRevealedPasswordId] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState(null);

    useEffect(() => {
        const fetchPasswords = async () => {
            if (currentUser) {
                const userPasswordsCollectionRef = collection(db, "users", currentUser.uid, "passwords");
                const data = await getDocs(userPasswordsCollectionRef);
                const passwordsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setPasswords(passwordsData);
                setLoading(false);
            }
        };
        fetchPasswords();
    }, [currentUser]);

    const handleReveal = (id) => {
        setRevealedPasswordId(revealedPasswordId === id ? null : id);
    };

    const openDeleteConfirm = (password) => {
        setPasswordToDelete(password);
        setIsConfirmModalOpen(true);
    };

    const handleDelete = async () => {
        if (!passwordToDelete) return;
        try {
            const passwordDocRef = doc(db, "users", currentUser.uid, "passwords", passwordToDelete.id);
            await deleteDoc(passwordDocRef);
            setPasswords(passwords.filter(p => p.id !== passwordToDelete.id));
        } catch (error) {
            console.error("Error deleting password: ", error);
            alert("Failed to delete password.");
        } finally {
            setIsConfirmModalOpen(false);
            setPasswordToDelete(null);
        }
    };

    return (
        <>
            <div className="w-full max-w-md bg-white dark:bg-slate-800/60 p-8 rounded-2xl shadow-xl dark:shadow-2xl shadow-slate-300 dark:shadow-red-900/20 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Vault</h2>
                    <button onClick={onBack} className="text-sm font-semibold text-red-600 dark:text-red-500 hover:underline">
                        &larr; Back
                    </button>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-slate-500 dark:text-slate-400">Loading vault...</p>
                    ) : passwords.length === 0 ? (
                        <p className="text-center text-slate-500 dark:text-slate-400">Your vault is empty. Save a password to see it here.</p>
                    ) : (
                        passwords.map(p => (
                            <div key={p.id} className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{p.service}</h3>
                                    {p.tag && (
                                        <span className="text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-full">
                                            {decryptPassword(p.tag, masterPassword)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {revealedPasswordId === p.id ? decryptPassword(p.username, masterPassword) : maskUsername(decryptPassword(p.username, masterPassword))}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
                                        {revealedPasswordId === p.id ? decryptPassword(p.password, masterPassword) : '••••••••••••'}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => openDeleteConfirm(p)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500">
                                            <BinIcon />
                                        </button>
                                        <button onClick={() => handleReveal(p.id)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                                            {revealedPasswordId === p.id ? <EyeSlashIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Password?"
            >
                <p>Are you sure you want to delete the password for <span className="font-bold">{passwordToDelete?.service}</span>?</p>
                <p>This action cannot be undone.</p>
            </ConfirmationModal>
        </>
    );
}