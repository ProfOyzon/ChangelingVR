'use client';

import { Activity, useState } from 'react';
import type { FullProfile } from '@/lib/db/schema';
import { ParseMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';
import { ProfileMeta } from './profile-meta';

export function ProfileTab({ user }: { user: FullProfile }) {
  const [activeTab, setActiveTab] = useState<'about' | 'contributions'>('about');

  return (
    <>
      <div className="flex flex-row items-center gap-2 border-b border-gray-500/50">
        <div
          className={cn(
            'shrink-0 pb-1',
            activeTab === 'about' ? 'border-b-2 border-white text-white' : 'text-gray-300',
          )}
        >
          <button
            onClick={() => setActiveTab('about')}
            className="cursor-pointer rounded-sm px-2 py-1 hover:bg-zinc-800 hover:text-white"
          >
            About
          </button>
        </div>
        <div
          className={cn(
            'shrink-0 pb-1',
            activeTab === 'contributions' ? 'border-b-2 border-white text-white' : 'text-gray-300',
          )}
        >
          <button
            onClick={() => setActiveTab('contributions')}
            className="cursor-pointer rounded-sm px-2 py-1 hover:bg-zinc-800 hover:text-white"
          >
            Contributions
          </button>
        </div>
      </div>

      <Activity mode={activeTab === 'about' ? 'visible' : 'hidden'}>
        {user.bio ? (
          <div className="text-gray-200">
            <ParseMarkdown text={user.bio} />
          </div>
        ) : (
          <div className="text-gray-200">No bio available</div>
        )}
      </Activity>

      <Activity mode={activeTab === 'contributions' ? 'visible' : 'hidden'}>
        <ProfileMeta user={user} />
      </Activity>
    </>
  );
}
