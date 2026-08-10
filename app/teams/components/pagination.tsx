import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = cn('flex size-8 items-center justify-center text-sm', {
    'underline underline-offset-2 text-light-mustard': isActive,
    'hover:text-light-mustard hover:underline hover:underline-offset-2':
      !isActive && position !== 'middle',
    'pointer-events-none opacity-75': position === 'middle',
  });

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

export function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = cn('flex h-10 w-10 items-center justify-center', {
    'pointer-events-none opacity-50': isDisabled,
    'hover:text-light-mustard': !isDisabled,
  });

  const icon =
    direction === 'left' ? <FaArrowLeft className="w-4" /> : <FaArrowRight className="w-4" />;

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link
      id={direction === 'left' ? 'pagination-prev' : 'pagination-next'}
      href={href}
      className={className}
    >
      {icon}
    </Link>
  );
}
