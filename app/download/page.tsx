import { FaItchIo, FaLaptop, FaSteam } from 'react-icons/fa6';
import type { Metadata } from 'next';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import EsrbTeen from '@/public/esrb-teen.svg';

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
        'flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-lg backdrop-blur-sm transition-colors hover:bg-white/20',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export const metadata: Metadata = {
  title: 'Play Now',
  description: 'Download Changeling VR',
};

export default function DownloadPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-end justify-center overflow-hidden bg-[url('/background/living_room_far.jpg')] bg-cover bg-center p-12 brightness-90">
      <div className="flex flex-col gap-4">
        <p className="text-center text-2xl font-bold">Enter the dreamscape - Download Now!</p>
        <div className="flex items-center justify-center gap-6 md:hidden">
          <Button href="https://xkdlj9yxxa926ujy.public.blob.vercel-storage.com/downloads/spring-2025.zip">
            <FaLaptop />
            PC Download
          </Button>
        </div>

        <div className="flex items-center gap-6 max-md:hidden">
          <Image src={EsrbTeen} alt="ESRB Teen Rating" className="h-18 w-auto" />
          <Button href="https://xkdlj9yxxa926ujy.public.blob.vercel-storage.com/downloads/spring-2025.zip">
            <FaLaptop />
            PC Download
          </Button>
          <Button
            href="https://changelingvrteam.itch.io/changelingvr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaItchIo />
            Itch.io
          </Button>
          <Button
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-not-allowed opacity-50"
          >
            <FaSteam />
            Steam
          </Button>
        </div>
      </div>
    </div>
  );
}
