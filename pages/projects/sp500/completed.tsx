// pages/projects/sp500/completed.tsx
import React, { useEffect, useState } from 'react';
import ChartDisplay from '../../../components/ChartDisplay';
import CSVDownload from '../../../components/CSVDownload';

interface FinalRating {
  ticker: string;
  rating: number;
}

export default function CompletedPage() {
  const [portfolio, setPortfolio] = useState<{ticker: string; weight: number}[]>([]);

  useEffect(() => {
    const finalEloData = sessionStorage.getItem('finalElo');
    if (finalEloData) {
      const finalElo: FinalRating[] = JSON.parse(finalEloData);
      // Convert Elo ratings to weights
      // A common approach: weight = rating / sum_of_all_ratings
      const sum = finalElo.reduce((acc, s) => acc + s.rating, 0);
      const weights = finalElo.map(s => ({ ticker: s.ticker, weight: s.rating / sum }));
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
        <a href="/projects/sp500">Finish</a>
      </div>
    </div>
  );
}
