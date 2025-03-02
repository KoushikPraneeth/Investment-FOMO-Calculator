import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { format, parseISO } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceDataPoint {
  date: string;
  price: number;
}

interface InvestmentChartProps {
  mainData: PriceDataPoint[];
  mainLabel: string;
  comparisonData?: PriceDataPoint[];
  comparisonLabel?: string;
  chartType?: 'line' | 'bar' | 'area';
  showInvestmentPoints?: boolean;
}

const sortByDate = (data: PriceDataPoint[]) => {
  return [...data].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );
};

export const InvestmentChart: React.FC<InvestmentChartProps> = ({
  mainData = [],
  mainLabel = "Asset Price",
  comparisonData = [],
  comparisonLabel = "Comparison",
  chartType = 'line',
  showInvestmentPoints = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Create a mutation observer to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d, yyyy");
  };

  // Sort data chronologically
  const sortedMainData = sortByDate(mainData);

  // Sort comparison data if it exists
  const sortedComparisonData = comparisonData.length > 0 ? sortByDate(comparisonData) : [];
  
  // Find min and max dates to align datasets
  const allDates = [...sortedMainData.map(d => d.date)]
    .concat(sortedComparisonData.map(d => d.date))
    .map(d => new Date(d).getTime());
  
  const minDate = allDates.length ? new Date(Math.min(...allDates)) : new Date();
  const maxDate = allDates.length ? new Date(Math.max(...allDates)) : new Date();
  
  // Prepare datasets
  const datasets = [
    {
      label: mainLabel,
      data: sortedMainData.map((d) => d.price),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: chartType === 'area' ? "rgba(75, 192, 192, 0.2)" : "rgba(75, 192, 192, 0.5)",
      tension: 0.1,
      fill: chartType === 'area',
      pointRadius: showInvestmentPoints ? 3 : 0,
      pointHoverRadius: 5,
    },
  ];
  
  // Add comparison dataset if it exists
  if (sortedComparisonData.length > 0) {
    datasets.push({
      label: comparisonLabel,
      data: sortedComparisonData.map((d) => d.price),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: chartType === 'area' ? "rgba(255, 99, 132, 0.2)" : "rgba(255, 99, 132, 0.5)",
      tension: 0.1,
      fill: chartType === 'area',
      pointRadius: showInvestmentPoints ? 3 : 0,
      pointHoverRadius: 5,
    });
  }
  
  const chartData = {
    labels: sortedMainData.map((d) => formatDate(d.date)),
    datasets,
  };

  const options: ChartOptions<"line"> = {
    animation: {
      duration: 1500,
    },
    color: isDarkMode ? '#fff' : undefined,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDarkMode ? '#e0e0e0' : '#4a4a4a',
        }
      },
      title: {
        display: true,
        text: "Investment Price History",
        color: isDarkMode ? '#e0e0e0' : '#4a4a4a',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          },
        },
        backgroundColor: isDarkMode ? '#2d2d2d' : 'rgba(0, 0, 0, 0.7)',
        titleColor: isDarkMode ? '#e0e0e0' : '#ffffff',
        bodyColor: isDarkMode ? '#e0e0e0' : '#ffffff',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            return `$${value.toLocaleString()}`;
          },
          color: isDarkMode ? '#a0a0a0' : '#666666',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#a0a0a0' : '#666666',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  if (!mainData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center h-64 transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400">No price history data available</p>
      </div>
    );
  }

  // Chart type controls
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  
  useEffect(() => {
    setSelectedChartType(chartType);
  }, [chartType]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
      {/* Chart controls */}
      <div className="flex justify-end mb-4 space-x-2">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${selectedChartType === 'line' 
              ? 'bg-teal-accent text-white dark:bg-teal-600' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setSelectedChartType('line')}
          >
            Line
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${selectedChartType === 'area' 
              ? 'bg-teal-accent text-white dark:bg-teal-600' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setSelectedChartType('area')}
          >
            Area
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${selectedChartType === 'bar' 
              ? 'bg-teal-accent text-white dark:bg-teal-600' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setSelectedChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>
      
      <div className="aspect-w-16 aspect-h-9">
        {selectedChartType === 'bar' ? (
          <Bar
            data={{
              ...chartData,
              datasets: chartData.datasets.map(dataset => ({
                ...dataset,
                borderRadius: 4,
                maxBarThickness: 30,
              }))
            }}
            options={options}
          />
        ) : (
          <Line 
            data={{
              ...chartData,
              datasets: chartData.datasets.map(dataset => ({
                ...dataset,
                fill: selectedChartType === 'area',
                tension: 0.1,
                pointRadius: dataset.pointRadius,
              }))
            }} 
            options={options} 
          />
        )}
      </div>
      
      {/* Legend */}
      {comparisonData.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-sm" 
                style={{ backgroundColor: dataset.borderColor as string }}
              />
              <span className="text-sm text-charcoal-dark dark:text-gray-300">
                {dataset.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
