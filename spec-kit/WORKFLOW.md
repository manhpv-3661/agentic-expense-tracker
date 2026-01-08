# Development Workflow

## 🔄 Standard Development Process

This document outlines the workflow for developing features in the Agentic Expense Tracker project.

---

## 📋 Phase 1: Planning

### 1.1 Define Requirements

- [ ] Read specification document
- [ ] Identify user stories
- [ ] List acceptance criteria
- [ ] Determine dependencies

### 1.2 Technical Design

- [ ] Choose appropriate architecture
- [ ] Design database schema (if needed)
- [ ] Plan API endpoints
- [ ] Design UI components
- [ ] Identify reusable components

### 1.3 Task Breakdown

- [ ] Break feature into small tasks (1-2 hours each)
- [ ] Prioritize tasks
- [ ] Identify blockers
- [ ] Estimate effort

---

## 🏗️ Phase 2: Implementation

### 2.1 Backend Development (NestJS)

#### Setup Module

```bash
# Create new module
nest g module feature-name
nest g controller feature-name
nest g service feature-name

# Or manual creation in src/modules/
```

#### Implementation Steps

1. **Create Entity** (`*.entity.ts`)

   ```typescript
   @Entity("table_name")
   export class FeatureEntity {
     @PrimaryGeneratedColumn("uuid")
     id: string;

     // Add fields...
   }
   ```

2. **Create DTOs** (`dto/*.dto.ts`)

   ```typescript
   export class CreateFeatureDto {
     @IsString()
     @IsNotEmpty()
     name: string;
   }
   ```

3. **Implement Service** (`*.service.ts`)

   ```typescript
   @Injectable()
   export class FeatureService {
     constructor(
       @InjectRepository(FeatureEntity)
       private repo: Repository<FeatureEntity>
     ) {}

     async create(dto: CreateFeatureDto) {
       // Implementation
     }
   }
   ```

4. **Implement Controller** (`*.controller.ts`)

   ```typescript
   @Controller("features")
   @UseGuards(JwtAuthGuard)
   export class FeatureController {
     constructor(private service: FeatureService) {}

     @Post()
     create(@Body() dto: CreateFeatureDto, @CurrentUser() user: User) {
       return this.service.create(dto, user);
     }
   }
   ```

5. **Register in Module** (`*.module.ts`)

   ```typescript
   @Module({
     imports: [TypeOrmModule.forFeature([FeatureEntity])],
     controllers: [FeatureController],
     providers: [FeatureService],
     exports: [FeatureService],
   })
   export class FeatureModule {}
   ```

6. **Import in AppModule**

### 2.2 Frontend Development (Next.js)

#### Create API Client

```typescript
// lib/api/feature.ts
export const featureApi = {
  getAll: () => apiClient.get("/features"),
  create: (data) => apiClient.post("/features", data),
  // ...
};
```

#### Create Page

```typescript
// app/(dashboard)/features/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await featureApi.getAll();
      setData(result);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Features</h1>
      {/* UI implementation */}
    </div>
  );
}
```

#### Create Component (if needed)

```typescript
// components/features/FeatureForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FeatureForm({ onSuccess }) {
  // Form implementation
}
```

---

## 🧪 Phase 3: Testing

### 3.1 Backend Testing

#### Manual API Testing

```bash
# Test with cURL
curl -X POST http://localhost:4000/features \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Feature"}'
```

#### Check for Errors

```bash
cd backend
npm run lint
npm run build
```

### 3.2 Frontend Testing

#### Manual Testing

1. Start dev server: `npm run dev`
2. Navigate to feature page
3. Test all user interactions
4. Check responsive design
5. Verify error handling

#### Check for Errors

```bash
cd frontend
npm run lint
npm run build
```

### 3.3 Integration Testing

- [ ] Backend + Frontend work together
- [ ] Database operations succeed
- [ ] Authentication works
- [ ] Error handling works
- [ ] Loading states display correctly

---

## 📝 Phase 4: Documentation

### 4.1 Code Documentation

- [ ] Add JSDoc comments to complex functions
- [ ] Document API endpoints
- [ ] Add README for new modules

### 4.2 User Documentation

- [ ] Update TESTING_GUIDE.md if needed
- [ ] Add to PROJECT_COMPLETE.md
- [ ] Update API documentation

---

## ✅ Phase 5: Code Review & Commit

### 5.1 Self Review Checklist

- [ ] Code follows project standards
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] Responsive design
- [ ] Accessibility (ARIA labels)
- [ ] No console.logs left
- [ ] No commented-out code
- [ ] No unused imports

### 5.2 Commit Changes

Follow conventions in `GIT_COMMIT.md`:

```bash
# Stage changes
git add .

# Commit with conventional message
git commit -m "feat(backend): add feature management module

- Create Feature entity and repository
- Implement CRUD operations
- Add validation with DTOs
- Add JWT authentication

Closes #123"

# Push to remote
git push origin feature-branch
```

---

## 🚀 Phase 6: Deployment

### 6.1 Pre-deployment Checklist

- [ ] All tests pass
- [ ] No build errors
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Documentation updated
- [ ] Code reviewed

### 6.2 Deployment Steps

#### Backend

```bash
cd backend
npm run build
# Deploy dist/ folder
```

#### Frontend

```bash
cd frontend
npm run build
# Deploy .next/ folder
```

#### Database

```bash
# Run migrations
npm run migration:run

# Verify schema
psql -U expense_user -d expense_tracker_db -c "\dt"
```

---

## 🔄 Continuous Improvement

### After Each Feature

1. **Retrospective**
   - What went well?
   - What could be improved?
   - Lessons learned?

2. **Update Documentation**
   - Add new patterns to this guide
   - Update architecture docs
   - Improve examples

3. **Refactor if Needed**
   - Simplify complex code
   - Extract reusable components
   - Improve performance

---

## 📚 Quick Reference

### Common Commands

```bash
# Backend
cd backend
npm run start:dev      # Development mode
npm run build          # Production build
npm run lint           # Check for errors
npm run test           # Run tests

# Frontend
cd frontend
npm run dev            # Development mode
npm run build          # Production build
npm run lint           # Check for errors

# Database
docker-compose up -d   # Start database
docker-compose down    # Stop database
docker-compose logs    # View logs
```

### File Locations

- **Backend Modules**: `backend/src/modules/`
- **Frontend Pages**: `frontend/app/(dashboard)/`
- **UI Components**: `frontend/components/ui/`
- **API Clients**: `frontend/lib/api/`
- **Documentation**: `docs/`

### Useful Resources

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeORM Docs](https://typeorm.io/)

---

## 🎯 Success Criteria

Feature is **done** when:

- ✅ Code implemented and working
- ✅ Manually tested
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Responsive design
- ✅ Error handling complete
- ✅ Documentation updated
- ✅ Committed with proper message
- ✅ Deployed (if applicable)

---

## 💡 Tips

1. **Start Small**: Implement one feature at a time
2. **Test Often**: Test after each change
3. **Commit Often**: Small, focused commits
4. **Document as You Go**: Don't leave it for later
5. **Ask for Help**: Use AI prompts when stuck
6. **Follow Standards**: Consistency is key
7. **Think User First**: Always consider UX

---

**Remember**: Quality > Speed. Take time to do it right! 🎯
