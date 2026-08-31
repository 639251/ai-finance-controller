import React from 'react';
import { Target, AlertTriangle, CheckCircle, Flame, Plus, Settings } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

export default function BudgetProgress() {
  const { budgetStatus, setIsBudgetModalOpen } = useFinance();

  return (
    <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Monthly Category Budgets & Caps
          </h2>
          <p className="text-xs text-slate-400">Track spending velocity against configured limits</p>
        </div>
        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Edit Caps</span>
        </button>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {budgetStatus.map((budget, idx) => {
          const color = CATEGORY_COLORS[budget.category] || '#10b981';
          const isOver = budget.isOver;
          const isWarning = budget.isWarning && !isOver;

          return (
            <div 
              key={idx} 
              className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              {/* Category Info & Status Badge */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span>{budget.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isOver ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      <Flame className="w-3 h-3" />
                      Exceeded by {formatCurrency(budget.spent - budget.monthlyLimit)}
                    </span>
                  ) : isWarning ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      {budget.percentage}% Spent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      {budget.percentage}% Used
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver 
                      ? 'bg-gradient-to-r from-rose-600 to-red-500' 
                      : isWarning
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${Math.min(100, budget.percentage)}%` }}
                />
              </div>

              {/* Numerical Details */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Spent: <strong className="text-white font-semibold">{formatCurrency(budget.spent)}</strong> of {formatCurrency(budget.monthlyLimit)}
                </span>
                <span>
                  {isOver ? (
                    <span className="text-rose-400 font-bold">$0.00 left</span>
                  ) : (
                    <>
                      Remaining: <strong className="text-emerald-400 font-semibold">{formatCurrency(budget.remaining)}</strong>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
