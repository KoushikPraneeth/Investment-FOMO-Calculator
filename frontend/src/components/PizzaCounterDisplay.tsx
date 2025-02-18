import React from 'react';
import { Pizza } from 'lucide-react';

interface PizzaCounterDisplayProps {
  pizzaCount: number;
}

export const PizzaCounterDisplay: React.FC<PizzaCounterDisplayProps> = ({ pizzaCount }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
      <Pizza className="w-8 h-8 text-orange-500 mb-2" />
      <div className="text-2xl font-bold text-orange-600">{pizzaCount.toLocaleString()}</div>
      <div className="text-sm text-orange-700 text-center mt-1">
        Pizzas Missed
      </div>
    </div>
  );
};