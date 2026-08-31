import { mockDB } from '../config/db.js';

/**
 * Controller for AI Insights, Recommendations & Notification Center
 */

export const getInsightsAndAlerts = (req, res) => {
  try {
    const txs = mockDB.transactions;
    const budgets = mockDB.budgets;
    const notifications = [...mockDB.notifications];

    // Compute dynamic recommendations based on transaction patterns
    const dynamicRecommendations = [];

    // 1. Food / Coffee Spending analysis
    const foodExpenses = txs.filter(t => t.category === 'Food/Dining' && t.type === 'expense');
    const totalFood = foodExpenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 1200;

    const coffeePurchases = foodExpenses.filter(t => 
      t.description.toLowerCase().includes('coffee') || 
      t.description.toLowerCase().includes('starbucks') ||
      t.description.toLowerCase().includes('dunkin') ||
      t.description.toLowerCase().includes('boba')
    );
    const coffeeTotal = coffeePurchases.reduce((sum, t) => sum + t.amount, 0);

    if (coffeeTotal > 20) {
      dynamicRecommendations.push({
        id: 'rec_coffee_' + Date.now(),
        category: 'Food/Dining',
        title: 'Café & Beverage Optimization',
        description: `You have spent $${coffeeTotal.toFixed(2)} on café beverages across ${coffeePurchases.length} visits.`,
        tip: 'Brewing specialty coffee or tea at home on weekdays could save you ~$40-60 every month.',
        impact: 'High ($40+/mo)',
        icon: 'Coffee'
      });
    }

    if (totalFood > 0 && (totalFood / totalIncome) > 0.25) {
      dynamicRecommendations.push({
        id: 'rec_dining_' + Date.now(),
        category: 'Food/Dining',
        title: 'Dining Out vs. Grocery Balance',
        description: `Dining & takeout represents ${Math.round((totalFood / totalIncome) * 100)}% of your monthly income.`,
        tip: 'Batch meal prepping with friends twice a week can cut food expenses by 35%.',
        impact: 'Very High ($80+/mo)',
        icon: 'Utensils'
      });
    }

    // 2. Rideshare & Transport
    const uberExpenses = txs.filter(t => 
      t.category === 'Transportation' && 
      (t.description.toLowerCase().includes('uber') || t.description.toLowerCase().includes('lyft'))
    );
    const uberTotal = uberExpenses.reduce((sum, t) => sum + t.amount, 0);

    if (uberTotal > 30) {
      dynamicRecommendations.push({
        id: 'rec_transit_' + Date.now(),
        category: 'Transportation',
        title: 'Campus Transit Pass Opportunity',
        description: `You have spent $${uberTotal.toFixed(2)} on rideshares this month.`,
        tip: 'Check if your student ID qualifies for free or discounted university shuttle & bus passes.',
        impact: 'Medium ($35/mo)',
        icon: 'Car'
      });
    }

    // 3. Textbook & Subscription Savings
    const eduSpend = txs.filter(t => t.category === 'Education').reduce((s, t) => s + t.amount, 0);
    if (eduSpend > 50) {
      dynamicRecommendations.push({
        id: 'rec_edu_' + Date.now(),
        category: 'Education',
        title: 'Digital Textbook & Library Rentals',
        description: `You have spent $${eduSpend.toFixed(2)} on course materials.`,
        tip: 'Check university open-access libraries, PDF reserves, or student rental exchanges.',
        impact: 'High ($50+/semester)',
        icon: 'BookOpen'
      });
    }

    res.json({
      success: true,
      notifications,
      recommendations: dynamicRecommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const notif = mockDB.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      return res.json({ success: true, data: notif });
    }
    res.status(404).json({ success: false, message: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
