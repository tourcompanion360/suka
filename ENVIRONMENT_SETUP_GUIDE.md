# TourCompanion Environment Setup Guide
# Only Supabase integration - no other third-party services

## Quick Setup (Client / Server)

### Client (Browser, Vite)
- Use VITE_ prefixed environment variables
- These are exposed to the browser

**Required Variables:**
```
VITE_SUPABASE_URL=https://yrvicwapjsevyilxdzsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlydmljd2FwanNldnlpbHhkenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDY2ODIsImV4cCI6MjA3NTU4MjY4Mn0.tRhpswJI2CccGdWX3fcJEowSA9IBh-KMYHfaiKVjN7c
```

**Example Implementation (.env.local):**
```bash
# .env.local - Client-side environment variables
VITE_SUPABASE_URL=https://yrvicwapjsevyilxdzsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlydmljd2FwanNldnlpbHhkenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDY2ODIsImV4cCI6MjA3NTU4MjY4Mn0.tRhpswJI2CccGdWX3fcJEowSA9IBh-KMYHfaiKVjN7c
```

**JavaScript Client Code:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Runtime guard to avoid blank screens
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env.local or Vercel env settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Server (Edge / Serverless — Node/Server code)
- Read server-only secrets from process.env
- DO NOT expose these to the client/browser

**Required Variables:**
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=your_supabase_database_connection_string
JWT_SECRET=your_32_character_jwt_secret_for_backend
```

**Example Implementation:**
```bash
# .env - Server-side environment variables (DO NOT COMMIT)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_service_key
DATABASE_URL=postgresql://postgres:[password]@db.yrvicwapjsevyilxdzsm.supabase.co:5432/postgres
JWT_SECRET=your_32_character_random_secret_here
```

**Server Code Example:**
```javascript
// Only use service role for trusted server operations
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRole) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in server environment variables.');
}

// Use service role only for:
// - Background jobs
// - Database migrations
// - Admin operations
// - Server-side data processing
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
```

## Deployment Configurations

### Vercel Deployment
Set these environment variables in Vercel dashboard:
```
VITE_SUPABASE_URL=https://yrvicwapjsevyilxdzsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlydmljd2FwanNldnlpbHhkenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDY2ODIsImV4cCI6MjA3NTU4MjY4Mn0.tRhpswJI2CccGdWX3fcJEowSA9IBh-KMYHfaiKVjN7c
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Netlify Deployment
Set these environment variables in Netlify dashboard:
```
VITE_SUPABASE_URL=https://yrvicwapjsevyilxdzsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlydmljd2FwanNldnlpbHhkenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDY2ODIsImV4cCI6MjA3NTU4MjY4Mn0.tRhpswJI2CccGdWX3fcJEowSA9IBh-KMYHfaiKVjN7c
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Security Notes

1. **Client Variables (VITE_)**: Safe to expose to browser
2. **Server Variables**: Never expose to client - keep secret
3. **Service Role Key**: Only use on server-side for admin operations
4. **Anon Key**: Safe for client-side authentication and data access
5. **Runtime Guards**: Always check for missing environment variables

## Current Status

✅ **Zero external dependencies** - Only Supabase integration
✅ **All third-party APIs removed** - Stripe, SendGrid, Sentry, etc.
✅ **Build tested successfully** - No external imports or services
✅ **Environment variables configured** - Client and server separation
