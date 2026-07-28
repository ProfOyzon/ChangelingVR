# ChangelingVR Website

Official website for the Changeling VR game. Built with Next.js, TypeScript, Tailwind CSS, Drizzle ORM, and Postgres.

---

## Structure

```
/ (project root)
├── app/            # Routes (auth, dashboard, api, users)
├── components/     # UI components
├── lib/            # Auth, DB, utilities
├── drizzle/        # Migrations & snapshots
├── public/         # Static assets
└── config files    # next.config.ts, vercel.json, etc.
```

---

## Requirements

- Node.js >= 22.15.0
- pnpm >= 10.20.0
- Postgres

---

## Quick Start

1. `pnpm install`
2. Create `.env.local` (see below)
3. `pnpm dev` → http://localhost:3000

---

## Scripts

- `pnpm dev` — Dev server
- `pnpm build` — Production build
- `pnpm start` — Start production
- `pnpm db:studio` - View DB

---

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
AUTH_ACCESS_CODE=
JWT_ACCESS_SECRET=
NODEMAILER_PASSWORD=
BLOB_READ_WRITE_TOKEN=
```

---

## License

MIT © Changeling VR
