import { Fragment } from 'react';
import type { Metadata } from 'next';
import Head from 'next/head';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Angela',
};

export default function Angela() {
  return (
    <Fragment>
      <Head>
        {/* Link style sheets */}
        <link rel="stylesheet" href="/assets/styles/base.css" />
        <link rel="stylesheet" href="/assets/styles/angela.css" />
      </Head>

      <div
        id="gameContainer"
        className="relative mx-auto mt-[60px] flex h-screen w-fit items-end justify-center"
      >
        <button
          id="restartBtn"
          className="absolute top-1/2 z-10 h-20 rounded-[20px] border border-[#f7a027] bg-[#fff3cd] px-5 text-[1.3rem] text-[#f7a027] hover:cursor-pointer hover:border-[#fff3cd] hover:bg-[#f7a027] hover:text-[#fff3cd]"
        >
          Start a New Day
          <br />
          ☀️
        </button>

        <button
          id="playBtn"
          className="absolute right-[10px] bottom-[10px] z-10 h-[7%] w-[10%] rounded-[20px] border border-[#fff3cd] bg-[#f7a027] text-[1.3rem] text-[#fff3cd] hover:cursor-pointer hover:bg-[#dcd9c0] hover:text-black"
        >
          Play
        </button>

        <button
          id="skipBtn"
          className="absolute right-[38%] bottom-[38%] z-10 h-max w-max rounded-[20px] border border-[#598328] bg-[#f7e2a0] px-[2vw] text-[1.3rem] text-[#598328] hover:cursor-pointer hover:border-[#f7e2a0] hover:bg-[#598328] hover:text-[#f7e2a0]"
        >
          Skip Intro
        </button>

        <canvas id="back" className="block"></canvas>

        <div id="vignettesDiv" className="pointer-events-none absolute w-full">
          <div
            id="vignetteOverlay"
            className="absolute top-0 left-0 h-full w-full shadow-[inset_0_0_100px_100px_rgb(0,0,0)]"
          ></div>
        </div>

        <p
          id="game-result"
          className="absolute top-1/4 z-10 rounded-[10px] bg-[rgba(0,0,0,0.5)] p-4 font-mono text-[1.3rem] text-[whitesmoke] shadow-[0_0_5px_rgba(0,0,0,1)]"
        >
          TIME NOW: <b id="currentTime">5:00 AM</b>
          <br />
          You completed{' '}
          <b id="goodComplete" className="text-yellowgreen text-[1.7rem]">
            0
          </b>{' '}
          good tasks and avoided <b className="badAvoid text-yellowgreen text-[1.7rem]">0</b> bad
          tasks.
          <br />
          You missed{' '}
          <b id="goodMiss" className="text-[1.7rem] text-[tomato]">
            0
          </b>{' '}
          good tasks and completed{' '}
          <b id="badComplete" className="text-[1.7rem] text-[tomato]">
            0
          </b>{' '}
          bad tasks.
          <br />
          Your current high score is <b id="highScore">0</b> and your all time high score is{' '}
          <b id="allTimeHighScore">0</b>
        </p>
      </div>

      {/* Script */}
      <Script type="module" src="/scripts/angela/index.js" strategy="afterInteractive" />
    </Fragment>
  );
}
