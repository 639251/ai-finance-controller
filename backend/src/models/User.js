/**
 * User Model & Database Schema Reference
 * Compatible with MongoDB (Mongoose) and Relational DBs (PostgreSQL / SQLite)
 */

export const UserSchemaDefinition = {
  id: { type: 'String | UUID', primaryKey: true },
  name: { type: 'String', required: true },
  email: { type: 'String', required: true, unique: true },
  passwordHash: { type: 'String', required: true },
  currency: { type: 'String', default: 'USD' },
  monthlyIncome: { type: 'Number', default: 2500.00 },
  createdAt: { type: 'Date', default: 'Date.now' },
  updatedAt: { type: 'Date', default: 'Date.now' }
};

/*
-- PostgreSQL DDL Equivalent:
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  monthly_income NUMERIC(10, 2) DEFAULT 2500.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
