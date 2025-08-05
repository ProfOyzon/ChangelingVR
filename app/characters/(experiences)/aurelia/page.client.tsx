'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type CaseFile = {
  title: string;
  name: string;
  status: 'Ongoing' | 'Resolved' | 'Pending';
  image: string;
  background: string;
  summary: string;
  result: string;
};

const caseFileData: CaseFile[] = [
  {
    title: 'Case No. 1',
    name: 'A Standard Boogeyman',
    status: 'Resolved',
    image: '/media/experiences/aurelia/polaroid_flat1.png',
    background:
      "A police investigation hit a dead end in a case of repeated break-ins with no signs of entry. The break-ins occurred in the home of a family of three, and the perpetrator always entered the child's room. After several unsuccessful attempts to catch the perpetrator, the parents contacted me, believing the break-ins to be the work of a magical creature. I was brought in to identify the creature and find a method to capture or repel it.",
    summary:
      "When I arrived at the home, I questioned the family to find any details on the creature. Only the child provided useful information, as they were the only one to see it. They described it as a boogeyman, a generic term for creatures that seek out sleeping children for various purposes. They told me it was a tall, dark, human-shaped figure, but it did not appear to do anything, just watching them as they slept.\n\nAt this point I knew vaguely what it looked like, and that it was intelligent enough to hide when other humans were approaching. My abilities could give me a clearer picture of the creature, but I would need to be in the room when it appears, which is impossible. This was not enough to determine a specific creature, so over the next three weeks I gathered more information.\n\nEventually, I had a breakthrough when I noticed the child was becoming more lethargic, and had lower emotional responses. While those symptoms could be explained by sleep disruptions, I believed they were the creature's doing. This would make it an emotional feeder, similar to the Baku (a creature that devours dreams). This feeding behavior means the child is not in imminent danger, but harm could come to them if the creature is not removed.",
    result:
      'The case was handed off to an expert in expelling creatures that have become attached to homes. Full resolution of the case is pending, but my investigation was successful.',
  },
  {
    title: 'Case No. 2',
    name: 'The Neuro-Carnivorous Plant',
    status: 'Resolved',
    image: '/media/experiences/aurelia/polaroid_flat2.png',
    background:
      'I was contacted by a nursery owner who was suffering from intense nightmares. After a few of his employees started noticing the same effects, he suspected magical interference. I was hired to find and put an end to the source of the nightmares.',
    summary:
      'Upon arrival, I asked the affected employees about the nature of the nightmares, and how long they had been experiencing them. As stated on the phone call, all of the employees started experiencing nightmares after the owner. This could suggest that he was the vector for some kind of "dream virus", or that he was some kind of impostor that induces nightmares.\n\nMy next step was to enter someone\'s nightmare and see if I can discover the source from within. I couldn\'t entirely trust the owner, so I asked one of the employees if they could fall asleep. Upon entering their dream, I found myself inside of a small, dark room. It could have been a closet, but it was completely empty. It was also completely silent, no sounds of birds, cars or even wind.\n\nRegular nightmares have action, something actively affecting the person who is experiencing them. Something seemed to be draining the experience out of the nightmare—perhaps it was not even a nightmare to begin with. After I got out from the closet space, before me was an otherwise normal apartment, save for the lush overgrowth that had taken over the building.\n\nNot far from the closet space I found the dreaming employee. She seemed to be trapped by vines, with parts of it seemingly fused to her. I tried to reassure her, but quickly moved on to investigate the building. I noticed that all the vegetation was growing from below the building, so I followed it down into the basement. There was a single massive vine breaking through the floor, extending up from a void below. Without any other leads, I followed the vine down to its source, spending hours walking down flights of stairs—dreams tend to warp perceptions of time.\n\nEventually I reached a nursery, floating in the void. I believed this to be some kind of nexus, as there were more branches extending out into the void. The branches all converged on a bag of soil, wildly bursting out of it. I attempted various methods of destroying the branches, but they appeared to be impervious to damage. My efforts did have an effect however, waking up the employee and expelling me from the dream with her.',
    result:
      "After my experience in the dream, we decided to check the storage room. Inside one of the soil bags we found a fully grown and healthy root system, with no leaves or stems. After removing and killing it, the worker's dreams returned to normal. It seems this plant is some kind of mind parasite—sucking up experiences to feed itself. I have no idea where the plant came from, or how many more exist.",
  },
  {
    title: 'Case No. 3',
    name: 'The Shape Shifter',
    status: 'Resolved',
    image: '/media/experiences/aurelia/polaroid_flat3.png',
    background:
      'I was hired by a pharmaceutical company intern to investigate a strange occurrence at their lab. Security cameras recorded a newly hired intern entering the facility after-hours. When questioned about why they entered, the intern claimed they did not, and no logs in the computer system show them entering the facility. The intern believes some kind of shapeshifter is framing her to prevent anyone from discovering it.',
    summary:
      "When we first met, I first made sure she knew exactly how my powers worked. At that point, I had suspected she did it and was trying to use magic to come up with a cover story. On contact, however, I found that she was telling the truth—she hadn't left her apartment the night of the supposed break-in. Since I now knew she was telling the truth, the next obstacle was convincing her employer. The company would most likely not take the word of a dream walker alone, so we used the intern's internet activity on that night, and her roommates testimony as additional evidence.",
    result:
      "The company seemed to accept our evidence, although it was not the deciding factor. The security footage showed the intern entering the building and walking directly towards the server room, and accessing one particular machine. They didn't believe it was possible for an intern hired a week ago to be so familiar with the building layout, so they have called in an investigator of their own. My client was no longer under extreme suspicion, so unless she contacts me again, I will consider this case resolved.",
  },
];

export default function AureliaClientPage() {
  const [currentFile, setCurrentFile] = useState<number>(0);
  const currentCaseFile = caseFileData[currentFile];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {caseFileData.map((file, index) => (
          <button
            key={file.title}
            onClick={() => setCurrentFile(index)}
            className={cn(
              'rounded-t-3xl border-t-2 border-[#674e29] bg-[#e2a757] px-6 py-1 text-base md:px-12 md:text-lg',
              currentFile === index && 'bg-[#674e29]',
            )}
          >
            {file.title}
          </button>
        ))}
      </div>

      <div className="flex-1 border-t-2 border-[#674e29] bg-[#e2a757] p-2 text-black md:p-4">
        <div className="flex h-full flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-row-reverse justify-end gap-4 md:flex-1/4 md:flex-col md:items-center md:justify-start">
            <div className="flex flex-col gap-2">
              <h3 className="text-center text-2xl font-bold md:text-3xl">{currentCaseFile.name}</h3>
              <p className="block text-lg md:hidden md:text-center">
                Status: {currentCaseFile.status}
              </p>
            </div>

            <div className="relative">
              <Image
                src={currentCaseFile.image}
                alt={currentCaseFile.name}
                width={50}
                height={200}
                className="h-auto w-24 md:w-64"
              />
              <p className="absolute right-0 bottom-5 left-0 hidden text-center text-lg text-black md:block">
                Status: {currentCaseFile.status}
              </p>
            </div>
          </div>

          <div className="flex h-[calc(100svh-22rem)] flex-col gap-4 overflow-scroll md:h-[calc(100svh-16.5rem)] md:flex-3/4">
            <section className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold underline">Background</h3>
              <p className="whitespace-pre-line">{currentCaseFile.background}</p>
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold underline">Summary</h3>
              <div className="whitespace-pre-line">{currentCaseFile.summary}</div>
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold underline">Result</h3>
              <p className="whitespace-pre-line">{currentCaseFile.result}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
