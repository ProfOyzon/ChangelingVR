'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps<'button'> {
  pendingText?: string;
}

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={cn(
        'flex cursor-pointer flex-row items-center gap-2 rounded-md border border-gray-500/50 bg-slate-900 px-3 py-2 text-sm text-white [&_svg]:size-4',
        className,
      )}
      {...props}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" /> {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
