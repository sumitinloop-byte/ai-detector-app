import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Zap, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

const TextVerifier = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) {
      alert("Please enter some text to scan.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta",
        {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}` },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      const resultData = await response.json();
      
      // Model response se AI score nikalna
      const aiScoreObj = resultData[0].find(item => item.label === 'Fake' || item.label === 'Label_1');
      const finalPercentage = Math.round(aiScoreObj.score * 100);
      const isAI = finalPercentage > 50;

      setResult({
        score: finalPercentage,
        isAi: isAI,
        status: isAI ? "AI GENERATED" : "HUMAN AUTHENTIC",
        markers: isAI 
          ? ["Neural Pattern Detected", "Uniform Syntax Found", "AI Linguistic Signature"]
          : ["Natural Narrative Flow", "Complex Sentence Rhythms", "Human Variance"]
      });
    } catch (error) {
      console.error("Error:", error);
      alert("API Error! Please refresh or check your Netlify Token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 font-sans">
      <div className="xl:col-span-3 space-y-6">
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-3xl shadow-2xl transition-all hover:border-cyan-500/40">
          <textarea
            className="w-full h-80 md:h-[480px] bg-transparent p-10 text-xl md:text-2xl font-medium outline-none placeholder:text-slate-700 leading-relaxed resize-none text-cyan-50/90"
            placeholder="PASTE TEXT CONTENT FOR NEURAL PATTERN SCANNING..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {isLoading && (
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_cyan] z-20"
            />
          )}
        </div>
        
        <button
          onClick={analyzeText}
          disabled={isLoading}
          className="w-full py-8 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-20 shadow-xl"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={24} fill="currentColor" />}
          {isLoading ? "DECRYPTING SYNTAX..." : "INITIATE FORENSIC SCAN"}
        </button>
      </div>

      <div className="xl:col-span-1 space-y-4">
        {/* Result Card */}
        <div className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${result ? (result.isAi ? 'border-red-500/40' : 'border-green-500/40') : 'border-white/5'} backdrop-blur-xl`}>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">AI PROBABILITY</div>
          <div className={`text-6xl font-black tracking-tighter ${result ? (result.isAi ? 'text-red-500' : 'text-green-500') : 'text-slate-800'}`}>
            {result ? `${result.score}%` : "00%"}
          </div>
          {result && (
            <div className={`mt-4 text-[10px] font-bold uppercase tracking-tighter ${result.isAi ? 'text-red-400' : 'text-green-400'}`}>
               Result: {result.status}
            </div>
          )}
        </div>

        {/* Markers Card */}
        <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] backdrop-blur-2xl">
           <h4 className="text-[10px] font-black text-slate-500 uppercase mb-5 tracking-[0.2em]">Linguistic Analysis</h4>
           <div className="space-y-4">
              {result ? result.markers.map(m => (
                <div key={m} className="flex items-center gap-3 text-[11px] font-bold text-cyan-400/80 uppercase">
                  <CheckCircle2 size={14} className="text-cyan-500" /> {m}
                </div>
              )) : (
                <div className="py-10 text-center opacity-20 text-[10px] font-bold uppercase tracking-widest">
                  System Idle
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TextVerifier;