/**
 * Database & In-Memory Store with Realistic Seed Data for Instant Usability
 */

export const mockDB = {
  users: [
    {
      id: 'usr_student_01',
      name: 'Alex Rivera',
      email: 'alex.rivera@campus.edu',
      monthlyIncome: 2400.00,
      currency: 'USD',
      createdAt: '2026-08-01T00:00:00.000Z'
    }
  ],

  budgets: [
    { id: 'bgt_1', userId: 'usr_student_01', category: 'Food/Dining', monthlyLimit: 350.00, period: '2026-09', alertThresholdPercent: 80 },
    { id: 'bgt_2', userId: 'usr_student_01', category: 'Groceries', monthlyLimit: 250.00, period: '2026-09', alertThresholdPercent: 80 },
    { id: 'bgt_3', userId: 'usr_student_01', category: 'Transportation', monthlyLimit: 120.00, period: '2026-09', alertThresholdPercent: 80 },
    { id: 'bgt_4', userId: 'usr_student_01', category: 'Entertainment', monthlyLimit: 100.00, period: '2026-09', alertThresholdPercent: 80 },
    { id: 'bgt_5', userId: 'usr_student_01', category: 'Education', monthlyLimit: 200.00, period: '2026-09', alertThresholdPercent: 80 },
    { id: 'bgt_6', userId: 'usr_student_01', category: 'Housing/Rent', monthlyLimit: 850.00, period: '2026-09', alertThresholdPercent: 90 },
    { id: 'bgt_7', userId: 'usr_student_01', category: 'Shopping', monthlyLimit: 150.00, period: '2026-09', alertThresholdPercent: 80 }
  ],

  transactions: [
    {
      id: 'tx_01',
      userId: 'usr_student_01',
      type: 'income',
      amount: 1200.00,
      category: 'Income/Salary',
      description: 'University Research Lab Stipend',
      merchant: 'University Payroll',
      date: '2026-09-01',
      source: 'recurring',
      createdAt: '2026-09-01T08:00:00.000Z'
    },
    {
      id: 'tx_02',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 850.00,
      category: 'Housing/Rent',
      description: 'Monthly Dorm & Apartment Lease',
      merchant: 'Campus Commons Housing',
      date: '2026-09-01',
      source: 'manual',
      createdAt: '2026-09-01T09:30:00.000Z'
    },
    {
      id: 'tx_03',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 25.00,
      category: 'Food/Dining',
      description: 'Domino\'s Pizza Combo Meal',
      merchant: 'Domino\'s',
      date: '2026-08-31',
      source: 'voice',
      rawVoiceTranscript: "I spent $25 on pizza at Domino's yesterday",
      createdAt: '2026-08-31T20:15:00.000Z'
    },
    {
      id: 'tx_04',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 6.75,
      category: 'Food/Dining',
      description: 'Iced Caramel Macchiato',
      merchant: 'Starbucks',
      date: '2026-08-30',
      source: 'voice',
      rawVoiceTranscript: "Spent 6 dollars and 75 cents at Starbucks this morning",
      createdAt: '2026-08-30T09:00:00.000Z'
    },
    {
      id: 'tx_05',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 68.40,
      category: 'Groceries',
      description: 'Weekly Essentials & Produce',
      merchant: 'Trader Joe\'s',
      date: '2026-08-29',
      source: 'manual',
      createdAt: '2026-08-29T16:20:00.000Z'
    },
    {
      id: 'tx_06',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 18.50,
      category: 'Transportation',
      description: 'Campus to Downtown Rideshare',
      merchant: 'Uber',
      date: '2026-08-28',
      source: 'voice',
      rawVoiceTranscript: "Paid 18.50 for Uber downtown",
      createdAt: '2026-08-28T22:10:00.000Z'
    },
    {
      id: 'tx_07',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 85.00,
      category: 'Education',
      description: 'Calculus & Data Science Textbooks',
      merchant: 'Campus Bookstore',
      date: '2026-08-26',
      source: 'manual',
      createdAt: '2026-08-26T11:00:00.000Z'
    },
    {
      id: 'tx_08',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 5.99,
      category: 'Entertainment',
      description: 'Student Premium Streaming Plan',
      merchant: 'Spotify',
      date: '2026-08-25',
      source: 'recurring',
      createdAt: '2026-08-25T00:00:00.000Z'
    },
    {
      id: 'tx_09',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 14.50,
      category: 'Food/Dining',
      description: 'Burrito Bowl with Guac',
      merchant: 'Chipotle',
      date: '2026-08-24',
      source: 'manual',
      createdAt: '2026-08-24T13:40:00.000Z'
    },
    {
      id: 'tx_10',
      userId: 'usr_student_01',
      type: 'expense',
      amount: 42.00,
      category: 'Shopping',
      description: 'Campus Hoodie & Desk Lamp',
      merchant: 'Amazon',
      date: '2026-08-22',
      source: 'manual',
      createdAt: '2026-08-22T15:10:00.000Z'
    }
  ],

  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_student_01',
      type: 'velocity_warning',
      severity: 'warning',
      category: 'Food/Dining',
      title: 'High Dining Spending Velocity',
      message: 'You have used 72% of your Food/Dining monthly budget in the first 10 days of the cycle.',
      suggestedAction: 'Try meal-prepping 2 lunches this week to stay under your $350 cap.',
      potentialSavings: 45.00,
      read: false,
      createdAt: '2026-08-31T20:30:00.000Z'
    },
    {
      id: 'notif_2',
      userId: 'usr_student_01',
      type: 'recommendation',
      severity: 'info',
      category: 'Food/Dining',
      title: 'Coffee Spending Optimization',
      message: 'Coffee purchases average $48/month. Brewing coffee at home 3 days a week could save ~$30 monthly.',
      suggestedAction: 'Invest in a $15 French press or campus refill mug for 20% discount.',
      potentialSavings: 30.00,
      read: false,
      createdAt: '2026-08-30T10:00:00.000Z'
    },
    {
      id: 'notif_3',
      userId: 'usr_student_01',
      type: 'milestone',
      severity: 'success',
      category: 'Housing/Rent',
      title: 'Rent Paid on Time',
      message: 'Monthly lease payment of $850.00 logged successfully. Your housing budget is fully on track.',
      suggestedAction: 'No action needed.',
      potentialSavings: 0,
      read: true,
      createdAt: '2026-09-01T09:35:00.000Z'
    }
  ]
};
