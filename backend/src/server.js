import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import finopsRoutes from './routes/finopsRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Finance Controller FinOps Engine',
    time: new Date().toISOString(),
    engine: 'Autonomous FinOps Reconciliation Agent'
  });
});

// API Routes
app.use('/api/finops', finopsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Finance Controller Backend Server running on http://localhost:${PORT}`);
  console.log(`🎙️ Voice & Transaction Endpoints ready at http://localhost:${PORT}/api`);
});

export default app;
