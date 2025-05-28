import type { BaseContent, Identifiable } from './common';

export interface Character extends BaseContent, Identifiable {
  age: string;
  height: string;
  nationality: string;
  personality: string;
  hobbies: string;
  icon_url: string;
  props?: string[];
}

export interface CharacterItemProps {
  character: Character;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}
