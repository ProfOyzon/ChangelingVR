'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';
import { Button } from './button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex items-center gap-2.5 md:hidden">
      <button
        className="relative inline-grid size-9 place-items-center rounded px-2"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="bg-dune absolute top-16 right-0 z-100 w-screen p-4 shadow-md">
          <div className="flex flex-col gap-2">
            <Button
              href="/characters"
              aria-label="View the characters"
              variant="link"
              className="hover:hover:bg-midnight/40 justify-start"
              onClick={closeMenu}
            >
              Characters
            </Button>
            <Button
              href="/newsroom"
              aria-label="View the latest news"
              variant="link"
              className="hover:hover:bg-midnight/40 justify-start"
              onClick={closeMenu}
            >
              News
            </Button>
            <Button
              href="/teams"
              aria-label="View the Changeling VR team"
              variant="link"
              className="hover:hover:bg-midnight/40 justify-start"
              onClick={closeMenu}
            >
              Team
            </Button>
            <Button
              href="https://changelingvrteam.itch.io/changelingvr"
              aria-label="Play Changeling VR on itch.io"
              className="justify-start"
              onClick={closeMenu}
            >
              Play Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
