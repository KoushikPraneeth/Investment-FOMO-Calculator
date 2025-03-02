import React, { useState } from 'react';
import axios from 'axios';
import { Book, Loader2 } from 'lucide-react';
import type { InvestmentResult } from '../services/api';

interface TimeTravelersJournalProps {
  results: InvestmentResult;
  assetSymbol: string;
  amount: string;
  entryDate: Date;
  exitDate: Date;
}

export const TimeTravelersJournal: React.FC<TimeTravelersJournalProps> = ({
  results,
  assetSymbol,
  amount,
  entryDate,
  exitDate,
}) => {
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const cleanJournalEntry = (response: string) => {
    // Remove content between <think> and </think> tags
    return response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const generateJournalEntry = async () => {
    setIsLoading(true);
    setError('');

    try {
      const prompt = `You are writing a humorous diary entry from the perspective of someone who ${
        results.profitLoss > 0 ? 'made' : 'lost'
      } money on an investment. Here are the details:

      - Investment: $${amount} in ${assetSymbol}
      - Entry Price: $${results.entryPrice.toLocaleString()}
      - Exit Price: $${results.exitPrice.toLocaleString()}
      - Entry Date: ${entryDate.toLocaleDateString()}
      - Exit Date: ${exitDate.toLocaleDateString()}
      - Total ${results.profitLoss > 0 ? 'Profit' : 'Loss'}: $${Math.abs(
        results.profitLoss
      ).toLocaleString()}
      - Return: ${results.profitLossPercentage.toFixed(2)}%

      Write a short, witty diary entry (2-3 paragraphs) that captures the emotional journey of this investment. If it was profitable, be smugly satisfied but acknowledge the luck involved. If it was a loss, be dramatically self-deprecating about the missed opportunity. Include specific details about the dates and amounts. Use a mix of humor and financial jargon. End with a lesson learned or amusing observation.`;

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
          temperature: 0.8,
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

      const cleanedEntry = cleanJournalEntry(response.data.choices[0].message.content);
      setJournalEntry(cleanedEntry);
    } catch (err) {
      setError(
        'Failed to generate journal entry. Time travel can be unpredictable... 🚀'
      );
      console.error('Groq API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-charcoal-dark dark:text-dark-text-primary flex items-center">
          <Book className="w-6 h-6 mr-2 text-teal-accent dark:text-dark-text-accent" />
          Time Traveler's Journal
        </h3>
        {!journalEntry && !isLoading && (
          <button
            onClick={generateJournalEntry}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent-darker dark:bg-teal-accent-darker dark:hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent dark:focus:ring-offset-dark-bg-secondary"
          >
            Generate Entry
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-teal-accent dark:text-dark-text-accent" />
          <span className="ml-2 text-charcoal dark:text-dark-text-secondary">
            Traveling through time and space...
          </span>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
      )}

      {journalEntry && (
        <div className="prose prose-sm dark:prose-invert max-w-none mt-4">
          <div className="p-6 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-md transition-colors duration-300">
            <div className="italic text-charcoal dark:text-dark-text-secondary whitespace-pre-line">
              {journalEntry}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
