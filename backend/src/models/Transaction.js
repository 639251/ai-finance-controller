/**
 * Transaction Model & Database Schema Reference
 */

export const TransactionSchemaDefinition = {
  id: { type: 'String | UUID', primaryKey: true },
  userId: { type: 'String | UUID', ref: 'User', required: true },
  type: { type: 'String', enum: ['expense', 'income'], required: true },
  amount: { type: 'Number', required: true },
  category: { 
    type: 'String', 
    enum: [
      'Food/Dining', 'Housing/Rent', 'Groceries', 'Transportation',
      'Entertainment', 'Utilities', 'Education', 'Shopping',
      'Health & Personal Care', 'Income/Salary', 'Other'
    ], 
    required: true 
  },
  description: { type: 'String', required: true },
  merchant: { type: 'String' },
  date: { type: 'String (YYYY-MM-DD)', required: true },
  source: { type: 'String', enum: ['manual', 'voice', 'receipt_scan', 'recurring'], default: 'manual' },
  rawVoiceTranscript: { type: 'String' },
  tags: { type: 'Array of Strings', default: [] },
  createdAt: { type: 'Date', default: 'Date.now' }
};

/*
-- PostgreSQL DDL Equivalent:
CREATE TYPE transaction_type AS ENUM ('expense', 'income');
CREATE TYPE transaction_source AS ENUM ('manual', 'voice', 'receipt_scan', 'recurring');

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  merchant VARCHAR(100),
  date DATE NOT NULL,
  source transaction_source DEFAULT 'manual',
  raw_voice_transcript TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category);
*/
