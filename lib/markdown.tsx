'use client';

import Markdown from 'react-markdown';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';

export function ParseMarkdown({ text }: { text: string }) {
  return (
    <Markdown
      rehypePlugins={[remarkGfm]}
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
          <Image
            src={typeof src === 'string' ? src : '/placeholder.png'}
            alt={alt || 'Decorative Image'}
            width={364}
            height={208}
            unoptimized
            className="my-2 h-52 w-auto rounded-md bg-gray-500/50 object-cover"
          />
        ),
      }}
    >
      {text}
    </Markdown>
  );
}
