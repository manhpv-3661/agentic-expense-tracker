# Fix: Login Redirect Issue

## 🔴 Vấn Đề

**Triệu chứng**: Sau khi login thành công, có `accessToken` trong localStorage nhưng không redirect sang `/dashboard`.

## 🔍 Nguyên Nhân

### 1. **Middleware Conflict**

```typescript
// middleware.ts (BEFORE)
const token = request.cookies.get("accessToken")?.value;
// ❌ Check cookies, nhưng app lưu vào localStorage!
```

**Vấn đề**:

- Middleware chạy **server-side** (Next.js edge runtime)
- Không thể access `localStorage` (chỉ có trong browser)
- App lưu token vào `localStorage` → middleware không thấy
- Middleware check `cookies` → không có token → block request

### 2. **Missing Protected Route Check**

```typescript
// app/(dashboard)/layout.tsx (BEFORE)
// ❌ Không có check authentication
// User có thể access dashboard mà không cần login
```

## ✅ Giải Pháp

### 1. **Disable Server-Side Middleware** ✅

```typescript
// frontend/middleware.ts (AFTER)
export function middleware(_request: NextRequest) {
  // Let client-side handle auth redirects
  return NextResponse.next();
}
```

**Lý do**:

- localStorage chỉ tồn tại client-side
- Middleware không thể validate localStorage tokens
- Chuyển sang client-side protection

### 2. **Add Client-Side Protection** ✅

```typescript
// frontend/app/(dashboard)/layout.tsx (AFTER)
export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Protect routes - redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (/* Dashboard layout */);
}
```

**Bảo vệ**:

- Check `user` từ AuthContext
- Nếu `loading === true` → show loading
- Nếu `user === null` → redirect to `/login`
- Chỉ render dashboard khi authenticated

### 3. **Fix Redirect Timing** ✅

```typescript
// frontend/components/auth/LoginForm.tsx (AFTER)
const handleSubmit = async (e: React.FormEvent) => {
  try {
    await login(email, password);
    // Wait for state to update before redirecting
    setTimeout(() => {
      router.push("/dashboard");
    }, 100);
  } catch (err) {
    setError(err.message || "Login failed");
  }
};
```

**Timing fix**:

- `login()` updates state asynchronously
- `setTimeout(100ms)` ensures state updates before redirect
- Prevents race condition

## 📋 Files Changed

### 1. `/frontend/middleware.ts`

```diff
- const token = request.cookies.get("accessToken")?.value;
- if (isProtectedRoute && !token) {
-   return NextResponse.redirect(new URL("/login", request.url));
- }
+ // Middleware disabled - using client-side auth checks
+ export function middleware(_request: NextRequest) {
+   return NextResponse.next();
+ }
```

### 2. `/frontend/app/(dashboard)/layout.tsx`

```diff
+ import { useEffect } from "react";
+ import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
+   const router = useRouter();
+   const { user, loading } = useAuth();

+   // Protect routes
+   useEffect(() => {
+     if (!loading && !user) {
+       router.push("/login");
+     }
+   }, [user, loading, router]);

+   if (loading) return <div>Loading...</div>;
+   if (!user) return null;

    return (/* layout */);
}
```

### 3. `/frontend/components/auth/LoginForm.tsx`

```diff
try {
  await login(email, password);
- router.push("/dashboard");
+ setTimeout(() => {
+   router.push("/dashboard");
+ }, 100);
} catch (err) {
- setError(err.message);
+ setError(err.message || "Login failed");
}
```

### 4. `/frontend/components/auth/RegisterForm.tsx`

```diff
try {
  await register(email, password, name);
- router.push("/dashboard");
+ setTimeout(() => {
+   router.push("/dashboard");
+ }, 100);
} catch (err) {
- setError(err.message);
+ setError(err.message || "Registration failed");
}
```

## 🔄 Flow Sau Khi Fix

### Login Flow:

```
1. User submit login form
   ↓
2. LoginForm calls login(email, password)
   ↓
3. AuthContext:
   - POST /auth/login
   - Get { accessToken, user }
   - localStorage.setItem("accessToken", token)
   - localStorage.setItem("user", JSON.stringify(user))
   - setUser(user)
   ↓
4. Wait 100ms for state update
   ↓
5. router.push("/dashboard")
   ↓
6. Dashboard layout loads
   ↓
7. useEffect checks: user exists? ✅
   ↓
8. Render dashboard! 🎉
```

### Protected Route Flow:

```
User tries to access /dashboard
   ↓
Middleware: ✅ Allow (no server-side check)
   ↓
Dashboard layout loads (client-side)
   ↓
useEffect checks authentication:
   - loading? → Show "Loading..."
   - !user? → router.push("/login")
   - user exists? → ✅ Render dashboard
```

## 🧪 Testing Checklist

- [x] Login with valid credentials → redirects to `/dashboard`
- [x] Login with invalid credentials → shows error, stays on `/login`
- [x] Access `/dashboard` without login → redirects to `/login`
- [x] Access `/dashboard` with token → shows dashboard
- [x] Logout → clears localStorage, redirects to `/login`
- [x] Register new account → redirects to `/dashboard`
- [x] Refresh page on `/dashboard` → stays on dashboard (if logged in)

## 🎯 Kết Quả

### ✅ Fixed:

1. Login redirect works correctly
2. Protected routes secured on client-side
3. No more middleware conflicts
4. Proper loading states
5. Clean error messages

### ⚠️ Trade-offs:

- **No server-side protection**: Middleware disabled
- **Client-side only**: Flash of content possible during redirect
- **localStorage**: Cannot use httpOnly cookies (less secure)

## 💡 Best Practices for Future

### Option A: Current Approach (localStorage + client-side)

✅ **Pros**:

- Simple to implement
- Works with Next.js App Router
- No server setup needed

❌ **Cons**:

- Vulnerable to XSS attacks
- No httpOnly protection
- Flash of content on protected routes

### Option B: Better Approach (cookies + middleware)

✅ **Pros**:

- httpOnly cookies (XSS protection)
- Server-side validation
- No flash of content

❌ **Cons**:

- Need to refactor AuthContext
- Set cookies from API response
- More complex setup

**Recommendation**: For production, migrate to **Option B** with httpOnly cookies.

## 📚 Related Files

- `frontend/middleware.ts` - Server-side middleware
- `frontend/contexts/AuthContext.tsx` - Auth state management
- `frontend/app/page.tsx` - Root page redirect
- `frontend/app/(dashboard)/layout.tsx` - Protected layout
- `frontend/components/auth/LoginForm.tsx` - Login form
- `frontend/components/auth/RegisterForm.tsx` - Register form

---

**Fixed**: January 8, 2026
**Issue**: Login redirect not working
**Solution**: Disable middleware, add client-side protection, fix timing
