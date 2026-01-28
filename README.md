# ViaApp Web

A modern Christian discipleship web application built to help believers grow in their faith through daily quiet time, Bible study, prayer tracking, Scripture memorization, and community connection.

## Overview

ViaApp Web is the browser-based companion to the ViaApp mobile platform. It provides a comprehensive suite of spiritual growth tools designed to foster consistent devotional habits and meaningful Christian community.

### Key Features

- **Quiet Time Experiences** - Multiple devotional formats including Word to Life, Word to Heart, Guided QT, and Custom QT
- **Bible Reading** - Full Bible access with multiple translations and reading plans
- **Prayer Journal** - Track prayer requests and celebrate answered prayers
- **Scripture Memorization** - Flashcard-based verse memorization with spaced repetition
- **Disciple Partner** - Accountability partnerships for spiritual growth
- **Church Community** - Connect with your local church, check-in on service days
- **Community Feed** - Share testimonies, prayer requests, and encouragement
- **Progress Tracking** - Streak tracking, badges, and statistics

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) with App Router |
| UI Library | [React 19](https://react.dev/) |
| State Management | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Language | [TypeScript 5.6](https://www.typescriptlang.org/) |
| Package Manager | [pnpm](https://pnpm.io/) |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Access to the ViaApp API (local or production)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/viaapp-web.git
cd viaapp-web

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

The application will be available at [http://localhost:3100](http://localhost:3100).

## Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# For production
# NEXT_PUBLIC_API_URL=https://api.viaapp.life
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.viaapp.com/api` |

## Available Scripts

```bash
# Development
pnpm dev          # Start dev server on port 3100
pnpm build        # Build for production
pnpm start        # Start production server on port 3100
pnpm lint         # Run ESLint
```

## Project Structure

```
viaapp-web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth layout group (login, register)
│   │   ├── (main)/          # Main app layout group
│   │   ├── bible/           # Bible reader
│   │   ├── church/          # Church features
│   │   ├── community/       # Community features
│   │   ├── dashboard/       # Main dashboard
│   │   ├── login/           # Authentication
│   │   ├── memory/          # Scripture memorization
│   │   ├── notifications/   # User notifications
│   │   ├── partner/         # Disciple partnerships
│   │   ├── prayer/          # Prayer journal
│   │   ├── progress/        # Stats and achievements
│   │   ├── quiet-time/      # QT experiences
│   │   ├── reading-plans/   # Bible reading plans
│   │   ├── register/        # User registration
│   │   ├── settings/        # User settings
│   │   └── studies/         # Bible studies
│   ├── components/          # Shared React components
│   ├── lib/                 # Utilities and configurations
│   │   ├── api.ts           # API client setup
│   │   ├── auth-provider.tsx # Authentication context
│   │   └── store.ts         # Zustand stores
│   └── shared/              # Shared types, constants, API client
│       ├── api/             # Generic API client factory
│       ├── constants/       # App constants
│       └── types/           # TypeScript type definitions
├── public/                  # Static assets
├── .github/workflows/       # CI/CD configuration
├── Dockerfile               # Container configuration
└── package.json
```

## Deployment

### Docker

The application is containerized for production deployment:

```bash
# Build the Docker image
docker build -t viaapp-web .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.viaapp.life viaapp-web
```

### GitHub Actions CI/CD

Pushing to `main` triggers automatic deployment:

1. Builds Docker image
2. Pushes to GitHub Container Registry (ghcr.io)
3. Deploys to VPS via SSH

### Manual Deployment

```bash
# Build for production
pnpm build

# The standalone output is in .next/standalone
node .next/standalone/server.js
```

## API Integration

The web app connects to the ViaApp API for all data operations. Key API modules include:

- **Auth** - Login, registration, token refresh
- **User** - Profile management, statistics
- **Quiet Time** - Session tracking, daily verses
- **Prayer** - CRUD operations for prayer requests
- **Bible** - Books, chapters, verses, search
- **Church** - Membership, check-ins, events
- **Partnerships** - Disciple partner connections

See the [Architecture documentation](./docs/ARCHITECTURE.md) for details on the API client implementation.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture details
- [Features](./docs/FEATURES.md) - Feature documentation
- [Onboarding](./docs/ONBOARDING.md) - Developer onboarding guide

## License

Proprietary - All rights reserved.

## Support

For issues or questions, please contact the development team.
