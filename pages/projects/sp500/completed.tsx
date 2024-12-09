// pages/projects/sp500/completed.tsx
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ChartDisplay from '../../../components/ChartDisplay';
import CSVDownload from '../../../components/CSVDownload';

interface FinalRating {
  Symbol: string;
  rating: number;
}

export default function CompletedPage() {
  const [portfolio, setPortfolio] = useState<{Symbol: string; weight: number}[]>([]);

  useEffect(() => {
    const finalEloData = sessionStorage.getItem('finalElo');
    if (finalEloData) {
      const finalElo: FinalRating[] = JSON.parse(finalEloData);
      // Convert Elo ratings to weights
      const sum = finalElo.reduce((acc, s) => acc + s.rating, 0);
      const weights = finalElo
        .map(s => ({ Symbol: s.Symbol, weight: s.rating / sum }))
        .sort((a, b) => b.weight - a.weight); // Sort by weight (desc)
      setPortfolio(weights);
    }
  }, []);
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Final Portfolio</h2>
      <p>This chart shows the weights of each stock based on your selections.</p>
      {portfolio.length > 0 && (
        <>
          <ChartDisplay data={portfolio} />
          <CSVDownload data={portfolio} />
        </>
      )}
        <div style={{ marginTop: '2rem' }}>
            <Link href="/projects/sp500" passHref>
                <button>Finish</button>
            </Link>
        </div>

    </div>
  );
}
