import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import charactersData from '@/lib/data/characters.json';

export async function generateMetadata(): Promise<Metadata> {
  const character = charactersData.find((c) => c.id === 'douglas');
  if (!character) return notFound();

  return {
    title: character.name,
    description: character.bio,
    openGraph: {
      title: character.name,
      description: character.bio,
    },
    twitter: {
      card: 'summary',
      title: character.name,
      description: character.bio,
    },
  };
}

export default function Douglas() {
  return (
    <>
      <div id="app"></div>
      {/* <div id = "credits">
			<ul>
				<li>Erase Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=73587">Pixabay</a></li>
				<li>Jump Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=80241">Pixabay</a></li>
				<li>Running Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6752">Pixabay</a></li>
				<li>Button Sound Effect from <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140881">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140881">Pixabay</a></li>
				<li>Landing Sound Effect from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6982">Pixabay</a></li>
				<li>Paintbrush Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=107494">Pixabay</a></li>
			</ul>
		</div>  */}
      <div id="wrapper"></div>

      <Script type="module" src="/scripts/douglas/index.js" strategy="afterInteractive" />
    </>
  );
}
