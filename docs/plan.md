# Expense Tracker – Technical Plan

## 1. Project Architecture

### Architecture Pattern: Full-Stack Next.js with Supabase

```
┌─────────────────────────────────────────┐
│    Frontend (Next.js 14 App Router)    │
│  - Server Components & Client Components │
│  - Dashboard, Transaction Management    │
│  - Charts & Visualization               │
└──────────────┬──────────────────────────┘
               │ API Routes / Server Actions
┌──────────────▼──────────────────────────┐
│      Backend (Next.js API Routes)       │
│  - RESTful API Endpoints                │
│  - Business Logic & Validation          │
│  - Supabase Client Integration          │
└──────────────┬──────────────────────────┘
               │ SQL Queries via Supabase SDK
┌──────────────▼──────────────────────────┐
│      Database (Supabase Postgres)       │
│  - Persistent Data Storage              │
│  - Row Level Security (RLS)             │
│  - Real-time subscriptions (optional)   │
└─────────────────────────────────────────┘
```

### Design Philosophy

- **Server-First Approach**: Leverage Next.js App Router with Server Components for optimal performance
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Security**: Row Level Security (RLS) policies to ensure data isolation per user
- **Simplicity**: No over-engineering, focus on core features from spec.md

---

## 2. Tech Stack Recommendation

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (optional) or custom components
- **State Management**: React Context API + React hooks
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts (lightweight, React-native)
- **Date Handling**: date-fns
- **HTTP Client**: Native fetch with Next.js API routes

### Backend

- **Runtime**: Next.js API Routes (Node.js)
- **Language**: TypeScript
- **BaaS**: Supabase
  - Authentication (email/password)
  - PostgreSQL database
  - Row Level Security
- **Validation**: Zod schemas
- **CSV Export**: Papaparse

### Database

- **Platform**: Supabase (Managed PostgreSQL)
- **Version**: PostgreSQL 15+
- **Features**: ACID compliance, RLS, foreign keys, indexes

### DevOps & Tools

- **Deployment**: Vercel (Frontend + API Routes)
- **Database Hosting**: Supabase Cloud
- **Version Control**: Git
- **Package Manager**: npm or pnpm
- **Code Quality**: ESLint + Prettier
- **Environment**: dotenv (via .env.local)

---

## 3. Database Schema

### Tables Design

#### **users** (Managed by Supabase Auth)

```sql
-- This table is automatically created by Supabase Auth
-- We'll use auth.users table
-- Fields: id (uuid), email, encrypted_password, created_at, updated_at
```

#### **profiles** (Optional - for extended user info)

```sql
CREATE TABLE profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name               VARCHAR(100),
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### **categories**

```sql
CREATE TABLE categories (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name               VARCHAR(50) NOT NULL,
  type               VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  color              VARCHAR(7) DEFAULT '#6366f1',  -- hex color for UI
  icon               VARCHAR(50) DEFAULT '💰',      -- emoji or icon identifier
  is_default         BOOLEAN DEFAULT FALSE,         -- system vs user-created
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, name, type)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id AND is_default = FALSE);

-- Indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(user_id, type);
```

#### **transactions**

```sql
CREATE TABLE transactions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id        UUID REFERENCES categories(id) ON DELETE SET NULL,
  type               VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount             DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  description        TEXT,
  transaction_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_type ON transactions(user_id, type);
CREATE INDEX idx_transactions_user_date_type ON transactions(user_id, transaction_date, type);
```

### Default Categories (Seed Data)

```sql
-- Default Expense Categories
INSERT INTO categories (user_id, name, type, color, icon, is_default) VALUES
  ('{user_id}', 'Food', 'expense', '#ef4444', '🍔', TRUE),
  ('{user_id}', 'Transport', 'expense', '#f59e0b', '🚗', TRUE),
  ('{user_id}', 'Utilities', 'expense', '#3b82f6', '💡', TRUE),
  ('{user_id}', 'Shopping', 'expense', '#ec4899', '🛍️', TRUE),
  ('{user_id}', 'Healthcare', 'expense', '#10b981', '⚕️', TRUE),
  ('{user_id}', 'Entertainment', 'expense', '#8b5cf6', '🎬', TRUE),
  ('{user_id}', 'Education', 'expense', '#14b8a6', '📚', TRUE),
  ('{user_id}', 'Other', 'expense', '#6b7280', '📦', TRUE);

-- Default Income Categories
INSERT INTO categories (user_id, name, type, color, icon, is_default) VALUES
  ('{user_id}', 'Salary', 'income', '#22c55e', '💼', TRUE),
  ('{user_id}', 'Freelance', 'income', '#06b6d4', '💻', TRUE),
  ('{user_id}', 'Investment', 'income', '#8b5cf6', '📈', TRUE),
  ('{user_id}', 'Gift', 'income', '#f43f5e', '🎁', TRUE),
  ('{user_id}', 'Other', 'income', '#6b7280', '💰', TRUE);
```

---

## 4. API Endpoints

### Base Path: `/app/api/`

### Authentication (Handled by Supabase)

| Method | Endpoint     | Description                 | Protected |
| ------ | ------------ | --------------------------- | --------- |
| POST   | Supabase SDK | Sign up with email/password | No        |
| POST   | Supabase SDK | Sign in with email/password | No        |
| POST   | Supabase SDK | Sign out                    | Yes       |
| GET    | Supabase SDK | Get current session         | Yes       |

### Transactions

| Method | Endpoint                   | Description                        | Protected |
| ------ | -------------------------- | ---------------------------------- | --------- |
| GET    | `/api/transactions`        | List all transactions with filters | Yes       |
| GET    | `/api/transactions/[id]`   | Get single transaction by ID       | Yes       |
| POST   | `/api/transactions`        | Create new transaction             | Yes       |
| PUT    | `/api/transactions/[id]`   | Update existing transaction        | Yes       |
| DELETE | `/api/transactions/[id]`   | Delete transaction                 | Yes       |
| GET    | `/api/transactions/export` | Export transactions as CSV         | Yes       |

**Query Parameters for GET /api/transactions:**

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `type` (string: 'income' | 'expense')
- `category_id` (uuid)
- `start_date` (ISO date: YYYY-MM-DD)
- `end_date` (ISO date: YYYY-MM-DD)
- `min_amount` (number)
- `max_amount` (number)
- `search` (string: search in description)
- `sort_by` (string: 'date' | 'amount', default: 'date')
- `sort_order` (string: 'asc' | 'desc', default: 'desc')

### Categories

| Method | Endpoint               | Description                        | Protected |
| ------ | ---------------------- | ---------------------------------- | --------- |
| GET    | `/api/categories`      | List all categories                | Yes       |
| GET    | `/api/categories/[id]` | Get single category by ID          | Yes       |
| POST   | `/api/categories`      | Create custom category             | Yes       |
| PUT    | `/api/categories/[id]` | Update category (non-default only) | Yes       |
| DELETE | `/api/categories/[id]` | Delete category (non-default only) | Yes       |

**Query Parameters for GET /api/categories:**

- `type` (string: 'income' | 'expense' | 'all', default: 'all')

### Dashboard / Analytics

| Method | Endpoint                 | Description                     | Protected |
| ------ | ------------------------ | ------------------------------- | --------- |
| GET    | `/api/dashboard/summary` | Get income/expense summary      | Yes       |
| GET    | `/api/dashboard/trends`  | Get daily/weekly/monthly trends | Yes       |

**Query Parameters for Dashboard:**

- `period` (string: 'daily' | 'weekly' | 'monthly', default: 'monthly')
- `start_date` (ISO date)
- `end_date` (ISO date)

---

## 5. Frontend Pages and Components

### Page Routes (App Router)

#### **Public Routes**

1. `/` - Landing/Home page (redirect to /login if not authenticated)
2. `/login` - Login page
3. `/signup` - Registration page

#### **Protected Routes** (Require Authentication)

4. `/dashboard` - Dashboard with summary and charts
5. `/transactions` - Transactions list with filters
6. `/transactions/new` - Add new transaction
7. `/transactions/[id]/edit` - Edit existing transaction
8. `/categories` - Manage categories
9. `/settings` - User settings (optional)

### Component Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx                    # Login Page
│   └── signup/
│       └── page.tsx                    # Signup Page
│
├── (dashboard)/
│   ├── layout.tsx                      # Protected Layout with Header/Nav
│   ├── dashboard/
│   │   └── page.tsx                    # Dashboard Page
│   ├── transactions/
│   │   ├── page.tsx                    # Transactions List Page
│   │   ├── new/
│   │   │   └── page.tsx                # Add Transaction Page
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx            # Edit Transaction Page
│   ├── categories/
│   │   └── page.tsx                    # Categories Management Page
│   └── settings/
│       └── page.tsx                    # Settings Page (optional)
│
└── api/
    ├── transactions/
    │   ├── route.ts                    # GET, POST /api/transactions
    │   ├── [id]/
    │   │   └── route.ts                # GET, PUT, DELETE /api/transactions/[id]
    │   └── export/
    │       └── route.ts                # GET /api/transactions/export
    ├── categories/
    │   ├── route.ts                    # GET, POST /api/categories
    │   └── [id]/
    │       └── route.ts                # GET, PUT, DELETE /api/categories/[id]
    └── dashboard/
        ├── summary/
        │   └── route.ts                # GET /api/dashboard/summary
        └── trends/
            └── route.ts                # GET /api/dashboard/trends

components/
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── AuthProvider.tsx
│
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
│
├── dashboard/
│   ├── SummaryCards.tsx               # Total Income, Expense, Net Balance
│   ├── PeriodSelector.tsx             # Daily/Weekly/Monthly toggle
│   ├── DateRangeFilter.tsx            # Date range picker
│   ├── TrendsChart.tsx                # Line chart for trends
│   ├── CategoryBreakdownChart.tsx     # Pie chart for categories
│   └── RecentTransactions.tsx         # Recent transactions list
│
├── transactions/
│   ├── TransactionList.tsx            # List of transactions
│   ├── TransactionCard.tsx            # Single transaction display
│   ├── TransactionForm.tsx            # Add/Edit form
│   ├── TransactionFilters.tsx         # Filter controls
│   ├── SearchBar.tsx                  # Search input
│   ├── ExportButton.tsx               # CSV export button
│   └── DeleteButton.tsx               # Delete with confirmation
│
├── categories/
│   ├── CategoryList.tsx               # List of categories
│   ├── CategoryForm.tsx               # Add/Edit category form
│   ├── CategoryBadge.tsx              # Category display badge
│   └── CategoryIcon.tsx               # Icon selector
│
└── ui/
    ├── Button.tsx                     # Reusable button
    ├── Input.tsx                      # Reusable input
    ├── Select.tsx                     # Reusable select
    ├── Modal.tsx                      # Reusable modal
    ├── Toast.tsx                      # Toast notifications
    ├── LoadingSpinner.tsx             # Loading state
    ├── EmptyState.tsx                 # No data state
    ├── Pagination.tsx                 # Pagination controls
    └── ConfirmDialog.tsx              # Confirmation dialog
```

---

## 6. High-Level Task Breakdown

### Phase 1: Foundation (Week 1)

1. Setup Next.js 14 project with TypeScript
2. Configure TailwindCSS
3. Setup Supabase project and environment variables
4. Create database schema and RLS policies
5. Seed default categories
6. Setup project folder structure

### Phase 2: Authentication (Week 1)

7. Setup Supabase Auth integration
8. Create auth context and provider
9. Build login page and form
10. Build signup page and form
11. Implement protected route middleware
12. Add logout functionality

### Phase 3: API Routes - Categories (Week 2)

13. Create GET /api/categories endpoint
14. Create POST /api/categories endpoint
15. Create PUT /api/categories/[id] endpoint
16. Create DELETE /api/categories/[id] endpoint

### Phase 4: API Routes - Transactions (Week 2)

17. Create GET /api/transactions endpoint with filters
18. Create POST /api/transactions endpoint
19. Create PUT /api/transactions/[id] endpoint
20. Create DELETE /api/transactions/[id] endpoint
21. Create GET /api/transactions/export endpoint

### Phase 5: API Routes - Dashboard (Week 2)

22. Create GET /api/dashboard/summary endpoint
23. Create GET /api/dashboard/trends endpoint

### Phase 6: UI Components (Week 3)

24. Build layout components (Header, Sidebar)
25. Build reusable UI components (Button, Input, Select, Modal)
26. Build Toast notification system
27. Build Loading and Empty state components

### Phase 7: Categories Management (Week 3)

28. Create categories page
29. Build CategoryList component
30. Build CategoryForm component
31. Implement CRUD operations for categories

### Phase 8: Transactions Management (Week 4)

32. Create transactions list page
33. Build TransactionList component
34. Build TransactionFilters and SearchBar
35. Implement pagination
36. Create add transaction page
37. Create edit transaction page
38. Build TransactionForm component
39. Implement delete with confirmation

### Phase 9: Dashboard (Week 4)

40. Create dashboard page layout
41. Build SummaryCards component
42. Build PeriodSelector component
43. Integrate Recharts library
44. Build TrendsChart component
45. Build CategoryBreakdownChart component
46. Build RecentTransactions component

### Phase 10: Export Feature (Week 5)

47. Implement CSV export functionality
48. Add export button to transactions page

### Phase 11: Polish & UX (Week 5)

49. Add loading states for all async operations
50. Implement error handling and user feedback
51. Add form validation with Zod
52. Ensure responsive design for mobile
53. Improve accessibility (a11y)

### Phase 12: Testing (Week 6)

54. Setup testing framework (Jest + React Testing Library)
55. Write API route tests
56. Write component unit tests
57. Perform manual end-to-end testing

### Phase 13: Documentation & Deployment (Week 6)

58. Write comprehensive README
59. Document API endpoints
60. Create .env.example file
61. Deploy to Vercel
62. Configure Supabase for production
63. Post-deployment testing

---

## 7. Key Technical Decisions

### Why Next.js 14 App Router?

- Server Components by default (better performance)
- Built-in API routes (no separate backend needed)
- File-based routing
- Optimized for production (image optimization, etc.)
- Easy deployment to Vercel

### Why Supabase?

- PostgreSQL database (robust, scalable)
- Built-in authentication
- Row Level Security (automatic data isolation)
- Real-time capabilities (future feature)
- Generous free tier
- Easy integration with Next.js

### Why TailwindCSS?

- Utility-first approach (rapid development)
- Small bundle size
- Highly customizable
- Good documentation
- Works well with Next.js

### Security Considerations

- Row Level Security ensures users only see their data
- Server-side validation on all API routes
- Zod schemas for type-safe validation
- HTTPS in production
- Secure cookie handling by Supabase Auth

### Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Server Components for static content
- Client Components only when needed (interactivity)
- Optimistic UI updates

---

## 8. Development Timeline

**Total Estimated Time: 6 weeks (solo developer)**

- Week 1: Foundation + Authentication (Tasks 1-12)
- Week 2: API Routes (Tasks 13-23)
- Week 3: UI Components + Categories (Tasks 24-31)
- Week 4: Transactions + Dashboard (Tasks 32-46)
- Week 5: Export + Polish (Tasks 47-53)
- Week 6: Testing + Deployment (Tasks 54-63)

---

This technical plan provides a complete roadmap aligned with the spec.md requirements. Next step: Break down into granular tasks in tasks.md.
