import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:8080/api';

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