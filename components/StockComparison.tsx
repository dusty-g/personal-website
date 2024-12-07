// components/StockComparison.tsx
import React from 'react';
import { formatTicker } from 'src/utils/formatTicker';

interface Stock {
  ticker: string;
  name: string;
}

interface StockComparisonProps {
  stockA: Stock;
  stockB: Stock;
  onSelect: (selectedTicker: string) => void;
  currentStep: number;
  totalSteps: number;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/Image-not-found.png';
  };

export default function StockComparison({ stockA, stockB, onSelect, currentStep, totalSteps }: StockComparisonProps) {
    //dynamic logo urls from parqet
    const logoURL = (ticker: string) => `https://assets.parqet.com/logos/symbol/${formatTicker(ticker)}`;
  
    return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
      <img
            src={logoURL(stockA.ticker)}
            alt={`${stockA.name} logo`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            onError={handleImageError}
          />
        <h3>{stockA.name}</h3>
        <p>{stockA.ticker}</p>
        <button onClick={() => onSelect(stockA.ticker)}>Select</button>
      </div>

      <div style={{ textAlign: 'center' }}>
      <img
            src={logoURL(stockB.ticker)}
            alt={`${stockB.name} logo`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            onError={handleImageError}
          />
        <h3>{stockB.name}</h3>
        <p>{stockB.ticker}</p>
        <button onClick={() => onSelect(stockB.ticker)}>Select</button>
      </div>

      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <p>Comparisons Completed: {currentStep}/{totalSteps}</p>
      </div>
    </div>
  );
}
