import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data structure
interface PriceDataPoint {
  date: string;
  price: number;
}

// Example mock data for testing
export const mockChartData: PriceDataPoint[] = [
  { date: '2023-01-01', price: 16500 },
  { date: '2023-01-08', price: 17000 },
  { date: '2023-01-15', price: 18200 },
  { date: '2023-01-22', price: 21000 },
  { date: '2023-01-29', price: 23500 },
  { date: '2023-02-05', price: 22800 },
  { date: '2023-02-12', price: 24000 },
  { date: '2023-02-19', price: 23000 },
  { date: '2023-02-26', price: 25000 },
];

// Example mock comparison data
export const mockComparisonChartData: PriceDataPoint[] = [
  { date: '2023-01-01', price: 380 },
  { date: '2023-01-08', price: 385 },
  { date: '2023-01-15', price: 390 },
  { date: '2023-01-22', price: 395 },
  { date: '2023-01-29', price: 405 },
  { date: '2023-02-05', price: 410 },
  { date: '2023-02-12', price: 415 },
  { date: '2023-02-19', price: 420 },
  { date: '2023-02-26', price: 425 },
];

interface InvestmentChartProps {
  mainData?: PriceDataPoint[];
  comparisonData?: PriceDataPoint[];
  mainLabel?: string;
  comparisonLabel?: string;
  entryDate?: Date;
  exitDate?: Date;
}

export const InvestmentChart: React.FC<InvestmentChartProps> = ({
  mainData = mockChartData,
  comparisonData,
  mainLabel = 'Asset Price',
  comparisonLabel = 'Comparison Asset',
  entryDate,
  exitDate,
}) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const chartData = {
    labels: mainData.map(d => formatDate(d.date)),
    datasets: [
      {
        label: mainLabel,
        data: mainData.map(d => d.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      ...(comparisonData ? [{
        label: comparisonLabel,
        data: comparisonData.map(d => d.price),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      }] : []),
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Investment Price History',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="aspect-w-16 aspect-h-9">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
