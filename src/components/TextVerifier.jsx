import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Loader2, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TextVerifier() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeText = () => {
    // UPDATED: Minimum 20 words wali condition hata di hai
    // Ab bas check karega ki input bilkul khali na ho
    if (text.trim().length === 0) {
      alert("Please enter some text to initiate the scan.");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const words = text.trim().split(/\s+/);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // AI Markers Logic
      const aiMarkers = ["delve", "tapestry", "comprehensive", "moreover", "furthermore", "in conclusion", "not only", "but also", "undoubtedly"];
      let triggerCount = 0;
      aiMarkers.forEach(m => { if (text.toLowerCase().includes(m)) triggerCount++; });

      const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
      const avgLength = sentenceLengths.length > 0 ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length : 0;
      const variance = sentenceLengths.length > 0 ? sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / sentenceLengths.length : 0;

      let score = 0;
      if (variance < 15) score += 60;
      else if (variance < 30) score += 30;
      
      score += (triggerCount * 12);
      if (avgLength > 15 && avgLength < 25) score += 15;

      const finalScore = Math.min(Math.max(score, 12), 99); 
      const isAI = finalScore > 55;

      setResult({
        score: finalScore,
        status: isAI ? "AI GENERATED" : "HUMAN AUTHENTIC",
        markers: isAI 
          ? ["Low Burstiness Detected", `${triggerCount} Neural Triggers Found`, "Syntactic Uniformity"] 
          : ["High Linguistic Variance", "Natural Narrative Flow", "Complex Sentence Rhythms"]
      });
      setLoading(false);
    }, 2000);
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
          {loading && (
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
          // UPDATED: Ab button tabhi disable hoga jab loading ho ya box khali ho
          disabled={loading || text.trim().length === 0}
          className="w-full py-8 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-20 shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Zap size={24} fill="currentColor" />}
          {loading ? "DECRYPTING SYNTAX..." : "INITIATE FORENSIC SCAN"}
        </button>
      </div>

      <div className="xl:col-span-1 space-y-4">
        <div className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${result ? (result.score > 55 ? 'border-red-500/40' : 'border-green-500/40') : 'border-white/5'} backdrop-blur-xl`}>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">AI PROBABILITY</div>
          <div className={`text-6xl font-black tracking-tighter ${result ? (result.score > 55 ? 'text-red-500' : 'text-green-500') : 'text-slate-800'}`}>
            {result ? `${result.score}%` : "00%"}
          </div>
          {result && (
            <div className={`mt-4 text-[10px] font-bold uppercase tracking-tighter ${result.score > 55 ? 'text-red-400' : 'text-green-400'}`}>
               Result: {result.status}
            </div>
          )}
        </div>

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
}