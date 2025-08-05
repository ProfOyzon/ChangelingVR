import Image from 'next/image';
import { Button } from '@/app/_components/button';
import Aurelia from '@/public/aurelia.png';

export function FinalCTASection() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-row items-center justify-center gap-2 px-6">
      <figure className="pt-8">
        <Image src={Aurelia} alt="Aurelia character portrait" className="h-80 w-auto" />
      </figure>

      <div className="flex max-w-lg flex-1 flex-col items-start py-4">
        <h2 className="mb-2 text-2xl font-semibold md:text-4xl">Step Into the Mystery</h2>

        <p className="mb-4 text-sm text-gray-300 md:text-base">
          Ready to uncover secrets and explore the unknown? Play Changeling VR now and begin your
          journey as Aurelia Walker.
        </p>

        <Button href="/download" className="w-full">
          Play Now
        </Button>
      </div>
    </section>
  );
}
