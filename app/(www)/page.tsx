import { CharactersSection } from './_components/characters';
import { FinalCTASection } from './_components/end-cta';
import { HeroSection } from './_components/hero';
import { OverviewSection } from './_components/overview';
import { PromoSection } from './_components/promo-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <OverviewSection />
      <PromoSection />
      <CharactersSection />
      <FinalCTASection />
    </>
  );
}
