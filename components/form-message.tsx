import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export const FormMessage = ({
  type,
  message,
}: {
  type: 'warning' | 'error' | 'success';
  message: string;
}) => {
  return (
    <span
      className={cn(
        'text-xs',
        type === 'error'
          ? 'text-red-500'
          : type === 'success'
            ? 'text-green-500'
            : 'text-yellow-500',
      )}
    >
      {message.split(';').map((msg, idx) => (
        <Fragment key={idx}>
          {msg.trim()}
          {idx < message.split(';').length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
};
