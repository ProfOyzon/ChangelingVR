'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export function CopyLink({ url, className }: { url: string; className?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <button type="button" onClick={handleCopy} aria-label="Copy link" className={className}>
      {isCopied ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </button>
  );
}
