import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringifyMarkdown(text: string) {
  const strippedText = text
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n\n+/g, '\n\n')
    .trim();

  return strippedText;
}
