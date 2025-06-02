'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Show up to 5 pages, centered on the current page
  const getPages = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center">
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            className="px-2.5 sm:pl-2.5 flex flex-row items-center hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous"
            type="button"
          >
            <FaChevronLeft />
            <span className="hidden sm:block">Previous</span>
          </button>
        </li>

        {pages.map((p) => (
          <li key={p}>
            <button
              className={cn(
                'px-2 py-1',
                p === page ? 'underline font-semibold' : 'hover:underline',
              )}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              type="button"
            >
              {p}
            </button>
          </li>
        ))}

        <li>
          <button
            className="flex flex-row items-center hover:underline disabled:opacity-50 disabled:cursor-not-allowed px-2.5 sm:pr-2.5"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next"
            type="button"
          >
            <span className="hidden sm:block">Next</span>
            <FaChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
