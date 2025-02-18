import React from 'react';
import { CalendarClock } from 'lucide-react';

interface RetirementYearsDisplayProps {
  retirementYears: number;
}

export const RetirementYearsDisplay: React.FC<RetirementYearsDisplayProps> = ({ retirementYears }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
      <CalendarClock className="w-8 h-8 text-green-500 mb-2" />
      <div className="text-2xl font-bold text-green-600">{retirementYears.toLocaleString()}</div>
      <div className="text-sm text-green-700 text-center mt-1">
        Years Earlier Retirement
      </div>
    </div>
  );
};