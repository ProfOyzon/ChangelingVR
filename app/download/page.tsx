import {
  FaDesktop,
  FaHardDrive,
  FaItchIo,
  FaMemory,
  FaMicrochip,
  FaSteam,
  FaVideo,
  FaVrCardboard,
} from 'react-icons/fa6';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';

function Button({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-xl backdrop-blur-sm transition-colors hover:bg-white/20',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function SpecItem({ icon: Icon, title, spec }: { icon: any; title: string; spec: string }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-md bg-white/5 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Icon className="text-light-mustard size-4" />
        <p className="text-xs font-medium text-gray-300">{title}</p>
      </div>
      <p className="text-left text-xs text-gray-400">{spec}</p>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Play Now',
  description: 'Download Changeling VR - A VR Narrative Mystery',
};

export default function DownloadPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl items-center justify-center p-6">
      <div className="flex flex-col items-center gap-12 text-center">
        <div>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Download{' '}
            <span className="to-light-mustard bg-radial from-[#ffdd99] bg-clip-text text-transparent">
              Changeling VR
            </span>{' '}
            Now
          </h1>
          <p className="max-w-2xl text-lg text-gray-300">
            Step into the unknown as detective Aurelia Walker. Touch the memories of others, walk
            through their dreams, and uncover the truth that lies hidden in the shadows.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            href="https://changelingvrteam.itch.io/changelingvr"
            className="border border-white/20 bg-[#fa5c5c] hover:bg-[#e54d4d]"
          >
            <FaItchIo />
            Download on Itch.io
          </Button>
          <Button
            href="https://store.steampowered.com/app/3182270/Changeling_VR/"
            className="border border-white/20 bg-linear-to-b from-[#171a21] via-[#1b2838] to-[#2a475e] opacity-50"
          >
            <FaSteam />
            Download on Steam
          </Button>
        </div>

        {/* Divider */}
        <div className="h-px w-32 bg-white/20" aria-hidden />

        <div className="w-full max-w-2xl">
          <h2 className="mb-6 text-xl font-bold">System Requirements</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="border-light-mustard/60 shadow-light-mustard/20 rounded-md border bg-white/5 shadow-md">
              <SpecItem icon={FaVrCardboard} title="VR Headset" spec="Meta Quest 2 or higher" />
            </div>
            <SpecItem icon={FaDesktop} title="OS" spec="Windows 10" />
            <SpecItem icon={FaMemory} title="Memory" spec="2 GB RAM minimum" />
            <SpecItem icon={FaHardDrive} title="Storage" spec="10 GB available space" />
            <SpecItem icon={FaVideo} title="Graphics" spec="NVIDIA GTX 970 or better" />
            <SpecItem
              icon={FaMicrochip}
              title="Processor"
              spec="Intel Core i5-4590 / AMD Ryzen 5 1500X"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
