import express from 'express';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getMonthlySummary
} from '../controllers/transactionController.js';

const router = express.Router();

// GET /api/transactions - Fetch all or filtered transactions
router.get('/', getTransactions);

// GET /api/transactions/summary - Get total balance, spending, income & category breakdown
router.get('/summary', getMonthlySummary);

// POST /api/transactions - Create new transaction (manual or voice verified)
router.post('/', createTransaction);

// DELETE /api/transactions/:id - Remove transaction
router.delete('/:id', deleteTransaction);

export default router;
