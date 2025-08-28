import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { auth } from "./firebase";
import LoginPage from "./LoginPage";
import SuccessModal from './SuccessModal.jsx';
import { db } from './firebase';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { encryptPassword } from './utils.js';
import { decryptPassword } from './utils.js';
import SavedPasswordsPage from "./SavedPasswordsPage.jsx";
import UnlockPage from "./UnlockPage.jsx";
import IntroScreen from "./IntroScreen.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import CreateMasterPasswordPage from "./CreateMasterPasswordPage.jsx";


// Icon Imports
import LockIconpng from "./assets/Icons/shield.png"
import SunIconpng from "./assets/Icons/sunY.png"
import MoonIconpng from "./assets/Icons/moon_1.png"
import SparklesIconpng from "./assets/Icons/clean.png"
import GlobeIconpng from "./assets/Icons/planet-earth.png"
import GoogleIconpng from "./assets/Icons/search.png"
import GithubIconpng from "./assets/Icons/github.png"
import FacebookIconpng from "./assets/Icons/facebook.png"
import InstagramIconpng from "./assets/Icons/instagram.png"
import MicrosoftIconpng from "./assets/Icons/microsoft.png"
import AppleIconpng from "./assets/Icons/apple-logo.png"
import AmazonIconpng from "./assets/Icons/social.png"
import LinkedInIconpng from "./assets/Icons/linkedin.png"
import TwitchIconpng from "./assets/Icons/twitch.png"
import TwitterIconpng from "./assets/Icons/twitter.png"
import SpotifyIconpng from "./assets/Icons/spotify.png"
import EyeIconpng from "./assets/Icons/view.png"
import EyeSlashIconpng from "./assets/Icons/invisible.png"
import ShieldCheckIconpng from "./assets/Icons/security.png"
import NetflixIconpng from "./assets/Icons/netflix.png"



const LoadingSpinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-200"></div>;

const LockIcon = ({ className }) => <img src={LockIconpng} alt="Lock Icon" className={className || "h-6 w-6 mr-2"} />;
const SunIcon = () => <img src={SunIconpng} alt="Sun Icon" className="h-6 w-6" />;
const MoonIcon = () => <img src={MoonIconpng} alt="Moon Icon" className="h-6 w-6" />;
const SparklesIcon = () => <img src={SparklesIconpng} alt="Sparkles Icon" className="h-5 w-5 mr-1" />;
const ShieldCheckIcon = () => <img src={ShieldCheckIconpng} alt="Shield Icon" className="h-5 w-5 mr-2" />;
const EyeIcon = () => <img src={EyeIconpng} alt="Eye Icon" className="h-5 w-5" />;
const EyeSlashIcon = () => <img src={EyeSlashIconpng} alt="Eye Slash Icon" className="h-5 w-5" />;
const GlobeIcon = () => <img src={GlobeIconpng} alt="Globe Icon" className="h-6 w-6" />;

const GoogleIcon = () => <img src={GoogleIconpng} alt="Google Icon" className="w-6 h-6" />;
const GithubIcon = () => <img src={GithubIconpng} alt="GitHub Icon" className="w-6 h-6" />;
const FacebookIcon = () => <img src={FacebookIconpng} alt="Facebook Icon" className="w-6 h-6" />;
const InstagramIcon = () => <img src={InstagramIconpng} alt="Instagram Icon" className="w-6 h-6" />;
const TwitterIcon = () => <img src={TwitterIconpng} alt="Twitter Icon" className="w-6 h-6" />;
const MicrosoftIcon = () => <img src={MicrosoftIconpng} alt="Microsoft Icon" className="w-6 h-6" />;
const TwitchIcon = () => <img src={TwitchIconpng} alt="Twitch Icon" className="w-6 h-6" />;
const SpotifyIcon = () => <img src={SpotifyIconpng} alt="Spotify Icon" className="w-6 h-6" />;
const AmazonIcon = () => <img src={AmazonIconpng} alt="Amazon Icon" className="w-6 h-6" />;
const AppleIcon = () => <img src={AppleIconpng} alt="Apple Icon" className="w-6 h-6" />;
const LinkedInIcon = () => <img src={LinkedInIconpng} alt="LinkedIn Icon" className="w-6 h-6" />;
const NetflixIcon = () => <img src={NetflixIconpng} alt="Netflix Icon" className="w-6 h-6" />;


const strengthStyles = {
  Strong: {
    container: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800",
    summaryText: "text-green-800 dark:text:green-200",
    suggestionText: "text-green-700 dark:text-green-300"
  },
  Medium: {
    container: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700",
    summaryText: "text-yellow-800 dark:text-yellow-200",
    suggestionText: "text-yellow-700 dark:text-yellow-300"
  },
  Weak: {
    container: "bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800",
    summaryText: "text-red-800 dark:text-red-200",
    suggestionText: "text-red-700 dark:text-red-300"
  }
};

const serviceIcons = {
  "google": <GoogleIcon />,
  "github": <GithubIcon />,
  "facebook": <FacebookIcon />,
  "instagram": <InstagramIcon />,
  "twitter": <TwitterIcon />,
  "netflix": <NetflixIcon />,
  "linkedin": <LinkedInIcon />,
  "microsoft": <MicrosoftIcon />,
  "twitch": <TwitchIcon />,
  "spotify": <SpotifyIcon />,
  "amazon": <AmazonIcon />,
  "apple": <AppleIcon />
}

const commonServices = [
  "Google",
  "GitHub",
  "Facebook",
  "Amazon",
  "Instagram",
  "Twitter",
  "Netflix",
  "LinkedIn",
  "Microsoft",
  "Apple",
  "Twitch",
  "Spotify"
];

const ServiceIconDisplay = ({ service }) => {
  const serviceKey = service.toLowerCase();
  const icon = serviceIcons[serviceKey];
  if (icon) return <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>;
  if (service) return <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><GlobeIcon /></div>;
  return null;
};

const DropdownServiceIcon = ({ service }) => {
  const serviceKey = service.toLowerCase();
  const icon = serviceIcons[serviceKey];
  if (icon) return icon;
  return <GlobeIcon />;
};

const Footer = () => (
  <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
    <div className="container mx-auto py-4 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Made with ❤️ by <a href="https://github.com/AdityaAryan-1408" target="_blank" rel="noopener noreferrer" className="font-semibold text-red-600 dark:text-red-500 hover:underline">Aditya Aryan</a>
      </p>
      <div className="flex space-x-4">
        <a href="https://github.com/AdityaAryan-1408" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <GithubIcon />
        </a>
        <a href="https://www.linkedin.com/in/aditya-aryan-7211b3241" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 transition-colors">
          <LinkedInIcon />
        </a>
      </div>
    </div>
  </footer>
);

const AuthModal = ({ isOpen, onClose, onSignInClick }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl shadow-slate-300 dark:shadow-red-900/20 border border-slate-200 dark:border-slate-700 p-8 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Authentication Required</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Please sign in to save your passwords securely across your devices.
        </p>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/30 dark:shadow-red-600/30 transform hover:scale-105 transition-all duration-300"
          onClick={onSignInClick}
        >
          Sign In
        </button>
        <button
          className="mt-4 text-sm text-slate-500 dark:text-slate-400 hover:underline"
          onClick={onClose}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};


function App() {
  const [showIntro, setShowIntro] = useState(true);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('passguard-theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('passguard-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const introSeen = sessionStorage.getItem('introSeen');
    if (introSeen) {
      setShowIntro(false);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('introSeen', 'true');
    setShowIntro(false);
  };

  return showIntro ?
    <IntroScreen onEnter={handleEnter} theme={theme} handleThemeToggle={handleThemeToggle} /> :
    <AppCore theme={theme} handleThemeToggle={handleThemeToggle} />;
}


function AppCore({ theme, handleThemeToggle }) {
  const { currentUser } = useAuth();
  const [masterPassword, setMasterPassword] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [userStatus, setUserStatus] = useState('loading');

  useEffect(() => {
    const checkUserSetup = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().masterPasswordIsSet) {
          setUserStatus('needsUnlock');
        } else {
          setUserStatus('needsSetup');
        }
      } else {
        setUserStatus('loggedOut');
        setIsVaultUnlocked(false);
        setMasterPassword('');
      }
    };
    checkUserSetup();
  }, [currentUser]);

  const handleUnlock = async (password, setError) => {
    if (!currentUser) {
      setError("User not found.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const encryptedCanary = docSnap.data().verification;
        if (!encryptedCanary) {
          setError("Cannot verify password. Account setup may be incomplete.");
          return;
        }

        const decryptedCanary = decryptPassword(encryptedCanary, password);

        if (decryptedCanary === 'test_value') {
          setMasterPassword(password);
          setIsVaultUnlocked(true);
          setUserStatus('unlocked');
        } else {
          setError("Incorrect Master Password");
        }
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      console.error("Unlock error:", error);
      setError("Incorrect Master Password");
    }
  };

  const handleLoginSuccess = (password) => {
    setMasterPassword(password);
    setIsVaultUnlocked(true);
  };

  if (userStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
  }

  if (userStatus === 'needsSetup') {
    return <CreateMasterPasswordPage onMasterPasswordSet={(password) => {
      setMasterPassword(password);
      setIsVaultUnlocked(true);
      setUserStatus('unlocked');
    }} />;
  }

  if (userStatus === 'needsUnlock') {
    return <UnlockPage onUnlock={handleUnlock} />;
  }

  return (
    <PassGuard
      theme={theme}
      handleThemeToggle={handleThemeToggle}
      masterPassword={masterPassword}
      isVaultUnlocked={isVaultUnlocked}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

function PassGuard({ theme, handleThemeToggle, masterPassword, isVaultUnlocked, onLoginSuccess }) {

  const { currentUser } = useAuth();
  const [view, setView] = useState('home');

  useEffect(() => {
    if (currentUser) {
      setView('home');
    }
  }, [currentUser]);


  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tag, setTag] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    setAnalysisResult(null);
  }, [password]);

  const filteredServices = commonServices.filter(s => s.toLowerCase().includes(service.toLowerCase()));


  const handleGeneratePassword = () => {
    setIsGenerating(true);

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const allChars = lower + upper + numbers + symbols;
    const length = 16;

    let passwordArray = [];

    passwordArray.push(lower[Math.floor(Math.random() * lower.length)]);
    passwordArray.push(upper[Math.floor(Math.random() * upper.length)]);
    passwordArray.push(numbers[Math.floor(Math.random() * numbers.length)]);
    passwordArray.push(symbols[Math.floor(Math.random() * symbols.length)]);

    for (let i = 4; i < length; i++) {
      passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]; // Swap
    }

    setPassword(passwordArray.join(''));
    setIsGenerating(false);
  };

  const handleAnalyzePassword = () => {
    if (!password) return;
    setIsAnalyzing(true);

    let score = 0;
    let suggestions = [];
    if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      suggestions.push("Make it longer (at least 8 characters).");
    }
    if (/[a-z]/.test(password)) score++; else suggestions.push("Add lowercase letters.");
    if (/[A-Z]/.test(password)) score++; else suggestions.push("Add uppercase letters.");
    if (/[0-9]/.test(password)) score++; else suggestions.push("Add numbers.");
    if (/[^a-zA-Z0-9]/.test(password)) score++; else suggestions.push("Add special characters.");


    let strength = "Weak";
    let summary = "Your Password seems Week.";


    if (score >= 5) {
      strength = "Strong";
      summary = "Your Password seems Strong, Make sure to remember it.";
    } else if (score >= 3) {
      strength = "Medium";
      summary = "Your password could be stronger.";
    }

    setAnalysisResult({
      strength: strength,
      summary: summary,
      suggestion: suggestions.length > 0 ? suggestions.join(' ') : "Looks good!"
    });

    setIsAnalyzing(false);
  };

  const handleSave = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!service || !username || !password) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      const encryptedPassword = encryptPassword(password, masterPassword);
      const passwordData = {
        service: service,
        username: encryptPassword(username, masterPassword),
        password: encryptedPassword,
        createdAt: new Date()
      };

      if (tag) {
        passwordData.tag = encryptPassword(tag, masterPassword);
      }

      const userPasswordsCollectionRef = collection(db, "users", currentUser.uid, "passwords");
      await addDoc(userPasswordsCollectionRef, passwordData);

      setIsSuccessModalOpen(true);

      setService('');
      setUsername('');
      setPassword('');
      setTag('');

    } catch (error) {
      console.error("Error saving password: ", error);
      alert("Failed to save password. Please try again.");
    }
  };

  return (
    <div>
      <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col transition-colors duration-300">
        <header className="py-4 px-6 md:px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors duration-300">
          <div className="container mx-auto flex justify-between items-center">
            <div
              className="relative"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            >
              <button
                onClick={() => setView('home')}
                className="flex items-center focus:outline-none"
              >
                <LockIcon className="h-6 w-6 mr-2 text-red-600 dark:text-red-500" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PassGuard</h1>
              </button>

              {isTooltipVisible && (
                <div className="absolute top-full mt-2 w-64 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg p-3 z-20">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    A secure, client-side password manager. Generate, analyze, and save your passwords with secure end-to-end encryption.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
                    Welcome, {currentUser.displayName || currentUser.email}
                  </span>
                  <button
                    onClick={() => setView('saved')}
                    className="text-sm font-semibold text-red-600 dark:text-red-500 hover:underline"
                  >
                    Saved Info
                  </button>
                  <button
                    onClick={() => auth.signOut()}
                    className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setView('login')}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg ...">
                  Login
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          {(() => {
            if (view === 'login' && !currentUser) {
              return <LoginPage
                onClose={() => setView('home')}
                onLoginSuccess={(password) => {
                  setMasterPassword(password);
                  setIsVaultUnlocked(true);
                  setView('home');
                }}
              />;
            }

            if (view === 'saved' && currentUser) {
              return <SavedPasswordsPage
                onBack={() => setView('home')}
                masterPassword={masterPassword}
              />;
            }

            return (
              <div className="w-[448px] max-w-md bg-white dark:bg-slate-800/60 p-8 rounded-2xl shadow-xl dark:shadow-2xl shadow-slate-300 dark:shadow-red-900/20 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Secure a Password</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Select or enter a service to begin.</p>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    <div className="relative" ref={dropdownRef}>
                      <label htmlFor="service" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Name</label>
                      <div className="relative">
                        <ServiceIconDisplay service={service} />
                        <input type="text" id="service" value={service} onChange={(e) => setService(e.target.value)} onFocus={() => setIsDropdownOpen(true)} placeholder="e.g., Google or my-website.com" autoComplete="off"
                          className={`w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none ${serviceIcons[service.toLowerCase()] || service ? 'pl-10' : 'pl-4'}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="tag" className="block mt-5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Account Name / Tag (Optional)
                        </label>
                        <input
                          type="text"
                          id="tag"
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          placeholder="e.g., Work Email, Main Account"
                          className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none"
                        />
                      </div>
                      {isDropdownOpen && (
                        <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10">
                          {filteredServices.map((s) => (
                            <div key={s} onClick={() => { setService(s); setIsDropdownOpen(false); }} className="flex items-center p-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer">
                              <div className="w-8 mr-3 flex-shrink-0 flex items-center justify-center">
                                <DropdownServiceIcon service={s} />
                              </div>
                              <span className="text-slate-800 dark:text-slate-200">{s}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {service && (
                      <>
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username or Email</label>
                          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., user@example.com"
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                          <div className="relative">
                            <input type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••"
                              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none pr-32"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <button
                                type="button"
                                onMouseDown={() => setIsPasswordVisible(true)}
                                onMouseUp={() => setIsPasswordVisible(false)}
                                onMouseLeave={() => setIsPasswordVisible(false)}
                                onTouchStart={() => setIsPasswordVisible(true)}
                                onTouchEnd={() => setIsPasswordVisible(false)}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full focus:outline-none"
                                aria-label="Show password"
                              >
                                {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                              </button>
                              <div className="h-5 border-l border-slate-300 dark:border-slate-600 mx-1"></div>
                              <button type="button" onClick={handleGeneratePassword} disabled={isGenerating} className="text-sm font-semibold text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 flex items-center disabled:opacity-50 disabled:cursor-not-allowed pr-1">
                                {isGenerating ? <LoadingSpinner /> : <><SparklesIcon /> Generate</>}
                              </button>
                            </div>
                          </div>
                        </div>

                        {password && (
                          <div className="flex flex-col items-center space-y-3 pt-2">
                            <button type="button" onClick={handleAnalyzePassword} disabled={isAnalyzing} className="w-full text-sm font-semibold text-slate-800 dark:text-white bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg py-2 px-4 flex items-center justify-center disabled:opacity-50 transition-colors duration-300">
                              {isAnalyzing ? <LoadingSpinner /> : "✨ Analyze Strength"}
                            </button>
                            {analysisResult && (
                              <div className={`w-full p-3 border rounded-lg text-sm ${strengthStyles[analysisResult.strength]?.container || strengthStyles.Medium.container}`}>
                                <p className={`font-semibold flex items-center ${strengthStyles[analysisResult.strength]?.summaryText || strengthStyles.Medium.summaryText}`}>
                                  <ShieldCheckIcon /> {analysisResult.summary}
                                </p>
                                <p className={`mt-1 ${strengthStyles[analysisResult.strength]?.suggestionText || strengthStyles.Medium.suggestionText}`}>
                                  {analysisResult.suggestion}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="pt-4">
                          <button
                            type="button"
                            onClick={handleSave}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/30 dark:shadow-red-600/30 transform hover:scale-105 transition-all duration-300"
                          >
                            Save Securely
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </div>
            );
          })()}
        </main>
        <Footer />
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignInClick={() => {
          setIsAuthModalOpen(false);
          setView('login');
        }}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onNavigate={() => {
          setIsSuccessModalOpen(false);
          setView('saved');
        }}
        title="Success!"
      >
        <p>Your password was saved securely.</p>
      </SuccessModal>
    </div>
  );
}

export default App;
