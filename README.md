# ViaApp Web

A Next.js web application for the ViaApp spiritual growth platform.

## Features

- **Quiet Time Experiences**: Word to Life, Word to Heart, Guided QT, and Custom QT sessions
- **Bible Reading**: Full Bible with multiple translations and reading plans
- **Memory Verses**: Track and practice Scripture memorization
- **Prayer Journal**: Manage prayer requests and track answered prayers
- **Disciple Partner**: Connect with accountability partners
- **Church Community**: Join and connect with your local church

## Prerequisites

- Node.js 18+
- pnpm 8+

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The app runs on [http://localhost:3100](http://localhost:3100).

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    bible/              # Bible reading
    church/             # Church community
    dashboard/          # Main dashboard
    login/              # Authentication
    memory/             # Memory verses
    notifications/      # User notifications
    partner/            # Disciple partner
    prayer/             # Prayer journal
    quiet-time/         # Quiet time experiences
    register/           # User registration
    settings/           # User settings
  components/           # Reusable UI components
  lib/                  # Utilities and providers
    api.ts              # API client configuration
    auth-provider.tsx   # Authentication context
    store.ts            # Zustand state stores
  shared/               # Shared types, constants, and API client
    api/                # API client implementation
    constants/          # App constants
    types/              # TypeScript type definitions
```

## Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_API_URL=https://api.viaapp.com/api
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Language**: TypeScript

## License

Private - All rights reserved.
