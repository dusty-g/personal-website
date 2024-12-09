// components/ChartDisplay.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  data: { Symbol: string; weight: number }[];
}

export default function ChartDisplay({ data }: ChartDisplayProps) {
  const labels = data.map(item => item.Symbol);
  const values = data.map(item => item.weight);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };

  // Determine the minimum y-axis value
  const minY = Math.min(...values) * .98; // Slightly below the smallest value for padding

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Portfolio Weights'
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: minY,
        ticks: {
          // Optional: Customize tick formatting
          callback: function(value: any) {
            return (value * 100).toFixed(2) + '%';
          }
        },
        title: {
          display: true,
          text: 'Weight (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Stock Ticker'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
