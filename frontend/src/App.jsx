import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import SpendingChart from './components/SpendingChart';
import BudgetProgress from './components/BudgetProgress';
import SmartAlerts from './components/SmartAlerts';
import RecommendationFeed from './components/RecommendationFeed';
import TransactionList from './components/TransactionList';
import VoiceExpenseModal from './components/VoiceExpenseModal';
import TransactionForm from './components/TransactionForm';
import BudgetModal from './components/BudgetModal';
import AuthModal from './components/AuthModal';
import { Mic, Sparkles, Plus, ShieldCheck, Zap } from 'lucide-react';

function DashboardContent() {
  const { 
    isAuthenticated, 
    currentUser, 
    setIsVoiceModalOpen, 
    setIsManualModalOpen, 
    setIsAuthModalOpen, 
    setAuthMode 
  } = useFinance();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* If user is NOT logged in, show Guest Welcome Banner */}
        {!isAuthenticated ? (
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Student Finance Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Track Expenses by Voice, Set Smart Caps & Grow Savings
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Sign in to your account or create a new profile to log voice expenses, view real-time budget velocity alerts, and receive AI financial advice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Create New Account</span>
              </button>
            </div>
          </div>
        ) : (
          /* Voice Feature Hero Banner for Logged-In User */
          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-emerald-900/30 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Welcome back, {currentUser?.name}!</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Log Expenses by Voice in Under 3 Seconds
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Just say: <span className="text-emerald-300 font-semibold italic">"I spent $25 on pizza at Domino's yesterday"</span> — our AI handles transcription, dynamic categorization, and auto-populates the ledger!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform active:scale-95 group"
                >
                  <Mic className="w-4 h-4 text-emerald-200 group-hover:scale-125 transition-transform animate-pulse" />
                  <span>Try Voice Entry</span>
                </button>

                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Manual Entry</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. Core Financial Metrics */}
        <StatCard />

        {/* 2. Charts & Budget Status (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <SpendingChart />
          </div>
          <div className="lg:col-span-5">
            <BudgetProgress />
          </div>
        </div>

        {/* 3. Smart Alerts & Personalized AI Recommendations (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <SmartAlerts />
          </div>
          <div className="lg:col-span-7">
            <RecommendationFeed />
          </div>
        </div>

        {/* 4. Filterable & Searchable Activity Ledger */}
        <TransactionList />
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Finance Controller • Built for Student Financial Literacy</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dynamic Tagging</span>
            <span>•</span>
            <span>Velocity Engine</span>
            <span>•</span>
            <span>Voice-to-JSON NLP</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <VoiceExpenseModal />
      <TransactionForm />
      <BudgetModal />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
