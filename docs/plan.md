# Expense Tracker – Technical Plan

## Architecture

- Frontend: Next.js + TypeScript
- Backend: Next.js API Routes + Supabase
- Database: Supabase Postgres
- Deployment: Vercel (Frontend + Backend), Supabase Cloud (DB)

## Tech Stack

- Frontend: Next.js, TypeScript, TailwindCSS
- Backend: Next.js API Routes, Supabase Client
- Auth: Supabase Auth
- State Management: React Context
- Charts: Chart.js or Recharts (optional)
- CSV Export: Papaparse or similar

## Database Schema

### Tables

1. Users
   - id (uuid, PK)
   - name, email, password (handled by Supabase Auth)
2. Categories
   - id, user_id (FK), name, type
3. Transactions
   - id, user_id (FK)
   - category_id (FK)
   - amount, type (income/expense)
   - date, description
4. [Optional] Settings

## API Endpoints

- GET /api/transactions → list transactions
- POST /api/transactions → create transaction
- PUT /api/transactions/:id → update
- DELETE /api/transactions/:id → delete
- GET /api/categories → list categories
- POST /api/categories → create category

## Frontend Pages

1. Dashboard (summary + charts)
2. Transactions (list + search/filter)
3. Add/Edit Transaction
4. Categories Management
5. Export CSV

## Task Breakdown Suggestion

- Setup project structure (Next.js + Supabase)
- Setup Auth with Supabase
- Implement DB tables
- Create API endpoints
- Create frontend pages
- Integrate charts
- Implement CSV export
- Testing + Deployment
