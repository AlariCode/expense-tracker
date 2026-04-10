## Frontend Architecture — Feature-Sliced Design (FSD)

Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, shadcn/ui. Path alias `@/*` maps to `src/*`.

The frontend follows [Feature-Sliced Design](https://feature-sliced.design/) methodology. Layers (top to bottom, imports only flow downward):

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Route group — login, register
│   └── (dashboard)/        # Route group — main dashboard (auth guard)
│       ├── page.tsx         # Transactions dashboard
│       ├── categories/      # Categories page
│       └── profile/         # User profile page
├── widgets/                # Composite UI blocks (composed from features/entities)
│   └── sidebar/            # App sidebar with navigation and user info
├── features/               # User-facing features (business logic + UI)
│   ├── auth/               # Login/register
│   └── transaction-list/   # Transaction list with pagination + summary
├── entities/               # Business entities (data models)
│   ├── user/               # User, AuthResponse types
│   ├── transaction/        # Transaction, TransactionType, TransactionSummary
│   └── category/           # Category type
└── shared/                 # Framework-agnostic utilities & UI kit
    ├── api/                # Base HTTP client (api-client.ts) — auto-attaches JWT
    ├── hooks/              # Shared hooks (use-auth.ts)
    ├── lib/utils.ts        # cn() utility (clsx + tailwind-merge)
    └── ui/                 # shadcn/ui components
```

### FSD Rules

- Each layer can only import from layers **below** it: `app` → `widgets` → `features` → `entities` → `shared`
- External imports from a slice go through its `index.ts` (public API)
- shadcn/ui components live in `shared/ui/` — configured via `components.json` (aliases: `@/shared/ui`, `@/shared/lib/utils`)
- Forms use `react-hook-form` + `zod` for validation

### Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```
