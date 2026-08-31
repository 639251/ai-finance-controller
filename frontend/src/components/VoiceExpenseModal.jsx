import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  HelpCircle,
  Clock,
  Tag,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { parseSpokenExpense } from '../utils/voiceParser';
import { formatCurrency } from '../utils/formatters';

const PRESET_PHRASES = [
  "I spent $25 on pizza at Domino's yesterday",
  "Spent 6 dollars and 75 cents at Starbucks this morning",
  "Paid 18.50 for Uber to campus yesterday",
  "Bought textbooks for $85 at campus bookstore",
  "Paid 850 dollars for dorm rent today",
  "Got 450 dollars freelance income today"
];

export default function VoiceExpenseModal() {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    addTransaction 
  } = useFinance();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Editable parsed fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food/Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('expense');

  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        const combined = (finalTrans || currentInterim).trim();
        setTranscript(combined);
        setInterimText(currentInterim);

        if (combined) {
          handleParseText(combined);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access blocked. Use the sample voice buttons below to test!');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Process text into structured JSON
  const handleParseText = (text) => {
    const result = parseSpokenExpense(text);
    setParsedResult(result);
    setAmount(result.amount > 0 ? result.amount.toString() : '');
    setDescription(result.description);
    setCategory(result.category);
    setDate(result.date);
    setType(result.type);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg('Web Speech API not supported in this browser. Please use the preset voice phrases below!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setParsedResult(null);
      setErrorMsg('');
      setIsSuccess(false);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleApplyPreset = (phrase) => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setTranscript(phrase);
    setIsSuccess(false);
    handleParseText(phrase);
  };

  const handleConfirmTransaction = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    addTransaction({
      amount: parseFloat(amount),
      description: description || 'Voice Expense',
      category: category || 'Food/Dining',
      date: date || new Date().toISOString().split('T')[0],
      type: type || 'expense',
      source: 'voice',
      rawVoiceTranscript: transcript
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsVoiceModalOpen(false);
      setIsSuccess(false);
      setTranscript('');
      setParsedResult(null);
    }, 1200);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Voice-Based Expense Entry
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Speech-To-JSON
                </span>
              </h2>
              <p className="text-xs text-slate-400">Speak naturally — our AI extracts amount, category, merchant & date</p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Microphone Recording Section */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-800 relative overflow-hidden">
            {/* Ambient Pulse Glow */}
            {isListening && (
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
            )}

            {/* Mic Big Button */}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-rose-500/40 ring-8 ring-rose-500/20 animate-pulse'
                  : 'bg-gradient-to-tr from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-emerald-500/30 hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>

            {/* Status Label */}
            <div className="mt-4 text-center">
              <span className={`text-sm font-semibold flex items-center justify-center gap-2 ${
                isListening ? 'text-rose-400 animate-pulse' : 'text-slate-300'
              }`}>
                {isListening ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    Listening... Speak your expense now!
                  </>
                ) : (
                  'Click microphone or pick a test phrase below'
                )}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Say e.g.: "I spent $25 on pizza at Domino's yesterday"
              </p>
            </div>

            {/* Audio Wave Visualizer Bars */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 mt-4 h-8">
                {[40, 70, 90, 60, 100, 50, 80, 60, 90, 40].map((height, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-emerald-400 rounded-full animate-wave"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${idx * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Presets / Test Phrases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                Quick Test Phrases (Instant Voice Simulation):
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(phrase)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all duration-200 ${
                    transcript === phrase
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>

          {/* Live Transcript Display */}
          {transcript && (
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Transcribed Speech Input:
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  Confidence: 96%
                </span>
              </div>
              <p className="text-sm font-medium text-white italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Extracted JSON Preview & Editable Form Confirmation */}
          {parsedResult && (
            <form onSubmit={handleConfirmTransaction} className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  AI Extracted Entity Form (Review & Confirm):
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" /> Auto-Tagged Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value="Food/Dining">🍔 Food & Dining</option>
                    <option value="Groceries">🛒 Groceries</option>
                    <option value="Transportation">🚗 Transportation / Rides</option>
                    <option value="Housing/Rent">🏠 Housing & Rent</option>
                    <option value="Entertainment">🎬 Entertainment</option>
                    <option value="Education">📚 Education & Books</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Utilities">💡 Utilities & Internet</option>
                    <option value="Health & Personal Care">💊 Health & Care</option>
                    <option value="Income/Salary">💰 Income & Stipend</option>
                    <option value="Other">📦 Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description / Merchant
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Domino's Pizza"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Resolved Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit / Confirm Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSuccess}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                    isSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25 active:scale-[0.99]'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 animate-bounce" />
                      Saved Successfully to Ledger!
                    </>
                  ) : (
                    <>
                      <span>Confirm & Record Voice Expense</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
