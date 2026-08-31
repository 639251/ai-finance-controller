import { mockDB } from '../config/db.js';

/**
 * Controller for Category Budgets & Spending Velocity
 */

export const getBudgets = (req, res) => {
  try {
    const period = req.query.period || new Date().toISOString().substring(0, 7);
    
    // Calculate current spending for each budget category
    const budgetsWithProgress = mockDB.budgets.map(budget => {
      const spent = mockDB.transactions
        .filter(t => t.category === budget.category && t.type === 'expense' && t.date.startsWith(period))
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = Math.min(100, Math.round((spent / budget.monthlyLimit) * 100));
      const remaining = Math.max(0, budget.monthlyLimit - spent);
      const isOverBudget = spent > budget.monthlyLimit;
      const isNearLimit = percentage >= budget.alertThresholdPercent;

      return {
        ...budget,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage,
        isOverBudget,
        isNearLimit
      };
    });

    res.json({
      success: true,
      period,
      data: budgetsWithProgress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBudget = (req, res) => {
  try {
    const { category } = req.params;
    const { monthlyLimit, alertThresholdPercent } = req.body;

    let budget = mockDB.budgets.find(b => b.category.toLowerCase() === category.toLowerCase());

    if (budget) {
      if (monthlyLimit !== undefined) budget.monthlyLimit = parseFloat(monthlyLimit);
      if (alertThresholdPercent !== undefined) budget.alertThresholdPercent = parseInt(alertThresholdPercent);
    } else {
      budget = {
        id: 'bgt_' + Date.now(),
        userId: 'usr_student_01',
        category,
        monthlyLimit: parseFloat(monthlyLimit) || 100,
        period: new Date().toISOString().substring(0, 7),
        alertThresholdPercent: parseInt(alertThresholdPercent) || 80
      };
      mockDB.budgets.push(budget);
    }

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
