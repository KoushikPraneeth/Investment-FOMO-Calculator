import React from "react";
import { Pizza, Plane, Clock } from "lucide-react";

interface SavedDisplayProps {
  profitLoss: number;
}

export const SavedDisplay: React.FC<SavedDisplayProps> = ({ profitLoss }) => {
  // Constants for calculations
  const PIZZA_COST = 15;
  const VACATION_COST = 3000;

  // Calculate values
  const absValue = Math.abs(profitLoss);
  const pizzaCount = Math.floor(absValue / PIZZA_COST);
  const vacationCount = Math.floor(absValue / VACATION_COST);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-charcoal-dark mb-4">
        What You Saved From Potential Loss
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pizza Counter */}
        <div className="text-center">
          <div className="bg-warm-gray-lighter rounded-lg p-4">
            <Pizza className="w-8 h-8 mx-auto mb-2 text-teal-accent" />
            <p className="text-3xl font-bold text-charcoal-dark mb-2">
              {pizzaCount}
            </p>
            <p className="text-sm text-charcoal">Pizzas Protected</p>
            <p className="text-xs text-charcoal-light mt-1">
              That's a lot of pizza money saved!
            </p>
          </div>
        </div>

        {/* Vacation Counter */}
        <div className="text-center">
          <div className="bg-warm-gray-lighter rounded-lg p-4">
            <Plane className="w-8 h-8 mx-auto mb-2 text-teal-accent" />
            <p className="text-3xl font-bold text-charcoal-dark mb-2">
              {vacationCount}
            </p>
            <p className="text-sm text-charcoal">Vacations Protected</p>
            <p className="text-xs text-charcoal-light mt-1">
              Your travel dreams live on!
            </p>
          </div>
        </div>

        {/* Retirement Impact */}
        <div className="text-center">
          <div className="bg-warm-gray-lighter rounded-lg p-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-teal-accent" />
            <p className="text-3xl font-bold text-charcoal-dark mb-2">0</p>
            <p className="text-sm text-charcoal">Retirement Impact</p>
            <p className="text-xs text-charcoal-light mt-1">
              Your retirement timeline stays intact
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-charcoal-light text-center mt-4">
        Silver lining: these everyday luxuries are still within reach!
      </p>
    </div>
  );
};
