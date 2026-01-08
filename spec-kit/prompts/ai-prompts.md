# AI Prompts Collection

## 📋 Purpose

This file contains reusable AI prompts for common development tasks. Use these prompts to get consistent, high-quality AI assistance.

---

## 🏗️ Backend Development Prompts

### Create New NestJS Module

```
Create a new NestJS module for [FEATURE_NAME] with the following requirements:

1. Entity:
   - [List entity fields and types]
   - Relationships: [List relationships]
   - Timestamps: createdAt, updatedAt

2. DTOs:
   - CreateDto with validation
   - UpdateDto with partial validation
   - Response

 with mapped fields

3. Service:
   - CRUD operations (create, findAll, findOne, update, delete)
   - Custom method: [describe custom logic]
   - Error handling with proper exceptions

4. Controller:
   - RESTful endpoints
   - JWT authentication with @UseGuards(JwtAuthGuard)
   - Use @CurrentUser() decorator for user access
   - Proper HTTP status codes

5. Module:
   - Register entity in TypeORM
   - Export service for other modules

Follow 100% NestJS standards. No Express direct usage.
```

### Fix NestJS Error

```
I'm getting the following error in my NestJS application:

[PASTE ERROR MESSAGE]

Context:
- File: [FILE_PATH]
- What I'm trying to do: [DESCRIPTION]
- Related code: [PASTE RELEVANT CODE]

Please:
1. Explain what's causing the error
2. Provide the exact fix
3. Show before/after code comparison
4. Suggest any related improvements

Follow NestJS best practices. No Express direct usage.
```

### Refactor to NestJS Standards

```
Refactor this code to follow 100% NestJS standards:

[PASTE CODE]

Requirements:
- Remove any Express direct usage
- Use NestJS decorators properly
- Implement proper dependency injection
- Add proper typing
- Follow NestJS naming conventions
- Add error handling
- Implement validation with DTOs

Show before/after comparison and explain changes.
```

---

## 💻 Frontend Development Prompts

### Create Next.js Page with shadcn/ui

```
Create a Next.js 14 App Router page for [FEATURE_NAME] with the following requirements:

1. Page Structure:
   - Path: app/(dashboard)/[feature]/page.tsx
   - Client component with "use client"
   - Responsive layout

2. Features:
   - List items with pagination
   - Create new item button (opens dialog)
   - Edit and delete actions
   - Filters: [list filters]
   - Search functionality

3. UI Components (shadcn/ui):
   - Button (with variants)
   - Dialog for forms
   - Input for search
   - Select for filters
   - Card for list items
   - Toast (Sonner) for notifications

4. State Management:
   - Use useState and useCallback
   - Proper useEffect with dependencies
   - Loading states
   - Error handling with toast

5. API Integration:
   - Use API client from lib/api/[feature].ts
   - Handle async operations
   - Show loading spinners
   - Handle errors gracefully

Follow Next.js 14 App Router best practices and shadcn/ui patterns.
```

### Fix React Hooks Error

```
I'm getting this React Hooks error:

[PASTE ERROR MESSAGE]

Context:
- Component: [COMPONENT_NAME]
- What I'm trying to do: [DESCRIPTION]
- Code: [PASTE RELEVANT CODE]

Please:
1. Explain why this error occurs
2. Show the proper fix
3. Explain useEffect dependency rules
4. Suggest useCallback if needed

Follow React 19 and Next.js 14 best practices.
```

### Convert Component to shadcn/ui

```
Convert this component to use shadcn/ui components:

[PASTE COMPONENT CODE]

Requirements:
- Replace all custom UI with shadcn/ui
- Use proper component imports (lowercase files)
- Use Sonner for toasts instead of custom Toast
- Use Dialog instead of Modal
- Use Radix Select instead of native select
- Maintain all functionality
- Improve accessibility

Show before/after comparison.
```

---

## 🗄️ Database Prompts

### Design Database Schema

```
Design a database schema for [FEATURE_NAME] with:

1. Tables needed: [list tables]
2. Relationships: [describe relationships]
3. Constraints: [list constraints]
4. Indexes: [list indexes]

Requirements:
- Use PostgreSQL with TypeORM
- UUIDs for primary keys
- Soft delete with isActive/deletedAt
- Timestamps (createdAt, updatedAt)
- Foreign key constraints
- User association for multi-tenancy

Provide:
1. SQL schema
2. TypeORM entities
3. Migration file
4. Sample queries
```

### Optimize Query

```
This query is slow:

[PASTE QUERY OR CODE]

Context:
- Table size: [approx rows]
- Current execution time: [time]
- What it does: [description]

Please:
1. Identify performance issues
2. Suggest optimizations
3. Recommend indexes
4. Show optimized version
5. Explain the improvements

Use PostgreSQL and TypeORM.
```

---

## 🐛 Debugging Prompts

### Debug TypeScript Error

```
I have this TypeScript error:

[PASTE ERROR]

File: [FILE_PATH]
Code: [PASTE CODE AROUND ERROR]

Please:
1. Explain what the error means
2. Show the exact fix
3. Explain the type issue
4. Suggest better typing if applicable

Use TypeScript strict mode.
```

### Debug Runtime Error

```
I'm getting this runtime error:

[PASTE ERROR AND STACK TRACE]

What I was doing: [DESCRIPTION]
Expected behavior: [DESCRIPTION]
Actual behavior: [DESCRIPTION]

Code: [PASTE RELEVANT CODE]

Please:
1. Identify the root cause
2. Provide a fix
3. Explain why it happened
4. Suggest prevention strategies
```

---

## 📝 Documentation Prompts

### Generate API Documentation

```
Generate API documentation for this controller:

[PASTE CONTROLLER CODE]

Format:
- Endpoint path and method
- Description
- Authentication requirements
- Request body/params schema
- Response schema
- Example requests/responses
- Error responses

Use OpenAPI/Swagger format.
```

### Generate Component Documentation

```
Generate component documentation for:

[PASTE COMPONENT CODE]

Include:
- Purpose and usage
- Props interface with descriptions
- Usage examples
- Accessibility notes
- Styling customization
- Related components
```

---

## 🔧 Refactoring Prompts

### Extract Reusable Logic

```
This code is repeated in multiple places:

[PASTE CODE]

Please:
1. Identify reusable patterns
2. Extract to utility/hook/service
3. Show updated implementation
4. Suggest better architecture

Follow DRY principle and project standards.
```

### Improve Code Quality

```
Review and improve this code:

[PASTE CODE]

Check for:
- TypeScript typing issues
- Error handling
- Performance issues
- Code duplication
- Naming conventions
- Comments/documentation
- Best practices

Provide improved version with explanations.
```

---

## 🧪 Testing Prompts

### Generate Test Cases

```
Generate test cases for:

[PASTE CODE]

Include:
- Unit tests for all methods
- Edge cases
- Error scenarios
- Mock data
- Assertions

Use Jest and Testing Library.
```

### Write E2E Test

```
Write an end-to-end test for:

Feature: [DESCRIPTION]
User flow:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Use Playwright or Cypress.
Include:
- Setup and teardown
- Test data creation
- User interactions
- Assertions
- Error cases
```

---

## 🚀 Deployment Prompts

### Create Dockerfile

```
Create a production Dockerfile for:

Application: [Backend/Frontend]
Framework: [NestJS/Next.js]
Requirements:
- [List requirements]

Include:
- Multi-stage build
- Security best practices
- Environment variables
- Health check
- Non-root user
```

### Create CI/CD Pipeline

```
Create a GitHub Actions workflow for:

Steps needed:
1. [List steps]

Include:
- Linting
- Testing
- Building
- Docker image build
- Deployment (if applicable)

Use modern best practices.
```

---

## 💡 General Prompts

### Code Review

```
Review this code as a senior developer:

[PASTE CODE]

Focus on:
- Architecture
- Best practices
- Performance
- Security
- Maintainability
- Testing

Provide specific, actionable feedback.
```

### Explain Code

```
Explain this code in detail:

[PASTE CODE]

Please:
1. Explain what it does
2. Explain how it works
3. Identify any issues
4. Suggest improvements

Assume I'm a junior developer.
```

---

## 🎯 Project-Specific Prompts

### Add Feature to Expense Tracker

```
Add [FEATURE_NAME] to the Agentic Expense Tracker:

Requirements:
- [List requirements]

Context:
- Backend: NestJS 11, PostgreSQL, TypeORM
- Frontend: Next.js 14, shadcn/ui, Sonner
- Auth: JWT with Passport
- Standards: 100% NestJS/Next.js compliant

Provide:
1. Backend implementation (module, service, controller)
2. Frontend implementation (pages, components)
3. API client
4. Database migration (if needed)
5. Documentation

Follow existing project patterns.
```

### Fix Expense Tracker Bug

```
There's a bug in the Expense Tracker:

Issue: [DESCRIPTION]
Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected: [DESCRIPTION]
Actual: [DESCRIPTION]

Affected files: [LIST FILES IF KNOWN]

Please:
1. Identify the root cause
2. Provide the fix
3. Explain why it happened
4. Add prevention (tests/validation)

Follow project standards (NestJS/Next.js).
```

---

## 📋 How to Use These Prompts

1. **Copy the prompt** you need
2. **Fill in the [PLACEHOLDERS]** with your specific information
3. **Paste CODE** where indicated
4. **Add context** if needed
5. **Submit to AI** assistant
6. **Review and apply** the response

---

## ✅ Best Practices

- **Be Specific**: More context = better response
- **Include Code**: Always show relevant code
- **State Requirements**: List what you need
- **Mention Constraints**: Technology, standards, etc.
- **Ask for Explanations**: Understand, don't just copy
- **Request Examples**: Examples help clarify
- **Follow Up**: Ask clarifying questions

---

**Remember**: Good prompts lead to good code! 🎯
