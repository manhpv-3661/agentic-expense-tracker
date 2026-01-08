# 🔧 Frontend Error Fixing Plan

## 🎯 Current Status

Frontend có **nhiều lỗi TypeScript** cần fix. Dưới đây là plan chi tiết để fix TẤT CẢ các lỗi.

---

## 📦 Step 1: Install Missing Dependencies (CRITICAL)

### Issue

Tất cả shadcn/ui packages đang missing:

- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `sonner`

### Solution

```bash
cd frontend
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react sonner
```

### Expected Result

- Tất cả "Cannot find module" errors sẽ biến mất
- TypeScript sẽ nhận diện được types

---

## 🗑️ Step 2: Delete Old Custom Components (DONE ✅)

Đã xóa các components cũ để tránh conflict:

- ~~`Button.tsx`~~ → dùng `button.tsx`
- ~~`Input.tsx`~~ → dùng `input.tsx`
- ~~`Select.tsx`~~ → dùng `select.tsx`
- ~~`Modal.tsx`~~ → dùng `dialog.tsx`
- ~~`Toast.tsx`~~ → dùng `sonner.tsx`

---

## 🔧 Step 3: Fix Remaining Files

### 3.1. CategoryForm.tsx

**Status**: ❌ Có lỗi
**Issues**:

1. Đang dùng old API (`useToast()` thay vì `toast` from sonner)
2. Đang dùng old Input component (có `label` prop - không tồn tại trong shadcn)

**Fix**: File đã được rewrite hoàn toàn với shadcn/ui components

---

### 3.2. Transactions Pages (4 files)

**Files**:

- `app/(dashboard)/transactions/page.tsx`
- `app/(dashboard)/transactions/new/page.tsx`
- `app/(dashboard)/transactions/[id]/edit/page.tsx`

**Common Issues**:

1. ❌ `useEffect` missing dependencies
2. ❌ Unused `error` variable in catch blocks
3. ❌ Import from old components (`Button`, `Input`, `Select`)

**Fix Pattern**:

```tsx
// BEFORE
import Button from "@/components/ui/Button";
try {
  // ...
} catch (error) {
  // ❌ unused
  showToast("Error", "error");
}

// AFTER
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
try {
  // ...
} catch {
  // ✅ no variable
  toast.error("Error");
}
```

---

### 3.3. Dashboard Page

**File**: `app/(dashboard)/dashboard/page.tsx`

**Issues**:

1. ❌ `CategoryBreakdown` type incompatible with Recharts `PieChart`
2. ❌ `useEffect` missing dependency
3. ❌ Unused `error` variable

**Fix**:

```tsx
// Fix type issue
const categoryBreakdown = data.categoryBreakdown.map(item => ({
  ...item,
  name: item.categoryName,  // Recharts expects 'name' not 'categoryName'
  value: item.total,         // Recharts expects 'value'
}));

// Fix label issue
label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
```

---

### 3.4. Auth Forms (2 files)

**Files**:

- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`

**Status**: ✅ No errors (may need refactoring for consistency)

---

### 3.5. Dashboard Layout

**File**: `app/(dashboard)/layout.tsx`

**Status**: ✅ No errors

---

## 📋 Complete Checklist

### Phase 1: Dependencies ❌ IN PROGRESS

- [ ] Run npm install with all shadcn/ui packages
- [ ] Verify packages in node_modules
- [ ] Verify packages in package.json
- [ ] Restart TypeScript server

### Phase 2: Component Updates ✅ DONE

- [x] Delete old custom components
- [x] Rewrite CategoryForm.tsx

### Phase 3: Fix TypeScript Errors 🔄 TODO

- [ ] Fix input.tsx interface warning
- [ ] Fix button.tsx variant/size props
- [ ] Fix transactions/page.tsx
- [ ] Fix transactions/new/page.tsx
- [ ] Fix transactions/[id]/edit/page.tsx
- [ ] Fix dashboard/page.tsx Recharts types

### Phase 4: Verification ⏳ PENDING

- [ ] Run `npm run lint` - no errors
- [ ] Run TypeScript check - no errors
- [ ] Test frontend startup
- [ ] Manual testing all pages

---

## 🚀 Quick Fix Commands

### 1. Install Dependencies

```bash
cd /home/pham.van.manhb@sun-asterisk.com/work-space/agentic-expense-tracker/frontend
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react sonner
```

### 2. Fix Input.tsx Interface

```typescript
// Change from:
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// To:
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
```

### 3. Check All Errors

```bash
npm run lint
```

---

## 📊 Error Summary

| Category               | Count          | Status           |
| ---------------------- | -------------- | ---------------- |
| Missing dependencies   | 9 packages     | ❌ Not installed |
| File naming conflicts  | 5 files        | ✅ Fixed         |
| useEffect dependencies | 4 occurrences  | 🔄 TODO          |
| Unused error variables | 10 occurrences | 🔄 TODO          |
| Type issues            | 3 occurrences  | 🔄 TODO          |
| Import issues          | Multiple       | 🔄 TODO          |

---

## 🎯 Priority

1. **CRITICAL**: Install dependencies (blocks everything)
2. **HIGH**: Fix CategoryForm.tsx imports
3. **MEDIUM**: Fix useEffect dependencies
4. **LOW**: Fix unused variables

---

## ✅ Success Criteria

Khi hoàn thành, project phải có:

- ✅ `npm install` chạy thành công
- ✅ `npm run lint` - 0 errors
- ✅ TypeScript compilation - 0 errors
- ✅ `npm run dev` - frontend khởi động thành công
- ✅ Tất cả pages load không lỗi
