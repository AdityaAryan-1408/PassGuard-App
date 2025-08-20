
import React from 'react';
import LockIconpng from "./assets/Icons/shield.png"
import SunIconpng from "./assets/Icons/sunY.png"
import MoonIconpng from "./assets/Icons/moon_1.png"

const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;
const SunIcon = () => <img src={SunIconpng} alt="Sun Icon" className="h-6 w-6" />;
const MoonIcon = () => <img src={MoonIconpng} alt="Moon Icon" className="h-6 w-6" />;

export default function IntroScreen({ onEnter, theme, handleThemeToggle }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 text-center">
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleThemeToggle}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 ring-2 ring-offset-2 ring-red-500 ring-offset-slate-100 dark:ring-offset-slate-900 transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-slate-800/60 p-8 rounded-2xl shadow-xl">
                <div className="flex flex-col items-center justify-center mb-6">
                    <LockIcon className="h-16 w-16 text-red-600 dark:text-red-500" />
                    <h1 className="text-5xl font-bold text-slate-900 dark:text-white mt-4">PassGuard</h1>
                </div>

                <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                    Your secure, client-side password manager. Generate, analyze, and save your passwords with end-to-end encryption. You hold the key, always.
                </p>

                <button
                    onClick={onEnter}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Enter
                </button>
            </div>
        </div>
    );
}