import Image from 'next/image';
import { Button } from '@/components/button';

export function OverviewSection() {
  return (
    <div className="my-6 flex w-full flex-col-reverse justify-center md:my-16 md:flex-row">
      <div className="flex w-full flex-col items-start justify-center max-md:p-6 max-md:pb-0 md:p-16 md:pr-0">
        <h2 className="mb-6 text-3xl font-bold text-white uppercase md:text-5xl">
          Remember who you are, for these memories are not yours.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-gray-300 md:text-lg">
          Changeling VR is a first-person VR mystery where you play as detective Aurelia Walker, a
          private eye with the power to dream-walk — seeing the memories of anyone she touches.
          Explore interconnected levels with unique mechanics, immersive visuals, and rich
          storytelling. Uncover the truth through environmental interaction, puzzle-solving, and
          deep character encounters.
        </p>
        <Button
          href="https://youtu.be/B01VZdgthws"
          aria-label="Watch the Changeling VR trailer on YouTube"
          className="max-md:w-full"
        >
          Watch Trailer
        </Button>
      </div>

      <figure className="w-full px-6 md:mask-l-from-50% md:p-0">
        <Image
          src="/banner-image.png"
          alt="Wide shot of the family home"
          width={800}
          height={240}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover"
        />
      </figure>
    </div>
  );
}
