import { Fragment } from 'react';
import { cn } from '../lib/utils';

export const FormMessage = ({ type, message }: { type: 'error' | 'success'; message: string }) => {
  return (
    <p className={cn('text-xs', type === 'error' ? 'text-red-500' : 'text-green-500')}>
      {message.split(';').map((msg, idx) => (
        <Fragment key={idx}>
          {msg.trim()}
          <br />
        </Fragment>
      ))}
    </p>
  );
};
