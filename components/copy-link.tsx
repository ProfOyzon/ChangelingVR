'use client';

import { useState } from 'react';
import { FaCheck, FaRegShareFromSquare } from 'react-icons/fa6';

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
      {isCopied ? <FaCheck className="size-4" /> : <FaRegShareFromSquare className="size-4" />}
    </button>
  );
}
