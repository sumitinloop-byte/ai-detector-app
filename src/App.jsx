import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Image as ImageIcon, ShieldCheck, Zap, Activity, Cpu, Terminal as TerminalIcon, BarChart3 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import TextVerifier from "./components/TextVerifier";
import ImageVerifier from "./components/ImageVerifier";

export default function App() {
  const [activeTab, setActiveTab] = useState("text");
  const [systemLoad, setSystemLoad] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(Math.floor(Math.random() * 5) + 12);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#02040a] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans relative flex flex-col">
      <Toaster position="top-center" />
      
      {/* Immersive Forensic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      </div>

      {/* Interactive Navbar */}
      <nav className="relative z-20 w-full px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-xl flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-4 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="p-2.5 bg-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all group-hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]"
            whileHover={{ rotate: [0, -5, 5, 0] }}
          >
            <Cpu size={22} className="text-black" />
          </motion.div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-tighter leading-none uppercase group-hover:text-cyan-400 transition-colors">
              KIIT UNIVERSITY
            </h3>
            <p className="text-[9px] font-bold text-cyan-400 tracking-[0.2em] uppercase mt-1 opacity-80 group-hover:opacity-100">
              Konverge 2026 // Auth-Protocol
            </p>
          </div>
        </motion.div>

        <div className="hidden md:flex gap-10 items-center">
          <HeaderStat icon={<Activity size={12} className="text-cyan-400" />} label="NEURAL LOAD" val={`${systemLoad}%`} />
          <HeaderStat icon={<TerminalIcon size={12} className="text-cyan-400" />} label="ENGINE" val="V4.Core" />
          <div className="px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-green-500 tracking-widest uppercase">SYSTEM LIVE</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center flex-grow">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-md">
             <Sparkles size={12} className="text-cyan-400" />
             <span className="text-[10px] font-black tracking-[0.2em] uppercase text-cyan-200">Digital Authenticity Verifier // Problem 02</span>
           </div>
          <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.75] mb-6">
            TRUTH.<span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 italic">LENS</span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-bold max-w-2xl mx-auto tracking-widest uppercase opacity-70">
            A specialized forensic dashboard developed for <span className="text-cyan-400">Konverge 2026</span>.
          </p>
        </motion.div>

        {/* Tactical Switcher */}
        <div className="flex w-full max-w-sm bg-white/[0.02] p-1.5 rounded-[2rem] border border-white/10 mb-14 backdrop-blur-3xl relative">
          <button onClick={() => setActiveTab("text")} className={`flex-1 py-4 rounded-[1.7rem] flex items-center justify-center gap-3 font-black text-[10px] tracking-[0.2em] transition-all relative z-10 ${activeTab === "text" ? "text-black" : "text-slate-500 hover:text-white"}`}>
            <FileText size={16} /> TEXT SCAN
          </button>
          <button onClick={() => setActiveTab("image")} className={`flex-1 py-4 rounded-[1.7rem] flex items-center justify-center gap-3 font-black text-[10px] tracking-[0.2em] transition-all relative z-10 ${activeTab === "image" ? "text-black" : "text-slate-500 hover:text-white"}`}>
            <ImageIcon size={16} /> IMAGE SCAN
          </button>
          <motion.div layoutId="nav-pill" animate={{ x: activeTab === "text" ? 0 : "100%" }} className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-cyan-400 rounded-[1.6rem] z-0 shadow-[0_0_25px_rgba(6,182,212,0.4)]" />
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
              {activeTab === "text" ? <TextVerifier /> : <ImageVerifier />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-20 w-full px-8 py-6 border-t border-white/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">
          Digital Trust Architecture // KIIT HACKATHON 2026
        </div>
        <div className="flex gap-6 items-center opacity-50 hover:opacity-100 transition-opacity">
          <BarChart3 size={16} className="text-cyan-500" />
          <span className="text-[10px] font-bold text-white tracking-widest uppercase italic">Secure Protocol Encrypted</span>
        </div>
      </footer>
    </div>
  );
}

function HeaderStat({ icon, label, val }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex flex-col">
        <span className="text-[8px] text-slate-500 font-black tracking-widest uppercase">{label}</span>
        <span className="text-[10px] font-black text-white">{val}</span>
      </div>
    </div>
  )
}