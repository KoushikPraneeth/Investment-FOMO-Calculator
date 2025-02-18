import React from 'react';
import { PizzaCounterDisplay } from './PizzaCounterDisplay';
import { VacationCounterDisplay } from './VacationCounterDisplay';
import { RetirementYearsDisplay } from './RetirementYearsDisplay';

interface PainScaleVisualizerProps {
  profitLoss: number;
}

export const PainScaleVisualizer: React.FC<PainScaleVisualizerProps> = ({ profitLoss }) => {
  // Mock calculations based on profit/loss amount
  const pizzaCount = Math.floor(Math.abs(profitLoss) / 15); // Assuming $15 per pizza
  const vacationCount = Math.floor(Math.abs(profitLoss) / 2000); // Assuming $2000 per vacation
  const retirementYears = Math.floor(Math.abs(profitLoss) / 50000); // Rough estimate of yearly expenses

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        What You {profitLoss >= 0 ? 'Gained' : 'Missed Out On'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PizzaCounterDisplay pizzaCount={pizzaCount} />
        <VacationCounterDisplay vacationCount={vacationCount} />
        <RetirementYearsDisplay retirementYears={retirementYears} />
      </div>
    </div>
  );
};