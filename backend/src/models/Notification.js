/**
 * Notification / Smart Alert & Recommendation Model
 */

export const NotificationSchemaDefinition = {
  id: { type: 'String | UUID', primaryKey: true },
  userId: { type: 'String | UUID', ref: 'User', required: true },
  type: { 
    type: 'String', 
    enum: ['alert', 'recommendation', 'budget_exceeded', 'velocity_warning', 'milestone'], 
    required: true 
  },
  title: { type: 'String', required: true },
  message: { type: 'String', required: true },
  severity: { type: 'String', enum: ['info', 'warning', 'critical', 'success'], default: 'info' },
  category: { type: 'String' },
  suggestedAction: { type: 'String' },
  potentialSavings: { type: 'Number' },
  read: { type: 'Boolean', default: false },
  createdAt: { type: 'Date', default: 'Date.now' }
};

/*
-- PostgreSQL DDL Equivalent:
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info',
  category VARCHAR(50),
  suggested_action TEXT,
  potential_savings NUMERIC(10, 2),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
