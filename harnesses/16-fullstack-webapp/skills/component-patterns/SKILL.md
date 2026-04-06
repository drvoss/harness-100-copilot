---
name: component-patterns
description: "Use when building React/Next.js components — provides patterns for component architecture, state management, data fetching, and folder structure. Extends the frontend-dev agent."
metadata:
  category: harness
  harness: 16-fullstack-webapp
  agent_type: general-purpose
---

# Component Patterns — React/Next.js Pattern Reference

Reference for building well-structured React/Next.js frontends with proven patterns.

## Component Architecture

### Folder Structure (Feature-based)
```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Route group: auth pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx          # Server Component
│   │   └── _components/      # Page-specific components
│   └── layout.tsx
├── components/
│   ├── ui/                   # Primitive UI components (Button, Input, Card)
│   └── features/             # Feature-specific composites
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities, API client, validators
└── types/                    # TypeScript type definitions
```

### Component Types

| Type | Purpose | Example |
|------|---------|---------|
| Server Component (RSC) | Data fetching, no interactivity | Product list page |
| Client Component (`"use client"`) | Interactivity, state | Form, modal, dropdown |
| Shared UI | Design system primitives | Button, Input, Badge |
| Feature Component | Business logic UI | UserProfile, OrderSummary |
| Layout Component | Page structure | Sidebar, Header, Footer |

## State Management Patterns

### Server State (React Query / SWR)
```tsx
// Recommended for API data
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users'),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### Client State (Zustand)
```tsx
// Recommended for UI state, user preferences
const useStore = create<Store>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

### Form State (React Hook Form)
```tsx
const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
})
```

## Data Fetching Patterns

### Next.js Server Components (preferred)
```tsx
// No useEffect, no useState, no loading spinner
async function ProductList() {
  const products = await db.product.findMany() // Direct DB or fetch
  return <ul>{products.map(p => <ProductItem key={p.id} product={p} />)}</ul>
}
```

### Error Boundary + Suspense
```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Skeleton />}>
    <ProductList />
  </Suspense>
</ErrorBoundary>
```

## Accessibility Checklist
- [ ] Interactive elements use `<button>` or `<a>` (not `<div onClick>`)
- [ ] Images have `alt` text (empty `alt=""` for decorative)
- [ ] Forms have `<label>` linked via `htmlFor` + `id`
- [ ] Focus visible (no `outline: none` without alternative)
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Keyboard navigation works for all interactive elements
