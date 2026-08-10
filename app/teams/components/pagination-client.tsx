'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '../scripts/generate-pagination';
import { PaginationArrow, PaginationNumber } from './pagination';

export function PaginationClient({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);

    // If the page is 1, delete the page parameter
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);
  if (allPages.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex items-center gap-1 -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(Number(page))}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}
