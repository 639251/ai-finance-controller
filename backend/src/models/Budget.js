/**
 * Budget Model & Database Schema Reference
 */

export const BudgetSchemaDefinition = {
  id: { type: 'String | UUID', primaryKey: true },
  userId: { type: 'String | UUID', ref: 'User', required: true },
  category: { type: 'String', required: true },
  monthlyLimit: { type: 'Number', required: true },
  period: { type: 'String (YYYY-MM)', required: true }, // e.g. "2026-09"
  alertThresholdPercent: { type: 'Number', default: 80 },
  createdAt: { type: 'Date', default: 'Date.now' }
};

/*
-- PostgreSQL DDL Equivalent:
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  monthly_limit NUMERIC(10, 2) NOT NULL,
  period VARCHAR(7) NOT NULL, -- 'YYYY-MM'
  alert_threshold_percent INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, period)
);
*/
