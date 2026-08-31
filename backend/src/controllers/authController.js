import { mockDB } from '../config/db.js';

/**
 * Real-Time User Authentication & Account Management Controller
 */

// Helper to generate a realistic token
const generateToken = (userId) => {
  return `jwt_token_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * POST /api/auth/signup
 * Register a new user account with initial default budgets
 */
export const signup = (req, res) => {
  try {
    const { name, email, password, monthlyIncome, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = mockDB.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      email: cleanEmail,
      password: password, // In production, bcrypt.hashSync(password, 10)
      role: role || 'Student / Young Professional',
      monthlyIncome: parseFloat(monthlyIncome) || 2000.00,
      currency: 'USD',
      createdAt: new Date().toISOString()
    };

    mockDB.users.push(newUser);

    // Initialize default student budgets for this new user
    const defaultBudgets = [
      { id: 'bgt_' + Date.now() + '_1', userId: newUser.id, category: 'Food/Dining', monthlyLimit: 300.00, alertThresholdPercent: 80 },
      { id: 'bgt_' + Date.now() + '_2', userId: newUser.id, category: 'Groceries', monthlyLimit: 200.00, alertThresholdPercent: 80 },
      { id: 'bgt_' + Date.now() + '_3', userId: newUser.id, category: 'Housing/Rent', monthlyLimit: 750.00, alertThresholdPercent: 90 },
      { id: 'bgt_' + Date.now() + '_4', userId: newUser.id, category: 'Transportation', monthlyLimit: 100.00, alertThresholdPercent: 80 },
      { id: 'bgt_' + Date.now() + '_5', userId: newUser.id, category: 'Entertainment', monthlyLimit: 80.00, alertThresholdPercent: 80 },
      { id: 'bgt_' + Date.now() + '_6', userId: newUser.id, category: 'Education', monthlyLimit: 150.00, alertThresholdPercent: 80 }
    ];
    mockDB.budgets.push(...defaultBudgets);

    // Welcome notification
    mockDB.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: newUser.id,
      type: 'milestone',
      severity: 'success',
      title: `Welcome to AI Finance Controller, ${newUser.name}!`,
      message: 'Your account and smart budgeting categories have been configured.',
      suggestedAction: 'Try logging your first expense with our Voice Entry button!',
      read: false,
      createdAt: new Date().toISOString()
    });

    const token = generateToken(newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        monthlyIncome: newUser.monthlyIncome,
        currency: newUser.currency
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/login
 * Authenticate existing user with email and password
 */
export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = mockDB.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email address. Please sign up.'
      });
    }

    // Check password (simple comparison for mock or bcrypt)
    if (user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please verify and try again.'
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Student',
        monthlyIncome: user.monthlyIncome,
        currency: user.currency
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/auth/me
 */
export const getCurrentUser = (req, res) => {
  const userId = req.headers['x-user-id'] || (mockDB.users[0] && mockDB.users[0].id);
  const user = mockDB.users.find(u => u.id === userId) || mockDB.users[0];

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      monthlyIncome: user.monthlyIncome,
      currency: user.currency
    }
  });
};

/**
 * PUT /api/auth/profile
 */
export const updateProfile = (req, res) => {
  const userId = req.headers['x-user-id'] || (mockDB.users[0] && mockDB.users[0].id);
  const user = mockDB.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { monthlyIncome, name, role } = req.body;
  if (monthlyIncome !== undefined) user.monthlyIncome = parseFloat(monthlyIncome);
  if (name) user.name = name.trim();
  if (role) user.role = role.trim();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      monthlyIncome: user.monthlyIncome,
      currency: user.currency
    }
  });
};

