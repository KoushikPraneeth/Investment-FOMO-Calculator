import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, Trophy, Repeat } from 'lucide-react';
import type { InvestmentResult } from '../services/api';

interface BattleCommentaryProps {
  assetResults: InvestmentResult[];
}

export const BattleCommentary: React.FC<BattleCommentaryProps> = ({ assetResults }) => {
  const [commentary, setCommentary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedAssets = [...assetResults].sort(
    (a, b) => b.profitLossPercentage - a.profitLossPercentage
  );

  const winner = sortedAssets[0];
  const loser = sortedAssets[sortedAssets.length - 1];

  const generateCommentary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `You are a witty commentator for our "Asset Battle Royale". Generate a funny, WWE-style commentary for this investment battle:

Winner: ${winner.assetName} with ${winner.profitLossPercentage.toFixed(2)}% return
Runner-ups: ${sortedAssets.slice(1, -1).map(asset => 
  `${asset.assetName} (${asset.profitLossPercentage.toFixed(2)}%)`
).join(', ')}
Loser: ${loser.assetName} with ${loser.profitLossPercentage.toFixed(2)}% return

Make it dramatic and humorous, using investing memes and WWE-style commentary. Keep it concise (2-3 sentences). Use emojis sparingly.`;

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

      // Clean the response to remove think tokens
      const cleanedResponse = response.data.choices[0].message.content
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
      setCommentary(cleanedResponse);
    } catch (err) {
      setError('Failed to generate battle commentary. The crowd is speechless! 😶');
      console.error('Groq API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
          <h3 className="text-xl font-bold text-charcoal-dark">Battle Commentary</h3>
        </div>
        <button
          onClick={generateCommentary}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Announcing...
            </>
          ) : commentary ? (
            <>
              <Repeat className="w-4 h-4 mr-2" />
              Generate New Commentary
            </>
          ) : (
            'Generate Commentary'
          )}
        </button>
      </div>

      {winner && (
        <div className="mb-6 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          <div>
            <span className="text-sm font-medium text-charcoal">Champion:</span>
            <span className="ml-2 text-sm font-bold text-green-600">
              {winner.assetName} (+{winner.profitLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {commentary && (
        <div className="bg-yellow-50 rounded-lg p-4 text-lg font-medium text-charcoal space-y-2">
          <p className="italic relative">
            <span className="absolute top-0 left-0 text-4xl text-yellow-300 opacity-50">"</span>
            <span className="relative z-10 pl-6">
              {commentary}
            </span>
            <span className="absolute bottom-0 right-0 text-4xl text-yellow-300 opacity-50">"</span>
          </p>
        </div>
      )}
    </div>
  );
};
