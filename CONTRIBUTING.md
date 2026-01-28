# Contributing to ViaApp Web

Thank you for your interest in contributing to ViaApp Web! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Review Process](#review-process)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Give and accept constructive feedback gracefully
- Focus on what is best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment, insults, or derogatory comments
- Personal or political attacks
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. Read the [Developer Onboarding Guide](./docs/ONBOARDING.md)
2. Set up your local development environment
3. Familiarized yourself with the [Architecture](./docs/ARCHITECTURE.md)

### Finding Something to Work On

- Check the issue tracker for open issues
- Look for issues labeled `good first issue` for newcomers
- Ask in team discussions if you want to work on something not yet tracked

### Before You Start

1. Ensure an issue exists for your work
2. Comment on the issue to claim it
3. Wait for confirmation before starting significant work

---

## Development Process

### Branch Workflow

```bash
# 1. Update your local main branch
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feature/your-feature-name
# Or for bug fixes:
git checkout -b fix/bug-description

# 3. Make your changes
# ...

# 4. Commit your changes
git add .
git commit -m "feat: description of your changes"

# 5. Push to your branch
git push origin feature/your-feature-name

# 6. Create a Pull Request on GitHub
```

### Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-study-notes` |
| Bug Fix | `fix/description` | `fix/login-redirect` |
| Refactor | `refactor/description` | `refactor/api-client` |
| Documentation | `docs/description` | `docs/update-readme` |

### Development Checklist

Before submitting your changes:

- [ ] Code compiles without errors (`pnpm build`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Changes work on desktop, tablet, and mobile
- [ ] No console errors in browser DevTools
- [ ] Changes don't break existing functionality
- [ ] New code follows existing patterns

---

## Coding Standards

### TypeScript

**Use strict typing:**
```typescript
// Good
function processData(data: UserData): ProcessedResult {
  return { processed: true, data };
}

// Avoid
function processData(data: any): any {
  return { processed: true, data };
}
```

**Define interfaces for complex objects:**
```typescript
interface QuietTimeSession {
  id: string;
  type: 'word_to_life' | 'word_to_heart';
  durationSeconds: number;
  completedAt: string;
}
```

**Use type inference when obvious:**
```typescript
// Good - type is obvious
const [loading, setLoading] = useState(false);

// Good - type needed for complex state
const [data, setData] = useState<UserData | null>(null);
```

### React Components

**Use functional components:**
```tsx
// Good
export function MyComponent({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

// Avoid class components unless necessary
```

**Destructure props:**
```tsx
// Good
function Card({ title, description, onClick }: CardProps) {
  return (/* ... */);
}

// Avoid
function Card(props: CardProps) {
  return <h1>{props.title}</h1>;
}
```

**Use hooks at the top level:**
```tsx
function MyComponent() {
  // Hooks first
  const [state, setState] = useState(null);
  const { user } = useAuth();

  // Then effects
  useEffect(() => {
    // ...
  }, []);

  // Then handlers
  const handleClick = () => {
    // ...
  };

  // Then render
  return (/* ... */);
}
```

### Styling

**Use Tailwind CSS classes:**
```tsx
// Good
<button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
  Click me
</button>

// Avoid inline styles
<button style={{ padding: '8px 16px', background: '#0d9488' }}>
  Click me
</button>
```

**Use clsx for conditional classes:**
```tsx
import { clsx } from 'clsx';

<button
  className={clsx(
    'px-4 py-2 rounded-lg',
    isActive ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700'
  )}
>
  Click me
</button>
```

**Follow the design system:**
- Use `brand-*` colors for primary actions
- Use `gray-*` for backgrounds and text
- Use `rounded-xl` or `rounded-2xl` for cards
- Use consistent padding: `p-4`, `p-6`, `p-8`

### API Calls

**Handle loading and error states:**
```tsx
const [data, setData] = useState<Data | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.module.getData();
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
```

### File Organization

**One component per file:**
```
src/components/
├── my-component.tsx     # Component
├── my-component.test.tsx # Tests (if any)
└── index.ts              # Exports
```

**Co-locate related code:**
```
src/app/my-feature/
├── page.tsx              # Page component
├── layout.tsx            # Layout (if needed)
├── components/           # Feature-specific components
│   └── feature-card.tsx
└── hooks/                # Feature-specific hooks
    └── use-feature-data.ts
```

---

## Pull Request Guidelines

### Creating a Pull Request

1. **Title**: Use a clear, descriptive title
   - Good: "Add scripture memorization review mode"
   - Bad: "Fix stuff"

2. **Description**: Include:
   - Summary of changes
   - Link to related issue(s)
   - Screenshots for UI changes
   - Testing instructions

3. **Size**: Keep PRs focused and manageable
   - Ideal: 100-300 lines changed
   - If larger, consider splitting

### PR Template

```markdown
## Summary
Brief description of the changes.

## Related Issue
Closes #123

## Changes Made
- Added new component for X
- Updated API client to support Y
- Fixed bug where Z

## Screenshots
(If applicable)

## Testing Instructions
1. Navigate to /page
2. Click on button
3. Verify X happens

## Checklist
- [ ] Code compiles without errors
- [ ] Linting passes
- [ ] Responsive design verified
- [ ] No console errors
```

### What to Include

- Only related changes
- Necessary tests (when applicable)
- Documentation updates if changing behavior
- Migration notes if breaking changes

### What NOT to Include

- Unrelated refactoring
- Code formatting changes (unless that's the purpose)
- Generated files that should be in `.gitignore`
- Secrets, credentials, or personal data

---

## Commit Message Guidelines

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code |
| `test` | Adding or correcting tests |
| `chore` | Changes to the build process or auxiliary tools |

### Examples

```
feat(prayer): add prayer request sharing functionality

- Added visibility options for prayer requests
- Implemented share to partner feature
- Updated UI for better accessibility

Closes #45
```

```
fix(auth): resolve login redirect loop

Token validation was incorrectly clearing valid tokens when
checking authentication state on page refresh.
```

```
refactor(api): simplify error handling in API client

Consolidated error handling logic into a single function
to improve maintainability.
```

---

## Review Process

### For Authors

1. Self-review your changes before requesting review
2. Respond to feedback promptly
3. Make requested changes in new commits (don't force-push)
4. Re-request review after addressing feedback
5. Squash commits when merging if requested

### For Reviewers

**What to Look For:**

1. **Correctness**: Does the code do what it's supposed to?
2. **Design**: Is the code well-structured?
3. **Complexity**: Is the code simple enough?
4. **Tests**: Are there appropriate tests?
5. **Naming**: Are names clear and descriptive?
6. **Style**: Does it follow our conventions?
7. **Documentation**: Are comments and docs adequate?

**How to Give Feedback:**

- Be constructive and specific
- Explain the "why" behind suggestions
- Distinguish between blocking issues and suggestions
- Use "nit:" prefix for minor suggestions
- Approve when ready, even with minor suggestions

**Response Time:**

- Aim to review within 1 business day
- If you can't review promptly, let the author know

### Merging

- All checks must pass
- At least one approval required
- No unresolved conversations
- Up to date with main branch
- Author merges their own PR (unless urgent)

---

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues and PRs
3. Ask in team discussions
4. Reach out to maintainers

Thank you for contributing to ViaApp Web!
