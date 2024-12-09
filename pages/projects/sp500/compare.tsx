import React, { useEffect, useState } from 'react';
import StockComparison from '../../../components/StockComparison';
import { calculateElo, StockElo } from '../../../components/EloRating';
import sp500 from '../../../utils/sp500.json'; // Ensure you have correct path
import { useRouter } from 'next/router';

export default function ComparePage() {
  const [eloRatings, setEloRatings] = useState<StockElo[]>([]);
  const [currentPair, setCurrentPair] = useState<{ stockA: any; stockB: any } | null>(null);
  const [comparisonsMade, setComparisonsMade] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Initialize elo ratings if not set
    if (eloRatings.length === 0) {
      const initial = sp500.map(stock => ({ Symbol: stock.Symbol, rating: 1500 }));
      setEloRatings(initial);
    }
  }, [eloRatings]);

  useEffect(() => {
    if (eloRatings.length > 0) {
      setCurrentPair(randomPair(sp500));
    }
  }, [eloRatings, comparisonsMade]);

  const onSelect = (selectedTicker: string) => {
    if (!currentPair) return;
    const loserTicker =
      currentPair.stockA.Symbol === selectedTicker ? currentPair.stockB.Symbol : currentPair.stockA.Symbol;

    const winnerIndex = eloRatings.findIndex(s => s.Symbol === selectedTicker);
    const loserIndex = eloRatings.findIndex(s => s.Symbol === loserTicker);

    if (winnerIndex === -1 || loserIndex === -1) return;

    const winnerRating = eloRatings[winnerIndex].rating;
    const loserRating = eloRatings[loserIndex].rating;

    const { winnerNew, loserNew } = calculateElo(winnerRating, loserRating);

    const updatedElo = [...eloRatings];
    updatedElo[winnerIndex].rating = winnerNew;
    updatedElo[loserIndex].rating = loserNew;
    setEloRatings(updatedElo);

    setComparisonsMade(prev => prev + 1);
  };

  const endComparisons = () => {
    sessionStorage.setItem('finalElo', JSON.stringify(eloRatings));
    router.push('/projects/sp500/completed');
  };

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
        />
      )}
      <p>Comparisons Made: {comparisonsMade}</p>
      <button onClick={endComparisons} style={{ marginTop: '1rem' }}>
        End
      </button>
      <footer style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>
        Logos provided by <a href="https://parqet.com" target="_blank" rel="noopener noreferrer">Parqet</a>.
      </footer>
    </div>
  );
}
