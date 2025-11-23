# Project Relay

A peer-to-peer platform connecting high school students for project transfers and collaborations. Think of it as Fiverr for high school projects.

## Overview

Project Relay helps students find and transfer ownership of projects, initiatives, and organizations. Whether you're graduating and need to pass on your nonprofit, or looking to take over an existing project that matches your interests, Project Relay facilitates seamless connections.

## Features

### For Project Seekers
- Browse projects by area (Tech, Science Research, Engineering, Journalism, Non-profit)
- Filter by state, commitment level, and project age
- Search projects by keywords
- Bookmark interesting projects
- Contact project owners directly
- Request project transfers with optional payment offers

### For Project Owners
- List up to 2 projects (additional listings available for $20)
- Set transfer fees (capped at $100)
- Receive contact requests and transfer inquiries via DM
- Manage project visibility and details

### User Features
- Guest mode for browsing without an account
- 10 weekly contact/transfer requests (more with premium)
- Personalized recommendations based on interests
- Location-based project discovery

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication & Database)
- CSS Modules

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin operations)
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
  app/
    auth/           # Sign in/up pages
    projects/       # Project listing and detail pages
    page.tsx        # Homepage
  components/       # Reusable UI components
  lib/
    auth.ts         # Authentication service with validation
    database.ts     # Database types and services
    supabase.ts     # Supabase client
    placeholder-data.ts  # Sample project data
```

## Database Schema

### User Profiles
- First name, last name, age, location
- Interests (at least 3 required)
- Time commitment preferences
- Points balance and premium status

### Projects
- Name, description, category (Project/Initiative/Organization)
- Area (Science Research, Tech, Engineering, Journalism, Non-profit, Other)
- Time commitment level
- Transfer fee (optional, max $100)
- Links to website, video, materials

### Supporting Tables
- Bookmarks
- Messages (DMs and transfer requests)
- Notifications
- Transactions
- Weekly request tracking

## Key Functionality

### Authentication
- Email/password sign up with validation
- Password requirements (minimum 8 characters)
- Username validation (alphanumeric with underscores)
- Guest mode for browsing

### Error Handling
- All auth operations wrapped in try-catch
- Input validation for email, password, username, ZIP code
- Environment variable validation on startup
- Loading states for async operations

### Request Limits
- Free users: 10 requests per week
- Premium users: 50 requests per week
- Points system for additional requests

## Development

### Testing with Placeholder Data

The app includes 20 sample projects for testing. These cover various categories:
- Science research projects
- Tech initiatives
- Engineering projects
- Journalism organizations
- Non-profit initiatives

### Adding New Features

1. Define types in `src/lib/database.ts`
2. Add service methods to the appropriate service class
3. Create UI components in `src/components`
4. Add pages in `src/app`

## Deployment

Deploy on Vercel:

```bash
npm run build
vercel deploy
```

Ensure environment variables are configured in Vercel dashboard.

## License

MIT
