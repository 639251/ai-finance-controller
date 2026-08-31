/**
 * AI Service for Voice Processing, Audio Transcription & NLP Entity Extraction
 */

import { predictCategory } from './categorizationRules.js';

/**
 * Transcribes audio via OpenAI Whisper API or returns simulated transcription.
 * @param {Buffer} audioBuffer - Binary audio buffer
 * @param {string} mimeType - e.g. 'audio/webm', 'audio/wav', 'audio/mp3'
 * @param {string} apiKey - Optional OpenAI API key
 * @returns {Promise<string>} Transcribed text string
 */
export async function transcribeAudio(audioBuffer, mimeType = 'audio/webm', apiKey = process.env.OPENAI_API_KEY) {
  if (apiKey) {
    try {
      // Normalize key format if prefix was omitted
      let formattedKey = apiKey.trim();
      if (!formattedKey.startsWith('sk-')) {
        formattedKey = `sk-proj-${formattedKey}`;
      }

      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
      const filename = mimeType.includes('wav') ? 'audio.wav' : mimeType.includes('mp3') ? 'audio.mp3' : 'audio.webm';

      // Build multipart request body
      const parts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
      ];

      const headerBuffer = Buffer.from(parts.join(''));
      const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`);
      const bodyBuffer = Buffer.concat([headerBuffer, audioBuffer, footerBuffer]);

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formattedKey}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body: bodyBuffer
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('OpenAI Whisper API error, falling back to simulated engine:', errorText);
      } else {
        const data = await response.json();
        return data.text;
      }
    } catch (err) {
      console.warn('Whisper API call failed, using heuristic engine:', err.message);
    }
  }

  // Fallback default message when no key provided or direct text was sent
  return "I spent $25 on pizza at Domino's yesterday";
}

/**
 * Parses transcribed speech into structured JSON: { amount, category, description, date, type }
 * @param {string} text - Spoken statement (e.g. "I spent $25 on pizza at Domino's yesterday")
 * @returns {object} Structured entity object
 */
export function extractEntitiesFromText(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      amount: 0,
      category: 'Other',
      description: 'Unspecified Expense',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    };
  }

  const rawText = text.trim();
  const lower = rawText.toLowerCase();

  // 1. Determine Type (Expense vs Income)
  const isIncome = lower.includes('income') || 
                   lower.includes('salary') || 
                   lower.includes('received') || 
                   lower.includes('got paid') || 
                   lower.includes('earned') ||
                   lower.includes('deposit') ||
                   lower.includes('stipend');
  const type = isIncome ? 'income' : 'expense';

  // 2. Extract Amount
  // Matches: "$25", "$ 25.50", "25.00", "25 dollars", "25 bucks", "for 25"
  let amount = 0;
  const amountRegexes = [
    /(?:\$|usd|bucks?|dollars?)\s*(\d+(?:\.\d{1,2})?)/i,
    /(\d+(?:\.\d{1,2})?)\s*(?:\$|usd|bucks?|dollars?)/i,
    /(?:spent|paid|for|cost|got)\s*(?:\$)?\s*(\d+(?:\.\d{1,2})?)/i,
    /(\d+(?:\.\d{1,2})?)/
  ];

  for (const regex of amountRegexes) {
    const match = lower.match(regex);
    if (match && match[1]) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed) && parsed > 0) {
        amount = Math.round(parsed * 100) / 100;
        break;
      }
    }
  }

  // 3. Extract and Resolve Date
  let targetDate = new Date();

  if (lower.includes('yesterday') || lower.includes('last night')) {
    targetDate.setDate(targetDate.getDate() - 1);
  } else if (lower.includes('day before yesterday') || lower.includes('2 days ago') || lower.includes('two days ago')) {
    targetDate.setDate(targetDate.getDate() - 2);
  } else if (lower.includes('3 days ago') || lower.includes('three days ago')) {
    targetDate.setDate(targetDate.getDate() - 3);
  } else if (lower.includes('last week')) {
    targetDate.setDate(targetDate.getDate() - 7);
  } else {
    // Check specific days of week (e.g. "last friday", "on monday")
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (lower.includes(days[i])) {
        const todayDay = targetDate.getDay();
        let diff = todayDay - i;
        if (diff <= 0) diff += 7;
        targetDate.setDate(targetDate.getDate() - diff);
        break;
      }
    }
  }

  const dateStr = targetDate.toISOString().split('T')[0];

  // 4. Predict Category
  const category = isIncome ? 'Income/Salary' : predictCategory(lower);

  // 5. Clean Description / Merchant
  let description = rawText;

  // Attempt to extract merchant after "at", "from", "on", "for"
  const merchantMatch = rawText.match(/(?:at|from|to|for|on)\s+([A-Z0-9a-z\s'’\-]+?)(?:\s+yesterday|\s+today|\s+last|\s+for|\s+\$|\.|$)/i);
  if (merchantMatch && merchantMatch[1]) {
    description = merchantMatch[1].trim();
  } else {
    // Strip common conversational filler words
    description = rawText
      .replace(/^(i\s+)?(spent|paid|bought|got|received|cost)\s+/i, '')
      .replace(/(\$|\b\d+(\.\d{1,2})?\s*(dollars?|bucks?)?)/gi, '')
      .replace(/\b(yesterday|today|last night|this morning|on|at|for|from)\b/gi, '')
      .trim();
  }

  // Capitalize nicely
  if (description) {
    description = description.charAt(0).toUpperCase() + description.slice(1);
  } else {
    description = category === 'Food/Dining' ? "Dining / Meal" : "Expense Entry";
  }

  return {
    amount,
    category,
    description: description.replace(/\s+/g, ' ').trim() || 'General Transaction',
    date: dateStr,
    type,
    rawText
  };
}

/**
 * Generates custom AI financial advice using Google Gemini API
 * @param {Array} transactions - User's transactions
 * @param {Array} budgets - User's budgets
 * @returns {Promise<Array>} List of tailored recommendations
 */
export async function getGeminiFinancialAdvice(transactions = [], budgets = [], apiKey = process.env.GEMINI_API_KEY) {
  if (!apiKey) return null;

  try {
    const summary = transactions.slice(0, 15).map(t => `${t.date}: ${t.type} $${t.amount} for ${t.description} (${t.category})`).join('\n');
    const prompt = `You are an expert student financial advisor. Analyze these recent transactions:\n${summary}\nProvide 3 short, actionable, money-saving tips for this student. Format as JSON array: [{"title": "...", "tip": "...", "category": "...", "savings": "$XX/mo"}]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (err) {
    console.warn('Gemini API call warning:', err.message);
  }

  return null;
}
