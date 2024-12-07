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
  data: { ticker: string; weight: number }[];
}

export default function ChartDisplay({ data }: ChartDisplayProps) {
  const labels = data.map(item => item.ticker);
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

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Portfolio Weights'
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
