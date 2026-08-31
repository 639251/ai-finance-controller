/**
 * Rule-Based Categorization Engine
 * Automatically tags transactions based on merchant keywords, item terms, and contextual clues.
 */

export const CATEGORY_MAP = {
  'Food/Dining': [
    'mcdonalds', 'mcdonald', 'dominos', 'domino', 'pizza', 'starbucks', 'subway',
    'chipotle', 'burger', 'kfc', 'taco bell', 'wendys', 'dunkin', 'boba', 'cafe',
    'coffee', 'dining', 'restaurant', 'canteen', 'cafeteria', 'doordash', 'ubereats',
    'grubhub', 'sushi', 'ramen', 'bakery', 'shake shack', 'panera', 'panda express'
  ],
  'Groceries': [
    'walmart', 'target', 'kroger', 'trader joe', 'whole foods', 'costco', 'safeway',
    'aldi', 'grocery', 'supermarket', 'market', 'instacart', 'convenience', '7-eleven',
    'fruit', 'vegetables', 'meat', 'milk', 'provisions'
  ],
  'Transportation': [
    'uber', 'lyft', 'metro', 'subway pass', 'bus', 'transit', 'gas', 'chevron',
    'shell', 'exxon', 'bp', 'mobil', 'parking', 'toll', 'train', 'amtrak', 'scooter',
    'bird', 'lime', 'flight', 'airline', 'delta', 'united', 'cab', 'taxi'
  ],
  'Housing/Rent': [
    'rent', 'dorm', 'landlord', 'apartment', 'housing', 'lease', 'roommate',
    'mortgage', 'maintenance', 'hoa'
  ],
  'Utilities': [
    'electricity', 'electric', 'water bill', 'wifi', 'internet', 'broadband',
    'verizon', 'at&t', 't-mobile', 'comcast', 'xfinity', 'utility', 'trash', 'power'
  ],
  'Entertainment': [
    'netflix', 'spotify', 'apple music', 'hulu', 'disney', 'hbo', 'cinema',
    'movie', 'amc', 'steam', 'playstation', 'xbox', 'nintendo', 'concert', 'ticket',
    'eventbrite', 'twitch', 'club', 'bar', 'bowling', 'party'
  ],
  'Education': [
    'tuition', 'books', 'textbook', 'course', 'coursera', 'udemy', 'chegg',
    'campus store', 'bookstore', 'stationery', 'notebook', 'quizlet', 'canvas',
    'college', 'university', 'exam fee', 'lab fee'
  ],
  'Shopping': [
    'amazon', 'shein', 'zara', 'h&m', 'nike', 'adidas', 'clothing', 'shoes',
    'electronics', 'apple store', 'best buy', 'ebay', 'thrift', 'mall', 'haul'
  ],
  'Health & Personal Care': [
    'pharmacy', 'cvs', 'walgreens', 'doctor', 'clinic', 'dentist', 'gym',
    'fitness', 'planet fitness', 'salon', 'haircut', 'barber', 'skincare', 'medicine'
  ],
  'Income/Salary': [
    'salary', 'paycheck', 'stipend', 'allowance', 'scholarship', 'refund',
    'freelance', 'cashback', 'bonus', 'direct deposit', 'transfer in', 'gift received'
  ]
};

/**
 * Predicts the most appropriate category for a given text or merchant name.
 * @param {string} text - Description or merchant name (e.g. "Domino's Pizza yesterday")
 * @returns {string} - Matching Category or 'Other'
 */
export function predictCategory(text = '') {
  if (!text || typeof text !== 'string') return 'Other';
  const clean = text.toLowerCase();

  // Explicit Income detection
  if (clean.includes('income') || clean.includes('salary') || clean.includes('stipend') || clean.includes('paycheck') || clean.includes('freelance earned')) {
    return 'Income/Salary';
  }

  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const keyword of keywords) {
      // Word boundary or substring matching
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(clean) || clean.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Other';
}
