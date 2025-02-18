import React from 'react';
import { Trophy, Swords } from 'lucide-react';

interface BattleStatusProps {
  isAnimating: boolean;
  currentLeader?: {
    name: string;
    return: number;
  };
}

export const BattleStatus = ({ isAnimating, currentLeader }: BattleStatusProps) => {
  if (!isAnimating || !currentLeader) return null;

  return (
    <div className="flex items-center justify-center space-x-4 text-sm">
      <div className="flex items-center text-yellow-500">
        <Swords className="w-4 h-4 mr-1" />
        <span>Battle in Progress</span>
      </div>
      <div className="flex items-center text-green-600">
        <Trophy className="w-4 h-4 mr-1" />
        <span>Current Leader: {currentLeader.name} ({currentLeader.return.toFixed(2)}%)</span>
      </div>
    </div>
  );
};
