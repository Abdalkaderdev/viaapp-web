# viaapp-web - Work Log

## Repository Info
- **Purpose**: Web app for individual VIA users (viaapp.life)
- **Tech Stack**: Next.js 15, App Router, Tailwind CSS
- **GitHub**: github.com/Abdalkaderdev/viaapp-web

## Work Completed

### Repository Setup
- Extracted from monorepo `/apps/web` directory
- Set up independent package.json
- Fixed @viaapp/shared imports (copied types locally)
- Pushed to GitHub

### Existing Features (from monorepo)

**App Structure:**
```
src/app/
├── bible/           # Bible reader
├── church/          # Church features
├── dashboard/       # User dashboard
├── login/           # Authentication
├── memory/          # Memory verses
├── notifications/   # Notifications
├── partner/         # Partner connections
├── prayer/          # Prayer requests
├── quiet-time/      # QT activities
├── register/        # Registration
└── settings/        # User settings
```

## TODO

1. **API Client** - Verify API endpoints match backend
2. **Auth Flow** - Test login/register
3. **Feature Parity** - Match mobile app features

## Commands

```bash
# Install dependencies
pnpm install

# Run development
pnpm dev

# Build
pnpm build

# Check TypeScript
pnpm tsc --noEmit
```

## Build Status
- TypeScript: 0 errors
- Ready for development
