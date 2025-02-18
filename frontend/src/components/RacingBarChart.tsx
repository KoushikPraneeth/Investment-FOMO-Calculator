import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { InvestmentResult } from '../services/api';
import { BattleStatus } from './BattleStatus';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RacingBarChartProps {
  assetResults: InvestmentResult[];
}

const COLORS = [
  '#26A69A', // Teal 500
  '#64B5F6', // Blue 400
  '#BA68C8', // Purple 300
  '#FFCA28', // Amber 400
  '#EF5350', // Red 400
  '#4DB6AC', // Teal 300
  '#7986CB', // Indigo 300
] as const;

const ANIMATION_DURATION = 8000; // milliseconds
const MIN_FRAME_DURATION = 50; // minimum milliseconds per frame

export const RacingBarChart = ({ assetResults }: RacingBarChartProps) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [champion, setChampion] = useState<string | null>(null);
  const [championReturn, setChampionReturn] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLeader, setCurrentLeader] = useState<{ name: string; return: number } | undefined>();

  useEffect(() => {
    let mounted = true;
    let lastTimestamp = 0;
    let frameIndex = 0;
    let animationFrameId: number;

    const totalFrames = assetResults[0].historicalPrices.length;
    const frameDuration = Math.max(ANIMATION_DURATION / totalFrames, MIN_FRAME_DURATION);

    const animate = (timestamp: number) => {
      if (!mounted || !chartRef.current) return;

      if (timestamp - lastTimestamp >= frameDuration) {
        const chart = chartRef.current;

        if (frameIndex < totalFrames) {
          const currentPrice = assetResults[0].historicalPrices[frameIndex];
          setCurrentDate(format(new Date(currentPrice.date), 'MMM d, yyyy'));

          // Calculate returns for current frame
          const newData = assetResults.map(result =>
            ((result.historicalPrices[frameIndex]?.price || 0) / result.entryPrice - 1) * 100
          );

          // Sort assets by current performance
          const sortedIndices = newData
            .map((value, index) => ({ value, index }))
            .sort((a, b) => b.value - a.value)
            .map(item => item.index);

          // Update current leader
          const leadingIndex = sortedIndices[0];
          setCurrentLeader({
            name: assetResults[leadingIndex].assetName,
            return: newData[leadingIndex]
          });

          // Update chart colors based on current rankings
          const newBackgroundColors = sortedIndices.map((originalIndex, position) =>
            `${COLORS[originalIndex]}${position === 0 ? 'FF' : 'CC'}`
          );

          chart.data.datasets[0].data = newData;
          chart.data.datasets[0].backgroundColor = newBackgroundColors;
          chart.update('none');

          frameIndex++;
          lastTimestamp = timestamp;
        } else if (frameIndex === totalFrames && mounted) {
          // Animation complete, determine champion
          const finalReturns = assetResults.map(result => {
            const lastPrice = result.historicalPrices[totalFrames - 1]?.price || 0;
            return ((lastPrice / result.entryPrice) - 1) * 100;
          });
          const maxReturn = Math.max(...finalReturns);
          const championIndex = finalReturns.indexOf(maxReturn);

          // Highlight champion
          const newBackgroundColors = COLORS.map((color, index) =>
            index === championIndex ? color : `${color}80`
          );
          chart.data.datasets[0].backgroundColor = newBackgroundColors;
          chart.data.datasets[0].borderWidth = COLORS.map((_, index) =>
            index === championIndex ? 3 : 2
          );
          chart.update('none');

          setChampion(assetResults[championIndex].assetName);
          setChampionReturn(maxReturn);
          setIsAnimating(false);
          setCurrentLeader(undefined);
          return;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    setIsAnimating(true);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [assetResults]);

  const data: ChartData<'bar'> = {
    labels: assetResults.map(result => result.assetName),
    datasets: [
      {
        label: 'Return (%)',
        data: Array(assetResults.length).fill(0),
        backgroundColor: COLORS.map(color => `${color}CC`),
        borderColor: COLORS,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Asset Performance Battle (% Return)',
        color: '#374151',
        font: {
          size: 18,
          weight: 'bold',
          family: "'Inter', system-ui, sans-serif",
        },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        bodyFont: {
          size: 14,
        },
        titleFont: {
          weight: 'bold',
        },
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(tooltipItem: TooltipItem<'bar'>) {
            return `${tooltipItem.formattedValue}% return`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value) => `${value}%`,
          color: '#718096',
          font: {
            size: 12,
          },
        },
        border: {
          color: '#E5E7EB',
        },
        title: {
          display: true,
          text: 'Percentage Return',
          color: '#718096',
          font: {
            size: 14,
          },
          padding: { top: 10 },
        },
      },
      y: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          color: '#374151',
          font: {
            weight: 'bold',
            size: 14,
          },
          padding: 10,
        },
        border: {
          color: '#E5E7EB',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center space-y-4 mb-4">
        <div className="font-medium text-charcoal text-sm">
          {currentDate}
        </div>
        <BattleStatus isAnimating={isAnimating} currentLeader={currentLeader} />
      </div>
      <div className="w-full h-64">
        <Bar
          ref={chartRef}
          options={options}
          data={data}
        />
      </div>
      {champion && championReturn !== null && !isAnimating && (
        <div className="text-center mt-6 space-y-2 animate-fade-in">
          <div className="text-green-600 font-bold text-lg animate-bounce">
            🏆 {champion} Wins The Battle! 🏆
          </div>
          <div className="text-charcoal text-sm">
            With an epic {championReturn.toFixed(2)}% return
          </div>
        </div>
      )}
    </div>
  );
};
