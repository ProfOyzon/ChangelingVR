// This page shows the settings for the user's account
// This includes the avatar, username, and delete account
import { Suspense } from 'react';
import { AvatarSection } from '@/app/dashboard/settings/components/avatar';
import { UsernameSection } from '@/app/dashboard/settings/components/username';
import { getFullProfile } from '@/lib/db/queries';

export default function SettingsPage() {
  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <Suspense fallback={<ProfileEditorSkeleton />}>
          <ProfileEditor />
        </Suspense>

        <div className="rounded-md border border-red-500/50 bg-red-900/50">
          <div className="space-y-4 rounded-t-md bg-slate-700 p-6">
            <h1 className="text-2xl font-bold">Delete Account</h1>
            <p className="text-gray-200">
              Permanently remove your Personal Account and all of its contents from ChangelingVR.
              This action is not reversible, so please continue with caution.
            </p>
          </div>

          <div className="flex justify-end px-6 py-4">
            <button className="rounded-sm bg-red-500 px-3 py-1 font-bold text-white">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

async function ProfileEditor() {
  const profile = await getFullProfile();
  if (!profile) return null;

  return (
    <>
      <AvatarSection username={profile.username} avatarUrl={profile.avatarUrl} />
      <UsernameSection username={profile.username} />
    </>
  );
}

function ProfileEditorSkeleton() {
  return (
    <>
      <div className="h-52 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-60.5 w-full animate-pulse rounded-md bg-slate-800" />
    </>
  );
}
