# Frontend Architecture - Next.js + shadcn/ui

## ✅ Stack

- **Framework**: Next.js 14 App Router (React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Toast Notifications**: Sonner
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📁 Project Structure

```
frontend/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Authentication route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/               # Protected routes
│   │   ├── layout.tsx             # Dashboard layout with navigation
│   │   ├── dashboard/page.tsx     # Analytics dashboard
│   │   ├── categories/page.tsx    # Categories management
│   │   └── transactions/          # Transactions CRUD
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage (redirects to dashboard)
│   └── globals.css                # Global styles + Tailwind
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx             # Button with variants
│   │   ├── input.tsx              # Input field
│   │   ├── select.tsx             # Select dropdown (Radix)
│   │   ├── dialog.tsx             # Modal dialog (Radix)
│   │   ├── card.tsx               # Card components
│   │   ├── label.tsx              # Form label
│   │   └── sonner.tsx             # Toast wrapper
│   ├── auth/                      # Auth-specific components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── categories/
│       └── CategoryForm.tsx
├── lib/
│   ├── utils.ts                   # cn() utility for class merging
│   └── api/                       # API clients
│       ├── client.ts              # Axios instance with auth
│       ├── categories.ts
│       ├── transactions.ts
│       └── dashboard.ts
├── contexts/
│   └── AuthContext.tsx            # Global auth state
└── hooks/
    └── useAuth.ts                 # Auth hook

```

## 🎨 shadcn/ui Components

### Installation

```bash
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react sonner
```

### Component List

| Component | Purpose                                                     | Radix Primitive        |
| --------- | ----------------------------------------------------------- | ---------------------- |
| `Button`  | Buttons with variants (default, destructive, outline, etc.) | @radix-ui/react-slot   |
| `Input`   | Text input fields                                           | Native HTML            |
| `Select`  | Dropdown selection                                          | @radix-ui/react-select |
| `Dialog`  | Modal dialogs                                               | @radix-ui/react-dialog |
| `Card`    | Content containers                                          | Native HTML            |
| `Label`   | Form labels                                                 | @radix-ui/react-label  |
| `Toaster` | Toast notifications                                         | Sonner                 |

### Usage Examples

#### Button

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

#### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Category</DialogTitle>
    </DialogHeader>
    <CategoryForm onSuccess={() => setIsOpen(false)} />
  </DialogContent>
</Dialog>;
```

#### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={type} onValueChange={setType}>
  <SelectTrigger>
    <SelectValue placeholder="Select type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="income">Income</SelectItem>
    <SelectItem value="expense">Expense</SelectItem>
  </SelectContent>
</Select>;
```

#### Toast (Sonner)

```tsx
import { toast } from "sonner";

// Success
toast.success("Category created successfully");

// Error
toast.error("Failed to load data");

// Promise
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save",
});
```

## 🔧 Utilities

### cn() - Class Name Utility

```tsx
import { cn } from "@/lib/utils";

// Merge classes with Tailwind de-duplication
<div className={cn("text-base", className, error && "text-red-600")} />;
```

## 📝 Best Practices

### 1. File Naming Convention

- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **shadcn/ui**: lowercase (e.g., `button.tsx`, `select.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)

### 2. Component Structure

```tsx
"use client"; // Only when using hooks/state

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";

export default function MyPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiClient.post("/api/data");
      toast.success("Success!");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
}
```

### 3. Type Safety

```tsx
// ✅ Good - Proper typing
const [type, setType] = useState<"income" | "expense">("income");

// ❌ Bad - Using any
const [type, setType] = useState<any>("income");
```

### 4. Error Handling

```tsx
// ✅ Good - Silent catch with toast
try {
  await api.delete(id);
  toast.success("Deleted");
} catch {
  toast.error("Failed to delete");
}

// ❌ Bad - Unused error variable
try {
  await api.delete(id);
} catch (error) {
  // ESLint error: 'error' is defined but never used
  toast.error("Failed");
}
```

### 5. useEffect Dependencies

```tsx
// ✅ Good - useCallback to stabilize dependency
const loadData = useCallback(
  async () => {
    const data = await api.get();
    setData(data);
  },
  [
    /* dependencies */
  ]
);

useEffect(() => {
  loadData();
}, [loadData]);

// ❌ Bad - Missing dependency
useEffect(() => {
  loadData();
}, []); // ESLint: missing dependency 'loadData'
```

## 🎯 Routing

### App Router Structure

```
app/
├── (auth)/                 # Route group (doesn't affect URL)
│   ├── login              # /login
│   └── register           # /register
├── (dashboard)/            # Protected route group
│   ├── layout.tsx         # Shared layout for /dashboard/*
│   ├── dashboard          # /dashboard
│   ├── categories         # /categories
│   └── transactions       # /transactions
│       ├── page.tsx       # /transactions (list)
│       ├── new            # /transactions/new
│       └── [id]           # /transactions/:id
│           └── edit       # /transactions/:id/edit
```

### Navigation

```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

// Link component
<Link href="/dashboard">Dashboard</Link>;

// Programmatic navigation
const router = useRouter();
router.push("/categories");
router.back();
```

## 🔐 Authentication

### Auth Context

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <div>Welcome, {user.email}</div>;
}
```

### Middleware Protection

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

## 📊 Data Fetching

### API Client

```tsx
import { categoriesApi } from "@/lib/api/categories";

// GET all
const categories = await categoriesApi.getAll();

// GET one
const category = await categoriesApi.getById(id);

// POST
await categoriesApi.create({ name: "Food", type: "expense" });

// PATCH
await categoriesApi.update(id, { name: "New Name" });

// DELETE
await categoriesApi.delete(id);
```

### With Loading States

```tsx
const [data, setData] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await categoriesApi.getAll();
      setData(result);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

if (loading) return <div>Loading...</div>;
```

## 🎨 Styling

### Tailwind Classes

```tsx
// Layout
<div className="flex items-center justify-between gap-4">

// Spacing
<div className="px-4 py-6 space-y-4">

// Typography
<h1 className="text-2xl font-bold text-gray-900">

// Colors
<span className="text-blue-600 hover:text-blue-700">

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Custom CSS (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

## ✅ Next.js Standards Checklist

- ✅ Use App Router (not Pages Router)
- ✅ `"use client"` directive only when needed (state/hooks)
- ✅ Server Components by default
- ✅ Proper imports: `"next/link"`, `"next/navigation"`
- ✅ shadcn/ui for consistent UI
- ✅ TypeScript strict mode
- ✅ ESLint compliant (no warnings)
- ✅ Proper error handling with toast
- ✅ Loading states for async operations
- ✅ Responsive design with Tailwind

## 🚀 Common Patterns

### CRUD Page Pattern

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CRUDPage() {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      const data = await api.getAll();
      setItems(data);
    } catch {
      toast.error("Failed to load");
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(id);
      toast.success("Deleted");
      loadItems();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Items</h1>
        <Button onClick={() => setIsOpen(true)}>Add</Button>
      </div>

      {/* List */}
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <Button onClick={() => handleDelete(item.id)}>Delete</Button>
        </div>
      ))}

      {/* Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <Form
            onSuccess={() => {
              setIsOpen(false);
              loadItems();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Sonner](https://sonner.emilkowal.ski/)
