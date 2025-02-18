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

interface PriceDataPoint {
  date: string;
  price: number;
}

interface InvestmentChartProps {
  mainData?: PriceDataPoint[];
  comparisonData?: PriceDataPoint[];
  mainLabel?: string;
  comparisonLabel?: string;
  entryDate?: Date;
  exitDate?: Date;
}

const sortByDate = (data: PriceDataPoint[]) => {
  return [...data].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
};

export const InvestmentChart: React.FC<InvestmentChartProps> = ({
  mainData = [],
  comparisonData,
  mainLabel = 'Asset Price',
  comparisonLabel = 'Comparison Asset',
  entryDate,
  exitDate,
}) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  // Sort data chronologically
  const sortedMainData = sortByDate(mainData);
  const sortedComparisonData = comparisonData ? sortByDate(comparisonData) : undefined;

  const chartData = {
    labels: sortedMainData.map(d => formatDate(d.date)),
    datasets: [
      {
        label: mainLabel,
        data: sortedMainData.map(d => d.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      ...(sortedComparisonData ? [{
        label: comparisonLabel,
        data: sortedComparisonData.map(d => d.price),
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

  if (!mainData.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-64">
        <p className="text-gray-500">No price history data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="aspect-w-16 aspect-h-9">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
