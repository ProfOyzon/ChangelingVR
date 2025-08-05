import type { IconType } from 'react-icons';
import { FaDiscord, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

type SocialLink = {
  href: string;
  icon: IconType;
  label: string;
};

type NavSection = {
  title: string;
  links: {
    href: string;
    label: string;
    prefetch?: boolean;
  }[];
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://x.com/ChangelingVR',
    icon: FaXTwitter,
    label: 'Follow us on X (formerly Twitter)',
  },
  {
    href: 'https://www.instagram.com/changelingvr',
    icon: FaInstagram,
    label: 'Follow us on Instagram',
  },
  {
    href: 'https://www.youtube.com/@ChangelingVRStudio',
    icon: FaYoutube,
    label: 'Subscribe to our YouTube channel',
  },
  {
    href: 'https://www.discord.gg/btEUjqazvP',
    icon: FaDiscord,
    label: 'Join our Discord server',
  },
];

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Explore',
    links: [
      { href: '/characters', label: 'Characters' },
      { href: '/teams', label: 'Developers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service', prefetch: false },
      { href: '/privacy', label: 'Privacy Policy', prefetch: false },
    ],
  },
];

const linkClass = 'hover:text-light-mustard transition-colors duration-300';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dune px-6 py-12 md:px-12" role="contentinfo">
      <div className="mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          <section className="mb-8 flex-1 space-y-4 md:mb-0">
            <Link href="/" className="inline-block" aria-label="Home">
              <Image src="/logo-with-name.svg" alt="Changeling VR Logo" width={200} height={200} />
            </Link>

            <p className="text-base leading-relaxed">
              Changeling VR is an experimental narrative mystery game created by artists, designers,
              and developers studying at the Rochester Institute of Technology School of Interactive
              Games and Media and College of Art and Design.
            </p>
          </section>

          <div className="flex flex-1 flex-row gap-8">
            {NAV_SECTIONS.map((section) => (
              <nav
                key={section.title}
                className="flex flex-1 flex-col items-center space-y-3"
                aria-labelledby={`nav-${section.title.toLowerCase()}`}
              >
                <h2
                  id={`nav-${section.title.toLowerCase()}`}
                  className="text-light-mustard text-lg font-semibold"
                >
                  {section.title}
                </h2>
                <ul className="space-y-2 text-center">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass} prefetch={link.prefetch}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <nav
              className="flex flex-1 flex-col items-center space-y-4"
              aria-labelledby="nav-connect"
            >
              <h2 id="nav-connect" className="text-light-mustard text-lg font-semibold">
                Connect
              </h2>
              <ul className="grid grid-cols-2 place-items-center gap-4">
                {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <section className="border-t border-gray-400 pt-6 text-center text-sm">
          <p>&copy; {currentYear} Changeling VR. All rights reserved.</p>
        </section>
      </div>
    </footer>
  );
}
