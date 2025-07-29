import { Fragment } from 'react';
import { CharactersSection } from '@/app/_components/www/characters';
import { FinalCTASection } from '@/app/_components/www/end-cta';
import { HeroSection } from '@/app/_components/www/hero';
import { MarqueeComponent } from '@/app/_components/www/marquee';
import { OverviewSection } from '@/app/_components/www/overview';
import { PromoSection } from '@/app/_components/www/promo-section';

export default function Home() {
  return (
    <Fragment>
      <HeroSection />
      <OverviewSection />
      <MarqueeComponent />
      <PromoSection />
      <CharactersSection />
      <FinalCTASection />
    </Fragment>
  );
}
