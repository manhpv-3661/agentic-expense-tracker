# Expense Tracker – Task Breakdown

> **Tech Stack**: Next.js 14 + NestJS 10 + PostgreSQL 15
>
> **Note**: Complete each task sequentially. Mark as ✅ when done.

---

## Phase 1: Project Setup & Infrastructure

### Task 1: Initialize Monorepo Structure ✅
**Description**: Create monorepo with npm workspaces for frontend and backend
**Related Files**:
- `package.json` (root)
- `frontend/` directory
- `backend/` directory
- `.gitignore`

**Steps**:
1. ✅ Create root package.json with workspaces
2. ✅ Create frontend/ and backend/ folders
3. ✅ Setup .gitignore
4. ✅ Install root dependencies (concurrently)

**Estimated Effort**: 30 minutes
**Status**: ✅ COMPLETED

---

### Task 2: Setup Frontend (Next.js) ✅
**Description**: Initialize Next.js 14 project in frontend folder
**Related Files**:
- `frontend/package.json`
- `frontend/next.config.ts`
- `frontend/tsconfig.json`
- `frontend/tailwind.config.js`
- `frontend/app/layout.tsx`
- `frontend/app/page.tsx`

**Steps**:
1. ✅ npx create-next-app with TypeScript, TailwindCSS, App Router
2. ✅ Configure TypeScript strict mode (already enabled)
3. ✅ Update package.json metadata
4. ✅ Verify project structure

**Estimated Effort**: 45 minutes
**Status**: ✅ COMPLETED

---

### Task 3: Setup Backend (NestJS) ✅
**Description**: Initialize NestJS project in backend folder
**Related Files**:
- `backend/package.json`
- `backend/nest-cli.json`
- `backend/tsconfig.json`
- `backend/src/main.ts`
- `backend/src/app.module.ts`

**Steps**:
1. ✅ Install NestJS CLI globally
2. ✅ Initialize NestJS project in backend/
3. ✅ Configure TypeScript strict mode (enabled)
4. ✅ Setup CORS for frontend (localhost:3000)
5. ✅ Change server port to 4000
6. ✅ Update package.json metadata

**Estimated Effort**: 45 minutes
**Status**: ✅ COMPLETED

---

### Task 4: Setup PostgreSQL Database ⬜
**Description**: Setup PostgreSQL locally or use cloud service
**Related Files**:
- `docker-compose.yml` (if using Docker)
- `backend/.env`

**Steps**:
1. Install PostgreSQL or use Railway/Supabase
2. Create database "expense_tracker"
3. Get connection string
4. Add to backend/.env

**Estimated Effort**: 30 minutes

---

### Task 5: Configure TypeORM in NestJS ⬜
**Description**: Setup TypeORM with PostgreSQL connection
**Related Files**:
- `backend/src/config/database.config.ts`
- `backend/src/app.module.ts`
- `backend/package.json`

**Steps**:
1. npm install @nestjs/typeorm typeorm pg
2. Create database config
3. Import TypeORM in AppModule
4. Test connection

**Estimated Effort**: 1 hour

---

### Task 6: Create Database Schema SQL ⬜
**Description**: Write SQL schema for users, categories, transactions
**Related Files**:
- `docs/schema.sql`

**Tables**: users, categories, transactions with indexes

**Estimated Effort**: 1 hour

---

## Phase 2: Backend - User & Authentication

### Task 7: Create User Entity ⬜
**Description**: Create TypeORM entity for users table
**Related Files**:
- `backend/src/modules/users/entities/user.entity.ts`

**Fields**: id, email, password_hash, name, created_at, updated_at

**Estimated Effort**: 30 minutes

---

### Task 8: Create Users Module ⬜
**Description**: Generate users module with service and controller
**Related Files**:
- `backend/src/modules/users/users.module.ts`
- `backend/src/modules/users/users.service.ts`
- `backend/src/modules/users/users.controller.ts`
- `backend/src/modules/users/dto/`

**Estimated Effort**: 1 hour

---

### Task 9: Create Auth Module ⬜
**Description**: Setup authentication with JWT
**Related Files**:
- `backend/src/modules/auth/auth.module.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/auth/auth.controller.ts`

**Dependencies**: @nestjs/passport, @nestjs/jwt, passport, passport-jwt, bcrypt

**Estimated Effort**: 2 hours

---

### Task 10: Implement Register Endpoint ⬜
**Description**: POST /auth/register - create new user
**Related Files**:
- `backend/src/modules/auth/dto/register.dto.ts`
- Auth service and controller

**Validation**: email, password (min 6 chars), name

**Estimated Effort**: 1.5 hours

---

### Task 11: Implement Login Endpoint ⬜
**Description**: POST /auth/login - authenticate user, return JWT
**Related Files**:
- `backend/src/modules/auth/dto/login.dto.ts`
- JWT strategy

**Estimated Effort**: 1.5 hours

---

### Task 12: Create JWT Guards ⬜
**Description**: Create auth guards for protected routes
**Related Files**:
- `backend/src/common/guards/jwt-auth.guard.ts`
- `backend/src/common/decorators/current-user.decorator.ts`

**Estimated Effort**: 1 hour

---

## Phase 3: Backend - Categories Module

### Task 13: Create Category Entity ⬜
**Description**: Create TypeORM entity for categories
**Related Files**:
- `backend/src/modules/categories/entities/category.entity.ts`

**Fields**: id, user_id, name, type, color, icon, is_default

**Estimated Effort**: 30 minutes

---

### Task 14: Create Categories Module ⬜
**Description**: Generate categories CRUD module
**Related Files**:
- `backend/src/modules/categories/categories.module.ts`
- Service, controller, DTOs

**Estimated Effort**: 1 hour

---

### Task 15: Implement Categories CRUD Endpoints ⬜
**Description**: GET, POST, PUT, DELETE /categories
**Related Files**:
- Categories service and controller
- DTOs for create/update

**Estimated Effort**: 2 hours

---

### Task 16: Seed Default Categories ⬜
**Description**: Create migration/seeder for default categories
**Related Files**:
- `backend/src/database/seeds/categories.seed.ts`

**Estimated Effort**: 1 hour

---

## Phase 4: Backend - Transactions Module

### Task 17: Create Transaction Entity ⬜
**Description**: Create TypeORM entity for transactions
**Related Files**:
- `backend/src/modules/transactions/entities/transaction.entity.ts`

**Relations**: ManyToOne with User and Category

**Estimated Effort**: 45 minutes

---

### Task 18: Create Transactions Module ⬜
**Description**: Generate transactions CRUD module
**Related Files**:
- `backend/src/modules/transactions/transactions.module.ts`
- Service, controller, DTOs

**Estimated Effort**: 1 hour

---

### Task 19: Implement GET /transactions with Filters ⬜
**Description**: List transactions with pagination, filtering, search
**Related Files**:
- Transactions service and controller
- Query DTOs

**Features**: pagination, type filter, category filter, date range, search

**Estimated Effort**: 2.5 hours

---

### Task 20: Implement POST /transactions ⬜
**Description**: Create new transaction endpoint
**Related Files**:
- `create-transaction.dto.ts`

**Validation**: amount > 0, date, type, category_id

**Estimated Effort**: 1 hour

---

### Task 21: Implement PUT /transactions/:id ⬜
**Description**: Update transaction endpoint
**Related Files**:
- `update-transaction.dto.ts`

**Estimated Effort**: 1 hour

---

### Task 22: Implement DELETE /transactions/:id ⬜
**Description**: Delete transaction endpoint

**Estimated Effort**: 30 minutes

---

### Task 23: Implement CSV Export ⬜
**Description**: GET /transactions/export - download as CSV
**Related Files**:
- Export service

**Dependencies**: csv-writer or json2csv

**Estimated Effort**: 1.5 hours

---

## Phase 5: Backend - Dashboard Module

### Task 24: Create Dashboard Module ⬜
**Description**: Module for analytics endpoints
**Related Files**:
- `backend/src/modules/dashboard/dashboard.module.ts`
- Service and controller

**Estimated Effort**: 30 minutes

---

### Task 25: Implement GET /dashboard/summary ⬜
**Description**: Calculate total income, expense, net balance
**Related Files**:
- Dashboard service

**Query**: date range filter

**Estimated Effort**: 1.5 hours

---

### Task 26: Implement GET /dashboard/trends ⬜
**Description**: Get daily/weekly/monthly aggregated data
**Related Files**:
- Dashboard service

**Estimated Effort**: 2 hours

---

### Task 27: Implement GET /dashboard/category-breakdown ⬜
**Description**: Group transactions by category, sum amounts

**Estimated Effort**: 1.5 hours

---

## Phase 6: Frontend - Setup & Auth

### Task 28: Setup Axios API Client ⬜
**Description**: Configure Axios with base URL and interceptors
**Related Files**:
- `frontend/lib/api/client.ts`

**Features**: base URL, auth token interceptor, error handling

**Estimated Effort**: 1 hour

---

### Task 29: Create Auth Context ⬜
**Description**: React context for authentication state
**Related Files**:
- `frontend/contexts/AuthContext.tsx`
- `frontend/hooks/useAuth.ts`

**State**: user, token, login, logout, register functions

**Estimated Effort**: 1.5 hours

---

### Task 30: Create Login Page ⬜
**Description**: Build login page with form
**Related Files**:
- `frontend/app/(auth)/login/page.tsx`
- `frontend/components/auth/LoginForm.tsx`

**Validation**: React Hook Form + Zod

**Estimated Effort**: 2 hours

---

### Task 31: Create Register Page ⬜
**Description**: Build registration page
**Related Files**:
- `frontend/app/(auth)/register/page.tsx`
- `frontend/components/auth/RegisterForm.tsx`

**Estimated Effort**: 2 hours

---

### Task 32: Implement Protected Routes ⬜
**Description**: Middleware to protect dashboard routes
**Related Files**:
- `frontend/middleware.ts`

**Estimated Effort**: 1 hour

---

### Task 33: Create Layout with Header ⬜
**Description**: Dashboard layout with navigation
**Related Files**:
- `frontend/app/(dashboard)/layout.tsx`
- `frontend/components/layout/Header.tsx`

**Features**: Logo, nav links, user menu, logout

**Estimated Effort**: 2 hours

---

## Phase 7: Frontend - UI Components

### Task 34: Create Button Component ⬜
**Description**: Reusable button with variants
**Related Files**:
- `frontend/components/ui/Button.tsx`

**Variants**: primary, secondary, danger, ghost

**Estimated Effort**: 45 minutes

---

### Task 35: Create Input Component ⬜
**Description**: Reusable input with label and error
**Related Files**:
- `frontend/components/ui/Input.tsx`

**Estimated Effort**: 1 hour

---

### Task 36: Create Select Component ⬜
**Description**: Reusable select dropdown
**Related Files**:
- `frontend/components/ui/Select.tsx`

**Estimated Effort**: 1 hour

---

### Task 37: Create Modal Component ⬜
**Description**: Reusable modal dialog
**Related Files**:
- `frontend/components/ui/Modal.tsx`

**Estimated Effort**: 1.5 hours

---

### Task 38: Create Toast Notification System ⬜
**Description**: Toast for success/error messages
**Related Files**:
- `frontend/components/ui/Toast.tsx`
- `frontend/contexts/ToastContext.tsx`

**Estimated Effort**: 2 hours

---

## Phase 8: Frontend - Categories

### Task 39: Create Categories Page ⬜
**Description**: Page to manage categories
**Related Files**:
- `frontend/app/(dashboard)/categories/page.tsx`

**Estimated Effort**: 1 hour

---

### Task 40: Create CategoryList Component ⬜
**Description**: Display list of categories
**Related Files**:
- `frontend/components/categories/CategoryList.tsx`

**Estimated Effort**: 1.5 hours

---

### Task 41: Create CategoryForm Component ⬜
**Description**: Form to add/edit category
**Related Files**:
- `frontend/components/categories/CategoryForm.tsx`

**Fields**: name, type, color, icon

**Estimated Effort**: 2 hours

---

### Task 42: Implement Category CRUD Operations ⬜
**Description**: Connect UI to API
**Related Files**:
- `frontend/lib/api/categories.ts`

**Estimated Effort**: 1.5 hours

---

## Phase 9: Frontend - Transactions

### Task 43: Create Transactions List Page ⬜
**Description**: Page with transaction list and filters
**Related Files**:
- `frontend/app/(dashboard)/transactions/page.tsx`

**Estimated Effort**: 2 hours

---

### Task 44: Create TransactionList Component ⬜
**Description**: Display transactions with pagination
**Related Files**:
- `frontend/components/transactions/TransactionList.tsx`

**Estimated Effort**: 2 hours

---

### Task 45: Create TransactionFilters Component ⬜
**Description**: Filters for type, category, date, amount
**Related Files**:
- `frontend/components/transactions/TransactionFilters.tsx`

**Estimated Effort**: 2.5 hours

---

### Task 46: Create Add Transaction Page ⬜
**Description**: Page to add new transaction
**Related Files**:
- `frontend/app/(dashboard)/transactions/new/page.tsx`

**Estimated Effort**: 1 hour

---

### Task 47: Create TransactionForm Component ⬜
**Description**: Form for transaction (create/edit)
**Related Files**:
- `frontend/components/transactions/TransactionForm.tsx`

**Fields**: type, amount, date, category, description

**Estimated Effort**: 3 hours

---

### Task 48: Create Edit Transaction Page ⬜
**Description**: Page to edit transaction
**Related Files**:
- `frontend/app/(dashboard)/transactions/[id]/edit/page.tsx`

**Estimated Effort**: 1 hour

---

### Task 49: Implement Transaction CRUD Operations ⬜
**Description**: Connect UI to API
**Related Files**:
- `frontend/lib/api/transactions.ts`

**Estimated Effort**: 2 hours

---

### Task 50: Implement CSV Export Button ⬜
**Description**: Download transactions as CSV
**Related Files**:
- `frontend/components/transactions/ExportButton.tsx`

**Estimated Effort**: 1 hour

---

## Phase 10: Frontend - Dashboard

### Task 51: Create Dashboard Page ⬜
**Description**: Main dashboard with summary and charts
**Related Files**:
- `frontend/app/(dashboard)/dashboard/page.tsx`

**Estimated Effort**: 1.5 hours

---

### Task 52: Create SummaryCards Component ⬜
**Description**: Cards for income, expense, net balance
**Related Files**:
- `frontend/components/dashboard/SummaryCards.tsx`

**Estimated Effort**: 1.5 hours

---

### Task 53: Create TrendsChart Component ⬜
**Description**: Line chart for income/expense trends
**Related Files**:
- `frontend/components/dashboard/TrendsChart.tsx`

**Dependencies**: recharts

**Estimated Effort**: 2.5 hours

---

### Task 54: Create CategoryBreakdownChart Component ⬜
**Description**: Pie chart for spending by category
**Related Files**:
- `frontend/components/dashboard/CategoryBreakdownChart.tsx`

**Estimated Effort**: 2 hours

---

### Task 55: Implement Dashboard API Integration ⬜
**Description**: Fetch and display dashboard data
**Related Files**:
- `frontend/lib/api/dashboard.ts`

**Estimated Effort**: 1.5 hours

---

## Phase 11: Testing & Quality

### Task 56: Write Backend Unit Tests ⬜
**Description**: Test services and controllers
**Related Files**:
- `backend/src/**/*.spec.ts`

**Estimated Effort**: 4 hours

---

### Task 57: Write Backend E2E Tests ⬜
**Description**: Test API endpoints
**Related Files**:
- `backend/test/app.e2e-spec.ts`

**Estimated Effort**: 3 hours

---

### Task 58: Write Frontend Component Tests ⬜
**Description**: Test React components
**Related Files**:
- `frontend/**/*.test.tsx`

**Dependencies**: Jest, React Testing Library

**Estimated Effort**: 3 hours

---

### Task 59: Manual Testing ⬜
**Description**: Test all features end-to-end

**Estimated Effort**: 2 hours

---

## Phase 12: Documentation & Deployment

### Task 60: Write README.md ⬜
**Description**: Complete project documentation
**Related Files**:
- `README.md`

**Sections**: Features, setup, env vars, deployment

**Estimated Effort**: 1.5 hours

---

### Task 61: Setup Swagger API Documentation ⬜
**Description**: Add Swagger to NestJS
**Related Files**:
- `backend/src/main.ts`

**Estimated Effort**: 1 hour

---

### Task 62: Deploy Backend to Railway ⬜
**Description**: Deploy NestJS to Railway or Render

**Estimated Effort**: 1 hour

---

### Task 63: Deploy Frontend to Vercel ⬜
**Description**: Deploy Next.js to Vercel

**Estimated Effort**: 30 minutes

---

### Task 64: Setup Production Database ⬜
**Description**: Configure PostgreSQL for production

**Estimated Effort**: 30 minutes

---

### Task 65: Post-Deployment Testing ⬜
**Description**: Test production environment

**Estimated Effort**: 1 hour

---

## Summary

**Total Tasks**: 65
**Estimated Total Effort**: ~100-120 hours (3-4 weeks full-time)

### Progress Tracking
- [✅] Phase 1: Project Setup (3/6 completed - 50%)
  - ✅ Task 1: Initialize Monorepo
  - ✅ Task 2: Setup Next.js
  - ✅ Task 3: Setup NestJS
  - ⬜ Task 4-6: Database & TypeORM setup
- [ ] Phase 2: Backend Auth (6 tasks)
- [ ] Phase 3: Backend Categories (4 tasks)
- [ ] Phase 4: Backend Transactions (7 tasks)
- [ ] Phase 5: Backend Dashboard (4 tasks)
- [ ] Phase 6: Frontend Auth (6 tasks)
- [ ] Phase 7: Frontend UI (5 tasks)
- [ ] Phase 8: Frontend Categories (4 tasks)
- [ ] Phase 9: Frontend Transactions (8 tasks)
- [ ] Phase 10: Frontend Dashboard (5 tasks)
- [ ] Phase 11: Testing (4 tasks)
- [ ] Phase 12: Deployment (6 tasks)

**Current Status**: ✅ Task 3 completed (NestJS backend ready!)
**Next Task**: Task 4 - Setup PostgreSQL Database
