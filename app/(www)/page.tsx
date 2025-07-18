import { Fragment } from 'react';
import { CharactersSection } from '@/app/_components/characters';
import { FinalCTASection } from '@/app/_components/end-cta';
import { HeroSection } from '@/app/_components/hero';
import { OverviewSection } from '@/app/_components/overview';
import { PromoSection } from '@/app/_components/promo-section';

export default function Home() {
  return (
    <Fragment>
      <HeroSection />
      <OverviewSection />
      <PromoSection />
      <CharactersSection />
      <FinalCTASection />
    </Fragment>
  );
}
