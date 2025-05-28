import { redirect } from 'next/navigation';

/**
 * Redirect to a given path with a given message
 */
export function encodedRedirect(type: 'error' | 'success', path: string, message: string): never {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
