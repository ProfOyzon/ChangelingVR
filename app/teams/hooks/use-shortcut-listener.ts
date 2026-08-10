import { useEffect } from 'react';

export function useShortcutListener(inputRef: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K focuses the search input
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // A/LeftArrow to go to the previous page
      if (event.key === 'a' || event.key === 'ArrowLeft') {
        const prevButton = document.querySelector<HTMLButtonElement>('#pagination-prev');
        if (prevButton) {
          event.preventDefault();
          prevButton.click();
        }
      }

      // D/RightArrow to go to the next page
      if (event.key === 'd' || event.key === 'ArrowRight') {
        const nextButton = document.querySelector<HTMLButtonElement>('#pagination-next');
        if (nextButton) {
          event.preventDefault();
          nextButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
