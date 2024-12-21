// pages/projects/sp500/index.tsx
import Link from 'next/link';
import React from 'react';
import Head from "next/head";
import Nav from "src/components/nav";

export default function SP500HomePage() {
  return (
    <>
      <Head>
        <title>S&P 500 Portfolio Builder</title>
        <meta name="description" content="Build a stock portfolio by comparing pairs of stocks." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div style={{ padding: '2rem' }}>
        <h1>S&P 500 Portfolio Builder</h1>
        <p>This app helps you build a stock portfolio by comparing pairs of stocks. Your final portfolio will be weighted by an Elo rating system based on your choices.</p>
        <Link href="/projects/sp500/compare">
          <button>Start</button>
        </Link>
      </div>
    </>
  );
}
