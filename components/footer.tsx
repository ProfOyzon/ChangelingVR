import { cloneElement } from 'react';
import Link from 'next/link';
import { SiX } from '@icons-pack/react-simple-icons';
import { SiYoutube } from '@icons-pack/react-simple-icons';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import { SiInstagram } from '@icons-pack/react-simple-icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: 'x.com/ChangelingVR',
      icon: <SiX />,
      alt: 'X formerly Twitter Logo',
    },
    {
      href: 'www.instagram.com/changelingvr',
      icon: <SiInstagram />,
      alt: 'Instagram Logo',
    },
    {
      href: 'www.youtube.com/@ChangelingVRStudio',
      icon: <SiYoutube />,
      alt: 'YouTube Logo',
    },
    {
      href: 'www.discord.gg/btEUjqazvP',
      icon: <SiDiscord />,
      alt: 'Discord Server Logo',
    },
  ];

  const linkClass = 'hover:text-light-mustard transition-colors duration-300';

  return (
    <footer className="bg-dune px-6 py-12 md:px-12">
      <div className="mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="mb-8 flex-1 space-y-4 md:mb-0">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <img src="/logo.svg" alt="Changeling VR Logo" className="w-50" />
            </Link>

            {/* Description */}
            <p className="text-base leading-relaxed">
              Changeling VR is an experimental narrative mystery game created by artists, designers,
              and developers studying at the Rochester Institute of Technology School of Interactive
              Games and Media and College of Art and Design.
            </p>
          </div>

          <div className="flex flex-1 flex-row gap-8">
            {/* Internal links section */}
            <div className="flex flex-1 flex-col items-center space-y-3">
              <h4 className="text-light-mustard text-lg font-semibold">Explore</h4>
              <ul className="space-y-2 text-center">
                <li>
                  <Link href="/characters" className={linkClass}>
                    Characters
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className={linkClass}>
                    Developers
                  </Link>
                </li>
                <li>
                  <Link href="/newsroom" className={linkClass}>
                    News & Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal section */}
            <div className="flex flex-1 flex-col items-center space-y-3">
              <h4 className="text-light-mustard text-lg font-semibold">Legal</h4>
              <ul className="space-y-2 text-center">
                <li>
                  <Link href="/sitemap.xml" className={linkClass}>
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={linkClass}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={linkClass}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social links section */}
            <div className="flex flex-1 flex-col items-center space-y-4">
              <h4 className="text-light-mustard text-lg font-semibold">Connect</h4>
              <div className="grid grid-cols-2 place-items-center gap-4">
                {socialLinks.map(({ href, icon, alt }) => (
                  <a
                    key={alt}
                    href={`https://${href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={alt}
                  >
                    {icon && cloneElement(icon, { className: linkClass })}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-400 pt-6 text-center text-sm">
          © {currentYear} Changeling VR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
