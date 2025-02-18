import React, { useState } from 'react';
import { Download, Share2, Loader } from 'lucide-react';

interface MemeGeneratorProps {
  investmentResult: {
    assetName: string;
    profitLoss: number;
    profitLossPercentage: number;
  };
}

export const MemeGenerator: React.FC<MemeGeneratorProps> = ({ investmentResult }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);

  // Mock meme generation
  const handleGenerateMeme = () => {
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Using a placeholder meme image from a reliable source
      setMemeUrl('https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600&h=400&fit=crop');
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (!memeUrl) return;
    
    const link = document.createElement('a');
    link.href = memeUrl;
    link.download = `investment-regret-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!memeUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Investment Regret Meme',
          text: `Check out my investment regret for ${investmentResult.assetName}!`,
          url: memeUrl
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(memeUrl);
        alert('Meme URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Immortalize Your {investmentResult.profitLoss >= 0 ? 'Success' : 'Regret'} with a Meme
        </h3>
        <p className="text-gray-600 mt-2">
          Generate a shareable meme to capture this moment
        </p>
      </div>

      {!memeUrl && (
        <button
          onClick={handleGenerateMeme}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Generating Your Meme...
            </span>
          ) : (
            'Create My Regret Meme!'
          )}
        </button>
      )}

      {memeUrl && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={memeUrl}
              alt="Generated meme"
              className="w-full h-auto"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Meme
            </button>
            
            <button
              onClick={handleShare}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Meme
            </button>
          </div>

          <button
            onClick={handleGenerateMeme}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Generate Another Meme
          </button>
        </div>
      )}
    </div>
  );
};