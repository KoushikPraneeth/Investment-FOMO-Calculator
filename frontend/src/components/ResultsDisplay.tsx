import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { InvestmentResult } from "../services/api";
import { FOMOChatbot } from "./FOMOChatbot";
import { MemeGenerator } from "./MemeGenerator";
import { InvestmentChart } from "./InvestmentChart";
import { TimeTravelersJournal } from "./TimeTravelersJournal";
import { OpportunityDisplay } from "./OpportunityDisplay";

interface ResultsDisplayProps {
  results: InvestmentResult | null;
  assetSymbol?: string;
  amount?: string;
  entryDate?: Date;
  exitDate?: Date;
}

const SingleResultDisplay: React.FC<{
  result: InvestmentResult;
  title?: string;
}> = ({ result, title }) => {
  const isProfit = result.profitLoss >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 animate-fade-in">
      {title && <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 dark:text-white">{title}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-warm-gray-lighter dark:bg-gray-700 rounded-lg">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Asset</h3>
            <p className="text-base sm:text-lg font-semibold truncate dark:text-white">{result.assetName}</p>
          </div>

          <div className="p-2 sm:p-3 bg-warm-gray-lighter dark:bg-gray-700 rounded-lg">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Investment
            </h3>
            <p className="text-base sm:text-lg font-semibold dark:text-white">
              ${result.investmentAmount.toLocaleString()}
            </p>
          </div>

          <div className="p-2 sm:p-3 bg-warm-gray-lighter dark:bg-gray-700 rounded-lg">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Entry Price</h3>
            <p className="text-base sm:text-lg font-semibold dark:text-white">
              ${result.entryPrice.toLocaleString()}
            </p>
          </div>

          <div className="p-2 sm:p-3 bg-warm-gray-lighter dark:bg-gray-700 rounded-lg">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Exit Price</h3>
            <p className="text-base sm:text-lg font-semibold dark:text-white">
              ${result.exitPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-2">
              {isProfit ? (
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              )}
              <span
                className={`text-lg sm:text-2xl font-bold ${
                  isProfit ? "text-green-500" : "text-red-500"
                }`}
              >
                {result.profitLoss > 0
                  ? "Cha-ching! 🤑"
                  : result.profitLoss < 0
                  ? "Oops! 💸"
                  : "Meh. 🌳"}
              </span>
            </div>

            <p
              className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${
                isProfit ? "text-green-500" : "text-red-500"
              }`}
            >
              ${Math.abs(result.profitLoss).toLocaleString()}
            </p>

            <p
              className={`text-lg sm:text-xl font-semibold ${
                isProfit ? "text-green-500" : "text-red-500"
              }`}
            >
              {result.profitLossPercentage.toFixed(2)}%
            </p>
            
            <p className="text-xs sm:text-sm text-charcoal-light dark:text-gray-300 mt-2">
              {result.profitLoss > 0
                ? "Your Imaginary Riches"
                : result.profitLoss < 0
                ? "Your Wallet Just Cried a Little"
                : "You Could've Just Buried Cash in the Backyard"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  assetSymbol = "",
  amount = "0",
  entryDate,
  exitDate,
}) => {
  if (!results) return null;
  
  // Add state for tab navigation on mobile
  const [activeTab, setActiveTab] = React.useState<'results' | 'chart' | 'opportunity' | 'meme' | 'journal' | 'chatbot'>('results');

  return (
    <div className="space-y-6">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
        <button 
          onClick={() => setActiveTab('results')} 
          className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'results' ? 'bg-teal-accent text-white' : 'bg-white text-charcoal'}`}
        >
          Results
        </button>
        <button 
          onClick={() => setActiveTab('chart')} 
          className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'chart' ? 'bg-teal-accent text-white' : 'bg-white text-charcoal'}`}
        >
          Chart
        </button>
        <button 
          onClick={() => setActiveTab('opportunity')} 
          className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'opportunity' ? 'bg-teal-accent text-white' : 'bg-white text-charcoal'}`}
        >
          {results.profitLoss >= 0 ? "Missed Out" : "Saved"}
        </button>
        <button 
          onClick={() => setActiveTab('meme')} 
          className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'meme' ? 'bg-teal-accent text-white' : 'bg-white text-charcoal'}`}
        >
          Meme
        </button>
        {entryDate && exitDate && (
          <button 
            onClick={() => setActiveTab('journal')} 
            className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'journal' ? 'bg-teal-accent text-white' : 'bg-white text-charcoal'}`}
          >
            Journal
          </button>
        )}
        <button 
          onClick={() => setActiveTab('chatbot')} 
          className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'chatbot' ? 'bg-teal-accent text-white' : 'bg-white text-charcoal'}`}
        >
          Chatbot
        </button>
      </div>
      
      {/* Desktop: Show all components, Mobile: Show based on active tab */}
      <div className={`md:block ${activeTab === 'results' ? 'block' : 'hidden'}`}>
        <SingleResultDisplay result={results} />
      </div>
      
      <div className={`md:block ${activeTab === 'chart' ? 'block' : 'hidden'}`}>
        <InvestmentChart
          mainData={results.historicalPrices}
          mainLabel={results.assetName}
        />
      </div>
      
      <div className={`md:block ${activeTab === 'opportunity' ? 'block' : 'hidden'}`}>
        {results && <OpportunityDisplay profitLoss={results.profitLoss} />}
      </div>
      
      <div className={`md:block ${activeTab === 'meme' ? 'block' : 'hidden'}`}>
        <MemeGenerator
          investmentResult={{
            assetName: results.assetName,
            profitLoss: results.profitLoss,
            profitLossPercentage: results.profitLossPercentage,
          }}
        />
      </div>
      
      {entryDate && exitDate && (
        <div className={`md:block ${activeTab === 'journal' ? 'block' : 'hidden'}`}>
          <TimeTravelersJournal
            results={results}
            assetSymbol={assetSymbol}
            amount={amount}
            entryDate={entryDate}
            exitDate={exitDate}
          />
        </div>
      )}
      
      <div className={`md:block ${activeTab === 'chatbot' ? 'block' : 'hidden'}`}>
        <FOMOChatbot results={results} assetSymbol={assetSymbol} />
      </div>
    </div>
  );
};
