# Developer Onboarding

Welcome to the ViaApp Web development team! This guide will help you get set up and productive quickly.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Development Workflow](#development-workflow)
- [Project Navigation](#project-navigation)
- [Adding New Pages](#adding-new-pages)
- [Adding New Features](#adding-new-features)
- [Testing Approach](#testing-approach)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| Node.js | 20+ | [Download](https://nodejs.org/) or use nvm |
| pnpm | Latest | `npm install -g pnpm` |
| Git | 2.30+ | [Download](https://git-scm.com/) |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| VS Code | Primary IDE |
| ESLint extension | Linting integration |
| Tailwind CSS IntelliSense | CSS class autocomplete |
| Prettier extension | Code formatting |
| GitLens | Git history visualization |

### VS Code Extensions

Install these VS Code extensions for the best development experience:

```json
// .vscode/extensions.json (recommended)
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "eamodio.gitlens"
  ]
}
```

### Access Requirements

- GitHub repository access
- API credentials (or local API running)
- (Optional) VPS access for deployments

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/viaapp-web.git
cd viaapp-web
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all project dependencies defined in `package.json`.

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Local API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Or use production API for testing
# NEXT_PUBLIC_API_URL=https://api.viaapp.life
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3100](http://localhost:3100).

### 5. Verify Setup

1. Open http://localhost:3100 in your browser
2. You should see the login page
3. If using local API, create a test account
4. If using production API, use existing credentials

---

## Development Workflow

### Daily Development

```bash
# Start the day
git pull origin main
pnpm install  # if package.json changed

# Start dev server
pnpm dev

# Make changes, save files
# Hot reload will update the browser

# Before committing
pnpm lint
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Convention

Follow conventional commits:

```
feat: add new quiet time type
fix: resolve login redirect issue
refactor: simplify API client
docs: update README
style: format code
chore: update dependencies
```

### Code Review Process

1. Create Pull Request against `main`
2. Ensure CI checks pass
3. Request review from team member
4. Address feedback
5. Merge after approval

---

## Project Navigation

### Key Directories

```
src/
├── app/          # Pages and routes
├── components/   # Shared components
├── lib/          # Utilities and config
└── shared/       # Shared code (types, constants, API)
```

### Finding Things

| Looking for... | Location |
|----------------|----------|
| Page component | `src/app/[route]/page.tsx` |
| Page layout | `src/app/[route]/layout.tsx` |
| Shared component | `src/components/` |
| API client | `src/lib/api.ts` (web-specific) |
| API factory | `src/shared/api/index.ts` |
| Type definitions | `src/shared/types/index.ts` |
| Constants | `src/shared/constants/index.ts` |
| Zustand stores | `src/lib/store.ts` |
| Auth provider | `src/lib/auth-provider.tsx` |

### Important Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with providers |
| `src/components/dashboard-layout.tsx` | Authenticated page wrapper |
| `src/components/sidebar.tsx` | Main navigation |
| `src/lib/api.ts` | Web API client with security |
| `src/lib/store.ts` | Zustand state stores |
| `tailwind.config.ts` | Tailwind customization |
| `next.config.ts` | Next.js configuration |

---

## Adding New Pages

### Step 1: Create Route Directory

```bash
mkdir -p src/app/my-feature
```

### Step 2: Create Page Component

Create `src/app/my-feature/page.tsx`:

```tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function MyFeaturePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await api.myModule.getData();
        if (result.data) {
          setData(result.data);
        } else if (result.error) {
          setError(result.error);
        }
      } catch {
        setError('Failed to load data');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Feature</h1>
          <p className="text-gray-600 mt-1">Feature description</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 rounded-xl p-6">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* Your content here */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```

### Step 3: Add to Navigation (if needed)

Edit `src/components/sidebar.tsx` to add navigation item:

```tsx
const moreNavItems = [
  // existing items...
  { href: '/my-feature', label: 'My Feature', icon: MyIcon },
];
```

### Step 4: Create Layout (if needed)

For features with nested routes, create `src/app/my-feature/layout.tsx`:

```tsx
export default function MyFeatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

---

## Adding New Features

### Adding a New API Module

1. **Add types** in `src/shared/types/index.ts`:

```tsx
export interface MyEntity {
  id: string;
  name: string;
  createdAt: string;
}
```

2. **Add API methods** in `src/shared/api/index.ts`:

```tsx
// Inside createApiClient return object:
myModule: {
  async getAll(): Promise<ApiResponse<MyEntity[]>> {
    return request<MyEntity[]>('/my-entities');
  },

  async getById(id: string): Promise<ApiResponse<MyEntity>> {
    return request<MyEntity>(`/my-entities/${id}`);
  },

  async create(data: Omit<MyEntity, 'id' | 'createdAt'>): Promise<ApiResponse<MyEntity>> {
    return request<MyEntity>('/my-entities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
},
```

### Adding a New Zustand Store

Edit `src/lib/store.ts`:

```tsx
interface MyFeatureState {
  items: MyEntity[];
  selectedId: string | null;
  setItems: (items: MyEntity[]) => void;
  setSelectedId: (id: string | null) => void;
}

export const useMyFeatureStore = create<MyFeatureState>()((set) => ({
  items: [],
  selectedId: null,
  setItems: (items) => set({ items }),
  setSelectedId: (selectedId) => set({ selectedId }),
}));
```

### Adding Constants

Edit `src/shared/constants/index.ts`:

```tsx
export const MY_FEATURE_OPTIONS = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
] as const;
```

### Adding a Shared Component

Create `src/components/my-component.tsx`:

```tsx
'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface MyComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function MyComponent({
  children,
  variant = 'primary',
  className,
}: MyComponentProps) {
  return (
    <div
      className={clsx(
        'rounded-xl p-4',
        variant === 'primary' && 'bg-brand-500 text-white',
        variant === 'secondary' && 'bg-gray-100 text-gray-900',
        className
      )}
    >
      {children}
    </div>
  );
}
```

Export from `src/components/index.ts`:

```tsx
export { MyComponent } from './my-component';
```

---

## Testing Approach

### Current Testing Setup

The project has a basic test setup with type definitions excluded from build:

```json
// tsconfig.json
{
  "exclude": [
    "**/__tests__/**",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

### Manual Testing Checklist

Before submitting a PR, verify:

1. **Authentication**
   - [ ] Login works with valid credentials
   - [ ] Logout clears session
   - [ ] Protected routes redirect to login

2. **Page Loading**
   - [ ] Page loads without errors
   - [ ] Loading states display correctly
   - [ ] Error states handle gracefully

3. **Responsiveness**
   - [ ] Desktop view works (1200px+)
   - [ ] Tablet view works (768px-1199px)
   - [ ] Mobile view works (<768px)
   - [ ] Sidebar collapses correctly

4. **API Integration**
   - [ ] Data fetches correctly
   - [ ] Create/update/delete operations work
   - [ ] Error responses are handled

5. **User Experience**
   - [ ] All buttons/links work
   - [ ] Forms validate correctly
   - [ ] Success/error messages appear

### Browser Testing

Test in these browsers:
- Chrome (primary)
- Safari
- Firefox
- Edge

### Future Testing Plans

- Unit tests with Jest
- Component tests with Testing Library
- E2E tests with Playwright

---

## Common Tasks

### Update API URL

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://new-api-url.com/api
```

Restart the dev server after changing.

### Add a New Icon

Import from Lucide React:

```tsx
import { NewIcon } from 'lucide-react';

<NewIcon className="w-5 h-5 text-brand-500" />
```

Browse available icons at [lucide.dev](https://lucide.dev/).

### Add a New Color

Edit `tailwind.config.ts`:

```tsx
theme: {
  extend: {
    colors: {
      mycolor: {
        50: '#f0f9ff',
        // ... full palette
        900: '#0c4a6e',
      },
    },
  },
},
```

### Add a New Font

1. Import font in `src/app/layout.tsx`
2. Add to `tailwind.config.ts` font family
3. Use with `font-newfont` class

### Debug API Requests

Check browser DevTools Network tab:
- Filter by Fetch/XHR
- Inspect request/response headers
- Check response body for errors

### Clear Local Storage

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

Then refresh the page.

---

## Troubleshooting

### Build Errors

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

**"Type errors"**
```bash
# Check types
pnpm tsc --noEmit
```

### Runtime Errors

**"Hydration mismatch"**
- Ensure component uses `'use client'` if it has browser-only code
- Add `export const dynamic = 'force-dynamic'` for dynamic pages

**"API connection failed"**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify API is running
- Check for CORS issues

### Common Issues

**Sidebar doesn't collapse**
- Check `useUIStore` is imported correctly
- Verify sidebar state in React DevTools

**Styles not applying**
- Restart dev server (Tailwind JIT)
- Check for typos in class names
- Verify Tailwind content config

**Login redirect loop**
- Clear localStorage/sessionStorage
- Check token storage in DevTools
- Verify API returns valid tokens

### Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Ask in team Slack channel
4. Pair with another developer

---

## Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Lucide Icons](https://lucide.dev/)

### Project Links
- [GitHub Repository](https://github.com/your-org/viaapp-web)
- [Production URL](https://app.viaapp.life)
- [API Documentation](https://api.viaapp.life/docs)

### Internal Documentation
- [Architecture](./ARCHITECTURE.md)
- [Features](./FEATURES.md)
- [Contributing](../CONTRIBUTING.md)
