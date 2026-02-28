import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";

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
          headers: { 
            Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      const resultData = await response.json();
      
      // Agar model load ho raha hai (free tier behavior)
      if (resultData.error && resultData.error.includes("loading")) {
        alert("Model is warming up. Wait 10 seconds and try again!");
        setIsLoading(false);
        return;
      }

      if (resultData && Array.isArray(resultData) && resultData[0]) {
        const aiScoreObj = resultData[0].find(item => item.label === 'Fake' || item.label === 'Label_1');
        const finalPercentage = Math.round(aiScoreObj.score * 100);
        const isAI = finalPercentage > 50;

        setResult({
          score: finalPercentage,
          isAi: isAI,
          status: isAI ? "AI GENERATED" : "HUMAN AUTHENTIC",
          markers: isAI 
            ? ["Neural Pattern Detected", "Uniform Syntax", "AI Signature"]
            : ["Natural Flow", "Human Sentence Rhythms", "High Variance"]
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("API is busy. Please try again in a few seconds!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 font-sans bg-black p-4 min-h-screen text-white">
      <div className="xl:col-span-3 space-y-6">
        <div className="relative rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-2">
          <textarea
            className="w-full h-80 md:h-[480px] bg-transparent p-10 text-xl md:text-2xl font-medium outline-none placeholder:text-slate-700 leading-relaxed resize-none text-cyan-400"
            placeholder="PASTE TEXT FOR SCANNIG..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <button
          onClick={analyzeText}
          disabled={isLoading}
          className="w-full py-8 bg-cyan-400 text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.5)]"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={24} fill="currentColor" />}
          {isLoading ? "DECRYPTING..." : "INITIATE SCAN"}
        </button>
      </div>

      <div className="xl:col-span-1 space-y-4">
        <div className={`p-8 rounded-[2.5rem] bg-white/5 border ${result ? (result.isAi ? 'border-red-500' : 'border-green-500') : 'border-white/10'}`}>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">AI PROBABILITY</div>
          <div className="text-6xl font-black mt-2">
            {result ? `${result.score}%` : "00%"}
          </div>
        </div>
        
        {result && (
          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
            <h4 className="text-[10px] text-slate-500 uppercase mb-4">Markers Found</h4>
            {result.markers.map(m => (
              <div key={m} className="flex items-center gap-2 text-cyan-400 text-xs mb-2">
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