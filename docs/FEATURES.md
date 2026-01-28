# Features

This document provides a comprehensive overview of all features in ViaApp Web, including page descriptions, user flows, and the component library.

## Table of Contents

- [Pages Overview](#pages-overview)
- [User Flows](#user-flows)
- [Component Library](#component-library)

---

## Pages Overview

### Authentication

#### Login (`/login`)

The login page provides user authentication with email and password.

**Features:**
- Email/password form with validation
- Password visibility toggle
- Loading state during authentication
- Error message display
- Link to registration page
- Link back to ViaApp.com

**Technical Notes:**
- Uses `api.auth.login()` for authentication
- Stores user in Zustand store on success
- Redirects to `/dashboard` after login

#### Register (`/register`)

New user registration with comprehensive validation.

**Features:**
- Full name, email, password fields
- Password strength requirements:
  - Minimum 8 characters
  - Contains a number
  - Contains uppercase letter
- Confirm password matching
- Real-time validation feedback
- Terms of Service and Privacy Policy links

**Technical Notes:**
- Uses `api.auth.register()` for registration
- Automatically logs in user after successful registration

---

### Dashboard (`/dashboard`)

The main hub showing user progress, quick actions, and recent activity.

**Sections:**

1. **Header with Daily Verse**
   - Personalized greeting based on time of day
   - AI-powered daily verse with reference

2. **Onboarding Checklist** (new users only)
   - Complete first Quiet Time
   - Add first prayer
   - Memorize first verse
   - Start a reading plan

3. **Church Check-in Card** (on church service day)
   - Shows when it's the user's church day
   - One-tap check-in button
   - Confirmation state after check-in

4. **Streak Card**
   - Current streak count
   - Progress ring toward next milestone
   - Milestones: 7, 14, 30, 60, 90, 180, 365 days

5. **Quick Start CTA**
   - Prominent "Start Your Quiet Time" button
   - Direct link to QT experiences

6. **Stats Grid**
   - Sessions this month
   - Verses memorized
   - Total sessions
   - Active prayers

7. **Quick Actions**
   - Quiet Time
   - Read Bible
   - Memory Verses
   - Prayer Journal

8. **Recent Activity**
   - Timeline of recent quiet time sessions and prayers
   - Links to respective pages

---

### Quiet Time (`/quiet-time`)

Main page for selecting and starting quiet time experiences.

**QT Types:**

1. **Word to Life** (`/quiet-time/word_to_life`)
   - Scripture reading with life application
   - AI-generated reflection questions
   - Journaling component
   - 15-20 minute experience

2. **Word to Heart** (`/quiet-time/word_to_heart`)
   - Scripture memorization focus
   - Meditation on selected passage
   - 10-15 minute experience

3. **Guided QT** (`/quiet-time/guided`)
   - Structured devotional format
   - Step-by-step prompts
   - 20-30 minute experience

4. **Custom QT** (`/quiet-time/custom`)
   - Flexible format
   - User-directed reading and journaling
   - Variable time

**Additional Features:**
- Bible reading plans section
- Recent sessions history
- Success banner after completion

---

### Bible (`/bible`)

Full Bible reader with multiple translations and reading plans.

**Features:**

1. **Book Browser**
   - Old Testament (39 books)
   - New Testament (27 books)
   - Search/filter by book name
   - Chapter count display

2. **Chapter Reader**
   - Verse-by-verse display
   - Verse numbers with styling
   - Chapter navigation (previous/next)
   - Translation selector

3. **Reading Plans Tab**
   - Active plans with progress
   - Available plans to start
   - Difficulty levels (beginner, intermediate, advanced)
   - Plan duration and verses per day

**Technical Notes:**
- Uses `api.bible.getBooks()`, `api.bible.getChapter()`
- Translation selection persists across sessions
- Plans use `api.readingPlans` API module

---

### Prayer Journal (`/prayer`)

Personal prayer request management with answered prayer tracking.

**Features:**

1. **Prayer List**
   - Filter by: All, Active, Answered
   - Category badges
   - Creation date display
   - Mark as answered functionality

2. **New Prayer Form**
   - Title (required)
   - Description (optional)
   - Category selector:
     - Personal, Family, Health, Work
     - Spiritual, Relationships, World, Other
   - Visibility options:
     - Private, Partner only, Church

3. **Prayer Card**
   - Visual distinction for answered prayers
   - Check mark for answered status
   - Timestamp display

---

### Memory Verses (`/memory`)

Scripture memorization with spaced repetition practice.

**Features:**

1. **Stats Dashboard**
   - Total verses
   - Mastered count
   - In progress count
   - Current streak

2. **Verse Lists**
   - Due for Review section
   - Mastered section
   - Progress bars showing mastery level

3. **Practice Mode**
   - Reference display
   - Tap to reveal verse
   - Self-assessment (correct/incorrect)
   - Updates spaced repetition timing

4. **Add Verse Modal**
   - Reference input
   - Verse text input

**Technical Notes:**
- Mastery levels: learning, reviewing, mastered
- Progress calculated from correct count and level

---

### Disciple Partner (`/partner`)

Accountability partnership management.

**Views:**

1. **No Partner State**
   - Search for partners
   - Recommended partners list
   - Benefits explanation
   - Invite by email option

2. **Pending Requests**
   - Accept/reject buttons
   - Requester information

3. **Active Partnership**
   - Partner card with avatar
   - Partnership stats (streak, sessions, prayers shared)
   - Message button
   - Weekly check-in questions

4. **Messaging Modal**
   - Real-time message list
   - Message input
   - Timestamp display

---

### Church (`/church`)

Church community connection and check-in.

**Views:**

1. **No Church State**
   - Church search
   - Search results with join option

2. **My Church View**
   - Church card with name and location
   - Member and event counts
   - Service day display
   - Check-in functionality (on church day)
   - Upcoming events section
   - Leave church option

3. **Join Modal**
   - Service day selection
   - Day picker (Sun-Sat)

---

### Community (`/community`)

Social features for sharing and encouragement.

**Features:**

1. **Community Stats**
   - Total members
   - Active groups
   - Weekly discussions
   - Upcoming events

2. **Post Feed**
   - Filter tabs: All, Testimonies, Prayer Requests, Discussions, Encouragement
   - Post cards with author, type badge, content
   - Like, comment, share, bookmark actions

3. **Sidebar**
   - Groups navigation
   - Discussions navigation
   - Events navigation
   - Suggested groups

**Post Types:**
- Testimony (amber) - Sharing what God has done
- Prayer Request (rose) - Asking for prayer support
- Discussion (blue) - Questions and conversations
- Encouragement (green) - Uplifting messages

**Subpages:**
- `/community/groups` - Group directory
- `/community/groups/[id]` - Individual group
- `/community/discussions` - Discussion threads
- `/community/events` - Event listings

---

### Notifications (`/notifications`)

User notification center.

**Features:**
- Unread count badge
- Mark all as read
- Notification types with icons:
  - Streak milestone
  - Prayer answered
  - Partner message
  - Partner update
  - Quiet time reminder
- Time-relative display
- Individual mark as read

---

### Settings (`/settings`)

User preferences and account management.

**Sections:**

1. **Profile**
   - Display name
   - Email (read-only)

2. **Notifications**
   - Push notifications toggle
   - Quiet time reminders toggle
   - Partner updates toggle
   - Prayer answered toggle

3. **Reading Preferences**
   - Bible version selector
   - Font size (small, medium, large)

4. **Privacy**
   - Share progress with partner toggle
   - Public church visibility toggle

5. **Data & Storage**
   - Auto-sync toggle
   - Storage usage display
   - Export data button
   - Clear cache button

6. **About**
   - App version
   - Help & Support link
   - Privacy Policy link
   - Terms of Service link

---

### Progress (`/progress`)

User statistics and achievements.

**Subpages:**

1. **Overview** (`/progress`)
   - Summary statistics
   - Recent achievements

2. **Badges** (`/progress/badges`)
   - Earned badges
   - Available badges
   - Progress toward unlocking

3. **Statistics** (`/progress/statistics`)
   - Detailed stats breakdown
   - Charts and graphs

4. **Streaks** (`/progress/streaks`)
   - Current streak details
   - Streak history
   - Milestone tracking

---

### Reading Plans (`/reading-plans`)

Bible reading plan management.

**Subpages:**

1. **Active** (`/reading-plans/active`)
   - Currently enrolled plans
   - Progress tracking
   - Today's reading

2. **History** (`/reading-plans/history`)
   - Completed plans
   - Past progress

3. **Calendar** (`/reading-plans/[id]/calendar`)
   - Daily reading schedule
   - Completion tracking

---

### Studies (`/studies`)

Structured Bible studies and lessons.

**Subpages:**

1. **Browse** (`/studies`)
   - Available studies
   - Study descriptions

2. **Enrolled** (`/studies/enrolled`)
   - Current studies
   - Progress tracking

3. **My Progress** (`/studies/my-progress`)
   - Overall study statistics

4. **Study Detail** (`/studies/[id]`)
   - Study overview
   - Lesson list

5. **Lesson** (`/studies/[id]/lessons/[lessonId]`)
   - Lesson content
   - Completion tracking

---

## User Flows

### First-Time User Flow

```
1. User arrives at app -> Redirected to /login
2. User clicks "Sign up" -> /register
3. User completes registration
4. User redirected to /dashboard
5. Dashboard shows onboarding checklist
6. User follows checklist:
   a. Complete first QT -> /quiet-time
   b. Add first prayer -> /prayer
   c. Memorize first verse -> /memory
   d. Start reading plan -> /bible (Reading Plans tab)
7. Onboarding checklist disappears when complete
```

### Daily Quiet Time Flow

```
1. User opens app -> /dashboard
2. User sees streak card and "Start Quiet Time" CTA
3. User clicks "Begin Now" -> /quiet-time
4. User selects QT type (e.g., Word to Life)
5. User directed to /quiet-time/word_to_life
6. User completes QT experience:
   a. Reads Scripture passage
   b. Reflects on AI-generated questions
   c. Journals thoughts
7. User completes session
8. Redirected to /quiet-time?completed=true
9. Success banner shown
10. Streak updated on dashboard
```

### Prayer Request Flow

```
1. User navigates to /prayer
2. User clicks "New Prayer"
3. Modal opens with form
4. User enters:
   - Title: "Job interview tomorrow"
   - Category: Work
   - Visibility: Private
5. User submits form
6. Prayer appears in list
7. Later, user clicks check mark to mark answered
8. Prayer moves to "Answered" filter
9. Success celebration shown
```

### Church Check-in Flow

```
1. User has joined a church with Sunday service
2. On Sunday, user opens /dashboard
3. Church check-in card appears:
   "It's Church Day! Welcome to [Church Name]"
4. User clicks "Check In" button
5. API call to /churches/:id/check-in
6. Card updates to show "Checked In!"
7. Check-in recorded for attendance tracking
```

### Disciple Partner Connection Flow

```
1. User navigates to /partner
2. User sees "Find a Partner" view
3. User can:
   a. Search by name/email
   b. Select from recommendations
   c. Click "Invite Partner" to send email
4. User clicks "Connect" on recommended partner
5. Partnership request sent
6. Partner receives notification
7. Partner accepts request
8. Both users now see "Partner Connected" view
9. Users can message and track each other's progress
```

### Scripture Memorization Flow

```
1. User navigates to /memory
2. User clicks "Add Verse"
3. Modal opens:
   - Reference: John 3:16
   - Text: "For God so loved the world..."
4. User submits
5. Verse appears in "Due for Review"
6. User clicks verse card
7. Practice mode activates:
   a. Reference shown
   b. User recalls verse
   c. Taps to reveal
   d. Self-assesses (correct/incorrect)
8. Verse mastery level updates
9. Next review scheduled based on spaced repetition
```

---

## Component Library

### Layout Components

#### `DashboardLayout`

Main authenticated page wrapper with sidebar navigation.

```tsx
import { DashboardLayout } from '@/components/dashboard-layout';

<DashboardLayout>
  {/* Page content */}
</DashboardLayout>
```

**Features:**
- Authentication guard
- Responsive sidebar
- Mobile header with menu
- Loading state
- Error boundary

#### `Sidebar`

Navigation sidebar with collapsible state.

**Sections:**
- Logo and brand
- Streak badge
- Main navigation (Home, QT, Bible, Partner)
- More navigation (Prayer, Memory, Church, Community)
- Account navigation (Notifications, Settings)
- User info and logout

#### `Providers`

Root providers wrapper.

```tsx
<Providers>
  {children}
</Providers>
```

Currently wraps:
- `AuthProvider` - Authentication context

### Error Components

#### `ErrorBoundary`

React Error Boundary for catching render errors.

```tsx
<ErrorBoundary fallback={<CustomError />}>
  {children}
</ErrorBoundary>
```

#### `ErrorCard`

Inline error display with retry option.

```tsx
<ErrorCard
  message="Failed to load data"
  onRetry={() => refetch()}
/>
```

### Common UI Patterns

#### Stat Card

```tsx
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-600">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">Label</p>
      <p className="text-2xl font-bold text-gray-900">Value</p>
    </div>
  </div>
</div>
```

#### Quick Action Card

```tsx
<Link
  href="/path"
  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
>
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 group-hover:scale-110 transition-transform">
    <Icon className="w-6 h-6 text-white" />
  </div>
  <h3 className="font-semibold mt-4">Title</h3>
  <p className="text-sm text-gray-500 mt-1">Description</p>
</Link>
```

#### Form Input

```tsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
  placeholder="Placeholder text"
/>
```

#### Primary Button

```tsx
<button className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
  <Icon className="w-5 h-5" />
  Button Text
</button>
```

#### Toggle Switch

```tsx
<button
  onClick={() => onChange(!checked)}
  className={`relative w-11 h-6 rounded-full transition-colors ${
    checked ? 'bg-brand-500' : 'bg-gray-200'
  }`}
>
  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
    checked ? 'translate-x-5' : ''
  }`} />
</button>
```

#### Loading Spinner

```tsx
<Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
```

#### Empty State

```tsx
<div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
  <Icon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    No items yet
  </h3>
  <p className="text-gray-500 mb-4">
    Description of what to do
  </p>
  <Link href="/path" className="text-brand-600 font-medium hover:text-brand-700">
    Call to action
  </Link>
</div>
```

### Icons

The application uses [Lucide React](https://lucide.dev/) for icons. Common icons include:

| Icon | Usage |
|------|-------|
| `Home` | Dashboard |
| `BookHeart` | Quiet Time |
| `BookOpen` | Bible |
| `Users` | Partner, Community |
| `Heart` | Prayer |
| `Brain` | Memory Verses |
| `Church` | Church |
| `Bell` | Notifications |
| `Settings` | Settings |
| `Flame` | Streaks |
| `Loader2` | Loading spinner |
| `ChevronRight` | Navigation |
| `Plus` | Add actions |
| `Check` | Success, completed |
| `X` | Close, remove |
