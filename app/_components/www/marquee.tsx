import Image from 'next/image';
import { Marquee } from '@/components/magicui/marquee';

const creatureImages = [
  'Creature_Art_Aoyin',
  'Creature_Art_Aswang',
  'Creature_Art_Chupacabra',
  'Creature_Art_Flying_Brains',
  'Creature_Art_Hallowed_Stag',
  'Creature_Art_Oni',
  'Creature_Art_Sasquatch',
];

const doodleImages = [
  'doodles1_T',
  'doodles2_T',
  'doodles3_T',
  'doodles4_T',
  'doodles5_T',
  'doodles6_T',
];

const presskitImages = [
  'PressKitScreenshot_01',
  'PressKitScreenshot_02',
  'PressKitScreenshot_03',
  'PressKitScreenshot_04',
  'PressKitScreenshot_05',
  'PressKitScreenshot_06',
];

export function MarqueeComponent() {
  return (
    <section className="mb-6 space-y-4" aria-label="Game artwork showcase">
      <Marquee>
        {creatureImages.map((img) => (
          <figure key={img} className="mx-4">
            <Image
              src={`/media/creatures/${img}.png`}
              alt={`Creature artwork: ${img}`}
              width={100}
              height={100}
              className="h-32 w-auto object-contain"
            />
          </figure>
        ))}
      </Marquee>

      <Marquee reverse={true}>
        {doodleImages.map((img) => (
          <figure key={img} className="mx-4 bg-white">
            <Image
              src={`/media/doodles/${img}.png`}
              alt={`Doodle artwork: ${img}`}
              width={100}
              height={100}
              className="h-32 w-auto object-contain"
            />
          </figure>
        ))}
      </Marquee>

      <Marquee>
        {presskitImages.map((img) => (
          <figure key={img} className="mx-4">
            <Image
              src={`/media/press/${img}.jpg`}
              alt={`Game screenshot: ${img}`}
              width={100}
              height={100}
              className="h-32 w-auto object-contain"
            />
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
