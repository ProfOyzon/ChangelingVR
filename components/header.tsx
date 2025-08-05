import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import type { ButtonVariant } from './button';
import { MobileMenu } from './mobile-menu';

export type NavItem = {
  href: string;
  label: string;
  ariaLabel?: string;
  variant?: ButtonVariant;
};

type CharacterLink = {
  href: string;
  label: string;
  id: string;
};

const CHARACTER_LINKS: CharacterLink[] = [
  { href: '/characters#aurelia', label: 'Aurelia Walker', id: 'aurelia' },
  { href: '/characters#angela', label: 'Angela Summers', id: 'angela' },
  { href: '/characters#dylan', label: 'Dylan Monelo', id: 'dylan' },
  { href: '/characters#douglas', label: 'Douglas Summers-Monelo', id: 'douglas' },
  { href: '/characters#kirsten', label: 'Kirsten Summers-Monelo', id: 'kirsten' },
  { href: '/characters#tobi', label: 'Tobi Summers-Monelo', id: 'tobi' },
];

const NAV_ITEMS: NavItem[] = [
  {
    href: '/teams',
    label: 'Team',
    ariaLabel: 'View the Changeling VR team',
    variant: 'link',
  },
  {
    href: '/download',
    label: 'Play Now',
    ariaLabel: 'Download Changeling VR',
  },
];

export function Header() {
  return (
    <header className="bg-dune fixed inset-x-0 top-0 z-100 uppercase shadow-md">
      <nav
        className="flex h-16 items-center justify-between gap-4 px-4"
        aria-label="Main Navigation"
      >
        <Link href="/" aria-label="Home">
          <Image
            src="/logo-with-name.svg"
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

            <div
              className="absolute left-1/2 hidden w-[300px] -translate-x-1/2 pt-4 group-hover:block"
              role="menu"
              aria-label="Character selection"
            >
              <div className="translate-x-1/2">
                <div className="border-b-dune/80 h-0 w-0 border-x-6 border-b-6 border-x-transparent"></div>
              </div>

              <div className="bg-dune/80 [&>a]:hover:bg-midnight/40 [&>a]:hover:text-light-mustard flex flex-col gap-1 rounded-md p-2 shadow-md backdrop-blur-sm [&>a]:block [&>a]:rounded-md [&>a]:px-3 [&>a]:py-2 [&>a]:text-center">
                {CHARACTER_LINKS.map(({ href, label, id }) => (
                  <Button
                    key={id}
                    href={href}
                    variant="link"
                    aria-label={`View ${label}'s profile`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {NAV_ITEMS.map(({ href, label, ariaLabel, variant }) => (
            <Button key={href} href={href} variant={variant} aria-label={ariaLabel}>
              {label}
            </Button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <MobileMenu items={NAV_ITEMS} />
      </nav>
    </header>
  );
}
