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

      <div className="gameContainer">
        <button id="restartBtn" className="invisible">
          Start a New Day
          <br />
          ☀️
        </button>
        <button id="playBtn" className="invisible">
          Play
        </button>
        <button id="skipBtn" className="invisible">
          Skip Intro
        </button>

        <canvas id="back"></canvas>

        <div className="vignettesDiv"></div>

        <p id="game-result">
          TIME NOW: <b className="currentTime">5:00 AM</b>
          <br />
          You completed <b className="goodComplete">0</b> good tasks and avoided{' '}
          <b className="badAvoid">0</b> bad tasks.
          <br />
          You missed <b className="goodMiss">0</b> good tasks and completed{' '}
          <b className="badComplete">0</b> bad tasks.
          <br />
          Your current high score is <b className="highScore">0</b> and your all time high score is{' '}
          <b className="allTimeHighScore">0</b>
        </p>
      </div>

      {/* Script */}
      <Script type="module" src="/scripts/angela/index.js" strategy="afterInteractive" />
    </Fragment>
  );
}
