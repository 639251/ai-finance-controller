import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Mic, 
  Edit3, 
  RotateCw, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Layers,
  Calendar,
  MessageSquareQuote
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/formatters';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [expandedTranscriptId, setExpandedTranscriptId] = useState(null);

  const categories = [
    'All',
    'Food/Dining',
    'Groceries',
    'Housing/Rent',
    'Transportation',
    'Entertainment',
    'Education',
    'Shopping',
    'Utilities',
    'Health & Personal Care',
    'Income/Salary'
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.merchant && t.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesType = selectedType === 'All' || t.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Transaction History & Activity Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Showing {filteredTransactions.length} recorded entries
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search merchant or item..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Type Toggle */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-800">
            <tr>
              <th className="py-3 px-4">Transaction / Merchant</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Entry Source</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isExpense = tx.type === 'expense';
                const catColor = CATEGORY_COLORS[tx.category] || '#94a3b8';
                const isVoice = tx.source === 'voice';

                return (
                  <React.Fragment key={tx.id}>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      {/* Description & Merchant */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border ${
                            isExpense 
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {isExpense ? (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-bold">{tx.description}</p>
                            {tx.merchant && (
                              <p className="text-[10px] text-slate-400">{tx.merchant}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Tag */}
                      <td className="py-3.5 px-4">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                            borderColor: `${catColor}30`
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        {formatDate(tx.date)}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        {isVoice ? (
                          <button
                            onClick={() => setExpandedTranscriptId(expandedTranscriptId === tx.id ? null : tx.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold hover:bg-indigo-500/20 transition-all"
                            title="Click to view voice transcript"
                          >
                            <Mic className="w-3 h-3 text-indigo-400 animate-pulse" />
                            <span>Voice AI</span>
                          </button>
                        ) : tx.source === 'recurring' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>Recurring</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-medium">
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Manual</span>
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-extrabold text-sm">
                        <span className={isExpense ? 'text-white' : 'text-emerald-400'}>
                          {isExpense ? '-' : '+'}{formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Delete Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Voice Transcript Banner */}
                    {isVoice && expandedTranscriptId === tx.id && tx.rawVoiceTranscript && (
                      <tr className="bg-indigo-950/20 border-b border-indigo-500/20">
                        <td colSpan="6" className="py-2.5 px-6">
                          <div className="flex items-center gap-2 text-xs text-indigo-300">
                            <MessageSquareQuote className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            <span><strong>Spoken Transcript:</strong> "{tx.rawVoiceTranscript}"</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
