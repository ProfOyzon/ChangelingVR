'use client';

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export function ParseMarkdown({ text }: { text: string }) {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw, remarkGfm]}
      components={{
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        del: ({ children }) => <del className="line-through">{children}</del>,
        u: ({ children }) => <u className="underline">{children}</u>,
        p: ({ children }) => <p className="mb-0.5 whitespace-pre-wrap">{children}</p>,
        h1: ({ children }) => <h1 className="mb-2 text-2xl font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-1.5 text-xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-1 text-lg font-bold">{children}</h3>,
        li: ({ children }) => <li className="flex items-center gap-1">{children}</li>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            className="text-blue-400 hover:text-blue-500 hover:underline"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="my-2 h-52 w-full rounded-md bg-gray-500/50 object-cover"
          />
        ),
      }}
    >
      {text}
    </Markdown>
  );
}

export function StringifyMarkdown({ text }: { text: string }) {
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
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
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

  return <>{strippedText}</>;
}
