import { BackButton } from '@/components/back-button';

export function generateMetadata() {
  return {
    title: '404 - Not Found',
    description: 'The page you are looking for is restricted or unavailable.',
    robots: 'noindex',
  };
}

export default function NotFound() {
  return (
    <div className="to-midnight text-light-mustard flex min-h-screen w-full flex-row items-center justify-center bg-gradient-to-b from-black px-6">
      <section className="max-w-md">
        <h1 className="mb-4 text-center text-6xl font-bold tracking-tight">404</h1>

        <p className="mb-6 text-center text-lg text-zinc-300">
          The page you&apos;re looking for doesn&apos;t exist or is restricted.
        </p>

        <div className="flex items-center justify-center">
          <BackButton />
        </div>
      </section>
    </div>
  );
}
