import Image from 'next/image';
import { Button } from '@/components/button';
import Aurelia from '@/public/aurelia.png';

export function FinalCTASection() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-row items-center justify-center gap-2 px-6 pt-12">
      <figure>
        <Image src={Aurelia} alt="Aurelia character portrait" className="h-80 w-auto" />
      </figure>

      <div className="flex max-w-lg flex-1 flex-col items-start space-y-4">
        <h2 className="text-2xl font-semibold md:text-4xl">Step Into the Mystery</h2>

        <p className="text-sm text-gray-300 md:text-base">
          Ready to uncover secrets and explore the unknown? Play ChangelingVR now and begin your
          journey as Aurelia Walker.
        </p>

        <Button href="/download" className="w-full">
          Play Now
        </Button>
      </div>
    </section>
  );
}
