'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Character } from '../types';

export function useCharacterRotation(characters: Character[], interval = 5000) {
  const [selectedCharacter, setSelectedCharacterState] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to clear and restart the timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSelectedCharacterState((prev) => (prev + 1) % characters.length);
    }, interval);
  }, [characters.length, interval]);

  // Set up the timer on mount and when characters/interval changes
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // When user selects a character, reset the timer
  const setSelectedCharacter = useCallback(
    (index: number) => {
      setSelectedCharacterState(index);
      resetTimer();
    },
    [resetTimer],
  );

  return { selectedCharacter, setSelectedCharacter };
}
