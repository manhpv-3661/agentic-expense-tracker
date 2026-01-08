# Expense Tracker

A full-stack expense tracking application built with Next.js, NestJS, PostgreSQL, and TypeScript.

## Features

- 🔐 **Authentication**: JWT-based user authentication with secure password hashing
- 💰 **Transaction Management**: Track income and expenses with categories
- 📊 **Dashboard**: Visualize spending trends and category breakdowns
- 📁 **Categories**: Organize transactions with custom categories
- 📤 **Export**: Download transaction history as CSV
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Axios** for API calls
- **Recharts** for data visualization
- **date-fns** for date formatting

### Backend

- **NestJS 11**
- **TypeORM** with PostgreSQL
- **JWT** authentication
- **bcrypt** for password hashing
- **class-validator** for validation

### Database

- **PostgreSQL 15** (Docker)

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd agentic-expense-tracker
```

### 2. Install dependencies

```bash
# Install all workspace dependencies
npm install
```

### 3. Start PostgreSQL database

```bash
docker compose up -d
```

### 4. Setup environment variables

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=expense_tracker

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

PORT=4000
NODE_ENV=development
```

**Frontend** (create `frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Run the application

**Option 1: Run both services concurrently**

```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:

```bash
cd backend
npm run start:dev
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

### 6. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Project Structure

```
agentic-expense-tracker/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── users/      # Users module
│   │   │   ├── categories/ # Categories module
│   │   │   ├── transactions/ # Transactions module
│   │   │   └── dashboard/  # Dashboard analytics module
│   │   ├── common/         # Shared decorators & guards
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── (auth)/         # Authentication pages
│   │   └── (dashboard)/    # Protected dashboard pages
│   ├── components/         # Reusable React components
│   ├── contexts/           # React contexts (Auth)
│   ├── lib/api/            # API client functions
│   └── package.json
├── docs/                    # Documentation
├── docker-compose.yml      # PostgreSQL container
└── package.json            # Root workspace config
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users

- `GET /users/me` - Get current user profile

### Categories

- `GET /categories` - Get all categories (with optional type filter)
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Transactions

- `GET /transactions` - Get transactions (with filters & pagination)
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/export` - Export to CSV

### Dashboard

- `GET /dashboard/summary` - Get financial summary
- `GET /dashboard/trends` - Get trends by period (daily/weekly/monthly)
- `GET /dashboard/category-breakdown` - Get spending by category

## Database Schema

The application uses three main tables:

- **users**: User accounts with authentication
- **categories**: Transaction categories (income/expense)
- **transactions**: Financial transactions linked to categories

See `docs/schema.sql` for the complete schema with indexes and triggers.

## Development

### Run tests

```bash
# Backend unit tests
cd backend
npm run test

# Backend e2e tests
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

### Lint and format

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

## Deployment

### Backend (Railway/Render)

1. Create PostgreSQL database
2. Set environment variables
3. Deploy from Git repository

### Frontend (Vercel)

1. Connect repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

## License

MIT

## Author

Built for Agentic Coding Course - Bài tập 1
