# Feature Specification: Dashboard Analytics

## 📋 Feature Overview

**Feature Name**: Dashboard Analytics & Visualization
**Priority**: High
**Status**: ✅ Complete
**Implementation Date**: January 2026

### Summary

Analytics dashboard providing summary statistics, trends visualization, and category breakdown for income and expenses.

### User Story

As a user
I want to see visual summaries of my financial data
So that I can understand my spending patterns and financial health

---

## 🎯 Requirements

### Functional Requirements

1. Display total income, total expense, and net balance
2. Show transaction count
3. Support date range filtering
4. Display trends chart (daily/weekly/monthly)
5. Show category breakdown with percentages
6. Visual charts using Recharts
7. Period selector (day/week/month/year)
8. Responsive layout for mobile

### Non-Functional Requirements

- **Performance**: Dashboard loads < 1 second
- **Usability**: Clear, intuitive visualizations
- **Accuracy**: Precise financial calculations

### Acceptance Criteria

- [x] Summary cards show correct totals
- [x] Date range filter works
- [x] Trends chart displays correctly
- [x] Period selector changes data view
- [x] Category breakdown shows all categories
- [x] Charts are responsive
- [x] Loading states shown during data fetch
- [x] Error states handled gracefully

---

## 🏗️ Technical Design

### Backend (NestJS)

#### Service Methods

##### 1. Summary Endpoint

```typescript
async getSummary(userId: string, startDate?: string, endDate?: string) {
  // Returns:
  {
    totalIncome: number;      // Sum of all income
    totalExpense: number;     // Sum of all expense
    netBalance: number;       // Income - Expense
    transactionCount: number; // Total transactions
  }
}
```

##### 2. Trends Endpoint

```typescript
async getTrends(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly'
) {
  // Returns: Array of periods with income/expense totals
  [
    {
      period: '2026-01',
      type: 'income',
      total: 3000
    },
    {
      period: '2026-01',
      type: 'expense',
      total: 2500
    }
  ]
}
```

##### 3. Category Breakdown Endpoint

```typescript
async getCategoryBreakdown(
  userId: string,
  type?: 'income' | 'expense',
  startDate?: string,
  endDate?: string
) {
  // Returns: Array of categories with totals
  [
    {
      categoryId: 'uuid-123',
      categoryName: 'Food',
      color: '#ef4444',
      icon: '🍔',
      total: 500,
      count: 15
    }
  ]
}
```

#### API Endpoints

| Method | Endpoint                        | Description                | Auth     |
| ------ | ------------------------------- | -------------------------- | -------- |
| GET    | `/dashboard/summary`            | Get income/expense summary | Required |
| GET    | `/dashboard/trends`             | Get trends data            | Required |
| GET    | `/dashboard/category-breakdown` | Get category totals        | Required |

#### Request/Response Examples

**GET /dashboard/summary?startDate=2026-01-01&endDate=2026-01-31**

```json
// Response (200 OK)
{
  "totalIncome": 5000.0,
  "totalExpense": 3500.0,
  "netBalance": 1500.0,
  "transactionCount": 78
}
```

**GET /dashboard/trends?period=monthly**

```json
// Response (200 OK)
[
  {
    "period": "2025-12",
    "type": "income",
    "total": "4500.00"
  },
  {
    "period": "2025-12",
    "type": "expense",
    "total": "3000.00"
  },
  {
    "period": "2026-01",
    "type": "income",
    "total": "5000.00"
  },
  {
    "period": "2026-01",
    "type": "expense",
    "total": "3500.00"
  }
]
```

**GET /dashboard/category-breakdown?type=expense&startDate=2026-01-01&endDate=2026-01-31**

```json
// Response (200 OK)
[
  {
    "categoryId": "uuid-1",
    "categoryName": "Food",
    "color": "#ef4444",
    "icon": "🍔",
    "total": "1200.00",
    "count": 25
  },
  {
    "categoryId": "uuid-2",
    "categoryName": "Transport",
    "color": "#3b82f6",
    "icon": "🚗",
    "total": "800.00",
    "count": 15
  }
]
```

### Frontend (Next.js)

#### Pages

- `app/(dashboard)/dashboard/page.tsx` - Main dashboard

#### Components

- Summary cards (Income, Expense, Net Balance, Transaction Count)
- Period selector (Day/Week/Month/Year)
- Date range picker
- Trends chart (Line chart with Recharts)
- Category breakdown chart (Pie chart with Recharts)
- Recent transactions list

#### API Client

```typescript
// lib/api/dashboard.ts
export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface TrendData {
  period: string;
  type: "income" | "expense";
  total: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  total: string;
  count: number;
}

export const dashboardApi = {
  getSummary: (startDate?: string, endDate?: string) =>
    apiClient.get<Summary>("/dashboard/summary", {
      params: { startDate, endDate },
    }),

  getTrends: (period: "daily" | "weekly" | "monthly") =>
    apiClient.get<TrendData[]>("/dashboard/trends", {
      params: { period },
    }),

  getCategoryBreakdown: (
    type?: "income" | "expense",
    startDate?: string,
    endDate?: string
  ) =>
    apiClient.get<CategoryBreakdown[]>("/dashboard/category-breakdown", {
      params: { type, startDate, endDate },
    }),
};
```

#### Dashboard Layout

```
┌─────────────────────────────────────────────┐
│ Dashboard                                   │
├─────────────────────────────────────────────┤
│ Period: [Week▼]  Range: [Jan 1 - Jan 8]    │
├─────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ │Income│ │Expense│ │Balance│ │Count │        │
│ │$5000 │ │$3500 │ │+$1500 │ │  78  │        │
│ └──────┘ └──────┘ └──────┘ └──────┘        │
├─────────────────────────────────────────────┤
│ Trends (Weekly)                             │
│ ┌─────────────────────────────────────────┐ │
│ │        📈 Line Chart                    │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────────┐  │
│ │ Category       │ │ Recent Transactions│  │
│ │ Breakdown      │ │ • Food: $50        │  │
│ │   🥧 Pie Chart │ │ • Transport: $20   │  │
│ │                │ │ • Shopping: $100   │  │
│ └────────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────┘
```

#### Charts Implementation

**Trends Chart (Recharts LineChart)**

```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={transformedData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="period" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" />
    <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" />
  </LineChart>
</ResponsiveContainer>
```

**Category Breakdown (Recharts PieChart)**

```tsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={categoryData}
      dataKey="total"
      nameKey="categoryName"
      cx="50%"
      cy="50%"
      outerRadius={80}
      label
    >
      {categoryData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

#### UI Components Used

- `Card` - For summary cards and chart containers
- `Select` - Period selector
- `Button` - Date range picker trigger
- Recharts - LineChart, PieChart, ResponsiveContainer
- `Badge` - Transaction type indicators
- `Toaster` (Sonner) - Error notifications

### Database

No new tables needed. Uses existing `transactions` table with aggregations.

---

## 🔒 Security

### Authentication

- All endpoints require JWT token
- Data automatically filtered by userId

### Authorization

- Users can only see their own data
- All queries scoped to authenticated user

### Data Privacy

- No sensitive data exposed
- Aggregated data only

---

## 🧪 Testing

### Unit Tests

- [x] DashboardService: getSummary calculates correctly
- [x] DashboardService: getSummary filters by date range
- [x] DashboardService: getTrends formats periods correctly
- [x] DashboardService: getTrends handles different periods
- [x] DashboardService: getCategoryBreakdown groups correctly
- [x] DashboardService: getCategoryBreakdown filters by type

### Integration Tests

- [x] GET /dashboard/summary returns summary
- [x] GET /dashboard/summary filters by date
- [x] GET /dashboard/trends returns trends data
- [x] GET /dashboard/trends?period=daily works
- [x] GET /dashboard/category-breakdown returns breakdown
- [x] GET /dashboard/category-breakdown?type=expense filters

### E2E Tests

- [x] User can view dashboard
- [x] User can change period selector
- [x] User can change date range
- [x] Charts display correctly
- [x] Summary cards show correct values
- [x] Mobile layout is responsive

---

## 📊 Performance

### Expected Load

- Dashboard accessed frequently
- Typical query: 3 months of data
- Response time target: < 1 second

### Optimization

- Database indexes on user_id, date, type
- Aggregation at database level (fast)
- Frontend caching with React Query
- Charts render client-side (smooth)

---

## 📝 Implementation Files

### Backend

- `backend/src/modules/dashboard/dashboard.module.ts`
- `backend/src/modules/dashboard/dashboard.service.ts`
- `backend/src/modules/dashboard/dashboard.controller.ts`

### Frontend

- `frontend/app/(dashboard)/dashboard/page.tsx`
- `frontend/lib/api/dashboard.ts`
- Recharts library integration

---

## 🚀 Deployment

No special requirements. Uses existing database.

---

## 📚 Related Features

- **Transactions**: Source data for all analytics
- **Categories**: Used for breakdown visualization

---

## 💡 Future Enhancements

- [ ] Budget tracking and alerts
- [ ] Spending goals
- [ ] Year-over-year comparison
- [ ] Custom date ranges
- [ ] Export charts as images
- [ ] Predictive analytics (AI)

---

**Status**: ✅ Complete
**Last Updated**: January 8, 2026
**Implemented By**: NestJS Backend + Next.js Frontend + Recharts
