import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { InvestmentResult } from '../services/api';
import { PainScaleVisualizer } from './PainScaleVisualizer';
import { MemeGenerator } from './MemeGenerator';
import { InvestmentChart } from './InvestmentChart';

interface ResultsDisplayProps {
  results: InvestmentResult | null;
  comparisonResults?: InvestmentResult | null;
}

const SingleResultDisplay: React.FC<{ result: InvestmentResult; title?: string }> = ({ result, title }) => {
  const isProfit = result.profitLoss >= 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Asset</h3>
            <p className="text-lg font-semibold">{result.assetName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Investment Amount</h3>
            <p className="text-lg font-semibold">
              ${result.investmentAmount.toLocaleString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Entry Price</h3>
            <p className="text-lg font-semibold">
              ${result.entryPrice.toLocaleString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Exit Price</h3>
            <p className="text-lg font-semibold">
              ${result.exitPrice.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-2">
              {isProfit ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
              <span className={`text-2xl font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {isProfit ? 'Profit' : 'Loss'}
              </span>
            </div>
            
            <p className={`text-3xl font-bold mb-2 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(result.profitLoss).toLocaleString()}
            </p>
            
            <p className={`text-xl font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {result.profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, comparisonResults }) => {
  if (!results) return null;

  return (
    <div className="space-y-6">
      {comparisonResults ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleResultDisplay result={results} title="Investment 1" />
          <SingleResultDisplay result={comparisonResults} title="Investment 2" />
        </div>
      ) : (
        <SingleResultDisplay result={results} />
      )}

      <InvestmentChart
        mainData={results.historicalPrices}
        comparisonData={comparisonResults?.historicalPrices}
        mainLabel={results.assetName}
        comparisonLabel={comparisonResults?.assetName}
      />

      {!comparisonResults && (
        <>
          <PainScaleVisualizer profitLoss={results.profitLoss} />
          <MemeGenerator 
            investmentResult={{
              assetName: results.assetName,
              profitLoss: results.profitLoss,
              profitLossPercentage: results.profitLossPercentage
            }} 
          />
        </>
      )}
    </div>
  );
};
