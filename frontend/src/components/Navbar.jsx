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
  ChevronDown,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate max-w-[140px] sm:max-w-none">
                AI Finance Controller
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                Razorpay
              </span>
            </div>
            <p className="hidden md:flex text-xs text-slate-400 items-center gap-1 font-mono">
              Autonomous FinOps Reconciliation • 50+ Batch Loop
            </p>
          </div>
        </div>

        {/* Center Mode Switcher (Visible on both Mobile & Desktop) */}
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

        {/* Right Desktop Action Buttons (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-3 shrink-0">
          {activeMode === 'personal' && (
            <>
              {/* Quick Net Balance */}
              <div className="flex items-center space-x-2 text-xs text-slate-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Net:</span>
                <span className={`font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netBalance)}
                </span>
              </div>

              {/* Voice Input Button */}
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                <span>Voice Entry</span>
              </button>

              {/* Manual Entry Button */}
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Entry</span>
              </button>

              {/* Budget Manager Button */}
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Manage Budget Caps"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={resetDemoData}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-800 text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
                title="Reset to Student Demo Dataset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Desktop User Auth */}
          <div className="relative">
            {isAuthenticated && currentUser ? (
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                    {getInitials(currentUser.name)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

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
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                      <span>Create Another Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Mobile Hamburger Button (Visible only on Mobile) */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b0f19] px-4 py-4 space-y-3 animate-fadeIn">
          {activeMode === 'personal' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400">Net Cashflow:</span>
                <span className={`font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netBalance)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsVoiceModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-emerald-200" />
                  <span>Voice Entry</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsManualModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Manual Entry</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBudgetModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/80 text-slate-300 text-xs border border-slate-700 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Budget Caps</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    resetDemoData();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/80 text-slate-400 text-xs border border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>
          )}

          {/* User Auth Section in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                    {getInitials(currentUser.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-slate-800 text-xs font-bold text-white border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-emerald-600 text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
