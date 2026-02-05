import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Square, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  Database, 
  Eye, 
  Terminal, 
  Shield, 
  Zap
} from 'lucide-react';

// --- Helper: Random Data Generators ---
const VEHICLE_TYPES = ['Car', 'Bus', 'Truck', 'Bike', 'Auto'];
const CITIES = ['TN-01', 'TN-05', 'TN-07', 'KA-01', 'KL-02', 'DL-3C'];

const generateLicensePlate = () => {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${city}-${letters}-${numbers}`;
};

// --- Constant Configuration ---
// Mapped to video files in the root folder as requested
const FEEDS_CONFIG = [
  { id: '01', label: 'North Gate - Anna Salai', videoSrc: 'stream1.mp4' },
  { id: '02', label: 'East Wing - OMR', videoSrc: 'stream2.mp4' },
  { id: '03', label: 'South Junction - Guindy', videoSrc: 'stream3.mp4' },
  { id: '04', label: 'West Ramp - Mount Rd', videoSrc: 'stream4.mp4' },
  { id: '05', label: 'Central Plaza', videoSrc: 'stream5.mp4' },
];

// --- Component: Video Traffic Feed ---
const TrafficFeed = React.memo(({ id, label, isRunning, videoSrc, onVehicleDetect }) => {
  const [vehicleCount, setVehicleCount] = useState(0);
  
  // --- Data Simulation Effect ---
  // Since we are using video files, we simulate the AI detection events 
  // to keep the data logs flowing while the video plays.
  useEffect(() => {
    let intervalId;

    if (isRunning) {
      // Create a slightly randomized interval for each camera to make logs look natural
      const detectionSpeed = 1500 + Math.random() * 2000; 

      intervalId = setInterval(() => {
        // 1. Trigger a "Detection" event
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

        // 2. Update the "Active Objects" count to simulate real-time counting
        setVehicleCount(prev => {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          let newCount = prev + change;
          if (newCount < 0) newCount = 0;
          if (newCount > 15) newCount = 15;
          return newCount;
        });

      }, detectionSpeed);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, id, onVehicleDetect]);

  return (
    <div className="relative w-full h-48 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg group shrink-0">
      
      {/* Video Player */}
      <video 
        src={videoSrc}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* AI Processing Overlay (Visible only when Running) */}
      {isRunning && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Scan line effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
          {/* Bounding box grid hint */}
          <div className="absolute inset-4 border border-dashed border-cyan-500/30 opacity-50"></div>
          {/* Corner markers */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex justify-between items-center backdrop-blur-sm">
        <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
          <Eye size={12} /> {label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${vehicleCount > 8 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {vehicleCount > 8 ? 'CONGESTION' : 'FLOWING'}
        </span>
      </div>
    </div>
  );
});

// --- Main App Component ---
export default function MetroPulseDashboard() {
  const [systemState, setSystemState] = useState('offline'); // offline, initializing, running
  const [logs, setLogs] = useState([]);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const scrollRef = useRef(null);

  const handleLaunch = () => {
    setSystemState('initializing');
    setTimeout(() => {
      setSystemState('running');
    }, 2000);
  };

  const handleStop = () => {
    setSystemState('offline');
    setLogs([]);
    setEmergencyActive(false);
  };

  // Wrapped in useCallback to prevent new function creation on every render
  const handleVehicleDetect = useCallback((data) => {
    setLogs(prev => [data, ...prev].slice(0, 50)); // Keep last 50 logs
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current && systemState === 'running') {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, systemState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">METRO PULSE <span className="text-cyan-400">AI</span></h1>
            <p className="text-xs text-slate-400 font-mono tracking-wider">CORE.EXE // LAUNCH AGENT V2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${systemState === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-300">
              {systemState === 'running' ? 'SYSTEM ACTIVE' : systemState === 'initializing' ? 'BOOTING...' : 'SYSTEM STANDBY'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">SDG 11</span>
            <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">Urban Mobility</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Enforced Grid Height with Scrollable Columns */}
      <main className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column: Controls & Metrics (3 Cols) - Scrollable */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          {/* Control Panel */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-sm shrink-0">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={16} /> Operations
            </h2>
            
            <div className="space-y-3">
              {systemState !== 'running' ? (
                <button 
                  onClick={handleLaunch}
                  disabled={systemState === 'initializing'}
                  className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all 
                    ${systemState === 'initializing' 
                      ? 'bg-slate-800 text-slate-500 cursor-wait' 
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95'}`}
                >
                  {systemState === 'initializing' ? <Activity className="animate-spin" /> : <Play fill="currentColor" />}
                  {systemState === 'initializing' ? 'INITIALIZING NEURAL NET...' : 'LAUNCH AGENT'}
                </button>
              ) : (
                <button 
                  onClick={handleStop}
                  className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Square fill="currentColor" size={18} />
                  TERMINATE SESSION
                </button>
              )}

              <button 
                onClick={() => setEmergencyActive(!emergencyActive)}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all border
                  ${emergencyActive 
                    ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-red-500/50 shadow-lg' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'}`}
              >
                <AlertTriangle size={18} />
                {emergencyActive ? 'EMERGENCY OVERRIDE ACTIVE' : 'SIMULATE EMERGENCY'}
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shrink-0 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={16} /> System Metrics
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">GPU Load</span>
                  <span className="text-cyan-400">{systemState === 'running' ? '87%' : '0%'}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-1000" 
                    style={{ width: systemState === 'running' ? '87%' : '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Network Latency</span>
                  <span className="text-emerald-400">{systemState === 'running' ? '12ms' : '-'}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: systemState === 'running' ? '15%' : '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Model Confidence</span>
                  <span className="text-purple-400">{systemState === 'running' ? '98.2%' : '-'}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-1000" 
                    style={{ width: systemState === 'running' ? '98%' : '0%' }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
               <div className="flex items-center gap-3 text-slate-400 text-sm">
                 <Shield size={16} />
                 <span>Security Protocols:</span>
                 <span className="text-emerald-400">Active</span>
               </div>
            </div>
          </div>
        </div>

        {/* Center Column: Video Grid (6 Cols) - Scrollable */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-full overflow-y-auto pb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* Header for grid */}
          <div className="flex justify-between items-end shrink-0">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Eye size={16} /> Live Surveillance Matrix
            </h2>
            <span className={`text-xs flex items-center gap-1 ${systemState === 'running' ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
               <span className={`w-2 h-2 rounded-full ${systemState === 'running' ? 'bg-red-500' : 'bg-slate-500'}`}></span>
               {systemState === 'running' ? 'AI ANALYZING' : 'CCTV FEED LIVE'}
            </span>
          </div>

          {/* 5-Stream Grid Layout */}
          <div className="grid grid-cols-2 gap-4 pb-12">
            {/* First 4 regular size */}
            {FEEDS_CONFIG.slice(0, 4).map((feed) => (
              <TrafficFeed 
                key={feed.id} 
                {...feed} 
                isRunning={systemState === 'running'} 
                onVehicleDetect={handleVehicleDetect}
              />
            ))}
            
            {/* 5th Feed - Full Width */}
            <div className="col-span-2">
               <TrafficFeed 
                  key={FEEDS_CONFIG[4].id} 
                  {...FEEDS_CONFIG[4]} 
                  isRunning={systemState === 'running'} 
                  onVehicleDetect={handleVehicleDetect}
                />
            </div>
          </div>
        </div>

        {/* Right Column: OCR & Logs (3 Cols) - Fixed Height */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
           
           {/* OCR Live Stream */}
           <div className="bg-slate-950 border border-slate-800 rounded-xl p-0 flex flex-col h-full overflow-hidden shadow-xl">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Database size={16} /> OCR Real-time
                </h2>
                <span className="text-xs font-mono text-slate-500">PORT: 8080</span>
             </div>

             <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 custom-scrollbar" ref={scrollRef}>
                {systemState === 'offline' && (
                  <div className="text-slate-600 text-center mt-10 italic">
                    Waiting for agent initialization...
                  </div>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-slate-800/50 pb-2 animate-in slide-in-from-right fade-in duration-300">
                    <span className="text-slate-500 shrink-0">[{log.timestamp.split(' ')[0]}]</span>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between w-full">
                        <span className="text-cyan-300 font-bold">{log.plate}</span>
                        <span className={`${log.confidence > 90 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                          {log.confidence}%
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400 mt-1">
                        <span className="text-[10px] uppercase bg-slate-800 px-1 rounded">{log.type}</span>
                        <span className="text-[10px]">CAM-{log.camId}</span>
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             {/* Terminal Input Look */}
             <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                <Terminal size={14} />
                <span className="animate-pulse">_</span>
                <span>Listening for data streams...</span>
             </div>
           </div>

        </div>

      </main>

      {/* Emergency Overlay */}
      {emergencyActive && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center bg-red-500/10 animate-pulse">
           <div className="bg-red-950/90 border-2 border-red-500 text-red-100 px-8 py-6 rounded-2xl shadow-2xl shadow-red-500/50 flex flex-col items-center gap-4 pointer-events-auto backdrop-blur-md">
              <AlertTriangle size={48} className="animate-bounce" />
              <h1 className="text-3xl font-black tracking-widest uppercase">Emergency Corridor Mode</h1>
              <p className="text-red-200">Priority signals activated for Ambulance/Fire Support.</p>
              <div className="w-full h-12 bg-black/50 rounded-lg overflow-hidden relative">
                 <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-red-500 tracking-widest">
                   CLEANING ROUTE A-7...
                 </div>
                 <div className="h-full bg-red-600/20 w-full animate-progress-indeterminate"></div>
              </div>
              <button 
                onClick={() => setEmergencyActive(false)}
                className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase text-sm tracking-wider"
              >
                Deactivate Override
              </button>
           </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="fixed bottom-4 right-6 text-xs text-slate-600 font-mono pointer-events-none z-50">
        CORE.EXE © 2025 // IMPACT X 3.0
      </footer>
    </div>
  );
}
