import React from 'react';
import { TrendingUp, TrendingDown, BarChart2, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { InvestmentResult } from '../services/api';

interface AdvancedMetricsProps {
  results: InvestmentResult;
  comparisonName?: string;
  comparisonReturn?: number;
}

export const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({
  results,
  comparisonName,
  comparisonReturn,
}) => {
  // Calculate volatility (standard deviation of returns)
  const calculateVolatility = () => {
    if (!results.historicalPrices || results.historicalPrices.length < 2) return 0;
    
    const prices = results.historicalPrices.map(p => p.price);
    const returns = [];
    
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * 100; // Convert to percentage
  };
  
  // Calculate maximum drawdown
  const calculateMaxDrawdown = () => {
    if (!results.historicalPrices || results.historicalPrices.length < 2) return 0;
    
    const prices = results.historicalPrices.map(p => p.price);
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
      } else {
        const drawdown = (peak - prices[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }
    
    return maxDrawdown * 100; // Convert to percentage
  };
  
  // Calculate annualized return
  const calculateAnnualizedReturn = () => {
    if (!results.historicalPrices || results.historicalPrices.length < 2) return 0;
    
    const firstDate = new Date(results.historicalPrices[0].date);
    const lastDate = new Date(results.historicalPrices[results.historicalPrices.length - 1].date);
    const yearDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (yearDiff < 0.1) return results.profitLossPercentage; // If less than ~36 days, just return total return
    
    // Calculate annualized return: (1 + totalReturn)^(1/years) - 1
    return (Math.pow(1 + results.profitLossPercentage / 100, 1 / yearDiff) - 1) * 100;
  };
  
  const volatility = calculateVolatility();
  const maxDrawdown = calculateMaxDrawdown();
  const annualizedReturn = calculateAnnualizedReturn();
  
  // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
  const riskFreeRate = 2;
  const sharpeRatio = (annualizedReturn - riskFreeRate) / (volatility || 1); // Avoid division by zero
  
  return (
    <div className="mt-6 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4 text-charcoal-dark dark:text-dark-text-primary flex items-center">
        <BarChart2 className="w-5 h-5 mr-2 text-teal-accent dark:text-dark-text-accent" />
        Advanced Investment Metrics
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Annualized Return */}
        <div className="p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-charcoal-dark dark:text-dark-text-secondary">Annualized Return</h4>
            {annualizedReturn >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className={`text-lg font-semibold ${
            annualizedReturn >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {annualizedReturn.toFixed(2)}%
          </p>
          <p className="text-xs text-charcoal-light dark:text-dark-text-secondary mt-1">
            Per year average
          </p>
        </div>
        
        {/* Volatility */}
        <div className="p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-charcoal-dark dark:text-dark-text-secondary">Volatility</h4>
            <AlertTriangle className={`w-4 h-4 ${
              volatility > 20 ? 'text-red-500' : volatility > 10 ? 'text-yellow-500' : 'text-green-500'
            }`} />
          </div>
          <p className="text-lg font-semibold text-charcoal-dark dark:text-dark-text-primary">
            {volatility.toFixed(2)}%
          </p>
          <p className="text-xs text-charcoal-light dark:text-dark-text-secondary mt-1">
            {volatility > 20 ? 'High risk' : volatility > 10 ? 'Medium risk' : 'Low risk'}
          </p>
        </div>
        
        {/* Maximum Drawdown */}
        <div className="p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-charcoal-dark dark:text-dark-text-secondary">Max Drawdown</h4>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-red-500">
            -{maxDrawdown.toFixed(2)}%
          </p>
          <p className="text-xs text-charcoal-light dark:text-dark-text-secondary mt-1">
            Largest price drop
          </p>
        </div>
        
        {/* Sharpe Ratio */}
        <div className="p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-charcoal-dark dark:text-dark-text-secondary">Sharpe Ratio</h4>
            <BarChart2 className={`w-4 h-4 ${
              sharpeRatio > 1 ? 'text-green-500' : sharpeRatio > 0 ? 'text-yellow-500' : 'text-red-500'
            }`} />
          </div>
          <p className={`text-lg font-semibold ${
            sharpeRatio > 1 ? 'text-green-500' : sharpeRatio > 0 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {sharpeRatio.toFixed(2)}
          </p>
          <p className="text-xs text-charcoal-light dark:text-dark-text-secondary mt-1">
            {sharpeRatio > 1 ? 'Excellent' : sharpeRatio > 0 ? 'Good' : 'Poor'} risk-adjusted return
          </p>
        </div>
      </div>
      
      {/* Comparison with alternative scenario */}
      {comparisonName && typeof comparisonReturn === 'number' && (
        <div className="mt-6 p-4 border border-warm-gray dark:border-dark-bg-tertiary rounded-lg transition-colors duration-300">
          <h4 className="font-medium text-charcoal-dark dark:text-dark-text-primary mb-2">
            Comparison with {comparisonName}
          </h4>
          
          <div className="flex items-center">
            <div className="flex-1 h-4 bg-gray-200 dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
              <div 
                className={`h-full ${results.profitLossPercentage > comparisonReturn ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(results.profitLossPercentage - comparisonReturn) / 2, 100)}%` }}
              ></div>
            </div>
            
            <div className="ml-4 text-sm">
              {results.profitLossPercentage > comparisonReturn ? (
                <span className="text-green-500 font-medium">
                  Outperformed by {(results.profitLossPercentage - comparisonReturn).toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  Underperformed by {(comparisonReturn - results.profitLossPercentage).toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
