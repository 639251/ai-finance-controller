/**
 * Helper formatters for Currency, Dates, Percentages
 */

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (isoDate) => {
  if (!isoDate) return '';
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoDate);
};

export const CATEGORY_COLORS = {
  'Food/Dining': '#f59e0b',
  'Housing/Rent': '#8b5cf6',
  'Groceries': '#10b981',
  'Transportation': '#3b82f6',
  'Entertainment': '#ec4899',
  'Utilities': '#06b6d4',
  'Education': '#6366f1',
  'Shopping': '#f43f5e',
  'Health & Personal Care': '#14b8a6',
  'Income/Salary': '#22c55e',
  'Other': '#94a3b8'
};
