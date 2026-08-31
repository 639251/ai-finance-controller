import express from 'express';
import { getBudgets, updateBudget } from '../controllers/budgetController.js';

const router = express.Router();

// GET /api/budgets - Get all categories with progress and over-budget flags
router.get('/', getBudgets);

// PUT /api/budgets/:category - Update cap or threshold
router.put('/:category', updateBudget);

export default router;
