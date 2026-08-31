import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, Layers } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

export default function SpendingChart() {
  const { categoryBreakdown, transactions, totalExpense } = useFinance();
  const [activeTab, setActiveTab] = useState('donut'); // 'donut' | 'trend'

  // Prepare trend data grouped by date
  const trendDataMap = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const dateKey = t.date;
      trendDataMap[dateKey] = (trendDataMap[dateKey] || 0) + t.amount;
    });

  const trendData = Object.keys(trendDataMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(date => ({
      date: date.substring(5), // "08-25"
      amount: Math.round(trendDataMap[date] * 100) / 100
    }));

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0;
      return (
        <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.fill }} />
            {item.name}
          </p>
          <p className="text-emerald-400 font-extrabold text-sm">{formatCurrency(item.value)}</p>
          <p className="text-slate-400 text-[11px]">{pct}% of total spending</p>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="text-slate-400 font-semibold">{label}</p>
          <p className="text-emerald-400 font-extrabold text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Spending Analytics & Visualizations
          </h2>
          <p className="text-xs text-slate-400">Interactive category breakdown and historical timeline</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'donut'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Category Donut
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'trend'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Spending Timeline
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full relative flex items-center justify-center">
        {categoryBreakdown.length === 0 ? (
          <div className="text-center text-slate-500 text-xs">
            No expense data available to display charts.
          </div>
        ) : activeTab === 'donut' ? (
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-full md:w-3/5 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} 
                        stroke="#0b0f19"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Centered Donut Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Spent</span>
                <span className="text-base font-extrabold text-white">{formatCurrency(totalExpense)}</span>
              </div>
            </div>

            {/* Compact Legend */}
            <div className="w-full md:w-2/5 flex flex-wrap md:flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {categoryBreakdown.slice(0, 5).map((item, idx) => {
                const color = CATEGORY_COLORS[item.name] || '#94a3b8';
                const pct = totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs w-full py-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-slate-300 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-200">
                      <span>{formatCurrency(item.value)}</span>
                      <span className="text-[10px] text-slate-500">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#spendGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
