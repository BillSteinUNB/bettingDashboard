# BetTracker

A comprehensive sports betting dashboard for tracking wagers, analyzing performance, and managing your bankroll.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## Features

- **Dashboard** - View key performance metrics (ROI, win rate, P&L), bankroll progression charts, and league-by-league breakdowns
- **New Entry** - Log single bets or parlays with full details (game, selection, league, odds, units)
- **Active Bets** - Track pending wagers and quickly resolve them (Win/Loss/Push/Void)
- **History** - Search and filter your complete betting history with pagination
- **Settings** - Configure preferences, default units, and theme

### Supported Leagues

NFL, NBA, NHL, NCAAB, MLB, Soccer, Tennis, MMA, and custom entries

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: React hooks + localStorage persistence

---

## Roadmap: Multi-User Web App

> The following features are planned to transform BetTracker from a local-only tool into a full web application with user accounts and cloud persistence.

### Phase 1: Authentication

**Goal**: Allow users to create accounts and log in securely.

| Task | Description | Tools |
|------|-------------|-------|
| Auth Provider Setup | Integrate a managed auth service | Supabase Auth / Clerk / NextAuth |
| Login/Signup UI | Create authentication pages or modal | React components |
| Session Management | Handle tokens, refresh, logout | Auth provider SDK |
| Protected Routes | Redirect unauthenticated users | React Router or middleware |

**Auth Options Considered**:
- **Supabase Auth** (recommended) - Free tier, integrates with database, supports email/password + OAuth
- **Clerk** - Beautiful pre-built UI components, generous free tier
- **NextAuth** - If migrating to Next.js later
- **Firebase Auth** - Good if already in Google ecosystem

### Phase 2: Database

**Goal**: Store bets in a cloud database instead of localStorage.

| Task | Description | Tools |
|------|-------------|-------|
| Database Setup | Create hosted PostgreSQL instance | Supabase / PlanetScale / Railway |
| Schema Design | Create `users` and `bets` tables | SQL migrations |
| Row Level Security | Ensure users only access their own data | Postgres RLS policies |
| Indexes | Optimize queries for filtering/sorting | SQL indexes on `user_id`, `date` |

**Proposed Schema**:

```sql
-- Users table (managed by auth provider)
-- Supabase creates this automatically

-- Bets table
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  game TEXT NOT NULL,
  selection TEXT NOT NULL,
  league TEXT NOT NULL,
  odds INTEGER NOT NULL,
  units DECIMAL(10,2) NOT NULL,
  result TEXT DEFAULT 'pending',
  pnl DECIMAL(10,2) DEFAULT 0,
  is_parlay BOOLEAN DEFAULT false,
  parlay_legs JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own bets"
  ON bets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own bets"
  ON bets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own bets"
  ON bets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own bets"
  ON bets FOR DELETE
  USING (auth.uid() = user_id);
```

### Phase 3: API Integration

**Goal**: Replace localStorage with database calls.

| Task | Description | Effort |
|------|-------------|--------|
| Supabase Client Setup | Install and configure `@supabase/supabase-js` | 30 min |
| Refactor `useBets` Hook | Replace localStorage reads/writes with Supabase queries | 2-4 hrs |
| Add Loading States | Handle async data fetching in UI | 1 hr |
| Error Handling | Display errors for failed operations | 1 hr |
| Optimistic Updates | Update UI immediately, sync in background | 2 hrs (optional) |

**Current `useBets` hook changes**:

```typescript
// Before (localStorage)
const [bets, setBets] = useState<Bet[]>(() => {
  const saved = localStorage.getItem('bettracker_bets');
  return saved ? JSON.parse(saved) : MOCK_BETS;
});

// After (Supabase)
const [bets, setBets] = useState<Bet[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBets = async () => {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setBets(data);
    setLoading(false);
  };
  fetchBets();
}, []);
```

### Phase 4: Deployment

**Goal**: Make the app accessible on the web.

| Task | Description | Tools |
|------|-------------|-------|
| Frontend Hosting | Deploy static React app | Vercel / Netlify / Cloudflare Pages |
| Environment Variables | Secure API keys and URLs | Platform env vars |
| Custom Domain | Connect your own domain (optional) | DNS configuration |
| SSL | Ensure HTTPS | Automatic with Vercel/Netlify |

**Recommended Setup**:
- **Frontend**: Vercel (free, automatic deploys from GitHub)
- **Backend/DB**: Supabase (free tier: 500MB database, 50K monthly active users)
- **Total Cost**: $0/month for hobby use

### Phase 5: Enhancements (Future)

| Feature | Description | Priority |
|---------|-------------|----------|
| Data Export | Export bets to CSV/Excel | Medium |
| Import from Sheets | Migrate existing Google Sheets data | Medium |
| Unit Calculators | Kelly criterion, stake sizing tools | Low |
| Notifications | Alerts for pending bet reminders | Low |
| Public Profiles | Share your record (opt-in) | Low |
| Mobile App | React Native or PWA | Low |
| Odds API | Auto-fetch current odds | Low |

---

## Effort Estimate

| Phase | Time (Solo Dev) |
|-------|-----------------|
| Phase 1: Auth | 2-4 hours |
| Phase 2: Database | 2-4 hours |
| Phase 3: API Integration | 4-8 hours |
| Phase 4: Deployment | 1-2 hours |
| **Total** | **~12-20 hours** |

With focused effort: **2-3 days** to a production-ready multi-user app.

---

## Archive

The `archive/` folder contains the previous implementation:
- `archive/frontend/` - Original Next.js frontend
- `archive/backend/` - Flask API + Streamlit dashboard

These are preserved for reference but are no longer active.

---

## License

MIT
