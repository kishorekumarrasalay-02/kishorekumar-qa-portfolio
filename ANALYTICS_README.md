# Portfolio Analytics Dashboard

Enterprise-level analytics for your portfolio — visitor tracking, click events, downloads, scroll depth, and a hidden admin dashboard.

## Folder Structure

```
supabase/
  schema.sql                 # Database tables (run in Supabase SQL editor)

src/
  auth.ts                    # NextAuth admin authentication
  middleware.ts              # Protects /dashboard routes

  app/
    api/
      visit/route.ts         # Register visitors & sessions
      event/route.ts         # Section views, scroll depth, generic events
      contact/route.ts       # Click tracking (GitHub, LinkedIn, email, etc.)
      download/route.ts      # Resume & document downloads
      dashboard/route.ts     # Dashboard metrics (auth required)
      auth/[...nextauth]/    # NextAuth handlers
    dashboard/               # Hidden analytics UI (admin only)
    login/                   # Admin login page

  components/
    analytics/
      AnalyticsProvider.tsx  # Context wrapper for tracking
      SectionTracker.tsx     # Auto-tracks section views & scroll depth
      TrackableDownload.tsx  # Download links with analytics
      TrackableLink.tsx      # Reusable tracked links
      HiddenBugTrigger.tsx   # 5-click footer bug → login
    dashboard/               # Dashboard UI components

  hooks/
    useAnalytics.ts          # trackPage, trackClick, trackDownload, etc.
    useDashboardData.ts      # Fetches dashboard metrics

  lib/
    analytics/               # Types, hashing, rate-limit, queries
    supabase/server.ts       # Supabase admin client
```

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Copy **Project URL** and **service_role** key (Settings → API)

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values.

### 3. Run Locally

```bash
npm run dev
```

## Hidden Dashboard Access

1. Scroll to the **footer**
2. Click the tiny **bug** icon **5 times** (within 3 seconds)
3. Sign in at `/login`
4. Access `/dashboard`

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/visit` | POST | Register visitors & sessions |
| `/api/event` | POST | Section views, scroll depth, events |
| `/api/contact` | POST | Click tracking |
| `/api/download` | POST | File download tracking |
| `/api/dashboard` | GET | Dashboard metrics (auth required) |

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Add all env variables from `.env.local`
3. Deploy

Vercel provides geo headers for country/city detection automatically.
