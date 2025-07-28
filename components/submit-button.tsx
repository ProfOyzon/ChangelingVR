'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface Props extends ComponentProps<typeof Button> {
  pendingText?: string;
}

export function SubmitButton({ children, pendingText = 'Submitting...', ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin" /> {pendingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
