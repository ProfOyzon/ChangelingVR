# Project Overview

This project uses a modern, domain-driven structure for scalability and maintainability, leveraging Next.js App Router, TanStack Query (React Query), and Supabase for data-driven features.

---

## Structure

```
/ (project root)
├── app/
│   ├── teams/                # Teams page (SSR/CSR, React Query, see app/teams/README.md)
│   ├── components/           # App-wide UI components
│   ├── api/                  # API routes
│   ├── users/                # User profiles, settings, and management
│   ├── auth/                 # Authentication flows (login, register, password reset)
│   └── ...                   # Other routes and features
├── hooks/                    # Custom React hooks
├── lib/                      # Shared libraries (e.g., supabase client)
├── public/                   # Static assets
├── types/                    # Shared TypeScript types
├── tsconfig.json
├── next.config.ts
└── ... (other config files)
```

---

## Key Conventions

- **app/components/**: Shared UI components used across multiple pages/routes.
- **app/teams/**: Implements the Teams page with SSR/CSR hydration, search, and pagination using TanStack Query and Supabase. See `app/teams/README.md` for details.
- **app/hooks/**, **app/lib/**, **app/types/**: Shared hooks, libraries, and types for use throughout the app.
- **public/**: Static files (images, icons, etc.).

---

## Features

- **Supabase Integration**: All data fetching and mutations are handled via Supabase.
- **Modern Next.js**: Uses the App Router, server components, and best practices for scalable apps.

---

## Contributing

- Place shared logic, types, and UI in the appropriate `app/components/`, `app/hooks/`, `app/lib/`, or `app/types/` folders.
- Place feature-specific code in the relevant `app/[feature]/` subfolder (e.g., `app/teams/`).
- See local `README.md` files in each folder (e.g., `app/teams/README.md`) for more details and conventions.

---

## Getting Started

1. Install dependencies: `pnpm install`
2. Run the development server: `pnpm dev`
3. Visit [http://localhost:3000](http://localhost:3000)

---

For more information, see the README files in each major folder.
