import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  Github, 
  LayoutDashboard, 
  Activity, 
  Camera, 
  Cpu, 
  Map, 
  LogOut,
  Menu,
  Bell,
  Search,
  Terminal,
  Image as ImageIcon
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
const firebaseConfig = {
  apiKey: "AIzaSyDjKquPaRU_5oQ0Lx9h5GtMXvhze7524-Q",
  authDomain: "core-exe.firebaseapp.com",
  projectId: "core-exe",
  storageBucket: "core-exe.firebasestorage.app",
  messagingSenderId: "1082669816189",
  appId: "1:1082669816189:web:5e91a810a1e823e9fb5414",
  measurementId: "G-KR2PM5L0WL"
};

// Check if the user has actually set up Firebase (simple check for placeholder)
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

// Initialize Firebase only if configured
let auth = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.log("Firebase init error:", error);
  }
}

/* --- COMPONENTS --- */

// 1. ANIMATED TRAFFIC VISUAL (ABSTRACT NEON)
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
                animation: `trafficFlow ${4 + Math.random() * 6}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
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

// 2. DASHBOARD (Professional Light Theme with Dark Accents)
const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      {/* Sidebar - Clean White */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col text-slate-600 shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">CORE.exe</h1>
            <p className="text-xs text-slate-500 font-medium">Traffic OS v2.0</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {['Dashboard', 'Live Map', 'Analytics', 'Signals', 'Emergency Override'].map((item, idx) => (
            <button key={item} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${idx === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              {idx === 0 ? <LayoutDashboard size={18} /> : 
               idx === 1 ? <Map size={18} /> : 
               idx === 2 ? <Activity size={18} /> :
               idx === 3 ? <Cpu size={18} /> :
               <Zap size={18} />}
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium w-full hover:bg-red-50 rounded-lg">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 md:hidden">
            <Menu className="text-slate-500" />
            <span className="font-bold text-slate-900">CORE.exe</span>
          </div>
          <div className="hidden md:flex relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search junctions, zones, or camera feeds..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-200 shadow-md">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Junctions', val: '124', icon: Map, color: 'blue' },
              { label: 'Congestion Reduced', val: '-18%', icon: Activity, color: 'emerald' },
              { label: 'AI Decisions/hr', val: '4.2k', icon: Cpu, color: 'purple' },
              { label: 'Camera Feeds', val: '312', icon: Camera, color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2.4%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stat.val}</h3>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Visual Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dark Theme Accent: The Map stays dark because it looks better */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden min-h-[400px] relative flex flex-col">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h3 className="font-bold text-white">Live Traffic Simulation</h3>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-slate-800 rounded-md text-slate-400 border border-slate-700">Map View</span>
                  <span className="px-2 py-1 bg-blue-600 text-white rounded-md shadow-lg shadow-blue-900/50">Satellite</span>
                </div>
              </div>
              <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
                   <div className="absolute inset-0 opacity-20" 
                        style={{ 
                          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', 
                          backgroundSize: '40px 40px' 
                        }}>
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center z-10">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <p className="text-blue-400 font-mono text-sm tracking-widest animate-pulse">CONNECTING TO NODES...</p>
                      </div>
                   </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">AI Insights</h3>
              <div className="space-y-4">
                {[
                  { title: 'Congestion Spike Predicted', time: '10 mins ago', desc: 'Main St & 4th Ave likely to clog in 15m.', type: 'warning' },
                  { title: 'Emergency Corridor Active', time: 'Just now', desc: 'Ambulance routed via Green Lane.', type: 'success' },
                  { title: 'Signal Optimized', time: '2 mins ago', desc: 'Extended Green light at Downtown Hub.', type: 'info' },
                ].map((notif, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200 group">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      notif.type === 'warning' ? 'bg-amber-500' :
                      notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.desc}</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-2 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// 3. MAIN APP (LOGIN PAGE)
export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); 

  // Styles for animation keyframes
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
        setTimeout(() => {
            setIsLoading(false);
            alert("⚠️ DEMO MODE NOTICE:\n\nSocial Login (Google/Github) requires a real Firebase Project.\n\nTo access the dashboard now, please use the Email Login button (it works without keys for demo purposes!).");
        }, 500);
        return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsLoggedIn(true);
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
         setIsLoggedIn(true);
         setUser({ email: email || 'demo@core.exe' });
         setIsLoading(false);
      }, 1500);
      return;
    }

    // REAL FIREBASE AUTH
    try {
      let result;
      if (isSignUp) {
        // Create new account
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in existing user
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      setUser(result.user);
      setIsLoggedIn(true);
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

  if (isLoggedIn) {
    return <Dashboard user={user || { email: email || 'admin@core.exe' }} onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center font-sans overflow-hidden relative">
      <style>{styles}</style>
      
      {/* 1. BACKGROUND VISUAL LAYER (Smart Traffic) */}
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

          {/* Clean Light Social Options - 2 Columns (Github & Google) */}
          <div className="mt-4 pt-5 border-t border-slate-200/60">
            <p className="text-center text-slate-400 text-[10px] mb-4 mt-1 uppercase tracking-wide font-medium">
              Secure Access • SDG11 Urban Protocol
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* GitHub */}
              <button 
                type="button"
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center h-10 rounded-lg bg-white/80 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all shadow-sm group"
              >
                <Github size={18} />
                <span className="text-xs font-medium ml-2">GitHub</span>
              </button>
              
              {/* Google */}
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
      
      {/* Decorative Bottom Text - Light on Dark */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-20 pointer-events-none">
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium">Impact X 2.0 • Sustainable Cities</p>
      </div>

    </div>
  );
}
