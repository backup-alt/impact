import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Github, 
  Terminal,
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

/* --- FIREBASE CONFIGURATION --- */
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "core-exe.firebaseapp.com",
  projectId: "core-exe",
  storageBucket: "core-exe.firebasestorage.app",
  messagingSenderId: "1082669816189",
  appId: "1:1082669816189:web:5e91a810a1e823e9fb5414",
  measurementId: "G-KR2PM5L0WL"
};

const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let auth = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.log("Firebase init error:", error);
  }
}

/* --- VISUAL COMPONENT --- */
const TrafficVisual = React.memo(() => {
  const colors = [
    'bg-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    'bg-blue-400/80 shadow-[0_0_15px_rgba(96,165,250,0.5)]',
    'bg-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    'bg-purple-400/80 shadow-[0_0_15px_rgba(192,132,252,0.5)]',
    'bg-rose-400/80 shadow-[0_0_15px_rgba(251,113,133,0.5)]'
  ];

  return (
    <div className="fixed inset-0 bg-[#0B1120] overflow-hidden z-0">
      {/* Classy Grid Background */}
      <div className="absolute inset-0" 
           style={{ 
             opacity: 0.2,
             backgroundImage: `
               radial-gradient(circle at center, rgba(56, 189, 248, 0.8) 0px, transparent 1.5px),
               linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px), 
               linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
             `, 
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
           }}>
      </div>
      
      {/* Moving "Traffic" Particles - Abstract Flow */}
      <div className="absolute inset-0 perspective-1000">
        {[...Array(35)].map((_, i) => {
           const randomColorClass = colors[Math.floor(Math.random() * colors.length)];
           return (
            <div 
              key={`v-${i}`}
              className={`absolute rounded-full ${randomColorClass}`}
              style={{
                width: Math.random() > 0.5 ? '1px' : '2px',
                height: Math.random() > 0.5 ? '80px' : '140px',
                left: `${Math.random() * 100}%`,
                top: '-150px',
                opacity: 0.6,
                animation: `trafficFlow ${4 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 1}s`
              }}
            />
          );
        })}
         {[...Array(35)].map((_, i) => {
           const randomColorClass = colors[Math.floor(Math.random() * colors.length)];
           return (
            <div 
              key={`h-${i}`}
              className={`absolute rounded-full ${randomColorClass}`}
              style={{
                height: Math.random() > 0.5 ? '1px' : '2px',
                width: Math.random() > 0.5 ? '80px' : '140px',
                left: '-150px',
                top: `${Math.random() * 100}%`,
                opacity: 0.6,
                animation: `trafficFlowHorizontal ${5 + Math.random() * 7}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
           );
        })}
      </div>
    </div>
  );
});

// 3. MAIN AUTH PAGE COMPONENT
export default function AuthPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); 

  const styles = `
    @keyframes trafficFlow {
      0% { transform: translateY(-100vh); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
    @keyframes trafficFlowHorizontal {
      0% { transform: translateX(-100vw); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateX(100vw); opacity: 0; }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  // --- AUTH HANDLERS ---
  
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    if (!isFirebaseConfigured || !auth) {
        // DEMO BYPASS
        setTimeout(() => {
            setIsLoading(false);
            onLogin({ email: "demo@user.com", displayName: "Demo User" });
        }, 800);
        return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error) {
      console.error(error);
      alert("Login Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(new GoogleAuthProvider());
  const handleGithubLogin = () => handleSocialLogin(new GithubAuthProvider());

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // DEMO MODE LOGIN (No keys needed)
    if (!auth || !isFirebaseConfigured) {
      setTimeout(() => {
         setIsLoading(false);
         // Pass user data up to parent to trigger redirect
         onLogin({ email: email || 'demo@core.exe' });
      }, 1500);
      return;
    }

    // REAL FIREBASE AUTH
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(result.user);
    } catch (error) {
      console.error(error);
      const action = isSignUp ? "Registration" : "Login";
      alert(`${action} Failed: ` + error.message);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address in the field above to reset your password.");
      return;
    }

    if (!auth || !isFirebaseConfigured) {
      alert("Demo Mode: Password reset simulation sent to " + email);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error(error);
      alert("Error sending reset email: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center font-sans overflow-hidden relative">
      <style>{styles}</style>
      
      {/* 1. BACKGROUND VISUAL LAYER */}
      <TrafficVisual />
      
      {/* 2. CENTERED LOGIN CARD */}
      <div className="relative z-20 w-full max-w-sm p-4">
        
        {/* BRIGHTER Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-blue-400/50 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        {/* Frosted Porcelain Card */}
        <div className="bg-slate-50/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
          
          {/* Logo Placeholder Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white/50 rounded-2xl border border-slate-200 flex items-center justify-center mb-3 shadow-sm group cursor-pointer hover:border-blue-400 transition-all transform hover:scale-105">
                 <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <Terminal className="text-white w-5 h-5" />
                 </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isSignUp ? 'Create Account' : 'CORE.exe'}
            </h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
              {isSignUp ? 'Join the Metro Pulse Network' : 'Metro Pulse System'}
            </p>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="space-y-3">
              <div className="group">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors h-4 w-4" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" 
                    placeholder="Work Email"
                    required
                  />
                </div>
              </div>
              
              <div className="group">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors h-4 w-4" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" 
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <a 
                href="#" 
                onClick={handleResetPassword}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Recover Password?
              </a>
            </div>

            <button 
              type="submit" 
              className={`w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-1px] active:scale-[0.98] mt-2 text-sm ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? (
                    <>Sign Up <ArrowRight size={16} /></>
                  ) : (
                    <>Sign In to Dashboard <ArrowRight size={16} /></>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Social Options */}
          <div className="mt-4 pt-5 border-t border-slate-200/60">
            <p className="text-center text-slate-400 text-[10px] mb-4 mt-1 uppercase tracking-wide font-medium">
              Secure Access • SDG11 Urban Protocol
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center h-10 rounded-lg bg-white/80 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all shadow-sm group"
              >
                <Github size={18} />
                <span className="text-xs font-medium ml-2">GitHub</span>
              </button>
              
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center h-10 rounded-lg bg-white/80 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all shadow-sm group"
              >
                 <svg className="w-4 h-4" viewBox="0 0 24 24">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 <span className="text-xs font-medium ml-2 text-slate-600">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 text-center z-20 pointer-events-none">
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium">Impact X 2.0 • Sustainable Cities</p>
      </div>
    </div>
  );
}