import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a more readable format.
 * @param {String} isoDate - The ISO date string to format.
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
