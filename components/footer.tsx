import type { IconType } from 'react-icons';
import { FaDiscord, FaInstagram, FaItchIo, FaSteam, FaXTwitter, FaYoutube } from 'react-icons/fa6';
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
          <div className="mb-8 flex-1 space-y-4 md:mb-0">
            <Link href="/" className="inline-block" aria-label="Home">
              <img src="/logo.svg" alt="Changeling VR Logo" className="w-50" />
            </Link>

            <p className="text-base leading-relaxed">
              Changeling VR is an experimental narrative mystery game created by artists, designers,
              and developers studying at the Rochester Institute of Technology School of Interactive
              Games and Media and College of Art and Design.
            </p>
          </div>

          <div className="flex flex-1 flex-row gap-8">
            {NAV_SECTIONS.map((section) => (
              <nav key={section.title} className="flex flex-1 flex-col items-center space-y-3">
                <h4 className="text-light-mustard text-lg font-semibold">{section.title}</h4>
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

            <nav className="flex flex-1 flex-col items-center space-y-4">
              <h4 className="text-light-mustard text-lg font-semibold">Connect</h4>
              <div className="grid grid-cols-2 place-items-center gap-4">
                {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-400 pt-6 text-center text-sm">
          © {currentYear} Changeling VR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
