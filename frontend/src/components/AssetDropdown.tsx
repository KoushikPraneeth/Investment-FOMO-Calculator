import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
}

interface AssetDropdownProps {
  selectedAsset: string;
  onAssetChange: (symbol: string) => void;
}

const ASSETS: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
];

export const AssetDropdown: React.FC<AssetDropdownProps> = ({
  selectedAsset,
  onAssetChange,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedAsset}
        onChange={(e) => onAssetChange(e.target.value)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Pick an asset (e.g., Bitcoin, Beanie Babies, or Grandma’s Vintage China)</option>
        {ASSETS.map((asset) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.symbol} - {asset.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
    </div>
  );
};
