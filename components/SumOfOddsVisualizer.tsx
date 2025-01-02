import { useState, useMemo } from 'react';

export default function SumOfOddsVisualizer() {
  // State for the current n value
  const [n, setN] = useState(1);

  // Maximum value for n
  const maxN = 16;

  // Calculate sum of first n odd numbers = n^2
  const sumOfOdds = (value: number) => value * value;

  // Generate a stable array of random colors for each ring from 1..maxN
  // useMemo ensures we only generate them once (or if maxN changes).
  const ringColors = useMemo(() => {
    const randomColor = () =>
      '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

    return Array.from({ length: maxN }, () => randomColor());
  }, [maxN]);

  // Identify which "ring" a cell (r, c) belongs to.
  // A cell is in ring i if it lies in the bottom row or right column
  // of the i x i square. We check from outermost ring n down to ring 1
  // so that each cell is assigned the highest valid ring.
  const getRingIndex = (r: number, c: number, size: number) => {
    for (let i = size; i >= 1; i--) {
      const bottomRow = r === i - 1 && c <= i - 1;
      const rightCol = c === i - 1 && r <= i - 1;
      if (bottomRow || rightCol) {
        return i;
      }
    }
    // Default fallback (should never hit if (r, c) is within n x n)
    return 1;
  };

  // Event handlers to increase/decrease n
  const handleIncrement = () => {
    setN((prev) => Math.min(prev + 1, maxN));
  };

  const handleDecrement = () => {
    setN((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sum of the First {n} Odd Numbers</h2>
      <p>
        The sum of the first {n} odd numbers (1, 3, 5, ..., {2 * n - 1}) is{' '}
        <strong>{sumOfOdds(n)}</strong>. This is equal to <strong>n²</strong>.
      </p>

      <div style={{ marginBottom: 10 }}>
        <button onClick={handleDecrement} disabled={n === 1}>
          -
        </button>
        <span style={{ margin: '0 10px' }}>Current n: {n}</span>
        <button onClick={handleIncrement} disabled={n === maxN}>
          +
        </button>
      </div>

      {/* Visualization of the n x n grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, 24px)`,
          gap: '2px',
          marginTop: 20,
        }}
      >
        {Array.from({ length: n }).map((_, row) => {
          return Array.from({ length: n }).map((_, col) => {
            const ring = getRingIndex(row, col, n);
            const color = ringColors[ring - 1];
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderRadius: 2,
                }}
              />
            );
          });
        })}
      </div>
    </div>
  );
}
