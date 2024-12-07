// pages/projects/sp500/compare.tsx
import React, { useEffect, useState } from 'react';
import StockComparison from '../../../components/StockComparison';
import { calculateElo, StockElo } from '../../../components/EloRating';
import sp500 from '../../../utils/sp500.json'; // Ensure you have correct path

// CONFIGURATION
const TOTAL_COMPARISONS = 10;

export default function ComparePage() {
  const [eloRatings, setEloRatings] = useState<StockElo[]>([]);
  const [currentPair, setCurrentPair] = useState<{ stockA: any; stockB: any } | null>(null);
  const [comparisonsMade, setComparisonsMade] = useState(0);

  useEffect(() => {
    // Initialize elo ratings if not set
    if (eloRatings.length === 0) {
      const initial = sp500.map(stock => ({ ticker: stock.ticker, rating: 1500 }));
      setEloRatings(initial);
    }
  }, [eloRatings]);

  useEffect(() => {
    if (eloRatings.length > 0 && comparisonsMade < TOTAL_COMPARISONS) {
      setCurrentPair(randomPair(sp500));
    } else if (comparisonsMade >= TOTAL_COMPARISONS) {
        //store elo ratings before redirect
        sessionStorage.setItem('finalElo', JSON.stringify(eloRatings));
      // Redirect to completion page
      window.location.href = '/projects/sp500/completed';
    }
  }, [eloRatings, comparisonsMade]);

  const onSelect = (selectedTicker: string) => {
    if (!currentPair) return;
    const loserTicker = (currentPair.stockA.ticker === selectedTicker) ? currentPair.stockB.ticker : currentPair.stockA.ticker;

    const winnerIndex = eloRatings.findIndex(s => s.ticker === selectedTicker);
    const loserIndex = eloRatings.findIndex(s => s.ticker === loserTicker);

    if (winnerIndex === -1 || loserIndex === -1) return;

    const winnerRating = eloRatings[winnerIndex].rating;
    const loserRating = eloRatings[loserIndex].rating;

    const { winnerNew, loserNew } = calculateElo(winnerRating, loserRating);

    const updatedElo = [...eloRatings];
    updatedElo[winnerIndex].rating = winnerNew;
    updatedElo[loserIndex].rating = loserNew;
    setEloRatings(updatedElo);

    setComparisonsMade(comparisonsMade + 1);
  };

  // Helper to get random pair
  function randomPair(arr: any[]) {
    const clone = [...arr];
    const idxA = Math.floor(Math.random() * clone.length);
    const stockA = clone.splice(idxA, 1)[0];
    const idxB = Math.floor(Math.random() * clone.length);
    const stockB = clone.splice(idxB, 1)[0];
    return { stockA, stockB };
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Compare and Select a Stock</h2>
      {currentPair && (
        <StockComparison
          stockA={currentPair.stockA}
          stockB={currentPair.stockB}
          onSelect={onSelect}
          currentStep={comparisonsMade}
          totalSteps={TOTAL_COMPARISONS}
        />
      )}
    </div>
  );
}
