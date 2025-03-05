import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface HistoricalPricePoint {
  date: string;
  price: number;
}

export interface InvestmentRequest {
  assetSymbol: string;
  entryDate: Date;
  exitDate: Date;
  investmentAmount: number;
}

export interface InvestmentResult {
  assetName: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: number;
  profitLossPercentage: number;
  investmentAmount: number;
  pizzaCount: number;
  vacationCount: number;
  retirementYears: number;
  historicalPrices: HistoricalPricePoint[];
}

export interface ScenarioResult {
  name: string;
  profitLoss: number;
  profitLossPercentage: number;
  historicalPrices: HistoricalPricePoint[];
}

export const fetchInvestmentData = async (request: InvestmentRequest): Promise<InvestmentResult> => {
  const { assetSymbol, entryDate, exitDate, investmentAmount } = request;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/calculate`, {
      params: {
        symbol: assetSymbol,
        entryDate: format(entryDate, 'yyyy-MM-dd'),
        exitDate: format(exitDate, 'yyyy-MM-dd'),
        amount: investmentAmount
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch investment data');
    }
    throw error;
  }
};

// Function to generate comparison scenario data based on the original result
export const generateScenarioData = (originalResult: InvestmentResult, scenarioMultiplier: number, scenarioName: string): ScenarioResult => {
  // Apply the multiplier to the historical prices to simulate different performance
  const modifiedPrices = originalResult.historicalPrices.map(point => {
    // Generate a price that follows the same trend but with the multiplier applied
    // We'll use a random factor to make it look more realistic
    const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    const basePrice = point.price;
    const trendFactor = scenarioMultiplier * randomFactor;
    
    return {
      date: point.date,
      price: basePrice * trendFactor
    };
  });
  
  // Calculate the new profit/loss based on the modified prices
  const entryPrice = modifiedPrices[0].price;
  const exitPrice = modifiedPrices[modifiedPrices.length - 1].price;
  const profitLoss = (exitPrice - entryPrice) * (originalResult.investmentAmount / originalResult.entryPrice);
  const profitLossPercentage = ((exitPrice - entryPrice) / entryPrice) * 100;
  
  return {
    name: scenarioName,
    profitLoss,
    profitLossPercentage,
    historicalPrices: modifiedPrices
  };
};
