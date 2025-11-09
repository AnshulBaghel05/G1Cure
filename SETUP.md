# G1Cure Development Setup Guide

Quick setup guide for developers joining the G1Cure project.

## Prerequisites

- **Bun** (recommended) or **Node.js 18+**
- **Git**
- **Code Editor** (VS Code recommended)

## One-Command Setup

```bash
# Clone and setup
git clone https://github.com/AnshulBaghel05/G1Cure.git
cd G1Cure
chmod +x setup.sh
./setup.sh
```

## Manual Setup

### 1. Install Dependencies

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Backend
cd backend
bun install

# Frontend
cd ../frontend
bun install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials

# Frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Setup Database

Option A - Use Supabase Dashboard:
1. Create account at https://supabase.com
2. Create new project
3. Run migrations from `backend/supabase/migrations/` in SQL Editor

Option B - Use CLI:
```bash
cd backend/supabase
./apply-migrations.sh
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend (from backend/)
bun run dev

# Terminal 2 - Frontend (from frontend/)
bun run dev
```

## Project Structure

```
G1Cure/
├── backend/                 # Encore.dev backend
│   ├── ai/                 # AI medical assistant
│   ├── clinic/             # Patient, doctor, appointment services
│   ├── telemedicine/       # Video conferencing
│   ├── stripe/             # Payment processing
│   ├── notifications/      # Email/SMS/Push
│   ├── analytics/          # Analytics & reporting
│   ├── supabase/          # Database client & migrations
│   └── .env               # Backend environment variables
│
├── frontend/               # React + Vite frontend
│   ├── pages/             # Route pages (admin, doctor, patient)
│   ├── components/        # Reusable React components
│   ├── contexts/          # React contexts (Auth, Theme, Language)
│   ├── lib/               # Utilities
│   ├── public/            # Static assets, PWA files
│   └── .env.local         # Frontend environment variables
│
├── docs/                  # Documentation
├── DEPLOYMENT.md          # Deployment guide
├── SETUP.md              # This file
└── README.md             # Project overview
```

## Development Workflow

### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Making Changes

1. **Create Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Follow existing code style
- Add TypeScript types
- Write clean, readable code

3. **Test**
```bash
# Backend
cd backend
bun test

# Frontend
cd frontend
bun run build  # Check for build errors
```

4. **Commit**
```bash
git add .
git commit -m "feat: your feature description"
```

5. **Push**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request**
- Go to GitHub
- Create PR from your branch to `develop`

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(auth): add email verification
fix(appointments): resolve booking conflict
docs(api): update API documentation
```

## Common Tasks

### Add New Backend Endpoint

1. Create service file in appropriate directory (e.g., `backend/clinic/new-service.ts`)

2. Define API:
```typescript
import { api } from "encore.dev/api";

export const myEndpoint = api(
  { expose: true, method: "POST", path: "/my-endpoint", auth: true },
  async (req: MyRequest): Promise<MyResponse> => {
    // Implementation
  }
);
```

3. Test endpoint:
```bash
curl -X POST http://localhost:4000/my-endpoint -d '{"data": "test"}'
```

### Add New Frontend Page

1. Create page component in `frontend/pages/`

2. Add route in `frontend/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

3. Add navigation link in appropriate layout

### Add New Database Table

1. Create migration file:
```sql
-- backend/supabase/migrations/006_new_table.sql
CREATE TABLE my_table (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- Add policy
CREATE POLICY "Users can read own data" ON my_table
  FOR SELECT USING (auth.uid() = user_id);
```

2. Run migration via Supabase dashboard

3. Update TypeScript types in `backend/supabase/client.ts`

### Add Component

1. Create in `frontend/components/`
2. Export in `frontend/components/index.ts` if reusable
3. Use TypeScript for props
4. Add JSDoc comments

Example:
```typescript
interface MyComponentProps {
  /** User's name */
  name: string;
  /** Callback when clicked */
  onClick?: () => void;
}

/**
 * My reusable component
 */
export const MyComponent: React.FC<MyComponentProps> = ({ name, onClick }) => {
  return <div onClick={onClick}>Hello, {name}</div>;
};
```

## Debugging

### Backend Debugging

View logs:
```bash
# Encore logs
encore logs

# Or check console output
```

Debug endpoint:
```bash
# Use Encore's built-in API explorer
encore run
# Visit: http://localhost:9400
```

### Frontend Debugging

- Use React DevTools browser extension
- Check browser console (F12)
- Use `console.log()` during development
- React Query Devtools available at bottom-left

### Database Debugging

View data in Supabase:
- Dashboard → Table Editor
- Dashboard → SQL Editor

Check RLS policies:
```sql
-- View policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Testing

### Backend Tests
```bash
cd backend
bun test
```

### Frontend Tests
```bash
cd frontend
bun test
```

### E2E Tests
```bash
bun run test:e2e
```

## Code Style

### TypeScript
- Use strict mode
- Avoid `any` type
- Define interfaces for all props
- Use meaningful variable names

### React
- Functional components only
- Use hooks (useState, useEffect, etc.)
- Keep components small and focused
- Extract reusable logic to custom hooks

### CSS
- Use Tailwind CSS utility classes
- Define custom styles in component files
- Follow mobile-first approach

### Formatting
```bash
# Format code
bun run format

# Lint code
bun run lint
```

## Useful Commands

### Backend
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun test             # Run tests
encore logs          # View logs
encore secret set    # Set secret
```

### Frontend
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Lint code
```

### Database
```bash
# Export schema
pg_dump --schema-only "postgresql://..." > schema.sql

# Backup data
pg_dump "postgresql://..." > backup.sql

# Restore
psql "postgresql://..." < backup.sql
```

## Environment Variables

### Required Backend Variables
```
SUPABASE_URL                # From Supabase dashboard
SUPABASE_ANON_KEY          # From Supabase dashboard
SUPABASE_SERVICE_ROLE_KEY  # From Supabase dashboard
```

### Optional Backend Variables
```
GEMINI_API_KEY             # For AI features
STRIPE_SECRET_KEY          # For payments
TWILIO_ACCOUNT_SID         # For SMS
AGORA_APP_ID              # For video
EMAIL_HOST                 # For emails
AWS_ACCESS_KEY_ID         # For file storage
FIREBASE_PROJECT_ID        # For push notifications
REDIS_URL                  # For caching
```

### Required Frontend Variables
```
VITE_SUPABASE_URL          # From Supabase dashboard
VITE_SUPABASE_ANON_KEY     # From Supabase dashboard
VITE_CLIENT_TARGET         # Backend URL
```

## VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- GitLens
- Thunder Client (API testing)
- Error Lens

## Resources

- [Encore.dev Docs](https://encore.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## Getting Help

- Check existing [Issues](https://github.com/AnshulBaghel05/G1Cure/issues)
- Read [Documentation](./docs/)
- Ask in team chat
- Create new issue with `question` label

## Quick Reference

### Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Encore Dashboard: http://localhost:9400

### Default Test Credentials
Create via Supabase Auth dashboard after migrations

### Common Errors

**Error**: "Database connection failed"
**Fix**: Check Supabase credentials in `.env`

**Error**: "Port already in use"
**Fix**: Kill process on port or change port

**Error**: "Module not found"
**Fix**: Run `bun install` again

**Error**: "CORS error"
**Fix**: Check `CORS_ORIGIN` in backend/.env

---

Happy coding! 🚀
