import React, { useState } from 'react';
import { X, Sliders, DollarSign, Check, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function BudgetModal() {
  const { budgets, isBudgetModalOpen, setIsBudgetModalOpen, updateBudgetCap } = useFinance();
  const [limits, setLimits] = useState(() => {
    const map = {};
    budgets.forEach(b => {
      map[b.category] = b.monthlyLimit;
    });
    return map;
  });

  const handleChange = (category, value) => {
    setLimits(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    Object.keys(limits).forEach(cat => {
      updateBudgetCap(cat, parseFloat(limits[cat]) || 0);
    });
    setIsBudgetModalOpen(false);
  };

  if (!isBudgetModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configure Category Budgets</h2>
              <p className="text-xs text-slate-400">Set monthly maximum spending limits</p>
            </div>
          </div>
          <button
            onClick={() => setIsBudgetModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Limits List */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-3">
            {budgets.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs font-semibold text-slate-200">{b.category}</span>
                <div className="flex items-center gap-1 w-32">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    value={limits[b.category] !== undefined ? limits[b.category] : b.monthlyLimit}
                    onChange={(e) => handleChange(b.category, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Budget Limits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
