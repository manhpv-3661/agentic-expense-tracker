# Feature Specification Template

## 📋 Feature Overview

**Feature Name**: [Name of the feature]
**Priority**: [High/Medium/Low]
**Estimated Effort**: [Hours/Days]
**Dependencies**: [List other features/tasks this depends on]
**Status**: [Planning/In Progress/Complete]

### Summary

[Brief 1-2 sentence description of what this feature does]

### User Story

As a [type of user]
I want [goal/desire]
So that [benefit/value]

---

## 🎯 Requirements

### Functional Requirements

1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

### Non-Functional Requirements

- **Performance**: [Performance criteria]
- **Security**: [Security requirements]
- **Accessibility**: [Accessibility requirements]
- **Usability**: [Usability requirements]

### Acceptance Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

## 🏗️ Technical Design

### Backend (NestJS)

#### Entities

```typescript
@Entity("entity_name")
export class EntityName {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  field1: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  field2: number;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### DTOs

```typescript
// Create DTO
export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  field1: string;

  @IsNumber()
  @IsPositive()
  field2: number;
}

// Update DTO
export class UpdateEntityDto extends PartialType(CreateEntityDto) {}

// Response DTO
export class EntityResponseDto {
  id: string;
  field1: string;
  field2: number;
  createdAt: Date;
}
```

#### Service Methods

- `create(dto: CreateEntityDto, user: User): Promise<Entity>`
- `findAll(user: User, filters?: FilterDto): Promise<Entity[]>`
- `findOne(id: string, user: User): Promise<Entity>`
- `update(id: string, dto: UpdateEntityDto, user: User): Promise<Entity>`
- `remove(id: string, user: User): Promise<void>`

#### API Endpoints

| Method | Endpoint            | Description       | Auth     |
| ------ | ------------------- | ----------------- | -------- |
| POST   | `/api/entities`     | Create new entity | Required |
| GET    | `/api/entities`     | List all entities | Required |
| GET    | `/api/entities/:id` | Get entity by ID  | Required |
| PATCH  | `/api/entities/:id` | Update entity     | Required |
| DELETE | `/api/entities/:id` | Delete entity     | Required |

#### Request/Response Examples

**POST /api/entities**

```json
// Request
{
  "field1": "value",
  "field2": 100.50
}

// Response (201 Created)
{
  "id": "uuid",
  "field1": "value",
  "field2": 100.50,
  "createdAt": "2026-01-08T12:00:00Z"
}
```

**GET /api/entities?field1=value**

```json
// Response (200 OK)
[
  {
    "id": "uuid",
    "field1": "value",
    "field2": 100.5,
    "createdAt": "2026-01-08T12:00:00Z"
  }
]
```

### Frontend (Next.js)

#### Pages

- `app/(dashboard)/entities/page.tsx` - List page
- `app/(dashboard)/entities/new/page.tsx` - Create page
- `app/(dashboard)/entities/[id]/edit/page.tsx` - Edit page

#### Components

- `components/entities/EntityForm.tsx` - Form component
- `components/entities/EntityCard.tsx` - Card component (optional)
- `components/entities/EntityFilters.tsx` - Filter component (optional)

#### API Client

```typescript
// lib/api/entities.ts
export interface Entity {
  id: string;
  field1: string;
  field2: number;
  createdAt: string;
}

export interface CreateEntityDto {
  field1: string;
  field2: number;
}

export const entitiesApi = {
  getAll: (filters?: Record<string, any>) =>
    apiClient.get<Entity[]>("/entities", { params: filters }),

  getById: (id: string) => apiClient.get<Entity>(`/entities/${id}`),

  create: (data: CreateEntityDto) => apiClient.post<Entity>("/entities", data),

  update: (id: string, data: Partial<CreateEntityDto>) =>
    apiClient.patch<Entity>(`/entities/${id}`, data),

  delete: (id: string) => apiClient.delete(`/entities/${id}`),
};
```

#### UI Components Used

- `Button` - For actions
- `Input` - For text fields
- `Select` - For dropdowns
- `Dialog` - For modals
- `Card` - For list items
- `Label` - For form labels
- `Toaster` (Sonner) - For notifications

### Database

#### Schema Changes

```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field1 VARCHAR(255) NOT NULL,
  field2 DECIMAL(10,2) NOT NULL,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_entities_user_id ON entities(user_id);
CREATE INDEX idx_entities_created_at ON entities(created_at);
```

#### Relationships

- Entity belongs to User (many-to-one)
- [Add other relationships]

---

## 📱 User Interface

### Wireframes

[Add wireframes, mockups, or descriptions]

#### List Page

```
┌─────────────────────────────────────────────┐
│ Entities                    [+ Add Entity]  │
├─────────────────────────────────────────────┤
│ 🔍 Search: [________]  Filter: [All ▼]     │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Entity 1                                │ │
│ │ Field1: Value                           │ │
│ │ Field2: 100.50                          │ │
│ │                      [Edit]  [Delete]   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Entity 2                                │ │
│ │ Field1: Value                           │ │
│ │ Field2: 200.75                          │ │
│ │                      [Edit]  [Delete]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Showing 1-10 of 25     [< 1 2 3 >]         │
└─────────────────────────────────────────────┘
```

#### Form (Create/Edit)

```
┌─────────────────────────────────────────────┐
│ Create Entity                      [x]      │
├─────────────────────────────────────────────┤
│                                             │
│ Field 1 *                                   │
│ [________________________]                  │
│                                             │
│ Field 2 *                                   │
│ [________________________]                  │
│                                             │
│                                             │
│                    [Cancel]  [Create]       │
└─────────────────────────────────────────────┘
```

### User Flows

1. **Create Entity Flow**
   - User clicks "Add Entity" button
   - Dialog opens with form
   - User fills in fields
   - Clicks "Create"
   - Loading state shows
   - Success toast appears
   - Dialog closes
   - List refreshes with new entity

2. **Edit Entity Flow**
   - User clicks "Edit" on an entity
   - Dialog opens with pre-filled form
   - User modifies fields
   - Clicks "Update"
   - Loading state shows
   - Success toast appears
   - Dialog closes
   - List refreshes with updated entity

3. **Delete Entity Flow**
   - User clicks "Delete" on an entity
   - Confirmation dialog appears
   - User confirms
   - Delete request sent
   - Success toast appears
   - Entity removed from list

---

## 🔒 Security

### Authentication

- All endpoints require JWT authentication
- Use `@UseGuards(JwtAuthGuard)` on controllers
- Access user via `@CurrentUser()` decorator

### Authorization

- Users can only access their own entities
- Filter queries by `user.id`
- Validate ownership before update/delete

### Validation

- All input validated with DTOs and class-validator
- Sanitize user input
- Validate file uploads (if applicable)
- Check for SQL injection, XSS

---

## 🧪 Testing

### Unit Tests

- [ ] Service: create method
- [ ] Service: findAll method
- [ ] Service: findOne method
- [ ] Service: update method
- [ ] Service: delete method
- [ ] Controller: all endpoints
- [ ] DTOs: validation rules

### Integration Tests

- [ ] API: Create entity
- [ ] API: List entities with filters
- [ ] API: Get entity by ID
- [ ] API: Update entity
- [ ] API: Delete entity
- [ ] API: Error cases (404, 401, 400)

### E2E Tests

- [ ] User can create entity
- [ ] User can view list of entities
- [ ] User can edit entity
- [ ] User can delete entity
- [ ] User can filter entities
- [ ] User can search entities

### Manual Testing

- [ ] Create entity via UI
- [ ] Edit entity via UI
- [ ] Delete entity via UI
- [ ] Apply filters
- [ ] Test pagination
- [ ] Test error messages
- [ ] Test loading states
- [ ] Test responsive design
- [ ] Test accessibility

---

## 📊 Performance

### Expected Load

- Requests per second: [number]
- Database queries per request: [number]
- Response time target: [ms]

### Optimization Strategies

- Database indexes on frequently queried fields
- Pagination for large datasets
- Caching (if applicable)
- Lazy loading on frontend

---

## 📝 Documentation

### Code Documentation

- JSDoc comments on complex methods
- README for module
- API documentation (Swagger/OpenAPI)

### User Documentation

- How to use the feature
- Screenshots
- Common issues and solutions

---

## 🚀 Deployment

### Database Migration

```bash
npm run migration:generate -- -n AddEntitiesTable
npm run migration:run
```

### Environment Variables

```env
# No new environment variables needed
# OR
NEW_FEATURE_API_KEY=xxx
```

### Deployment Checklist

- [ ] Run database migration
- [ ] Update environment variables
- [ ] Build backend
- [ ] Build frontend
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Smoke test in production
- [ ] Monitor for errors

---

## 📋 Implementation Checklist

### Backend

- [ ] Create entity
- [ ] Create DTOs (Create, Update, Response)
- [ ] Create service with CRUD methods
- [ ] Create controller with endpoints
- [ ] Add validation
- [ ] Add error handling
- [ ] Add authentication guards
- [ ] Register in module
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend

- [ ] Create API client
- [ ] Create list page
- [ ] Create form component
- [ ] Add create functionality
- [ ] Add edit functionality
- [ ] Add delete functionality
- [ ] Add filters
- [ ] Add pagination
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test responsive design
- [ ] Test accessibility

### Database

- [ ] Design schema
- [ ] Create migration
- [ ] Add indexes
- [ ] Update relationships
- [ ] Test queries

### Documentation

- [ ] API documentation
- [ ] Component documentation
- [ ] User guide
- [ ] Update README

### Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual testing
- [ ] Performance testing

---

## 🐛 Known Issues / Limitations

[List any known issues, limitations, or technical debt]

---

## 🔮 Future Enhancements

[List potential future improvements or features]

---

## 📚 References

- [Link to related documentation]
- [Link to design mockups]
- [Link to similar features]
- [Link to external resources]

---

**Last Updated**: [Date]
**Author**: [Name]
**Reviewers**: [Names]
