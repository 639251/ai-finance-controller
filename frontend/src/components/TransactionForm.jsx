import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  DollarSign, 
  Tag, 
  Calendar, 
  Building2, 
  FileText, 
  Sparkles,
  TrendingDown,
  TrendingUp,
  Check
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { parseSpokenExpense } from '../utils/voiceParser';

export default function TransactionForm() {
  const { 
    isManualModalOpen, 
    setIsManualModalOpen, 
    addTransaction 
  } = useFinance();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Food/Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [autoTagFeedback, setAutoTagFeedback] = useState('');

  // Dynamic categorization prediction as user types description or merchant
  useEffect(() => {
    if (type === 'expense' && (description || merchant)) {
      const combined = `${description} ${merchant}`;
      const parsed = parseSpokenExpense(combined);
      if (parsed.category && parsed.category !== 'Other') {
        setCategory(parsed.category);
        setAutoTagFeedback(`Auto-detected: ${parsed.category}`);
      }
    }
  }, [description, merchant, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      description: description || 'New Entry',
      merchant: merchant || '',
      category: type === 'income' ? 'Income/Salary' : category,
      date,
      source: 'manual'
    });

    setIsManualModalOpen(false);
    // Reset form
    setAmount('');
    setDescription('');
    setMerchant('');
    setAutoTagFeedback('');
  };

  if (!isManualModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manual Transaction Entry</h2>
              <p className="text-xs text-slate-400">Add an expense or income with smart auto-tagging</p>
            </div>
          </div>
          <button
            onClick={() => setIsManualModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Income / Stipend
            </button>
          </div>

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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-extrabold text-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Description & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Description
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Lunch with friends"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Merchant / Store
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Domino's, Uber, Amazon"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category with Auto-Tag notification */}
          {type === 'expense' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" /> Category
                </label>
                {autoTagFeedback && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium animate-fadeIn">
                    <Sparkles className="w-3 h-3" /> {autoTagFeedback}
                  </span>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none transition-all"
              >
                <option value="Food/Dining">🍔 Food & Dining</option>
                <option value="Groceries">🛒 Groceries</option>
                <option value="Transportation">🚗 Transportation</option>
                <option value="Housing/Rent">🏠 Housing & Rent</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Education">📚 Education & Books</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Utilities">💡 Utilities & Internet</option>
                <option value="Health & Personal Care">💊 Health & Personal Care</option>
                <option value="Other">📦 Other</option>
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> Transaction Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
