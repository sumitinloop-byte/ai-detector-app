import React, { useState } from 'react';

const TextVerifier = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeText = async () => {
    // Basic check agar text khali hai
    if (!text.trim()) {
      alert("Please enter some text to analyze.");
      return;
    }

    setIsLoading(true);
    try {
      // API Call: Hugging Face Model (VITE_HF_TOKEN environment variable se aayega)
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta",
        {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}` },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      const resultData = await response.json();
      
      // API response processing
      // Model 'Fake' (AI) ya 'Label_1' label use karta hai AI probability ke liye
      const aiScoreObj = resultData[0].find(item => item.label === 'Fake' || item.label === 'Label_1');
      const finalPercentage = Math.round(aiScoreObj.score * 100);

      setResult({
        score: finalPercentage,
        isAi: finalPercentage > 50,
        details: `Analysis suggests a ${finalPercentage}% probability of AI generation.`
      });
    } catch (error) {
      console.error("Error:", error);
      alert("API Error! Please check your token on Netlify or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">AI Text Detector</h2>
      <textarea
        className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={analyzeText}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Text'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.isAi ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <h3 className="font-bold text-lg">{result.isAi ? 'AI Content Detected' : 'Human Content Likely'}</h3>
          <p>{result.details}</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${result.isAi ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextVerifier;