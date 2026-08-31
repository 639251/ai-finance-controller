# 🚀 AI Finance Controller

> **Next-Generation Personal Finance Web Application for Students & Young Adults**  
> Features real-time **Voice-Based Expense Entry**, dynamic automated categorization, interactive budget cap planning, velocity-based smart alerts, and an AI recommendation engine.

---

## 📸 Key Features

1. **🎙️ Voice-Based Expense Entry (Core AI)**:
   - Live microphone speech recognition via Web Speech API and OpenAI Whisper STT integration.
   - Converts natural speech like:  
     `"I spent $25 on pizza at Domino's yesterday"`  
     into structured data:  
     `{ amount: 25.00, category: 'Food/Dining', description: 'Domino\'s Pizza', date: '2026-08-31', type: 'expense' }`.
   - Pre-populates the ledger form with instant one-click confirmation.
   - Built-in one-click test phrases for immediate testing without requiring a microphone.

2. **⚡ Dynamic Automated Categorization**:
   - Rule-based keyword and merchant engine (over 100+ preset student & everyday brands such as Domino's, Starbucks, Uber, Chipotle, Campus Bookstore, Spotify, Amazon, Rent).
   - Real-time auto-tagging preview as you type in the manual form, with full manual override.

3. **🎯 Budget Planning & Velocity Engine**:
   - Configurable monthly spending caps per category (Dining, Groceries, Housing, Transport, Entertainment, Education, etc.).
   - Visual progress bars with status badges (Healthy `<80%`, Near Cap `80-99%`, Exceeded `≥100%`).
   - Spending velocity warnings: Alerts users when spending pace outstrips the monthly schedule.

4. **💡 AI Personalization & Recommendations Feed**:
   - Analyzes category spend ratios (e.g. café visits vs. total income).
   - Delivers actionable micro-savings advice (e.g., *"Brewing coffee at home 3 days a week can save ~$45/month"*).

5. **📊 User Analytics Dashboard**:
   - Net Cashflow, Monthly Spending, Total Income, and Savings Rate metric cards.
   - Recharts Category Donut breakdown and Monthly Trend Area chart.
   - Searchable, filterable activity ledger with voice transcript badges and source indicators (Voice 🎙️, Manual ✍️, Recurring 🔄).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express, Multer, CORS, dotenv |
| **AI / STT** | Web Speech API, OpenAI Whisper STT endpoint, Custom NLP Entity Extractor |
| **Database** | MongoDB / PostgreSQL Schema definitions + In-memory mock database with realistic seed data |

---

## 📂 Project Structure

```
ai-finance-controller/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # In-memory store & rich student seed dataset
│   │   ├── controllers/
│   │   │   ├── authController.js     # User login & profile management
│   │   │   ├── transactionController.js # Transaction CRUD & budget alert triggers
│   │   │   ├── budgetController.js   # Monthly budget caps & velocity progress
│   │   │   ├── voiceController.js    # Whisper audio STT & text entity extraction
│   │   │   └── insightController.js  # Dynamic recommendations & notification center
│   │   ├── models/
│   │   │   ├── User.js               # User Schema (Mongoose & PostgreSQL DDL)
│   │   │   ├── Transaction.js        # Transaction Schema & indexes
│   │   │   ├── Budget.js             # Budget Cap Schema
│   │   │   └── Notification.js       # Smart Alert & Insight Schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── voiceRoutes.js
│   │   │   └── insightRoutes.js
│   │   ├── services/
│   │   │   ├── aiService.js          # Whisper API client & entity regex parser
│   │   │   └── categorizationRules.js# 100+ keyword dictionary & regex matcher
│   │   └── server.js                 # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header with balance quick view & profile
│   │   │   ├── StatCard.jsx          # Net Cashflow, Monthly Spend, Income & Savings Rate
│   │   │   ├── SpendingChart.jsx     # Category Donut & Spending Timeline charts
│   │   │   ├── BudgetProgress.jsx    # Visual spending bars vs caps with velocity tags
│   │   │   ├── VoiceExpenseModal.jsx # Voice recording UI + Waveform + Entity preview
│   │   │   ├── TransactionForm.jsx   # Manual transaction entry with auto-tagging
│   │   │   ├── TransactionList.jsx   # Searchable ledger with voice transcript drawer
│   │   │   ├── SmartAlerts.jsx       # Alert center with priority notifications
│   │   │   ├── RecommendationFeed.jsx# AI financial tips & savings calculator
│   │   │   └── BudgetModal.jsx       # Category limit configurator
│   │   ├── context/
│   │   │   └── FinanceContext.jsx    # State management, local storage sync & calculations
│   │   ├── utils/
│   │   │   ├── formatters.js         # Currency, date, and color tokens
│   │   │   └── voiceParser.js        # Browser-side voice entity extractor
│   │   ├── App.jsx                   # Main layout
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind styles and glassmorphism design
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🗄️ Database Schemas

### 1. PostgreSQL DDL Reference
```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  monthly_income NUMERIC(10, 2) DEFAULT 2400.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
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

-- Category Budgets Table
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
```

---

## 📡 Key API Routes

### 1. Voice Processing (`/api/voice`)
- `POST /api/voice/parse-text`
  - **Body**: `{ "text": "I spent $25 on pizza at Domino's yesterday" }`
  - **Response**:
    ```json
    {
      "success": true,
      "transcription": "I spent $25 on pizza at Domino's yesterday",
      "extracted": {
        "amount": 25.00,
        "category": "Food/Dining",
        "description": "Domino's Pizza",
        "date": "2026-08-31",
        "type": "expense"
      }
    }
    ```
- `POST /api/voice/process-audio`
  - Upload audio (`multipart/form-data`) -> OpenAI Whisper -> NLP Extractor.

### 2. Transactions (`/api/transactions`)
- `GET /api/transactions?category=Food/Dining&type=expense&search=Domino`
- `GET /api/transactions/summary`
- `POST /api/transactions`
- `DELETE /api/transactions/:id`

### 3. Budgets (`/api/budgets`)
- `GET /api/budgets`
- `PUT /api/budgets/:category`

### 4. Smart Insights (`/api/insights`)
- `GET /api/insights` (Returns velocity alerts and actionable tips)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18+` (Tested on `v24.x`)
- npm `v9+`

### 1. Run the Frontend (Instant UI Demo)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at **`http://localhost:5173`**.

### 2. Run the Backend API (Optional for full-stack API integration)
```bash
cd backend
npm install
npm run dev
```
Backend API will start on **`http://localhost:5001`**.

### 3. API Keys & Environment Variables (`backend/.env`)

Create or edit [`.env`](file:///c:/Users/Mahi%20Soni/OneDrive/Desktop/ai%20finance%20controller/backend/.env) in the `backend/` folder:

```env
PORT=5001
NODE_ENV=development

# 1. OpenAI Whisper API Key (Optional)
# Used for backend server-side audio file transcription:
# https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...

# 2. Google Gemini API Key (Optional)
# Used for advanced LLM financial insights & entity extraction:
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...

# 3. JWT & Database (Optional)
JWT_SECRET=super_secret_jwt_key_for_student_finance_auth
DATABASE_URL=mongodb://localhost:27017/ai-finance-controller
```
