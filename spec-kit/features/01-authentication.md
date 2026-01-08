# Feature Specification: Authentication & User Management

## 📋 Feature Overview

**Feature Name**: User Authentication & Authorization
**Priority**: High (Critical)
**Status**: ✅ Complete
**Implementation Date**: January 2026

### Summary

JWT-based authentication system allowing users to register, login, and access protected resources securely.

### User Story

As a new user
I want to create an account and login securely
So that I can access my personal expense tracking data

---

## 🎯 Requirements

### Functional Requirements

1. Users can register with email, password, and name
2. Users can login with email and password
3. Passwords are hashed with bcrypt (salt rounds: 10)
4. JWT tokens issued on successful authentication
5. Protected routes require valid JWT token
6. Token contains user ID and email

### Non-Functional Requirements

- **Security**: Passwords hashed with bcrypt, JWT tokens expire
- **Performance**: Authentication response < 500ms
- **Validation**: Email format, password minimum 6 characters

### Acceptance Criteria

- [x] User can register with unique email
- [x] Duplicate email registration returns error
- [x] User can login with correct credentials
- [x] Invalid credentials return 401 error
- [x] JWT token generated on successful auth
- [x] Protected routes validate JWT token
- [x] Invalid/expired tokens rejected

---

## 🏗️ Technical Design

### Backend (NestJS)

#### Entities

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### DTOs

```typescript
// Register DTO
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

// Login DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// Response
{
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

#### Service Methods

- `register(registerDto: RegisterDto): Promise<{ accessToken, user }>`
  - Validates email uniqueness
  - Hashes password with bcrypt
  - Creates user
  - Generates JWT token

- `login(loginDto: LoginDto): Promise<{ accessToken, user }>`
  - Validates email exists
  - Compares password hash
  - Generates JWT token

- `validateUser(userId: string): Promise<User>`
  - Used by JWT strategy
  - Returns user for authenticated requests

#### API Endpoints

| Method | Endpoint         | Description       | Auth |
| ------ | ---------------- | ----------------- | ---- |
| POST   | `/auth/register` | Register new user | No   |
| POST   | `/auth/login`    | Login user        | No   |

#### Request/Response Examples

**POST /auth/register**

```json
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

// Response (201 Created)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}

// Error (409 Conflict)
{
  "statusCode": 401,
  "message": "Email already exists"
}
```

**POST /auth/login**

```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}

// Error (401 Unauthorized)
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### Frontend (Next.js)

#### Pages

- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page

#### Components

- `components/auth/LoginForm.tsx` - Login form with validation
- `components/auth/RegisterForm.tsx` - Registration form with validation
- `contexts/AuthContext.tsx` - Auth context provider

#### API Client

```typescript
// lib/api/auth.ts
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  register: (data: RegisterDto) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  login: (data: LoginDto) => apiClient.post<AuthResponse>("/auth/login", data),
};
```

#### Authentication Flow

1. User submits login/register form
2. API request sent to backend
3. On success:
   - Store token in localStorage
   - Set token in API client headers
   - Redirect to dashboard
4. On error:
   - Show error toast
   - Keep user on form

#### Protected Routes

- Middleware checks for token in localStorage
- If no token → redirect to `/login`
- If token exists → allow access
- Invalid token → clear storage, redirect to `/login`

#### UI Components Used

- `Input` - Email and password fields
- `Button` - Submit buttons with loading states
- `Label` - Form field labels
- `Toaster` (Sonner) - Success/error notifications

### Database

#### Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

---

## 🔒 Security

### Authentication

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration
- Token payload: `{ sub: userId, email: userEmail }`

### Authorization

- JWT Guard protects all resource endpoints
- `@UseGuards(JwtAuthGuard)` on controllers
- `@CurrentUser()` decorator extracts user from request

### Validation

- Email format validation
- Password minimum 6 characters
- Required fields enforced
- Sanitize user input

### Security Best Practices

- Never store plain passwords
- Never return password hash in responses
- Use HTTPS in production
- Implement rate limiting for auth endpoints

---

## 🧪 Testing

### Unit Tests

- [x] AuthService: register with valid data
- [x] AuthService: register with duplicate email
- [x] AuthService: login with valid credentials
- [x] AuthService: login with invalid email
- [x] AuthService: login with invalid password
- [x] AuthService: validateUser returns user

### Integration Tests

- [x] POST /auth/register creates user
- [x] POST /auth/register rejects duplicate email
- [x] POST /auth/login returns token
- [x] POST /auth/login rejects invalid credentials
- [x] Protected routes reject requests without token

### E2E Tests

- [x] User can register via UI
- [x] User can login via UI
- [x] Invalid credentials show error
- [x] Successful login redirects to dashboard
- [x] Protected pages require login

---

## 📊 Performance

### Expected Load

- Requests per second: 100
- Response time target: < 500ms

### Optimization

- Index on email column for fast lookups
- Bcrypt comparison async (non-blocking)
- JWT validation in-memory (fast)

---

## 📝 Implementation Files

### Backend

- `backend/src/modules/auth/auth.module.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/dto/register.dto.ts`
- `backend/src/modules/auth/dto/login.dto.ts`
- `backend/src/modules/auth/strategies/jwt.strategy.ts`
- `backend/src/modules/auth/guards/jwt-auth.guard.ts`
- `backend/src/modules/users/users.module.ts`
- `backend/src/modules/users/users.service.ts`
- `backend/src/modules/users/entities/user.entity.ts`
- `backend/src/common/decorators/current-user.decorator.ts`

### Frontend

- `frontend/app/(auth)/login/page.tsx`
- `frontend/app/(auth)/register/page.tsx`
- `frontend/components/auth/LoginForm.tsx`
- `frontend/components/auth/RegisterForm.tsx`
- `frontend/contexts/AuthContext.tsx`
- `frontend/hooks/useAuth.ts`
- `frontend/lib/api/auth.ts`
- `frontend/middleware.ts`

---

## 🚀 Deployment

### Environment Variables

```env
# Backend
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# Database
DATABASE_URL=postgresql://...
```

### Database Migration

```bash
npm run migration:generate -- -n CreateUsersTable
npm run migration:run
```

---

## 📚 Related Features

- All features depend on authentication
- User ID used to filter all data (multi-tenancy)
- Categories, Transactions, Dashboard require auth

---

**Status**: ✅ Complete
**Last Updated**: January 8, 2026
**Implemented By**: NestJS Backend + Next.js Frontend
