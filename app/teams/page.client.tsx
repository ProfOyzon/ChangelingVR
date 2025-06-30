'use client';

import { useEffect, useRef, useState } from 'react';
import { FaGithub, FaGlobe, FaLinkedin, FaRegEnvelope } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/pagination';
import { profileOptions } from '@/lib/query-options';
import { useSuspenseQuery } from '@tanstack/react-query';

const LinkIcon = {
  email: <FaRegEnvelope className="size-4" />,
  website: <FaGlobe className="size-4" />,
  github: <FaGithub className="size-4" />,
  linkedin: <FaLinkedin className="size-4" />,
};

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
            <div
              key={profile.username}
              className="bg-steel/50 hover:bg-steel/75 relative flex h-64 w-40 max-w-40 min-w-40 flex-1 flex-col rounded-md backdrop-blur-sm transition-colors duration-300"
            >
              <Link
                href={`/users/${profile.username}`}
                className="flex h-full cursor-pointer flex-col"
              >
                <Image
                  src={profile.avatar_url || '/placeholder.png'}
                  alt={profile.username}
                  width={128}
                  height={128}
                  className="w-full rounded-t-lg mask-b-from-50% object-cover"
                  loading="lazy"
                />

                <div className="w-full space-y-1 p-2">
                  <span className="line-clamp-1 text-lg font-bold">
                    {profile.display_name || `@${profile.username}`}
                  </span>
                  <span className="line-clamp-3 text-xs text-gray-300">
                    {profile.bio || 'No bio available'}
                  </span>
                </div>
              </Link>

              <div className="[&>a]:hover:text-light-mustard absolute top-2 right-2 z-10 flex flex-col items-center gap-1 [&>a]:rounded-md [&>a]:bg-gray-800/80 [&>a]:p-1 [&>a]:text-white">
                {profile.links.map((link) => {
                  const icon = LinkIcon[link.platform as keyof typeof LinkIcon];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {paginated.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </>
  );
}
