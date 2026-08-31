import { mockDB } from '../config/db.js';
import { predictCategory } from '../services/categorizationRules.js';

/**
 * Controller for Transaction Operations (CRUD + Analytics)
 */

export const getTransactions = (req, res) => {
  try {
    const { category, type, search, startDate, endDate } = req.query;
    let list = [...mockDB.transactions];

    if (category && category !== 'All') {
      list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (type && type !== 'All') {
      list = list.filter(t => t.type === type);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => 
        t.description.toLowerCase().includes(q) ||
        (t.merchant && t.merchant.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (startDate) {
      list = list.filter(t => t.date >= startDate);
    }

    if (endDate) {
      list = list.filter(t => t.date <= endDate);
    }

    // Sort by date DESC
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTransaction = (req, res) => {
  try {
    const { amount, description, category, date, type, source, rawVoiceTranscript, merchant } = req.body;

    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }

    // Dynamic categorization fallback if user didn't specify or selected 'Other'
    let finalCategory = category;
    if (!finalCategory || finalCategory === 'Other' || finalCategory === 'Auto') {
      finalCategory = predictCategory(description + ' ' + (merchant || ''));
    }

    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: req.body.userId || 'usr_student_01',
      type: type === 'income' ? 'income' : 'expense',
      amount: Math.abs(parseFloat(amount)),
      category: finalCategory,
      description: description.trim(),
      merchant: merchant ? merchant.trim() : '',
      date: date || new Date().toISOString().split('T')[0],
      source: source || 'manual',
      rawVoiceTranscript: rawVoiceTranscript || null,
      createdAt: new Date().toISOString()
    };

    mockDB.transactions.unshift(newTx);

    // Check budget threshold & emit alert if exceeded
    if (newTx.type === 'expense') {
      const budget = mockDB.budgets.find(b => b.category === finalCategory);
      if (budget) {
        // Calculate total spend in this category for the current month
        const currentMonth = newTx.date.substring(0, 7);
        const totalSpent = mockDB.transactions
          .filter(t => t.category === finalCategory && t.type === 'expense' && t.date.startsWith(currentMonth))
          .reduce((sum, t) => sum + t.amount, 0);

        const spentPct = (totalSpent / budget.monthlyLimit) * 100;

        if (spentPct >= 100) {
          mockDB.notifications.unshift({
            id: 'notif_' + Date.now(),
            userId: newTx.userId,
            type: 'budget_exceeded',
            severity: 'critical',
            category: finalCategory,
            title: `Budget Exceeded: ${finalCategory}`,
            message: `You have spent $${totalSpent.toFixed(2)} out of your $${budget.monthlyLimit.toFixed(2)} monthly budget (${spentPct.toFixed(0)}%).`,
            suggestedAction: `Pause non-essential ${finalCategory} spending for the rest of this cycle.`,
            potentialSavings: totalSpent - budget.monthlyLimit,
            read: false,
            createdAt: new Date().toISOString()
          });
        } else if (spentPct >= budget.alertThresholdPercent) {
          mockDB.notifications.unshift({
            id: 'notif_' + Date.now(),
            userId: newTx.userId,
            type: 'velocity_warning',
            severity: 'warning',
            category: finalCategory,
            title: `Budget Warning: ${finalCategory}`,
            message: `You have reached ${spentPct.toFixed(0)}% of your $${budget.monthlyLimit.toFixed(2)} budget limit for ${finalCategory}.`,
            suggestedAction: `Limit further expenses in this category to $${(budget.monthlyLimit - totalSpent).toFixed(2)}.`,
            potentialSavings: 0,
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: newTx
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = (req, res) => {
  try {
    const { id } = req.params;
    const index = mockDB.transactions.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const removed = mockDB.transactions.splice(index, 1)[0];
    res.json({ success: true, message: 'Transaction deleted', data: removed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlySummary = (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().substring(0, 7); // e.g. "2026-09"
    const txs = mockDB.transactions;

    const totalIncome = txs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = txs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

    // Category breakdown
    const categoryTotals = {};
    txs
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const categoryBreakdown = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      total: Math.round(categoryTotals[cat] * 100) / 100
    })).sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      period: month,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate,
        transactionCount: txs.length
      },
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
