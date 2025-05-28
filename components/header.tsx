import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { MobileMenu } from './mobile-menu';

export function Header() {
  return (
    <header className="bg-dune fixed inset-x-0 top-0 z-100 uppercase shadow-md">
      <nav
        className="flex h-16 items-center justify-between gap-4 px-4"
        aria-label="Main Navigation"
      >
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Changeling logo"
            width={200}
            height={40}
            sizes="200px"
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Layout */}
        <div className="flex items-center gap-6 max-md:hidden">
          <div className="group relative">
            <Button href="/characters" aria-label="View the characters" variant="link">
              Characters
            </Button>

            <div className="absolute left-1/2 hidden w-[300px] -translate-x-1/2 pt-4 group-hover:block">
              <div className="translate-x-1/2">
                <div className="border-b-dune/80 h-0 w-0 border-x-6 border-b-6 border-x-transparent"></div>
              </div>

              <div className="bg-dune/80 [&>a]:hover:bg-midnight/40 [&>a]:hover:text-light-mustard flex flex-col gap-1 rounded p-2 shadow-md backdrop-blur-sm [&>a]:block [&>a]:rounded [&>a]:px-3 [&>a]:py-2 [&>a]:text-center">
                <Button href="/characters#aurelia" variant="link">
                  Aurelia Walker
                </Button>
                <Button href="/characters#angela" variant="link">
                  Angela Summers
                </Button>
                <Button href="/characters#dylan" variant="link">
                  Dylan Monelo
                </Button>
                <Button href="/characters#douglas" variant="link">
                  Douglas Summers-Monelo
                </Button>
                <Button href="/characters#kirsten" variant="link">
                  Kirsten Summers-Monelo
                </Button>
                <Button href="/characters#tobi" variant="link">
                  Tobi Summers-Monelo
                </Button>
              </div>
            </div>
          </div>

          <Button href="/newsroom" aria-label="View the latest news" variant="link">
            News
          </Button>

          <Button href="/teams" aria-label="View the Changeling VR team" variant="link">
            Team
          </Button>

          <Button
            href="https://changelingvrteam.itch.io/changelingvr"
            aria-label="Play Changeling VR on itch.io"
          >
            Play Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <MobileMenu />
      </nav>
    </header>
  );
}
