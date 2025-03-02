import React, { useState } from 'react';
import axios from 'axios';
import { Lightbulb, Loader2 } from 'lucide-react';
import type { InvestmentResult } from '../services/api';

interface InvestmentInsightsProps {
  results: InvestmentResult;
  assetSymbol: string;
  amount: string;
  entryDate: Date;
  exitDate: Date;
}

export const InvestmentInsights: React.FC<InvestmentInsightsProps> = ({
  results,
  assetSymbol,
  amount,
  entryDate,
  exitDate,
}) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const cleanInsights = (response: string) => {
    // Remove content between <think> and </think> tags
    return response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const generateInsights = async () => {
    setIsLoading(true);
    setError('');

    try {
      const prompt = `You are an AI investment analyst providing insightful analysis of an investment scenario. Here are the details:

      - Investment: $${amount} in ${assetSymbol}
      - Entry Price: $${results.entryPrice.toLocaleString()}
      - Exit Price: $${results.exitPrice.toLocaleString()}
      - Entry Date: ${entryDate.toLocaleDateString()}
      - Exit Date: ${exitDate.toLocaleDateString()}
      - Total ${results.profitLoss > 0 ? 'Profit' : 'Loss'}: $${Math.abs(
        results.profitLoss
      ).toLocaleString()}
      - Return: ${results.profitLossPercentage.toFixed(2)}%

      Provide a concise, data-driven analysis (3-4 paragraphs) that includes:
      1. Market context during this investment period (what was happening in the market)
      2. Key factors that likely influenced this asset's performance
      3. Alternative investment strategies that could have been considered
      4. Lessons for future investments based on this scenario
      
      Use a professional tone with specific insights tailored to this particular investment. Include relevant metrics and comparisons where appropriate.`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'deepseek-r1-distill-llama-70b',
          temperature: 0.5, // Lower temperature for more factual responses
          max_completion_tokens: 4096,
          top_p: 0.95,
          stream: false,
          stop: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
        }
      );

      const cleanedInsights = cleanInsights(response.data.choices[0].message.content);
      setInsights(cleanedInsights);
    } catch (err) {
      setError(
        'Failed to generate investment insights. Our analysts are currently unavailable... 📊'
      );
      console.error('Groq API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-charcoal-dark dark:text-white flex items-center">
          <Lightbulb className="w-6 h-6 mr-2 text-teal-accent dark:text-teal-500" />
          AI Investment Insights
        </h3>
        {!insights && !isLoading && (
          <button
            onClick={generateInsights}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent-darker dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent dark:focus:ring-offset-gray-800"
          >
            Generate Insights
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-teal-accent dark:text-teal-500 animate-spin mb-4" />
          <p className="text-charcoal-light dark:text-gray-400">Analyzing investment data...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {insights && (
        <div className="prose prose-sm sm:prose max-w-none dark:prose-invert mt-4">
          <div className="whitespace-pre-line text-charcoal-dark dark:text-gray-200">
            {insights.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
