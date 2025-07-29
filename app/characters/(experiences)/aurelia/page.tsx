import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Aurelia',
};

export default function Aurelia() {
  return (
    <>
      <div className="m-1 mt-[50px] flex min-h-screen flex-col bg-[#171A21] text-white lg:flex-row">
        {/* Sidebar */}
        <aside className="border-saddlebrown font-victoria w-full border-t-0 px-4 py-2 text-center text-sm lg:w-[15vw] lg:border-r-8 lg:text-base">
          <div className="mb-4">
            <Image
              src="/experiences/aurelia/pfp.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-auto h-[305px] w-auto"
            />
            <h2 className="mt-2 mb-4 text-[1.75em] underline">My Abilities</h2>
            <p className="text-justify">
              I am specialized in dealing with mind altering or otherwise psychological effects and
              creatures, but I can also diagnose most magical disturbances and refer you to an
              expert when physical force is required.
            </p>
            <p className="text-justify">
              In addition to my expertise, I also possess the ability to enter the minds of my
              clients when physical contact is made, allowing me to screen for any magical
              influences directly.
            </p>
          </div>

          <div className="mt-6">
            <h2 id="CIHeader" className="mb-3 text-[1.75em] underline">
              Contact Information
            </h2>
            <div className="mb-2 flex items-center">
              <Image
                src="/experiences/aurelia/phoneIcon.png"
                alt="phone"
                width={25}
                height={30}
                className="mr-2"
              />
              <p className="m-0">555-824-2345</p>
            </div>
            <div className="mb-2 flex items-center">
              <Image
                src="/experiences/aurelia/HomeIcon.png"
                alt="home"
                width={25}
                height={30}
                className="mr-2"
              />
              <p className="m-0">
                123 Fake Loc
                <br />
                New York, NY
                <br />
                1234-5678
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <Image
                src="/experiences/aurelia/MailIcon.png"
                alt="email"
                width={25}
                height={30}
                className="mr-2"
              />
              <p className="m-0">Awalker@Dreamwalkers.com</p>
            </div>
            <div className="mb-2 flex items-center">
              <Image
                src="/experiences/aurelia/Scryglass.png"
                alt="Scryglass"
                width={25}
                height={30}
                className="mr-2"
              />
              <p className="m-0">🜀 - 🜚 - 🝒 - 🜛 - 🝆 - 🜾</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-2">
          {/* Header */}
          <header className="font-victoria text-center text-[#DDD]">
            <h1 className="mt-6 mb-0 text-[3.5em] font-medium">One Touch Investigations</h1>
            <p className="mt-1 text-[21px]">
              Private Investigation - Magical Expertise - Memory Recovery
            </p>
          </header>

          {/* File Nav */}
          <nav id="fileNav" className="flex flex-row items-end">
            <button
              id="file1"
              className="cfButton h-6 w-32 rounded-t-[80px] border-0 bg-[#E2A757] font-mono hover:cursor-pointer focus:outline-none active:bg-[#FFDEB1]"
            >
              File 1
            </button>
            <button
              id="file2"
              className="cfButton h-6 w-32 rounded-t-[80px] border-0 bg-[#674E29] font-mono hover:cursor-pointer focus:outline-none active:bg-[#FFDEB1]"
            >
              File 2
            </button>
            <button
              id="file3"
              className="cfButton h-6 w-32 rounded-t-[80px] border-0 bg-[#674E29] font-mono hover:cursor-pointer focus:outline-none active:bg-[#FFDEB1]"
            >
              File 3
            </button>
            <button
              id="file4"
              className="cfButton h-6 w-32 rounded-t-[80px] border-0 bg-[#674E29] font-mono hover:cursor-pointer focus:outline-none active:bg-[#FFDEB1]"
            >
              About Me
            </button>
          </nav>

          {/* Case File Section */}
          <section
            id="caseFile"
            className="font-victoria mt-4 flex flex-col justify-center bg-[#E2A757] p-6 text-black lg:flex-row"
          >
            <div
              id="fileCaseHead"
              className="caseFileHead mb-6 flex basis-[30%] flex-col items-center text-center lg:mb-0"
            >
              <Image src="/experiences/aurelia/pfp.png" alt="Case Icon" width={250} height={250} />
              <h3 className="mt-4 mb-6 text-[1.9em]">Case Title</h3>
            </div>

            <div id="fileCaseBody" className="caseFileBody lg:pl-6">
              <h3 className="mb-2 text-[1.75em]">Details</h3>
              <p className="text-justify leading-snug">
                This is where the case file details will appear. You can adjust or dynamically load
                content into this section as needed.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* JavaScript */}
      <Script type="module" src="/scripts/aurelia/index.js" strategy="afterInteractive" />
    </>
  );
}
