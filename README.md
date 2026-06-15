# TaxWise AI

TaxWise AI is a full-stack project with a Django REST backend and a React + Vite frontend. An intelligent Canadian tax software recommendation platform that uses AI to guide users to the perfect product.

## 🌟 Features

- **Product Browsing:** Browse and filter 8 tax products by category (Personal, Expert, Corporate)
- **Comparison Matrix:** View all products side-by-side with 19+ features
- **Intelligent Wizard:** 4-step recommendation engine with priority rules
- **AI Assistant:** Chat with Groq-powered LLaMA 3.3 for product guidance
- **Admin Dashboard:** Secure login and product management portal
- **Dark/Light Theme Toggle:** User-preferred theme with persistent storage
- **Responsive Design:** Mobile-first with Tailwind CSS
- **MySQL Support:** Easily switch between SQLite (dev) and MySQL (production)

## Project Structure

- `backend/` - Django API, SQLite/MySQL database, and app logic
- `frontend/` - React UI built with Vite and TypeScript

## Requirements

- Python 3.12+
- Node.js 20.19+, 22.13+, or 24+
- MySQL 5.7+ (optional for production)

## Backend Setup

```powershell
Set-Location d:\project\backend
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Run Django checks or start the backend server:

```powershell
Set-Location d:\project\backend
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py runserver 8000
```

## Frontend Setup

```powershell
Set-Location d:\project\frontend
npm install
npm run dev
```

## Running the Full Project

1. Start the backend on `http://localhost:8000`.
2. Start the frontend on `http://localhost:5173`.
3. Open the frontend in a browser and it will talk to the backend API at `http://localhost:8000` by default.

## Environment Variables

The backend reads `backend/.env` for settings such as:

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `OPENAI_API_KEY`
- `CORS_ALLOWED_ORIGINS`

The frontend can optionally use `VITE_API_BASE_URL` if the API is not running on `http://localhost:8000`.

## Frontend Pages Overview

### 1. **Landing Page** (`/`)
The home page that introduces TaxWise AI. Features:
- Hero section with tagline and call-to-action buttons
- "How It Works" section explaining the 3-step process (Answer → Analysis → Recommendation)
- FAQ addressing common questions about the service
- Statistics highlighting the product count and capabilities
- Featured tax products preview
- Direct links to explore products or get recommendations

### 2. **Products Page** (`/products`)
Browse and explore all 8 tax software products. Features:
- View all products in a grid layout
- **Filter by category**: All, Personal, Expert, Corporate
- **Sort by price**: Low to High or High to Low
- Product cards showing name, price, and description
- Direct links to product details and recommendations

### 3. **Compare Page** (`/compare`)
A comprehensive feature matrix comparing all products side-by-side. Features:
- Scrollable table with all 8 products and 19+ features
- Features include: income types, deductions, expert help options, corporate filing, etc.
- Visual indicators (✓/✗) for included/excluded features
- Quick links to recommendations and product details
- Helpful for comparing specific capabilities across plans

### 4. **Recommendation Page** (`/recommend`)
Interactive step-by-step wizard guiding users to their ideal product. Features:
- **Step 1 - Filing Type**: Choose Personal, Self-Employed, or Incorporated
- **Step 2 - Income Sources**: Select from 8 income types (salary, freelance, investments, etc.)
- **Step 3 - Deductions**: Select applicable deductions (medical, business, home office, etc.)
- **Step 4 - Help Preference**: Choose self-filing, expert chat, or expert full service
- **Extra Step (if Incorporated)**: Specify if business has revenue
- Shows final recommendation with confidence level (High/Medium/Low)
- Displays recommended product details, price, and comparison links

### 5. **AI Assistant Page** (`/assistant`)
Conversational AI powered by Groq (LLaMA 3.3) for product guidance. Features:
- **Real-time chat interface** with message history
- **Starter questions** for new users (e.g., "Best product for freelancer?")
- **Message bubbles** with user/AI avatars and timestamps
- Provides product recommendations based on natural language queries
- **Important**: Guidance only — not tax or legal advice
- Falls back to simulated responses if API key is missing

### 6. **Admin Page** (`/admin/products`)
Read-only dashboard for product management overview. Features:
- **Product grid** showing all products at a glance
- Color-coded by product tier (Free, Deluxe, Premier, Expert, Corporate, etc.)
- Displays supported feature count for each product
- Shows product ID and price information
- Links to public product browser and comparison matrix
- Useful for administrators to verify loaded product data

### 7. **404 Page** (`/*`)
Graceful error page for invalid routes. Features:
- Friendly "Page Not Found" message
- Quick navigation links back to home and products
- Professional styling consistent with the app theme

## Backend API Endpoints

The backend is a Django REST API serving product data, recommendations, and AI-powered product guidance.

### Products API

#### `GET /api/products/`
Retrieve all tax products.
```json
[
  {
    "id": 1,
    "product_id": "free",
    "name": "Free",
    "price": "0.00",
    "currency": "CAD",
    "description": "Simple returns for salary/student income.",
    "best_for": ["Students", "Simple returns"],
    "salary_income": true,
    "student_income": true,
    "medical_expenses": false,
    "donations": false,
    ...feature flags...,
    "supported_features": ["Salary Income", "Student Income"],
    "unsupported_features": ["Medical Expenses", "Donations", ...]
  }
]
```

#### `GET /api/products/{product_id}/`
Retrieve a single product by product ID slug (e.g., `free`, `deluxe`, `premier`).
```json
{ ...single product object... }
```

### Recommendations API

#### `POST /api/recommend/`
Submit wizard answers and receive a product recommendation.

**Request Body:**
```json
{
  "filing_type": "personal|self-employed|incorporated",
  "income_sources": ["salary-income", "freelance-income", ...],
  "deductions": ["medical-expenses", "donations", "no-deductions", ...],
  "help_preference": "self|expert-help|expert-file",
  "has_revenue": true (required if filing_type is 'incorporated')
}
```

**Response:**
```json
{
  "recommended_product_id": "premier",
  "recommended_product_name": "Premier",
  "price": 50,
  "confidence": "high",
  "reasons": ["You selected investment income", "You have capital gains"],
  "matched_inputs": ["investment-income", "capital-gains"],
  "optional_upgrade": {
    "product_id": "expert-assist",
    "product_name": "Expert Assist",
    "price": 120,
    "reason": "Consider expert help for complex returns"
  },
  "warnings": [],
  "disclaimer": "This recommendation provides general product guidance only..."
}
```

**Recommendation Priority Engine:**
1. Incorporated + revenue → Business Corporate
2. Incorporated + no revenue → Nil Corporate Return
3. Help preference: "expert-file" → Expert Full Service
4. Help preference: "expert-help" → Expert Assist
5. Freelance/gig signals → Self-Employed
6. Investment/rental/capital gains → Premier
7. Medical/donations/employment → Deluxe
8. Salary/student only → Free

### Assistant API

#### `POST /api/assistant/`
Chat with the AI-powered product assistant.

**Request Body:**
```json
{
  "question": "What product is best for a freelancer?"
}
```

**Response:**
```json
{
  "answer": "Based on your situation, the Self-Employed plan ($70 CAD) is ideal...",
  "recommended_product": "self-employed",
  "confidence": "medium",
  "reasons": ["Freelancer income support", "Business expense tracking"],
  "disclaimer": "This is general product guidance only and is not tax, legal, or financial advice.",
  "source": "groq" (or "simulated" if API key missing)
}
```

**Notes:**
- Powered by **Groq (LLaMA 3.3-70b)** if `GROQ_API_KEY` is set in `.env`
- Falls back to **simulated keyword-based engine** if no API key
- Always includes a disclaimer—never gives tax or legal advice
- Max question length: 2000 characters

## Database Schema

### Products Table
Stores all 8 tax software products with feature flags:
- Core: `product_id`, `name`, `price`, `currency`, `description`, `best_for`
- Features: 19 boolean fields for supported features (salary_income, investment_income, expert_help, etc.)
- Metadata: `sort_order` for display ordering

### Admin User Table (Django's built-in User model)
Stores admin login credentials for dashboard access:
- `username`: Admin username
- `password`: Hashed password (bcrypt/PBKDF2)
- `email`: Admin email
- `is_staff`, `is_superuser`: Permission flags

## Notes

- The backend uses **SQLite for development** but **MySQL for production** (see [DEPLOYMENT.md](DEPLOYMENT.md)).
- I verified the Django project with `manage.py check` after installing dependencies.
- The AI Assistant requires a valid `GROQ_API_KEY` in `backend/.env` for real responses; without it, a simulated fallback is used.
- All pages are accessible from the main navigation bar at the top of the app.
- Admin login uses Django's built-in authentication and stores credentials securely in the database.
- Default demo credentials: username `admin`, password `admin123` (created via migration)
- Theme preference is stored in `localStorage` and persists across sessions.

## Deployment & Demo

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete guide for deploying frontend (Netlify) and backend (Heroku, AWS, DigitalOcean, Docker, etc.)
- **[DEMO_VIDEO_SCRIPT.md](DEMO_VIDEO_SCRIPT.md)** - Full walkthrough script for creating a demo video (scenes, narration, visual actions)