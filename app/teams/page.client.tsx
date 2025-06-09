'use client';

import { useEffect, useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TeamMemberCard } from './components/member-card';
import { Pagination } from './components/pagination';
import { profileOptions } from './utils/profile-options';

export default function TeamsPageClient() {
  const { data, error, isPending } = useSuspenseQuery(profileOptions);

  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const prevPageRef = useRef<number>(1);
  const pageSize = 20;

  if (error) throw error;

  useEffect(() => {
    if (search === '') {
      // Restore page when search is cleared
      setPage(prevPageRef.current);
    }
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;

    if (value && search === '') {
      // Save current page
      prevPageRef.current = page;
      setPage(1);
    } else if (!value && search !== '') {
      // Restore page with useEffect
    } else if (value) {
      setPage(1);
    }

    setSearch(value);
  };

  const filtered = (data ?? []).filter((profile) => {
    const searchLower = search.toLowerCase();

    return (
      profile.display_name?.toLowerCase().includes(searchLower) ||
      profile.username.toLowerCase().includes(searchLower)
    );
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <>
      <div className="mx-auto mb-6 max-w-md">
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Search for a team member..."
          className="w-full rounded-md border-2 border-gray-300 p-2"
        />
      </div>

      {isPending ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center text-lg font-semibold">No profiles found</div>
      ) : (
        <div className="mb-6 flex flex-wrap justify-center gap-6">
          {paginated.map((profile) => (
            <TeamMemberCard key={profile.username} member={profile} />
          ))}
        </div>
      )}

      {paginated.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </>
  );
}
