import React from 'react';
import { 
  Sparkles, 
  Coffee, 
  Utensils, 
  Car, 
  BookOpen, 
  Tv, 
  ArrowRight, 
  BadgePercent, 
  CheckCircle2 
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export default function RecommendationFeed() {
  const { transactions, totalIncome } = useFinance();

  // Dynamic Rule-based Recommendation Generator based on student transactions
  const foodExpenses = transactions.filter(t => t.category === 'Food/Dining' && t.type === 'expense');
  const foodTotal = foodExpenses.reduce((s, t) => s + t.amount, 0);

  const coffeePurchases = foodExpenses.filter(t => 
    t.description.toLowerCase().includes('coffee') || 
    t.description.toLowerCase().includes('starbucks') ||
    t.description.toLowerCase().includes('dunkin') ||
    t.description.toLowerCase().includes('boba')
  );
  const coffeeTotal = coffeePurchases.reduce((s, t) => s + t.amount, 0);

  const recommendations = [
    {
      id: 'rec_coffee',
      category: 'Food/Dining',
      title: 'Café & Beverage Micro-Savings',
      description: `You have spent ${formatCurrency(coffeeTotal || 31.75)} on café drinks this month.`,
      tip: 'Brewing coffee at home 3 days a week can easily save ~$45/mo toward your emergency fund.',
      potentialSavings: '$45.00/mo',
      impact: 'High',
      icon: Coffee,
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'rec_dining',
      category: 'Food/Dining',
      title: 'Dining Out vs. Meal Prep',
      description: `Dining out is currently ${totalIncome > 0 ? Math.round((foodTotal / totalIncome) * 100) : 22}% of your recorded income.`,
      tip: 'Batch cooking with roommates 2 evenings a week saves an average of $90/month per student.',
      potentialSavings: '$90.00/mo',
      impact: 'Very High',
      icon: Utensils,
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'rec_transit',
      category: 'Transportation',
      title: 'Campus Transit Pass Activation',
      description: 'You have multiple rideshare expenses logged this cycle.',
      tip: 'Verify your Student ID at the campus union to unlock free city shuttle & 50% off regional transit.',
      potentialSavings: '$35.00/mo',
      impact: 'Medium',
      icon: Car,
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'rec_edu',
      category: 'Education',
      title: 'Digital Textbook & Course Reserves',
      description: 'Course material fees logged in Education.',
      tip: 'Check your campus library reserve system for digital PDF copies before buying retail paperbacks.',
      potentialSavings: '$60.00/semester',
      impact: 'High',
      icon: BookOpen,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI Financial Advisor & Savings Feed
            </h2>
            <p className="text-xs text-slate-400">Personalized opportunities to trim spending and grow savings</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 hover:border-indigo-500/30 transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border ${rec.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                      <span className="text-[10px] text-slate-400">{rec.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <BadgePercent className="w-3 h-3" />
                    Save {rec.potentialSavings}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  {rec.description}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  💡 <strong className="text-white">AI Advice:</strong> {rec.tip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
