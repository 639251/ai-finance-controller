import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank, 
  Receipt 
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export default function StatCard() {
  const { totalIncome, totalExpense, netBalance, savingsRate, transactions } = useFinance();

  const stats = [
    {
      title: 'Net Cashflow',
      value: formatCurrency(netBalance),
      subtitle: netBalance >= 0 ? 'Surplus this cycle' : 'Deficit this cycle',
      icon: Wallet,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      trend: netBalance >= 0 ? '+12.4%' : '-5.2%',
      trendType: netBalance >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Monthly Spending',
      value: formatCurrency(totalExpense),
      subtitle: `${transactions.filter(t => t.type === 'expense').length} expense transactions`,
      icon: Receipt,
      gradient: 'from-rose-500/20 to-orange-500/10',
      iconColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      trend: 'Pace: Normal',
      trendType: 'neutral'
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      subtitle: 'Stipends & Campus Earnings',
      icon: TrendingUp,
      gradient: 'from-indigo-500/20 to-blue-500/10',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      trend: 'On Track',
      trendType: 'positive'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      subtitle: savingsRate >= 20 ? 'Target: 20%+ achieved' : 'Target: Aim for 20%',
      icon: PiggyBank,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      trend: savingsRate >= 20 ? 'Great discipline' : 'Needs attention',
      trendType: savingsRate >= 20 ? 'positive' : 'warning'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b ${stat.gradient} bg-slate-900/60 border ${stat.borderColor} backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 ${stat.iconColor} shadow-inner`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </h3>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 truncate max-w-[150px]">
                  {stat.subtitle}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  stat.trendType === 'positive' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : stat.trendType === 'warning'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
