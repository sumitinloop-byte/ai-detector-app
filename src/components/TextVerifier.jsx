import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Zap, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const TextVerifier = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const analyzeWithRetry = async (retries = 3) => {
    const token = import.meta.env.VITE_HF_TOKEN;
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta",
      {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();

    // Handling the "Model is loading" state from Hugging Face
    if (data.error && data.error.includes("loading") && retries > 0) {
      setStatusMsg(`Waking up server... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, 8000)); // Wait 8 seconds
      return analyzeWithRetry(retries - 1);
    }

    if (data.error) throw new Error(data.error);
    return data;
  };

  const handleScan = async () => {
    if (!text.trim()) return alert("Please paste some text first.");
    
    setIsLoading(true);
    setResult(null);
    setStatusMsg('Connecting to Neural Network...');

    try {
      const resultData = await analyzeWithRetry();
      
      if (resultData && resultData[0]) {
        const aiScoreObj = resultData[0].find(item => item.label === 'Fake' || item.label === 'Label_1');
        const score = Math.round(aiScoreObj.score * 100);
        
        setResult({
          score: score,
          isAi: score > 50,
          status: score > 50 ? "AI GENERATED" : "HUMAN AUTHENTIC",
          markers: score > 50 ? ["Neural Pattern Detected", "Low Burstiness"] : ["Natural Variance", "Human Syntax"]
        });
      }
    } catch (error) {
      console.error("Final Error:", error);
      alert("Server is overloaded. Please wait 15 seconds and try one last time.");
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 font-sans bg-black p-6 min-h-screen text-white">
      <div className="xl:col-span-3 space-y-6">
        <div className="relative rounded-[2rem] border border-cyan-500/20 bg-white/5 p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <textarea
            className="w-full h-80 md:h-[450px] bg-transparent p-8 text-xl outline-none placeholder:text-slate-700 resize-none text-cyan-400"
            placeholder="PASTE CONTENT FOR FORENSIC ANALYSIS..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleScan}
          disabled={isLoading}
          className="w-full py-6 bg-cyan-400 text-black rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={24} fill="currentColor" />}
          {isLoading ? statusMsg : "INITIATE SCAN"}
        </button>
      </div>

      <div className="xl:col-span-1 space-y-4">
        <div className={`p-8 rounded-[2rem] bg-white/5 border ${result ? (result.isAi ? 'border-red-500' : 'border-green-500') : 'border-white/10'}`}>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Probability</div>
          <div className="text-6xl font-black mt-2 text-cyan-50">{result ? `${result.score}%` : "00%"}</div>
          {result && <div className="mt-2 text-xs font-bold uppercase">{result.status}</div>}
        </div>
      </div>
    </div>
  );
};

export default TextVerifier;