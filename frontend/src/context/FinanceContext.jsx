import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseSpokenExpense } from '../utils/voiceParser';

const FinanceContext = createContext();

const DEMO_USERS = [
  {
    id: 'usr_student_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    password: 'password123',
    role: 'Computer Science Student',
    monthlyIncome: 2400.00,
    currency: 'USD'
  },
  {
    id: 'usr_freelance_02',
    name: 'Priya Sharma',
    email: 'priya.sharma@creative.io',
    password: 'password123',
    role: 'Freelance UI/UX Designer',
    monthlyIncome: 3500.00,
    currency: 'USD'
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_01',
    userId: 'usr_student_01',
    type: 'income',
    amount: 1400.00,
    category: 'Income/Salary',
    description: 'Research Assistant Campus Payroll',
    merchant: 'University',
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
    description: 'Student Apartment Lease Payment',
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
    description: 'Weekly Fresh Produce & Pantry',
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
    description: 'Uber Ride to Downtown Library',
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
    description: 'Spotify Student Premium',
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
    description: 'Chipotle Chicken Bowl',
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
    description: 'Desk Lamp & Study Organizer',
    merchant: 'Amazon',
    date: '2026-08-22',
    source: 'manual',
    createdAt: '2026-08-22T15:10:00.000Z'
  }
];

const INITIAL_BUDGETS = [
  { category: 'Food/Dining', monthlyLimit: 350.00, alertThresholdPercent: 80 },
  { category: 'Groceries', monthlyLimit: 250.00, alertThresholdPercent: 80 },
  { category: 'Housing/Rent', monthlyLimit: 850.00, alertThresholdPercent: 95 },
  { category: 'Transportation', monthlyLimit: 120.00, alertThresholdPercent: 80 },
  { category: 'Entertainment', monthlyLimit: 100.00, alertThresholdPercent: 80 },
  { category: 'Education', monthlyLimit: 200.00, alertThresholdPercent: 80 },
  { category: 'Shopping', monthlyLimit: 150.00, alertThresholdPercent: 80 },
  { category: 'Utilities', monthlyLimit: 100.00, alertThresholdPercent: 85 }
];

export function FinanceProvider({ children }) {
  // Authentication State (Starts logged out by default unless explicit session exists)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('ai_finance_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ai_finance_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('ai_finance_token') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Transactions & Budgets State
  const [transactions, setTransactions] = useState(() => {
    const userKey = currentUser ? `ai_finance_txs_${currentUser.id}` : 'ai_finance_txs';
    const saved = localStorage.getItem(userKey);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const userKey = currentUser ? `ai_finance_budgets_${currentUser.id}` : 'ai_finance_budgets';
    const saved = localStorage.getItem(userKey);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      type: 'velocity_warning',
      severity: 'warning',
      category: 'Food/Dining',
      title: 'High Dining Velocity Alert',
      message: 'You have used 72% of your Food/Dining monthly budget in the first 10 days of the cycle.',
      suggestedAction: 'Meal prep 2 days this week to stay safely under your $350 cap.',
      potentialSavings: 45.00,
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif_2',
      type: 'recommendation',
      severity: 'info',
      category: 'Food/Dining',
      title: 'Coffee Spending Optimization',
      message: 'Café visits average $48/month. Brewing coffee at home 3 days a week can save ~$30 monthly.',
      suggestedAction: 'Switch to a $15 travel tumbler with campus free refill perks.',
      potentialSavings: 30.00,
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Sync users to storage
  useEffect(() => {
    localStorage.setItem('ai_finance_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sync current user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ai_finance_current_user', JSON.stringify(currentUser));
      // Load user specific transactions and budgets
      const userTxs = localStorage.getItem(`ai_finance_txs_${currentUser.id}`);
      if (userTxs) {
        setTransactions(JSON.parse(userTxs));
      } else if (currentUser.id === 'usr_student_01') {
        setTransactions(INITIAL_TRANSACTIONS);
      } else {
        setTransactions([]);
      }

      const userBudgets = localStorage.getItem(`ai_finance_budgets_${currentUser.id}`);
      if (userBudgets) {
        setBudgets(JSON.parse(userBudgets));
      } else {
        setBudgets(INITIAL_BUDGETS);
      }
    } else {
      localStorage.removeItem('ai_finance_current_user');
    }
  }, [currentUser]);

  // Save current user's transactions
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`ai_finance_txs_${currentUser.id}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  // Save current user's budgets
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`ai_finance_budgets_${currentUser.id}`, JSON.stringify(budgets));
    }
  }, [budgets, currentUser]);

  // AUTH ACTIONS
  const signupUser = async ({ name, email, password, role, monthlyIncome }) => {
    const cleanEmail = email.toLowerCase().trim();
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role || 'Student',
      monthlyIncome: parseFloat(monthlyIncome) || 2200.00,
      currency: 'USD',
      createdAt: new Date().toISOString()
    };

    const token = 'jwt_token_' + newUser.id + '_' + Date.now();

    setRegisteredUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthToken(token);
    localStorage.setItem('ai_finance_token', token);

    // Give new user welcome initial stipend transaction
    const welcomeTx = {
      id: 'tx_welcome_' + Date.now(),
      userId: newUser.id,
      type: 'income',
      amount: parseFloat(monthlyIncome) || 2200.00,
      category: 'Income/Salary',
      description: 'Initial Monthly Starting Balance',
      merchant: 'Account Setup',
      date: new Date().toISOString().split('T')[0],
      source: 'manual',
      createdAt: new Date().toISOString()
    };

    setTransactions([welcomeTx]);
    setBudgets(INITIAL_BUDGETS);

    // Try sending to backend if live
    try {
      fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, monthlyIncome })
      }).catch(() => {});
    } catch (e) {}

    return newUser;
  };

  const loginUser = async ({ email, password }) => {
    const cleanEmail = email.toLowerCase().trim();
    const user = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    if (user.password && user.password !== password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const token = 'jwt_token_' + user.id + '_' + Date.now();
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('ai_finance_token', token);

    // Try notifying backend
    try {
      fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).catch(() => {});
    } catch (e) {}

    return user;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('ai_finance_token');
    localStorage.removeItem('ai_finance_current_user');
    setIsAuthModalOpen(true);
    setAuthMode('login');
  };

  const switchUser = (user) => {
    setCurrentUser(user);
    const token = 'jwt_token_' + user.id + '_' + Date.now();
    setAuthToken(token);
    localStorage.setItem('ai_finance_token', token);
  };

  // FINANCIAL ANALYTICS
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Category breakdown
  const categoryTotals = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const categoryBreakdown = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: Math.round(categoryTotals[category] * 100) / 100
  })).sort((a, b) => b.value - a.value);

  // Budget calculations
  const budgetStatus = budgets.map(b => {
    const spent = categoryTotals[b.category] || 0;
    const percentage = Math.min(100, Math.round((spent / b.monthlyLimit) * 100));
    const remaining = Math.max(0, b.monthlyLimit - spent);
    const isOver = spent > b.monthlyLimit;
    const isWarning = percentage >= b.alertThresholdPercent;

    return {
      ...b,
      spent: Math.round(spent * 100) / 100,
      remaining: Math.round(remaining * 100) / 100,
      percentage,
      isOver,
      isWarning
    };
  });

  // Add transaction
  const addTransaction = (tx) => {
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: currentUser ? currentUser.id : 'usr_student_01',
      type: tx.type || 'expense',
      amount: Math.abs(parseFloat(tx.amount)),
      category: tx.category || 'Food/Dining',
      description: tx.description || 'General Expense',
      merchant: tx.merchant || '',
      date: tx.date || new Date().toISOString().split('T')[0],
      source: tx.source || 'manual',
      rawVoiceTranscript: tx.rawVoiceTranscript || null,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    // Check budget limit alert
    if (newTx.type === 'expense') {
      const budget = budgets.find(b => b.category === newTx.category);
      if (budget) {
        const currentSpent = (categoryTotals[newTx.category] || 0) + newTx.amount;
        const pct = (currentSpent / budget.monthlyLimit) * 100;

        if (pct >= 100) {
          const alert = {
            id: 'notif_' + Date.now(),
            type: 'budget_exceeded',
            severity: 'critical',
            category: newTx.category,
            title: `Budget Cap Reached: ${newTx.category}`,
            message: `You've spent $${currentSpent.toFixed(2)} of your $${budget.monthlyLimit.toFixed(2)} budget limit (${Math.round(pct)}%).`,
            suggestedAction: `Hold off on further ${newTx.category} spending until next month.`,
            potentialSavings: currentSpent - budget.monthlyLimit,
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(prev => [alert, ...prev]);
        } else if (pct >= budget.alertThresholdPercent) {
          const alert = {
            id: 'notif_' + Date.now(),
            type: 'velocity_warning',
            severity: 'warning',
            category: newTx.category,
            title: `Approaching Budget Limit: ${newTx.category}`,
            message: `You have spent ${Math.round(pct)}% of your $${budget.monthlyLimit.toFixed(2)} monthly budget.`,
            suggestedAction: `Only $${(budget.monthlyLimit - currentSpent).toFixed(2)} remaining for this category.`,
            potentialSavings: 0,
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(prev => [alert, ...prev]);
        }
      }
    }

    return newTx;
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudgetCap = (category, monthlyLimit, alertThresholdPercent) => {
    setBudgets(prev => prev.map(b => {
      if (b.category.toLowerCase() === category.toLowerCase()) {
        return {
          ...b,
          monthlyLimit: parseFloat(monthlyLimit) || b.monthlyLimit,
          alertThresholdPercent: parseInt(alertThresholdPercent) || b.alertThresholdPercent
        };
      }
      return b;
    }));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    if (currentUser) {
      localStorage.removeItem(`ai_finance_txs_${currentUser.id}`);
      localStorage.removeItem(`ai_finance_budgets_${currentUser.id}`);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        currentUser,
        registeredUsers,
        authToken,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        signupUser,
        loginUser,
        logoutUser,
        switchUser,
        transactions,
        budgets,
        budgetStatus,
        notifications,
        categoryBreakdown,
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isManualModalOpen,
        setIsManualModalOpen,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        addTransaction,
        deleteTransaction,
        updateBudgetCap,
        markNotificationRead,
        clearAllNotifications,
        resetDemoData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
