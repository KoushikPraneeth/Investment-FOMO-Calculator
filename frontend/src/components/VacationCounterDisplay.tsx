import React from 'react';
import { Plane } from 'lucide-react';

interface VacationCounterDisplayProps {
  vacationCount: number;
}

export const VacationCounterDisplay: React.FC<VacationCounterDisplayProps> = ({ vacationCount }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
      <Plane className="w-8 h-8 text-blue-500 mb-2" />
      <div className="text-2xl font-bold text-blue-600">{vacationCount.toLocaleString()}</div>
      <div className="text-sm text-blue-700 text-center mt-1">
        Vacations Missed
      </div>
    </div>
  );
};