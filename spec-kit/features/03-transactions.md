# Feature Specification: Transactions Management

## 📋 Feature Overview

**Feature Name**: Transactions Management
**Priority**: High (Core Feature)
**Status**: ✅ Complete
**Implementation Date**: January 2026

### Summary

Complete CRUD system for managing income and expense transactions with advanced filtering, pagination, search, and CSV export functionality.

### User Story

As a user
I want to track my income and expenses
So that I can monitor my financial activities

---

## 🎯 Requirements

### Functional Requirements

1. Users can create transactions (income/expense)
2. Users can view transactions with pagination
3. Users can filter by: type, category, date range
4. Users can search by description
5. Users can update transactions
6. Users can delete transactions
7. Users can export transactions to CSV
8. Transactions sorted by date (newest first)

### Non-Functional Requirements

- **Performance**: List loads < 500ms with 1000+ transactions
- **Usability**: Intuitive filters and search
- **Data Integrity**: Amount must be positive
- **Export**: Support up to 10,000 transactions

### Acceptance Criteria

- [x] User can create transaction with all fields
- [x] User can view paginated transaction list
- [x] User can filter by type (income/expense)
- [x] User can filter by category
- [x] User can filter by date range
- [x] User can search in description
- [x] User can edit transaction
- [x] User can delete transaction
- [x] User can export to CSV
- [x] Pagination works correctly

---

## 🏗️ Technical Design

### Backend (NestJS)

#### Entities

```typescript
@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @ManyToOne(() => User)
  userId: string;

  @Column()
  @ManyToOne(() => Category)
  categoryId: string;

  @Column()
  type: "income" | "expense";

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column("text", { nullable: true })
  description: string;

  @Column("date")
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category)
  category: Category;
}
```

#### DTOs

```typescript
// Create DTO
export class CreateTransactionDto {
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsUUID()
  categoryId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// Update DTO
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

// Filter DTO
export class FilterTransactionDto {
  @IsOptional()
  @IsEnum(['income', 'expense'])
  type?: 'income' | 'expense';

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '20';
}

// Paginated Response
{
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

#### Service Methods

- `create(userId, dto): Promise<Transaction>`
  - Creates new transaction
  - Associates with user and category

- `findAll(userId, filters): Promise<PaginatedResponse>`
  - Lists transactions with filters
  - Supports pagination, search, filtering
  - Joins category for display
  - Ordered by date DESC

- `findOne(id, userId): Promise<Transaction>`
  - Gets single transaction
  - Includes category relation
  - Validates ownership

- `update(id, userId, dto): Promise<Transaction>`
  - Updates transaction
  - Validates ownership
  - Updates timestamp

- `remove(id, userId): Promise<void>`
  - Deletes transaction
  - Validates ownership

- `exportCsv(userId, filters): Promise<string>`
  - Exports filtered transactions as CSV
  - Includes all fields + category name

#### API Endpoints

| Method | Endpoint               | Description        | Auth     |
| ------ | ---------------------- | ------------------ | -------- |
| POST   | `/transactions`        | Create transaction | Required |
| GET    | `/transactions`        | List with filters  | Required |
| GET    | `/transactions/:id`    | Get by ID          | Required |
| PATCH  | `/transactions/:id`    | Update transaction | Required |
| DELETE | `/transactions/:id`    | Delete transaction | Required |
| GET    | `/transactions/export` | Export to CSV      | Required |

#### Request/Response Examples

**POST /transactions**

```json
// Request
{
  "type": "expense",
  "amount": 50.00,
  "categoryId": "uuid-123",
  "date": "2026-01-08",
  "description": "Lunch with team"
}

// Response (201 Created)
{
  "id": "uuid-456",
  "type": "expense",
  "amount": "50.00",
  "categoryId": "uuid-123",
  "date": "2026-01-08",
  "description": "Lunch with team",
  "userId": "uuid-user",
  "createdAt": "2026-01-08T12:00:00Z",
  "updatedAt": "2026-01-08T12:00:00Z"
}
```

**GET /transactions?type=expense&categoryId=uuid-123&page=1&limit=20**

```json
// Response (200 OK)
{
  "data": [
    {
      "id": "uuid-456",
      "type": "expense",
      "amount": "50.00",
      "date": "2026-01-08",
      "description": "Lunch with team",
      "category": {
        "id": "uuid-123",
        "name": "Food",
        "color": "#ef4444",
        "icon": "🍔"
      },
      "createdAt": "2026-01-08T12:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

**GET /transactions/export?startDate=2026-01-01&endDate=2026-01-31**

```csv
// Response (200 OK, text/csv)
Date,Type,Amount,Category,Description
2026-01-08,expense,50.00,Food,Lunch with team
2026-01-07,income,3000.00,Salary,January salary
...
```

### Frontend (Next.js)

#### Pages

- `app/(dashboard)/transactions/page.tsx` - List page with filters
- `app/(dashboard)/transactions/new/page.tsx` - Create page
- `app/(dashboard)/transactions/[id]/edit/page.tsx` - Edit page

#### Components

- `components/transactions/TransactionForm.tsx` - Create/edit form
- Filter components (type, category, date range, search)

#### API Client

```typescript
// lib/api/transactions.ts
export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: string;
  date: string;
  description: string;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  createdAt: string;
}

export interface CreateTransactionDto {
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
}

export interface FilterOptions {
  type?: "income" | "expense";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const transactionsApi = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get<PaginatedResponse<Transaction>>("/transactions", {
      params: filters,
    }),

  getById: (id: string) => apiClient.get<Transaction>(`/transactions/${id}`),

  create: (data: CreateTransactionDto) =>
    apiClient.post<Transaction>("/transactions", data),

  update: (id: string, data: Partial<CreateTransactionDto>) =>
    apiClient.patch<Transaction>(`/transactions/${id}`, data),

  delete: (id: string) => apiClient.delete(`/transactions/${id}`),

  exportCsv: (filters?: FilterOptions) =>
    apiClient.get<Blob>("/transactions/export", {
      params: filters,
      responseType: "blob",
    }),
};
```

#### UI Flow

1. **List Page**:
   - Show transactions in table/cards
   - Filters at top: Type, Category, Date Range, Search
   - Each row: Date, Type badge, Amount, Category, Description, Actions
   - Pagination at bottom
   - "Add Transaction" button
   - "Export CSV" button

2. **Create Flow**:
   - Click "Add Transaction"
   - Navigate to create page (or open dialog)
   - Fill form: Type, Amount, Category, Date, Description
   - Submit → API call
   - Success → redirect to list, show toast

3. **Edit Flow**:
   - Click "Edit" on transaction
   - Navigate to edit page with pre-filled form
   - Modify fields
   - Submit → API call
   - Success → redirect to list, show toast

4. **Delete Flow**:
   - Click "Delete" on transaction
   - Confirm dialog
   - Confirm → API call
   - Success → remove from list, show toast

5. **Export Flow**:
   - Click "Export CSV"
   - Apply current filters
   - Download starts
   - CSV file saved to browser

#### UI Components Used

- `Dialog` - For confirmation
- `Input` - Amount, description, search
- `Select` - Type, category
- `Button` - Actions
- `Label` - Form labels
- `Card` - Transaction cards
- `Badge` - Type indicator
- `Toaster` (Sonner) - Notifications

### Database

#### Schema

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_type ON transactions(user_id, type);
```

---

## 🔒 Security

### Authentication

- All endpoints require JWT token
- User filtered automatically

### Authorization

- Users can only access their own transactions
- All queries filtered by `userId`
- Update/delete validates ownership

### Validation

- Amount: must be positive number
- Date: valid date format
- Category: must exist and belong to user
- Type: must be 'income' or 'expense'

---

## 🧪 Testing

### Unit Tests

- [x] TransactionsService: create transaction
- [x] TransactionsService: findAll with pagination
- [x] TransactionsService: findAll with type filter
- [x] TransactionsService: findAll with date range
- [x] TransactionsService: findAll with search
- [x] TransactionsService: update validates ownership
- [x] TransactionsService: delete validates ownership
- [x] TransactionsService: exportCsv generates CSV

### Integration Tests

- [x] POST /transactions creates transaction
- [x] GET /transactions returns paginated list
- [x] GET /transactions?type=expense filters correctly
- [x] GET /transactions?search=lunch finds matching
- [x] PATCH /transactions/:id updates transaction
- [x] DELETE /transactions/:id deletes transaction
- [x] GET /transactions/export downloads CSV

### E2E Tests

- [x] User can create transaction
- [x] User can view transactions list
- [x] User can filter transactions
- [x] User can search transactions
- [x] User can edit transaction
- [x] User can delete transaction
- [x] User can export to CSV
- [x] Pagination works

---

## 📊 Performance

### Expected Load

- Typical user: 100-1000 transactions/month
- Response time: < 500ms

### Optimization

- Indexes on user_id, date, category_id, type
- Pagination prevents loading all data
- CSV export streams for large datasets
- Frontend caches categories for filters

---

## 📝 Implementation Files

### Backend

- `backend/src/modules/transactions/transactions.module.ts`
- `backend/src/modules/transactions/transactions.service.ts`
- `backend/src/modules/transactions/transactions.controller.ts`
- `backend/src/modules/transactions/entities/transaction.entity.ts`
- `backend/src/modules/transactions/dto/create-transaction.dto.ts`
- `backend/src/modules/transactions/dto/update-transaction.dto.ts`
- `backend/src/modules/transactions/dto/filter-transaction.dto.ts`

### Frontend

- `frontend/app/(dashboard)/transactions/page.tsx`
- `frontend/app/(dashboard)/transactions/new/page.tsx`
- `frontend/app/(dashboard)/transactions/[id]/edit/page.tsx`
- `frontend/components/transactions/TransactionForm.tsx`
- `frontend/lib/api/transactions.ts`

---

## 🚀 Deployment

### Database Migration

```bash
npm run migration:generate -- -n CreateTransactionsTable
npm run migration:run
```

---

## 📚 Related Features

- **Categories**: Select category for each transaction
- **Dashboard**: Aggregate transactions for analytics

---

**Status**: ✅ Complete
**Last Updated**: January 8, 2026
**Implemented By**: NestJS Backend + Next.js Frontend
