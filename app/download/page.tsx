import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Now',
  description: 'Download Changeling VR',
};

export default function DownloadPage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a]">
      <span>download here</span>
    </div>
  );
}
