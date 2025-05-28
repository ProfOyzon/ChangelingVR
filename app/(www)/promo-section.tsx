import Image from 'next/image';

// Promo items
const promoItems = [
  {
    title: 'The Touch of Memory',
    description:
      'Explore the Summers-Monelo household and reveal their secrets with a touch. All their memories, hopes, fears, and dreams will be yours to discover.',
    image: '/media/press/memory_touch.png',
    alt: 'The Touch of Memory screenshot',
  },
  {
    title: "A Mother's Fear",
    description:
      'If those we love can disappear, what will you give to hold onto them? And with the presence of magic, nothing is certain.',
    image: '/media/press/angela_fear.png',
    alt: "A Mother's Fear screenshot",
  },
  {
    title: "Dougie's Drawings",
    description: 'One page to the next, the drawings come alive.',
    image: '/media/press/dougie_doodle.png',
    alt: "Dougie's Drawings screenshot",
  },
];

export const PromoSection = () => {
  return (
    <div className="bg-light-mustard text-midnight mt-5 p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center">
        <h1 className="mb-2 max-w-lg text-center text-3xl font-bold uppercase md:mb-4 md:text-5xl">
          Discover your characters
        </h1>
        <p className="mb-4 text-base md:mb-6 md:text-lg">Explore and understand the characters</p>

        {/* Promo items */}
        <div className="motion-safe:animate-fade-in flex flex-col justify-evenly gap-6 md:flex-row">
          {promoItems.map((item) => (
            <div key={item.title} className="flex flex-1 flex-col items-center rounded">
              <div className="w-full mask-b-from-50%">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={800}
                  height={450}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="h-full max-h-[12.5rem] w-full rounded object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+OD5AQEBAR0dHSEhISFJSUlJSUlJSUlL/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
