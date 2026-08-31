/**
 * Client-Side Voice NLP Parser & Entity Extractor
 * Provides instant offline speech parsing with rich merchant recognition
 */

const CATEGORY_KEYWORDS = {
  'Food/Dining': [
    'mcdonalds', 'mcdonald', 'dominos', 'domino', 'pizza', 'starbucks', 'subway',
    'chipotle', 'burger', 'kfc', 'taco bell', 'wendys', 'dunkin', 'boba', 'cafe',
    'coffee', 'dining', 'restaurant', 'canteen', 'cafeteria', 'doordash', 'ubereats',
    'grubhub', 'sushi', 'ramen', 'bakery', 'shake shack', 'panera', 'panda express',
    'lunch', 'dinner', 'breakfast', 'snack'
  ],
  'Groceries': [
    'walmart', 'target', 'kroger', 'trader joe', 'whole foods', 'costco', 'safeway',
    'aldi', 'grocery', 'supermarket', 'market', 'instacart', 'convenience', '7-eleven',
    'fruit', 'vegetables', 'meat', 'milk', 'eggs', 'provisions'
  ],
  'Transportation': [
    'uber', 'lyft', 'metro', 'subway pass', 'bus', 'transit', 'gas', 'chevron',
    'shell', 'exxon', 'bp', 'mobil', 'parking', 'toll', 'train', 'amtrak', 'scooter',
    'bird', 'lime', 'flight', 'airline', 'delta', 'united', 'cab', 'taxi'
  ],
  'Housing/Rent': [
    'rent', 'dorm', 'landlord', 'apartment', 'housing', 'lease', 'roommate',
    'maintenance', 'hoa'
  ],
  'Utilities': [
    'electricity', 'electric', 'water bill', 'wifi', 'internet', 'broadband',
    'verizon', 'at&t', 't-mobile', 'comcast', 'xfinity', 'utility', 'trash', 'power'
  ],
  'Entertainment': [
    'netflix', 'spotify', 'apple music', 'hulu', 'disney', 'hbo', 'cinema',
    'movie', 'amc', 'steam', 'playstation', 'xbox', 'nintendo', 'concert', 'ticket',
    'eventbrite', 'twitch', 'club', 'bar', 'bowling', 'party', 'games'
  ],
  'Education': [
    'tuition', 'books', 'textbook', 'course', 'coursera', 'udemy', 'chegg',
    'campus store', 'bookstore', 'stationery', 'notebook', 'quizlet', 'canvas',
    'college', 'university', 'exam fee', 'lab fee', 'pens', 'binder'
  ],
  'Shopping': [
    'amazon', 'shein', 'zara', 'h&m', 'nike', 'adidas', 'clothing', 'shoes',
    'electronics', 'apple store', 'best buy', 'ebay', 'thrift', 'mall', 'hoodie', 'jacket'
  ],
  'Health & Personal Care': [
    'pharmacy', 'cvs', 'walgreens', 'doctor', 'clinic', 'dentist', 'gym',
    'fitness', 'planet fitness', 'salon', 'haircut', 'barber', 'skincare', 'medicine'
  ],
  'Income/Salary': [
    'salary', 'paycheck', 'stipend', 'allowance', 'scholarship', 'refund',
    'freelance', 'cashback', 'bonus', 'direct deposit', 'transfer in', 'gift received', 'earned'
  ]
};

export function parseSpokenExpense(text) {
  if (!text || typeof text !== 'string') {
    return {
      amount: 0,
      category: 'Food/Dining',
      description: 'Voice Entry',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    };
  }

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Detect Type
  const isIncome = lower.includes('income') || 
                   lower.includes('salary') || 
                   lower.includes('received') || 
                   lower.includes('got paid') || 
                   lower.includes('earned') ||
                   lower.includes('stipend');
  const type = isIncome ? 'income' : 'expense';

  // 2. Extract Amount
  let amount = 0;
  // Match currency values like "$25", "25 dollars", "25.50 bucks", "for 40"
  const amountMatch = lower.match(/(?:\$|usd|bucks?|dollars?)\s*(\d+(?:\.\d{1,2})?)/i) ||
                      lower.match(/(\d+(?:\.\d{1,2})?)\s*(?:\$|usd|bucks?|dollars?)/i) ||
                      lower.match(/(?:spent|paid|for|cost|got)\s*(?:\$)?\s*(\d+(?:\.\d{1,2})?)/i) ||
                      lower.match(/(\d+(?:\.\d{1,2})?)/);

  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1]);
  }

  // 3. Extract and Resolve Date
  const dateObj = new Date();
  if (lower.includes('yesterday') || lower.includes('last night')) {
    dateObj.setDate(dateObj.getDate() - 1);
  } else if (lower.includes('2 days ago') || lower.includes('two days ago')) {
    dateObj.setDate(dateObj.getDate() - 2);
  } else if (lower.includes('last week')) {
    dateObj.setDate(dateObj.getDate() - 7);
  }

  const date = dateObj.toISOString().split('T')[0];

  // 4. Classify Category
  let category = 'Other';
  if (isIncome) {
    category = 'Income/Salary';
  } else {
    for (const [catName, words] of Object.entries(CATEGORY_KEYWORDS)) {
      if (words.some(w => lower.includes(w))) {
        category = catName;
        break;
      }
    }
  }

  // 5. Clean Description / Merchant
  let description = raw;
  const merchantMatch = raw.match(/(?:at|from|on|for)\s+([A-Z0-9a-z\s'’\-]+?)(?:\s+yesterday|\s+today|\s+last|\s+this|\s+for|\s+\$|\.|$)/i);
  if (merchantMatch && merchantMatch[1]) {
    description = merchantMatch[1].trim();
  } else {
    description = raw
      .replace(/^(i\s+)?(spent|paid|bought|got|received|cost)\s+/i, '')
      .replace(/(\$|\b\d+(\.\d{1,2})?\s*(dollars?|bucks?)?)/gi, '')
      .replace(/\b(yesterday|today|last night|this morning|on|at|for|from)\b/gi, '')
      .trim();
  }

  if (description) {
    description = description.charAt(0).toUpperCase() + description.slice(1);
  } else {
    description = category === 'Food/Dining' ? "Dining / Coffee" : "Voice Expense";
  }

  return {
    amount,
    category,
    description: description.replace(/\s+/g, ' ').trim() || 'Recorded Expense',
    date,
    type,
    rawTranscript: raw
  };
}
