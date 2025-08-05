import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'link';

export interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-light-mustard text-midnight hover:bg-steel hover:text-light-mustard',
  secondary: 'bg-steel text-midnight hover:bg-mardi-grass hover:text-steel',
  link: 'font-normal text-white shadow-none hover:text-light-mustard',
};

const baseStyles = [
  'flex items-center justify-center rounded-md px-4 py-2 font-semibold uppercase shadow-md',
  'transition-[transform,color] duration-150 active:scale-95',
];

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/**
 * Custom Button component for navigation and actions.
 * Uses <a> for external links and Next.js Link for internal links.
 */
export function Button({ href, variant = 'primary', className, children, ...props }: ButtonProps) {
  const classes = cn(...baseStyles, variants[variant] ?? variants.primary, className);

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
