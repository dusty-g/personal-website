// components/CSVDownload.tsx
import React from 'react';

interface CSVDownloadProps {
  data: { ticker: string; weight: number }[];
}

export default function CSVDownload({ data }: CSVDownloadProps) {
  const handleDownload = () => {
    const rows = [
      ['Ticker', 'Weight'],
      ...data.map(item => [item.ticker, item.weight.toString()])
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'portfolio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={handleDownload}>Download CSV</button>;
}
