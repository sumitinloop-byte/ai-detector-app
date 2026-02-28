import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Zap, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

const TextVerifier = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeTextLocally = () => {
    if (!text.trim()) return alert("Please enter some text to scan.");
    
    setIsLoading(true);
    setResult(null);

    // Simulated scanning delay for effect
    setTimeout(() => {
      // Normal Logic: Word length aur sentence structure par based score
      const words = text.trim().split(/\s+/).length;
      const avgWordLength = text.length / words;
      
      // Artificial score logic (Mocking AI detection)
      let score = Math.floor(Math.random() * (45 - 12 + 1)) + 12; // Default Human score
      if (avgWordLength > 6 || words < 20) {
        score = Math.floor(Math.random() * (88 - 65 + 1)) + 65; // High complexity = AI suspicious
      }

      setResult({
        score: score,
        isAi: score > 50,
        status: score > 50 ? "AI GENERATED" : "HUMAN AUTHENTIC",
        markers: score > 50 
          ? ["Neural Consistency Detected", "Low Vocabulary Variance", "Predictive Syntax"] 
          : ["Natural Flow Pattern", "High Linguistic Variance", "Stylistic Human Signature"]
      });
      setIsLoading(false);
    }, 2000); // 2 seconds delay to look professional
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 font-sans bg-black p-4 min-h-screen text-white">
      <div className="xl:col-span-3 space-y-6">
        <div className="relative rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-2 shadow-2xl">
          <textarea
            className="w-full h-80 md:h-[480px] bg-transparent p-10 text-xl md:text-2xl outline-none placeholder:text-slate-700 leading-relaxed resize-none text-cyan-400"
            placeholder="PASTE TEXT FOR OFFLINE FORENSIC SCAN..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-pulse shadow-[0_0_15px_cyan]" />
          )}
        </div>
        
        <button
          onClick={analyzeTextLocally}
          disabled={isLoading}
          className="w-full py-8 bg-cyan-400 text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)]"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={24} />}
          {isLoading ? "ANALYZING PATTERNS..." : "OFFLINE FORENSIC SCAN"}
        </button>
      </div>

      <div className="xl:col-span-1 space-y-4">
        <div className={`p-8 rounded-[2.5rem] bg-white/5 border ${result ? (result.isAi ? 'border-red-500' : 'border-green-500') : 'border-white/10'}`}>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Linguistic Probability</div>
          <div className="text-6xl font-black mt-2 text-white">
            {result ? `${result.score}%` : "00%"}
          </div>
          {result && (
            <div className={`mt-4 text-xs font-bold uppercase ${result.isAi ? 'text-red-400' : 'text-green-400'}`}>
              {result.status}
            </div>
          )}
        </div>

        {result && (
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
            <h4 className="text-[10px] text-slate-500 uppercase mb-4 font-bold">Neural Markers</h4>
            {result.markers.map(m => (
              <div key={m} className="flex items-center gap-2 text-cyan-400 text-[11px] font-bold mb-2">
                <CheckCircle2 size={14} /> {m}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextVerifier;