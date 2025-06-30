'use client';

import { useEffect, useRef, useState } from 'react';
import { FaBars, FaX } from 'react-icons/fa6';
import { Button } from './button';
import type { NavItem } from './header';

type MobileMenuProps = {
  items: NavItem[];
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center gap-2.5 md:hidden" ref={menuRef}>
      <button
        className="relative inline-grid size-9 place-items-center rounded-md px-2"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaX /> : <FaBars />}
      </button>

      {isOpen && (
        <div
          id="mobile-menu"
          className="bg-dune absolute top-16 right-0 z-100 w-screen p-4 shadow-md"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col gap-2">
            <Button
              href="/characters"
              variant="link"
              aria-label="View the characters"
              className="justify-start"
              onClick={closeMenu}
            >
              Characters
            </Button>

            {items.map(({ href, label, ariaLabel, variant }) => (
              <Button
                key={href}
                href={href}
                variant={variant}
                aria-label={ariaLabel}
                className="justify-start"
                onClick={closeMenu}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
