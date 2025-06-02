// https://nextjs.org/docs/app/guides/mdx#using-tailwind-typography-plugin
// https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="bg-gray-900 max-w-7xl p-6 min-h-svh mx-auto prose-invert prose prose-headings:mt-8 prose-headings:font-semibold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg">
    //   {children}
    // </div>
    <>{children}</>
  );
}
