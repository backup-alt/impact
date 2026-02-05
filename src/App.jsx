import React, { useState, useEffect, useRef, useCallback } from 'react';
import AuthPage from './auth.jsx'; 
import { io } from "socket.io-client"; 
import { 
  Play, 
  Square, 
  Activity, 
  AlertTriangle, 
  Database, 
  Eye, 
  Terminal, 
  Shield, 
  Zap,
  Rocket,
  Github,
  ArrowLeft,
  Monitor,
  Server,
  Car,
  Truck,
  Bus
} from 'lucide-react';

// ==========================================
// CONFIGURATION & HELPERS
// ==========================================

// --- BACKEND CONNECTION ---
const SOCKET_URL = "http://localhost:5000";
const VIDEO_STREAM_URL = `${SOCKET_URL}/video_feed`;
const socket = io(SOCKET_URL);

// Keep existing configs for the Dashboard (Mock Data for other cams)
const VEHICLE_TYPES = ['Car', 'Bus', 'Truck', 'Bike', 'Auto'];
const CITIES = ['TN-01', 'TN-05', 'TN-07', 'KA-01', 'KL-02', 'DL-3C'];

const generateLicensePlate = () => {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${city}-${letters}-${numbers}`;
};

const FEEDS_CONFIG = [
  { id: '01', label: 'North Gate - Anna Salai', videoSrc: 'stream1.mp4' },
  { id: '02', label: 'East Wing - OMR', videoSrc: 'stream2.mp4' },
  { id: '03', label: 'South Junction - Guindy', videoSrc: 'stream3.mp4' },
  { id: '04', label: 'West Ramp - Mount Rd', videoSrc: 'stream4.mp4' },
  { id: '05', label: 'Central Plaza', videoSrc: 'stream5.mp4' },
];

// ==========================================
// SUB-COMPONENTS (Shared)
// ==========================================

const Navbar = ({ onLaunch, onNavigate, variant = 'landing', isScrolled, children }) => {
  const isDashboard = variant === 'dashboard';
  const isSolid = isDashboard || isScrolled;
  
  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${
      isSolid 
        ? 'bg-white/95 border-slate-200 shadow-sm' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 group cursor-pointer" 
          onClick={() => onNavigate('landing')}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            isSolid 
              ? 'bg-blue-600 shadow-blue-200 group-hover:bg-blue-700' 
              : 'bg-slate-900 shadow-blue-900/20 group-hover:bg-blue-600'
          }`}>
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <span className={`block text-lg font-black tracking-tight leading-none ${isSolid ? 'text-slate-900' : 'text-white'}`}>
              METRO<span className="text-blue-600">PULSE</span>
            </span>
            <span className={`text-xs font-mono tracking-widest uppercase ${isSolid ? 'text-slate-500' : 'text-slate-300'}`}>
              {isDashboard ? 'Professional Suite v2.0' : 'Traffic OS v2.0'}
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center space-x-1">
            {['Overview', 'Live Demo', 'Impact'].map((item) => (
              <button 
                key={item} 
                onClick={() => onNavigate(item)}
                className={`px-4 py-2 text-xs font-bold transition-all uppercase tracking-wide ${
                  isSolid 
                    ? 'text-blue-600 hover:text-slate-950'
                    : 'text-white hover:text-blue-400'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className={`h-6 w-[1px] ${isSolid ? 'bg-slate-200' : 'bg-white/20'}`} />

          {variant === 'landing' ? (
            <button 
              onClick={onLaunch}
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30 active:scale-95 group"
            >
              <Rocket className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              Launch Dashboard
            </button>
          ) : (
            children
          )}
        </div>
      </div>
    </nav>
  );
};

const StaticArrows = () => (
  <div className="absolute inset-0 pointer-events-none z-10">
    <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
      <defs>
        <marker id="arrowhead-static" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
        </marker>
      </defs>
      <path 
        d="M 250,500 C 350,250 550,250 450,450 C 400,550 550,580 660,520" 
        fill="none" 
        stroke="#475569" 
        strokeWidth="5" 
        strokeDasharray="12 8"
        markerEnd="url(#arrowhead-static)"
        opacity="0.9"
      />
    </svg>
  </div>
);

const Hero = ({ onLaunch }) => (
  <div 
    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[10%] w-[120%] h-[60vh] bg-white/80 rounded-t-[100%] shadow-[0_-50px_100px_-20px_rgba(37,99,235,0.15)] border-t border-blue-100/50 overflow-hidden"
    style={{ zIndex: 5 }}
  >
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/50 to-transparent opacity-50"></div>
    <div className="mt-[10vh] text-center max-w-4xl mx-auto px-6 flex flex-col items-center relative z-10">
       <div className="relative group cursor-pointer mb-8" onClick={() => window.open('https://github.com', '_blank')}>
         <div className="absolute -inset-8 bg-slate-200/50 rounded-full blur-2xl group-hover:bg-slate-300/50 transition-all duration-700"></div>
         <button className="relative flex flex-col items-center justify-center bg-white hover:bg-slate-50 text-slate-900 w-32 h-32 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 border-[6px] border-slate-50 ring-1 ring-slate-200">
           <div className="mb-2">
             <Github className="w-8 h-8 text-slate-700 group-hover:text-black transition-colors" />
           </div>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">View Us</span>
           <span className="text-xs font-black uppercase tracking-tight">On GitHub</span>
         </button>
       </div>
       <div className="space-y-6">
         <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
           Sense Of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Innovation, Versatility, And Possibility</span>
         </h2>
         <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
           More than just traffic control—we are a commitment to safer roads and cleaner air. 
           <br className="hidden md:block" />
           Empowering communities through responsible AI, reducing emissions, and prioritizing life with intelligent emergency corridors.
         </p>
       </div>
       <div className="mt-8 flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 rounded-full border border-slate-200 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 rounded-full border border-slate-200 text-xs font-bold text-slate-700">
            <Github size={14} />
            v2.0.4-beta
          </div>
       </div>
    </div>
  </div>
);

// ==========================================
// REVISED: SHIBUYA LIVE DEMO CONSOLE
// ==========================================

const LiveDemoConsole = React.forwardRef((props, ref) => {
  // STATE FOR REAL PYTHON DATA
  const [stats, setStats] = useState({ 
    vehicle_count: 0, 
    text: "Initializing...", 
    status: "WAITING", 
    density: 0,
    objects: { Car: 0, Bus: 0, Truck: 0, Bike: 0 } 
  });

  // --- SOCKET LISTENER ---
  useEffect(() => {
    // LISTEN TO 'vehicle_data' FROM PYTHON
    socket.on("vehicle_data", (data) => {
      setStats(data);
    });

    return () => socket.off("vehicle_data");
  }, []);

  // Helper for Status Color
  const getStatusStyle = (status) => {
    if (status.includes("CONGESTED")) return 'bg-red-600 border-red-400 text-white'; 
    if (status.includes("MODERATE")) return 'bg-yellow-500 border-yellow-300 text-white'; 
    return 'bg-emerald-500 border-emerald-300 text-white'; 
  };

  return (
    <div ref={ref} id="live-demo" className="w-full min-h-screen bg-slate-50 py-20 px-6 border-t border-slate-200 flex flex-col justify-center relative z-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Monitor className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Shibuya <span className="text-blue-600">Live Feed</span></h2>
              <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Connection: WebSocket Secure // Latency: ~120ms</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
          {/* VIDEO PLAYER COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-4 h-full">
            <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white ring-1 ring-slate-200 group">
              
              {/* TOP LEFT OVERLAYS */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-pulse w-fit">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  LIVE SHIBUYA CAM
                </div>
                
                {/* 🚦 TRAFFIC LEVEL BADGE (Clean, no text behind it) */}
                <div className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border backdrop-blur-md w-fit ${getStatusStyle(stats.status)}`}>
                   🚦 {stats.status} ({stats.density}%)
                </div>
              </div>
              
              {/* MJPEG STREAM IMG */}
              <img 
                src={VIDEO_STREAM_URL}
                className="w-full h-full object-cover" 
                alt="Connecting to Python Backend..."
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-end justify-between">
                      <div>
                          <h3 className="text-white font-bold text-lg">Camera 01: Shibuya Scramble</h3>
                          <p className="text-white/60 text-xs font-mono">YOLOv8 Inference Layer Active</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          {/* LIVE ANALYSIS COLUMN */}
          <div className="lg:col-span-4 h-full flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center shrink-0">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Server size={14} className="text-blue-500" />
                Live Analysis
              </span>
            </div>
            
            <div className="flex-1 p-6 flex flex-col gap-6 bg-slate-50/30 overflow-y-auto">
                {/* OBJECT COUNTS GRID */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detected Objects</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                         {/* CARS */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Car size={16}/></div>
                                 <span className="text-sm font-bold text-slate-700">Cars</span>
                             </div>
                             <span className="text-xl font-black text-slate-900">{stats.objects?.Car || 0}</span>
                        </div>

                         {/* BUSES */}
                         <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><Bus size={16}/></div>
                                 <span className="text-sm font-bold text-slate-700">Buses</span>
                             </div>
                             <span className="text-xl font-black text-slate-900">{stats.objects?.Bus || 0}</span>
                        </div>

                        {/* TRUCKS */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600"><Truck size={16}/></div>
                                 <span className="text-sm font-bold text-slate-700">Trucks</span>
                             </div>
                             <span className="text-xl font-black text-slate-900">{stats.objects?.Truck || 0}</span>
                        </div>
                    </div>
                </div>

                {/* 🛑 DELETED: LIVE OCR SECTION WAS HERE. IT IS NOW GONE. */}

            </div>
            
            <div className="p-3 border-t border-slate-100 bg-white text-[10px] text-slate-400 text-center font-mono uppercase tracking-widest shrink-0">
              Python Backend Connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ==========================================
// SHARED COMPONENT: TRAFFIC FEED (For Dashboard)
// ==========================================

const TrafficFeed = React.memo(({ id, label, isRunning, videoSrc, onVehicleDetect, onClick, className }) => {
  const [vehicleCount, setVehicleCount] = useState(0);

  // Note: The Dashboard still uses simulated data for the specific gates 
  // unless you want to replace all feeds with the Shibuya stream.
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      const detectionSpeed = 1500 + Math.random() * 2000; 
      intervalId = setInterval(() => {
        const type = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
        const confidence = (85 + Math.random() * 14).toFixed(1);
        onVehicleDetect({
          id: Date.now() + Math.random(),
          camId: id,
          plate: generateLicensePlate(),
          type: type,
          confidence: confidence,
          timestamp: new Date().toLocaleTimeString()
        });
        setVehicleCount(prev => {
          const change = Math.floor(Math.random() * 3) - 1; 
          let newCount = prev + change;
          return Math.max(0, Math.min(15, newCount));
        });
      }, detectionSpeed);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, id, onVehicleDetect]);

  return (
    <div 
      onClick={onClick}
      className={`relative bg-black rounded-xl overflow-hidden shadow-sm border border-slate-200 group shrink-0 cursor-pointer transition-all hover:ring-2 hover:ring-blue-500/50 ${className || 'w-full h-48'}`}
    >
      <video src={videoSrc} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" autoPlay loop muted playsInline />
      {isRunning && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-4 border border-dashed border-white/30 opacity-50"></div>
          {/* Crosshairs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-blue-500/50 rounded-full"></div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 flex justify-between items-center backdrop-blur-sm border-t border-slate-200">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Eye size={12} className="text-blue-600" /> {label}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${vehicleCount > 8 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>{vehicleCount > 8 ? 'CONGESTION' : 'FLOWING'}</span>
      </div>
    </div>
  );
});

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [view, setView] = useState('landing'); 
  const [systemState, setSystemState] = useState('offline'); 
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); 
  const scrollRef = useRef(null);
  const liveDemoRef = useRef(null); 
  
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 100);
    };
    if (view === 'landing') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const [scrollTarget, setScrollTarget] = useState(null);

  const handleNavigation = (destination) => {
    if (destination === 'Overview') {
      setView('landing');
      setScrollTarget('top');
    } else if (destination === 'Live Demo') {
      setView('landing');
      setScrollTarget('live-demo');
    } else if (destination === 'landing') {
      setView('landing');
    }
  };

  useEffect(() => {
    if (view === 'landing' && scrollTarget) {
      const timer = setTimeout(() => {
        if (scrollTarget === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (scrollTarget === 'live-demo' && liveDemoRef.current) {
          liveDemoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setScrollTarget(null); 
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view, scrollTarget]);

  const startDashboard = () => {
    setView('dashboard');
    setTimeout(() => {
       setSystemState('initializing');
       setTimeout(() => setSystemState('running'), 2000);
    }, 500);
  };

  const handleStop = () => {
    setSystemState('offline');
    setLogs([]);
    setEmergencyActive(false);
    setSelectedFeedId(null);
    handleNavigation('landing');
  };

  const handleVehicleDetect = useCallback((data) => {
    setLogs(prev => [data, ...prev].slice(0, 50)); 
  }, []);

  useEffect(() => {
    if (scrollRef.current && systemState === 'running') {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, systemState]);

  const selectedFeedData = selectedFeedId ? FEEDS_CONFIG.find(f => f.id === selectedFeedId) : null;

  // IF NO USER -> SHOW AUTH PAGE
  if (!user) {
      return <AuthPage onLogin={setUser} />;
  }

  // --- RENDER: LANDING PAGE ---
  if (view === 'landing') {
    return (
      <div className="min-h-screen relative text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden bg-slate-50">
        <div className="relative h-screen">
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('Banner.jpeg')` }}
          >
          </div>
          <Navbar onLaunch={startDashboard} onNavigate={handleNavigation} isScrolled={isScrolled} />
          <main className="relative z-10 h-full flex items-end justify-center overflow-hidden">
            <StaticArrows />
            <Hero onLaunch={startDashboard} />
          </main>
        </div>
        
        {/* REPLACED WITH LIVE FEED COMPONENT */}
        <LiveDemoConsole ref={liveDemoRef} />
      </div>
    );
  }

  // --- RENDER: DASHBOARD ---
  // (Dashboard code remains identical to your file, using FEEDS_CONFIG for simulated CCTV)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <Navbar variant="dashboard" onNavigate={handleNavigation} isScrolled={true}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <div className={`w-2 h-2 rounded-full ${systemState === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              {systemState === 'running' ? 'SYSTEM ACTIVE' : systemState === 'initializing' ? 'BOOTING...' : 'SYSTEM STANDBY'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded font-bold">SDG 11</span>
            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded font-bold">Urban Mobility</span>
          </div>
        </div>
      </Navbar>

      <main className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)] overflow-hidden mt-20">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm shrink-0">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={16} className="text-blue-600" /> Operations
            </h2>
            <div className="space-y-3">
              {systemState !== 'running' ? (
                <button 
                  disabled
                  className="w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 bg-slate-100 text-slate-400 cursor-wait opacity-70 border border-slate-200"
                >
                  {systemState === 'initializing' ? <Activity className="animate-spin" /> : <Play fill="currentColor" />}
                  {systemState === 'initializing' ? 'INITIALIZING NEURAL NET...' : 'LAUNCH AGENT'}
                </button>
              ) : (
                <button 
                  onClick={handleStop}
                  className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <Square fill="currentColor" size={18} />
                  TERMINATE SESSION
                </button>
              )}
              <button 
                onClick={() => setEmergencyActive(!emergencyActive)}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all border shadow-sm
                  ${emergencyActive 
                    ? 'bg-red-600 text-white border-red-600 animate-pulse shadow-red-200' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'}`}
              >
                <AlertTriangle size={18} />
                {emergencyActive ? 'EMERGENCY OVERRIDE ACTIVE' : 'SIMULATE EMERGENCY'}
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shrink-0 flex flex-col shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" /> System Metrics
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-slate-500">GPU Load</span><span className="text-blue-600">{systemState === 'running' ? '87%' : '0%'}</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: systemState === 'running' ? '87%' : '0%' }}/></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-slate-500">Network Latency</span><span className="text-emerald-600">{systemState === 'running' ? '12ms' : '-'}</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: systemState === 'running' ? '15%' : '0%' }}/></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold"><span className="text-slate-500">Model Confidence</span><span className="text-purple-600">{systemState === 'running' ? '98.2%' : '-'}</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: systemState === 'running' ? '98%' : '0%' }}/></div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Shield size={16} className="text-emerald-500" /><span>Security Protocols:</span><span className="text-emerald-600 font-bold">Active</span></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-full overflow-y-auto pb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {selectedFeedId && selectedFeedData ? (
            <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-blue-600" /> Active Feed Analysis
                </h2>
                <button 
                  onClick={() => setSelectedFeedId(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Grid
                </button>
              </div>
              <div className="flex-1 min-h-0 bg-black rounded-xl border-4 border-white shadow-lg overflow-hidden relative ring-1 ring-slate-200">
                 <TrafficFeed 
                   key={selectedFeedData.id} 
                   {...selectedFeedData} 
                   isRunning={systemState === 'running'} 
                   onVehicleDetect={handleVehicleDetect}
                   className="w-full h-full"
                 />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end shrink-0">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2"><Eye size={16} className="text-blue-600" /> Live Surveillance Matrix</h2>
                <span className={`text-xs flex items-center gap-1 font-bold ${systemState === 'running' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${systemState === 'running' ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                  {systemState === 'running' ? 'AI ANALYZING' : 'CCTV FEED LIVE'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-12">
                {FEEDS_CONFIG.slice(0, 4).map((feed) => (
                  <TrafficFeed 
                    key={feed.id} 
                    {...feed} 
                    isRunning={systemState === 'running'} 
                    onVehicleDetect={handleVehicleDetect} 
                    onClick={() => setSelectedFeedId(feed.id)}
                  />
                ))}
                <div className="col-span-2">
                  <TrafficFeed 
                    key={FEEDS_CONFIG[4].id} 
                    {...FEEDS_CONFIG[4]} 
                    isRunning={systemState === 'running'} 
                    onVehicleDetect={handleVehicleDetect}
                    onClick={() => setSelectedFeedId(FEEDS_CONFIG[4].id)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
           <div className="bg-white border border-slate-200 rounded-xl p-0 flex flex-col h-full overflow-hidden shadow-sm">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2"><Database size={16} className="text-blue-600" /> OCR Real-time</h2>
                <span className="text-xs font-mono text-slate-400 font-semibold">PORT: 8080</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 custom-scrollbar bg-slate-50/30" ref={scrollRef}>
                {systemState === 'offline' && <div className="text-slate-400 text-center mt-10 italic">Waiting for agent initialization...</div>}
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-slate-100 pb-2 animate-in slide-in-from-right fade-in duration-300">
                    <span className="text-slate-400 shrink-0 font-bold">[{log.timestamp.split(' ')[0]}]</span>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between w-full"><span className="text-slate-800 font-bold">{log.plate}</span><span className={`${log.confidence > 90 ? 'text-emerald-600' : 'text-yellow-600'} font-bold`}>{log.confidence}%</span></div>
                      <div className="flex justify-between text-slate-500 mt-1"><span className="text-[10px] uppercase bg-slate-100 px-1 rounded font-bold">{log.type}</span><span className="text-[10px] font-bold">CAM-{log.camId}</span></div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 text-xs font-mono text-slate-500 shrink-0">
                <Terminal size={14} /><span className="animate-pulse">_</span><span>Listening for data streams...</span>
             </div>
           </div>
        </div>
      </main>

      {emergencyActive && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center bg-red-500/10 animate-pulse">
           <div className="bg-white border-2 border-red-500 text-slate-800 px-8 py-6 rounded-2xl shadow-2xl shadow-red-500/20 flex flex-col items-center gap-4 pointer-events-auto backdrop-blur-md">
             <AlertTriangle size={48} className="animate-bounce text-red-600" />
             <h1 className="text-3xl font-black tracking-widest uppercase text-red-600">Emergency Corridor Mode</h1>
             <p className="text-slate-600 font-medium">Priority signals activated for Ambulance/Fire Support.</p>
             <div className="w-full h-12 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                 <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-red-600 tracking-widest z-10">CLEANING ROUTE A-7...</div>
                 <div className="h-full bg-red-100 w-full animate-progress-indeterminate"></div>
             </div>
             <button onClick={() => setEmergencyActive(false)} className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase text-sm tracking-wider shadow-lg shadow-red-200">Deactivate Override</button>
           </div>
        </div>
      )}
      <footer className="fixed bottom-4 right-6 text-xs text-slate-400 font-mono pointer-events-none z-50 font-bold">CORE.EXE © 2025 // IMPACT X 2.0</footer>
    </div>
  );
}