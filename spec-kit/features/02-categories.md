# Feature Specification: Categories Management

## 📋 Feature Overview

**Feature Name**: Categories Management
**Priority**: High
**Status**: ✅ Complete
**Implementation Date**: January 2026

### Summary

CRUD system for managing transaction categories with support for custom categories, colors, icons, and type filtering.

### User Story

As a user
I want to create and manage custom categories
So that I can organize my transactions effectively

---

## 🎯 Requirements

### Functional Requirements

1. Users can create custom categories
2. Users can view all their categories filtered by type
3. Users can update custom categories (not default ones)
4. Users can delete custom categories (not default ones)
5. Categories have: name, type (income/expense), color, icon
6. System provides default categories
7. Default categories cannot be modified or deleted

### Non-Functional Requirements

- **Performance**: Category list loads < 200ms
- **Usability**: Color picker and icon selector UI
- **Data Integrity**: Prevent deletion of default categories

### Acceptance Criteria

- [x] User can create category with name, type, color, icon
- [x] User can view categories filtered by type
- [x] User can update custom categories
- [x] User cannot update default categories
- [x] User can delete custom categories
- [x] User cannot delete default categories
- [x] Categories sorted alphabetically by name

---

## 🏗️ Technical Design

### Backend (NestJS)

#### Entities

```typescript
@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @ManyToOne(() => User)
  userId: string;

  @Column()
  name: string;

  @Column()
  type: "income" | "expense";

  @Column({ default: "#6366f1" })
  color: string; // Hex color

  @Column({ default: "💰" })
  icon: string; // Emoji

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### DTOs

```typescript
// Create DTO
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(["income", "expense"])
  type: "income" | "expense";

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

// Update DTO
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

// Response
{
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Service Methods

- `create(userId, dto): Promise<Category>`
  - Creates new custom category
  - Sets userId and isDefault = false

- `findAll(userId, type?): Promise<Category[]>`
  - Lists all categories for user
  - Optional filter by type
  - Ordered by name ASC

- `findOne(id, userId): Promise<Category>`
  - Gets single category
  - Validates ownership
  - Throws 404 if not found

- `update(id, userId, dto): Promise<Category>`
  - Updates category
  - Validates ownership
  - Prevents updating default categories (403)

- `remove(id, userId): Promise<void>`
  - Deletes category
  - Validates ownership
  - Prevents deleting default categories (403)

#### API Endpoints

| Method | Endpoint                   | Description        | Auth     |
| ------ | -------------------------- | ------------------ | -------- |
| POST   | `/categories`              | Create category    | Required |
| GET    | `/categories?type=expense` | List categories    | Required |
| GET    | `/categories/:id`          | Get category by ID | Required |
| PATCH  | `/categories/:id`          | Update category    | Required |
| DELETE | `/categories/:id`          | Delete category    | Required |

#### Request/Response Examples

**POST /categories**

```json
// Request
{
  "name": "Groceries",
  "type": "expense",
  "color": "#10b981",
  "icon": "🛒"
}

// Response (201 Created)
{
  "id": "uuid-123",
  "name": "Groceries",
  "type": "expense",
  "color": "#10b981",
  "icon": "🛒",
  "isDefault": false,
  "createdAt": "2026-01-08T10:00:00Z",
  "updatedAt": "2026-01-08T10:00:00Z"
}
```

**GET /categories?type=expense**

```json
// Response (200 OK)
[
  {
    "id": "uuid-1",
    "name": "Food",
    "type": "expense",
    "color": "#ef4444",
    "icon": "🍔",
    "isDefault": true
  },
  {
    "id": "uuid-2",
    "name": "Groceries",
    "type": "expense",
    "color": "#10b981",
    "icon": "🛒",
    "isDefault": false
  }
]
```

**PATCH /categories/:id**

```json
// Request
{
  "name": "Shopping",
  "color": "#8b5cf6"
}

// Response (200 OK)
{
  "id": "uuid-123",
  "name": "Shopping",
  "type": "expense",
  "color": "#8b5cf6",
  "icon": "🛒",
  "isDefault": false
}

// Error (403 Forbidden) - if trying to update default
{
  "statusCode": 403,
  "message": "Cannot update default category"
}
```

**DELETE /categories/:id**

```json
// Success (204 No Content)

// Error (403 Forbidden) - if trying to delete default
{
  "statusCode": 403,
  "message": "Cannot delete default category"
}
```

### Frontend (Next.js)

#### Pages

- `app/(dashboard)/categories/page.tsx` - Categories management page

#### Components

- `components/categories/CategoryForm.tsx` - Form for create/edit
- Color picker and icon selector

#### API Client

```typescript
// lib/api/categories.ts
export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: "income" | "expense";
  color?: string;
  icon?: string;
}

export const categoriesApi = {
  getAll: (type?: "income" | "expense") =>
    apiClient.get<Category[]>("/categories", {
      params: type ? { type } : undefined,
    }),

  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryDto) =>
    apiClient.post<Category>("/categories", data),

  update: (id: string, data: Partial<CreateCategoryDto>) =>
    apiClient.patch<Category>(`/categories/${id}`, data),

  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};
```

#### UI Flow

1. **List Page**:
   - Show categories grouped by type
   - Filter toggle (All/Income/Expense)
   - Add Category button opens dialog
   - Each category has Edit/Delete buttons
   - Default categories show lock icon, no edit/delete

2. **Create Flow**:
   - Click "Add Category"
   - Dialog opens with form
   - Fill name, select type
   - Choose color (color picker)
   - Choose icon (icon selector)
   - Submit → API call
   - Success → toast, close dialog, refresh list

3. **Edit Flow**:
   - Click "Edit" on custom category
   - Dialog opens pre-filled
   - Modify fields
   - Submit → API call
   - Success → toast, close dialog, refresh list

4. **Delete Flow**:
   - Click "Delete" on custom category
   - Confirm dialog appears
   - Confirm → API call
   - Success → toast, remove from list

#### UI Components Used

- `Dialog` - For create/edit forms
- `Input` - Category name
- `Select` - Type selection
- `Button` - Actions
- `Label` - Form labels
- `Toaster` (Sonner) - Notifications

### Database

#### Schema

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  color VARCHAR(7) DEFAULT '#6366f1',
  icon VARCHAR(50) DEFAULT '💰',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, name, type)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(user_id, type);
```

#### Default Categories

```sql
-- Expense categories
Food, Transport, Shopping, Bills, Entertainment, Healthcare, Education, Other

-- Income categories
Salary, Freelance, Investment, Gift, Other
```

---

## 🔒 Security

### Authentication

- All endpoints require JWT token
- `@UseGuards(JwtAuthGuard)`
- User extracted via `@CurrentUser()`

### Authorization

- Users can only access their own categories
- Query filtered by `userId`
- Update/delete validates ownership
- Default categories protected from modification

### Validation

- Name: required, not empty
- Type: must be 'income' or 'expense'
- Color: optional, must be valid hex (#RRGGBB)
- Icon: optional string

---

## 🧪 Testing

### Unit Tests

- [x] CategoriesService: create category
- [x] CategoriesService: findAll with type filter
- [x] CategoriesService: findOne validates ownership
- [x] CategoriesService: update prevents default modification
- [x] CategoriesService: delete prevents default deletion

### Integration Tests

- [x] POST /categories creates category
- [x] GET /categories returns user's categories
- [x] GET /categories?type=expense filters correctly
- [x] PATCH /categories/:id updates custom category
- [x] PATCH /categories/:id rejects default category (403)
- [x] DELETE /categories/:id deletes custom category
- [x] DELETE /categories/:id rejects default category (403)

### E2E Tests

- [x] User can create custom category
- [x] User can view categories list
- [x] User can filter by type
- [x] User can edit custom category
- [x] User cannot edit default category
- [x] User can delete custom category
- [x] User cannot delete default category

---

## 📊 Performance

### Expected Load

- Typical user: 10-30 categories
- Response time: < 200ms

### Optimization

- Categories cached on frontend after first load
- Index on user_id for fast queries
- Alphabetical sorting for consistent UX

---

## 📝 Implementation Files

### Backend

- `backend/src/modules/categories/categories.module.ts`
- `backend/src/modules/categories/categories.service.ts`
- `backend/src/modules/categories/categories.controller.ts`
- `backend/src/modules/categories/entities/category.entity.ts`
- `backend/src/modules/categories/dto/create-category.dto.ts`
- `backend/src/modules/categories/dto/update-category.dto.ts`

### Frontend

- `frontend/app/(dashboard)/categories/page.tsx`
- `frontend/components/categories/CategoryForm.tsx`
- `frontend/lib/api/categories.ts`

---

## 🚀 Deployment

### Database Migration

```bash
npm run migration:generate -- -n CreateCategoriesTable
npm run migration:run
```

### Seed Default Categories

```bash
npm run seed:categories
```

---

## 📚 Related Features

- **Transactions**: Use categories for classification
- **Dashboard**: Category breakdown chart

---

**Status**: ✅ Complete
**Last Updated**: January 8, 2026
**Implemented By**: NestJS Backend + Next.js Frontend
