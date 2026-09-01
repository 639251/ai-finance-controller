import React, { useState } from 'react';
import { 
  Sparkles, 
  Mic, 
  PlusCircle, 
  Bell, 
  Sliders, 
  RotateCcw, 
  Wallet,
  GraduationCap,
  LogIn,
  LogOut,
  UserPlus,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export default function Navbar({ activeMode, setActiveMode }) {
  const { 
    netBalance, 
    currentUser,
    isAuthenticated,
    setIsAuthModalOpen,
    setAuthMode,
    logoutUser,
    setIsVoiceModalOpen, 
    setIsManualModalOpen, 
    setIsBudgetModalOpen,
    resetDemoData 
  } = useFinance();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate max-w-[130px] sm:max-w-none">
                AI Finance Controller
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                Razorpay
              </span>
            </div>
            <p className="hidden md:flex text-xs text-slate-400 items-center gap-1 font-mono">
              Autonomous FinOps Reconciliation • 50+ Batch Loop
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveMode('finops')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'finops'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>FinOps (50+)</span>
          </button>
          <button
            onClick={() => setActiveMode('personal')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'personal'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>Voice</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {activeMode === 'personal' && (
            <>
              {/* Voice Input Button */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
                title="Record Voice Expense"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                <span className="hidden sm:inline">Voice</span>
              </button>

              {/* Manual Entry Button */}
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Add</span>
              </button>

              {/* Budget Manager Button */}
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white transition-all hidden sm:block"
                title="Manage Budget Caps"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={resetDemoData}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-800 text-slate-400 hover:text-amber-400 transition-all hidden sm:block"
                title="Reset to Student Demo Dataset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Auth & User Profile Dropdown */}
              <div className="relative">
                {isAuthenticated && currentUser ? (
                  <div>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                        {getInitials(currentUser.name)}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                        <div className="p-2 border-b border-slate-800">
                          <p className="text-xs font-bold text-white">{currentUser.name}</p>
                          <p className="text-[11px] text-emerald-400">{currentUser.role || 'Student'}</p>
                          <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                        </div>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setAuthMode('signup');
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                          <UserPlus className="w-4 h-4 text-emerald-400" />
                          <span>Create Another Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setAuthMode('login');
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                          <UserCheck className="w-4 h-4 text-indigo-400" />
                          <span>Switch Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logoutUser();
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Log In</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
