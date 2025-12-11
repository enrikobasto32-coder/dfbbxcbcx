import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  MessageSquareQuote, 
  FileText, 
  UploadCloud, 
  AlertCircle,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SentimentChart from './components/SentimentChart';
import WordCloud from './components/WordCloud';
import ChatBot from './components/ChatBot';
import { analyzeReviews } from './services/geminiService';
import { AnalysisResult } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null); // Reset previous result

    try {
      const data = await analyzeReviews(inputText);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze reviews. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleData = () => {
    setInputText(`
I absolutely love the new design of the app! It's so sleek and modern. However, the loading times are atrocious. I waited 10 seconds just to open my profile. Fix this!
---
Great customer service. I called about a billing issue and Sarah resolved it in 5 minutes. Very happy.
---
The product arrived damaged. The box was crushed. I'm requesting a refund immediately. This is unacceptable shipping quality.
---
Why did you remove the dark mode? My eyes hurt using this at night. Please bring it back.
---
Best purchase I've made all year. The quality is top notch and it fits perfectly. Highly recommend to everyone.
---
I'm cancelling my subscription. The price hike is not justified for the features you offer. Goodbye.
---
The new update is buggy. It crashes every time I try to upload a photo. Please patch this ASAP.
---
Surprised by how fast the delivery was! ordered yesterday and it's here today. Kudos to the logistics team.
    `.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Sentimo
              </span>
            </div>
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200 flex items-center gap-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 Gemini 3 Pro Active
               </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Sentiment Dashboard</h1>
          <p className="text-slate-500 text-lg">Analyze bulk reviews to uncover hidden insights and actionable trends.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-indigo-500" />
                  Input Data
                </h2>
                <button 
                  onClick={loadSampleData}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Load Sample
                </button>
              </div>
              
              <textarea
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm transition-all"
                placeholder="Paste your raw customer reviews here (one per line or separated by delimiters)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    isAnalyzing || !inputText.trim()
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Thinking (Deep Analysis)...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      Analyze Sentiment
                    </>
                  )}
                </button>
                {isAnalyzing && (
                  <p className="text-xs text-center text-slate-400 mt-2 animate-pulse">
                    Using Gemini 3 Pro Thinking Budget (32k tokens)
                  </p>
                )}
              </div>
            </div>

            {/* Hint Card */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                How it works
              </h3>
              <p className="text-indigo-700 text-sm leading-relaxed">
                Paste raw text from emails, surveys, or app store reviews. Our AI uses deep reasoning to separate distinct reviews, score their sentiment, and extract meaningful patterns.
              </p>
            </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {!result && !isAnalyzing && !error && (
              <div className="h-[600px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <LayoutDashboard className="w-16 h-16 mb-4 text-slate-300" />
                <p className="text-lg font-medium">Ready to analyze</p>
                <p className="text-sm">Paste reviews and click Analyze to generate the dashboard</p>
              </div>
            )}

            {isAnalyzing && !result && (
              <div className="h-[600px] bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center space-y-6 animate-pulse">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                <div className="space-y-2 text-center">
                  <p className="text-lg font-semibold text-slate-700">Analyzing patterns...</p>
                  <p className="text-slate-400 max-w-md mx-auto">Gemini is reading through your reviews, calculating sentiment scores, and identifying key themes.</p>
                </div>
              </div>
            )}

            {result && (
              <>
                {/* Top Row: Executive Summary & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Executive Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Executive Summary
                    </h2>
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600">
                      <ReactMarkdown>{result.executiveSummary}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      Top Priorities
                    </h2>
                    <div className="space-y-4">
                      {result.actionItems.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                          <h3 className="font-semibold text-indigo-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Row: Sentiment Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Sentiment Trend
                  </h2>
                  <SentimentChart data={result.sentimentTrend} />
                </div>

                {/* Bottom Row: Word Cloud */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                    Key Topics
                  </h2>
                  <WordCloud keywords={result.keywords} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Chat Bot Widget */}
      <ChatBot contextData={result ? `Executive Summary: ${result.executiveSummary}\n\nKey Trends: ${JSON.stringify(result.keywords)}\n\nRaw Reviews Snippet: ${inputText.substring(0, 2000)}` : undefined} />
    </div>
  );
}

export default App;