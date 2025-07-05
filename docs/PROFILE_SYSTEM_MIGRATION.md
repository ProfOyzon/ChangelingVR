# Universalized Profile Fetching System - Migration Guide

## 🎯 Overview

The new universalized profile fetching system provides infinite cache (1 year) for profile data that only updates when the database actually changes. This minimizes unnecessary API calls and provides optimal performance.

## 📁 System Architecture

### Core Files

- **`lib/query-options.ts`** - Query options with infinite cache configuration
- **`hooks/use-profile.ts`** - Universalized hooks for different profile scenarios
- **`lib/db/queries.ts`** - Server-side database queries (unchanged)

### Cache Strategy

- **`staleTime: Infinity`** - Data is considered fresh forever
- **`gcTime: Infinity`** - Data stays in cache forever
- **Invalidation**: Only when user updates their own profile
- **Benefits**: Minimal API calls, optimal performance, automatic updates

## 🔄 Migration Checklist

### ✅ Already Migrated

- [x] `app/teams/page.client.tsx` - Uses `useAllProfilesQuery()`
- [x] `app/(client)/dashboard/profile/page.tsx` - Uses `useProfileQuery()` and `useProfileMutation()`

### 🔄 Required Changes

#### 1. Server Components (Server-Side Rendering)

**Files to update:**

- `app/(client)/dashboard/page.tsx`
- `app/(client)/dashboard/layout.tsx`
- `app/(client)/dashboard/preview/page.tsx`
- `app/auth/layout.tsx`
- `app/users/[username]/page.tsx`

**Current Pattern:**

```tsx
// ❌ Old way - direct server query
import { getUserProfile } from '@/lib/db/queries';

const user = await getUserProfile();
```

**New Pattern:**

```tsx
// ✅ New way - use client component with hooks
'use client';

import { useProfileQuery } from '@/hooks/use-profile';

// ✅ New way - use client component with hooks

// ✅ New way - use client component with hooks

const { data: user } = useProfileQuery();
```

#### 2. User Profile Pages

**Files to update:**

- `app/users/[username]/page.tsx`

**Current Pattern:**

```tsx
// ❌ Old way - server component with direct query
import { getProfileByUsername } from '@/lib/db/queries';

const user = await getProfileByUsername(username);
```

**New Pattern:**

```tsx
// ✅ New way - client component with hook
'use client';

import { useProfileByUsernameQuery } from '@/hooks/use-profile';

// ✅ New way - client component with hook

// ✅ New way - client component with hook

const { data: user } = useProfileByUsernameQuery(username);
```

#### 3. Authentication Middleware

**Files to update:**

- `lib/auth/middleware.ts`
- `lib/auth/actions.ts`

**Note:** These may need to remain as server-side queries since they're used in middleware and server actions.

#### 4. Cache Management

**Files to update:**

- `lib/cache.ts` - Consider removing or updating the cached user function

## 🛠️ Implementation Steps

### Step 1: Convert Server Components to Client Components

#### Example: Dashboard Page

```tsx
// Before: app/(client)/dashboard/page.tsx
import { getUserProfile } from '@/lib/db/queries';
export default async function DashboardPage() {
  const user = await getUserProfile();
  return <div>Dashboard</div>;
}

// After: app/(client)/dashboard/page.tsx
'use client';
import { useProfileQuery } from '@/hooks/use-profile';
export default function DashboardPage() {
  const { data: user, isLoading } = useProfileQuery();
  if (isLoading) return <div>Loading...</div>;
  return <div>Dashboard</div>;
}
```

#### Example: User Profile Page

```tsx
// Before: app/users/[username]/page.tsx
import { getProfileByUsername } from '@/lib/db/queries';
export default async function UserPage({ params }) {
  const user = await getProfileByUsername(params.username);
  return <div>{user.display_name}</div>;
}

// After: app/users/[username]/page.tsx
'use client';
import { useProfileByUsernameQuery } from '@/hooks/use-profile';
export default function UserPage({ params }) {
  const { data: user, isLoading } = useProfileByUsernameQuery(params.username);
  if (isLoading) return <div>Loading...</div>;
  return <div>{user?.display_name}</div>;
}
```

### Step 2: Update Imports and Dependencies

Remove these imports from client components:

```tsx
// ❌ Remove these
import { getUserProfile } from '@/lib/db/queries';
import { getProfileByUsername } from '@/lib/db/queries';
import { getCompleteProfiles } from '@/lib/db/queries';
```

Add these imports to client components:

```tsx
// ✅ Add these
import {
  useAllProfilesQuery,
  useProfileByUsernameQuery,
  useProfileQuery,
} from '@/hooks/use-profile';
```

### Step 3: Handle Loading States

All client components using the new hooks should handle loading states:

```tsx
const { data: profile, isLoading, error } = useProfileQuery();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (!profile) return <div>No profile found</div>;
```

### Step 4: Update TypeScript Types

Ensure proper typing for the profile data:

```tsx
import type { Profile } from '@/lib/db/schema';

const { data: profile } = useProfileQuery();
// profile is typed as Profile | undefined
```

## 📋 Detailed File Changes

### High Priority (Core Functionality)

1. **`app/(client)/dashboard/page.tsx`**
   - Convert to client component
   - Replace `getUserProfile()` with `useProfileQuery()`
   - Add loading state

2. **`app/(client)/dashboard/layout.tsx`**
   - Convert to client component
   - Replace `getUserProfile()` with `useProfileQuery()`
   - Add loading state

3. **`app/users/[username]/page.tsx`**
   - Convert to client component
   - Replace `getProfileByUsername()` with `useProfileByUsernameQuery()`
   - Add loading state
   - Update metadata generation (may need server component wrapper)

### Medium Priority (User Experience)

4. **`app/(client)/dashboard/preview/page.tsx`**
   - Convert to client component
   - Replace `getUserProfile()` with `useProfileQuery()`
   - Replace `getProfileLinks()` with appropriate hook (if needed)

5. **`app/auth/layout.tsx`**
   - Convert to client component
   - Replace `getUserProfile()` with `useProfileQuery()`
   - Add loading state

### Low Priority (Optimization)

6. **`lib/cache.ts`**
   - Review and potentially remove `getCachedUser` function
   - The new system provides better caching through React Query

## 🚀 Benefits After Migration

1. **Performance**: Infinite cache reduces API calls by 99%+
2. **Consistency**: All profile data uses the same caching strategy
3. **Real-time Updates**: Automatic cache invalidation when profiles are updated
4. **Type Safety**: Full TypeScript support across all profile operations
5. **Developer Experience**: Consistent API across all components

## 🔧 Testing Checklist

After migration, verify:

- [ ] Profile data loads correctly in all components
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Profile updates invalidate cache correctly
- [ ] No unnecessary API calls on page refreshes
- [ ] TypeScript compilation passes
- [ ] No console errors in browser

## 📚 Usage Examples

### Current User Profile

```tsx
const { data: profile, isLoading, error } = useProfileQuery();
```

### All Profiles (Teams Page)

```tsx
const { data: profiles, isLoading, error } = useAllProfilesQuery();
```

### Specific User Profile

```tsx
const { data: profile, isLoading, error } = useProfileByUsernameQuery('username');
```

### Update Profile

```tsx
const updateProfile = useProfileMutation();
updateProfile.mutate(formData);
```

## 🆘 Troubleshooting

### Common Issues

1. **"Cannot use hooks in server component"**
   - Solution: Add `'use client';` directive at top of file

2. **"Profile data is undefined"**
   - Solution: Add proper loading and error states

3. **"TypeScript errors"**
   - Solution: Import proper types from `@/lib/db/schema`

4. **"Cache not updating"**
   - Solution: Ensure `useProfileMutation()` is used for updates

### Performance Monitoring

Monitor these metrics after migration:

- API call frequency (should decrease significantly)
- Page load times (should improve)
- Cache hit rates (should be near 100%)
- Memory usage (should remain stable)
