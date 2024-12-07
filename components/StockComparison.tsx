// components/StockComparison.tsx
import React from 'react';

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

export default function StockComparison({ stockA, stockB, onSelect, currentStep, totalSteps }: StockComparisonProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/images/placeholder-logo.jpg" alt="logo" style={{ width: '100px', height: '100px' }} />
        <h3>{stockA.name}</h3>
        <p>{stockA.ticker}</p>
        <button onClick={() => onSelect(stockA.ticker)}>Select</button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <img src="/images/placeholder-logo.jpg" alt="logo" style={{ width: '100px', height: '100px' }} />
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
