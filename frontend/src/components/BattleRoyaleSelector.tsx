import React from 'react';
import { AssetDropdown } from './AssetDropdown';

interface BattleRoyaleSelectorProps {
  assets: string[];
  setAssets: (assets: string[]) => void;
}

export const BattleRoyaleSelector: React.FC<BattleRoyaleSelectorProps> = ({ assets, setAssets }) => {
  const handleAssetChange = (index: number, newAsset: string) => {
    const newAssets = [...assets];
    newAssets[index] = newAsset;
    setAssets(newAssets);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2].map((index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Contender {index + 1}
          </label>
          <AssetDropdown
            selectedAsset={assets[index] || ''}
            onAssetChange={(newAsset) => handleAssetChange(index, newAsset)}
          />
        </div>
      ))}
    </div>
  );
};
