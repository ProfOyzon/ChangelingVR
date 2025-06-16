import Image, { type StaticImageData } from 'next/image';
import promosData from '@/lib/data/promos.json';
import AMothersFear from '@/public/media/press/angela_fear.png';
import DougiesDrawing from '@/public/media/press/dougie_doodle.png';
import TheTouchOfMemory from '@/public/media/press/memory_touch.png';
import type { Promo } from '@/types';

const promos = promosData as Promo[];
const promoImages: Record<string, StaticImageData> = {
  "Dougie's Drawings": DougiesDrawing,
  "A Mother's Fear": AMothersFear,
  'The Touch of Memory': TheTouchOfMemory,
};

export const PromoSection = () => {
  return (
    <div className="bg-light-mustard text-midnight mt-5 p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center">
        <h1 className="mb-2 max-w-lg text-center text-3xl font-bold uppercase md:mb-4 md:text-5xl">
          Discover your characters
        </h1>
        <p className="mb-4 text-base md:mb-6 md:text-lg">Explore and understand the characters</p>

        {/* Promo items */}
        <div className="flex flex-col justify-evenly gap-6 md:flex-row">
          {promos.map((item) => (
            <div key={item.title} className="flex flex-1 flex-col items-center rounded">
              <div className="w-full mask-b-from-50%">
                <Image
                  src={promoImages[item.title]}
                  alt={item.alt}
                  className="h-full max-h-50 w-full rounded object-cover"
                />
              </div>

              <div className="w-full pt-0">
                <h4 className="mb-1 text-xl font-bold md:text-2xl">{item.title}</h4>
                <p className="text-base md:text-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
