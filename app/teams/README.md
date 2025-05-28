# Teams Directory

This folder implements the **Teams** page for the Changeling VR project, providing a searchable, paginated list of team members with SSR/CSR hydration and modern React Query patterns.

## Structure

```
app/teams/
  components/
    member-card.tsx
    pagination.tsx
    query-provider.tsx
  utils/
    fetch-profile.ts
    get-query-client.ts
    profile-options.ts
  page.tsx
  page.client.tsx
  layout.tsx
  README.md
```

---

## Main Files & Responsibilities

### `page.tsx`

- **Server Component**.
- Prefetches team profile data using React Query and `getQueryClient`.
- Wraps the client page in a `HydrationBoundary` for SSR-to-CSR hydration.
- Renders the main page heading and description.

### `page.client.tsx`

- **Client Component**.
- Uses `useSuspenseQuery` with shared `profileOptions` for data fetching.
- Implements search and pagination, including restoring the previous page after clearing search.
- Renders team member cards and pagination controls.

### `layout.tsx`

- Wraps the page in a React Query provider for consistent query client access.

---

## Components

### `components/member-card.tsx`

- Renders a clickable card for each team member, showing avatar, name, bio, and social links.

### `components/pagination.tsx`

- Simple, accessible pagination component with page numbers and next/previous controls.

### `components/query-provider.tsx`

- Provides a React Query client context for the teams section.

---

## Utilities

### `utils/fetch-profile.ts`

- Exports `fetchProfiles`, a function to fetch all team profiles from Supabase.
- Used as the query function for React Query.

### `utils/profile-options.ts`

- Exports `profileOptions`, a shared React Query options object for fetching profiles.
- Centralizes query key, function, stale time, and placeholder data logic.

### `utils/get-query-client.ts`

- Ensures a single `QueryClient` instance is used on the client, and a new one per request on the server.
- Handles SSR/CSR hydration edge cases.

---

## Data Flow

1. **Server**: `page.tsx` prefetches profiles and hydrates the cache.
2. **Client**: `page.client.tsx` uses React Query to access and display the data, with search and pagination.
3. **Components**: Render individual team members and pagination controls.
4. **Utilities**: Centralize data fetching and query configuration.
