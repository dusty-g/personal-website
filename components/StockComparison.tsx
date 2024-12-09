// components/StockComparison.tsx
import React from 'react';
import { formatTicker } from 'src/utils/formatTicker';

interface Stock {
  Symbol: string;
  Shortname: string;
}

interface StockComparisonProps {
  stockA: Stock;
  stockB: Stock;
  onSelect: (selectedTicker: string) => void;
  currentStep: number;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/Image-not-found.png';
  };

export default function StockComparison({ stockA, stockB, onSelect, currentStep }: StockComparisonProps) {
    //dynamic logo urls from parqet
    const logoURL = (ticker: string) => `https://assets.parqet.com/logos/symbol/${formatTicker(ticker)}`;
  
    return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
      <img
            src={logoURL(stockA.Symbol)}
            alt={`${stockA.Shortname} logo`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            onError={handleImageError}
          />
        <h3>{stockA.Shortname}</h3>
        <p>{stockA.Symbol}</p>
        <button onClick={() => onSelect(stockA.Symbol)}>Select</button>
      </div>

      <div style={{ textAlign: 'center' }}>
      <img
            src={logoURL(stockB.Symbol)}
            alt={`${stockB.Shortname} logo`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            onError={handleImageError}
          />
        <h3>{stockB.Shortname}</h3>
        <p>{stockB.Symbol}</p>
        <button onClick={() => onSelect(stockB.Symbol)}>Select</button>
      </div>

      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        
      </div>
    </div>
  );
}
