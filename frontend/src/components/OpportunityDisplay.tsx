import React from "react";
import { Pizza, Plane, Clock } from "lucide-react";

interface OpportunityDisplayProps {
  profitLoss: number;
}

export const OpportunityDisplay: React.FC<OpportunityDisplayProps> = ({
  profitLoss,
}) => {
  const isProfit = profitLoss >= 0;
  const absValue = Math.abs(profitLoss);

  // Constants for calculations
  const PIZZA_COST = 15;
  const VACATION_COST = 3000;
  const RETIREMENT_SAVINGS_NEEDED = 40000; // Annual amount needed per year of early retirement

  // Calculate values
  const pizzaCount = Math.floor(absValue / PIZZA_COST);
  const vacationCount = Math.floor(absValue / VACATION_COST);
  const retirementYears = Math.floor(absValue / RETIREMENT_SAVINGS_NEEDED);

  // Only render one section based on whether there's a profit or loss
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-charcoal-dark mb-4">
        {isProfit
          ? "What You Missed Out On"
          : "What You Saved From Potential Loss"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pizza Counter */}
        <div className="text-center">
          <div className={`bg-warm-gray-lighter rounded-lg p-4 ${isProfit ? 'bg-orange-50' : ''}`}>
            <Pizza className={`w-8 h-8 mx-auto mb-2 ${isProfit ? 'text-orange-500' : 'text-teal-accent'}`} />
            <p className="text-3xl font-bold text-charcoal-dark mb-2">
              {pizzaCount}
            </p>
            <p className="text-sm text-charcoal">
              {isProfit ? "Pizzas Missed" : "Average Pizzas Saved"}
            </p>
            <p className="text-xs text-charcoal-light mt-1">
              {isProfit
                ? "Could've had a pizza party!"
                : "Hey, at least you can still afford these pizzas!"}
            </p>
          </div>
        </div>

        {/* Vacation Counter */}
        <div className="text-center">
          <div className={`bg-warm-gray-lighter rounded-lg p-4 ${isProfit ? 'bg-blue-50' : ''}`}>
            <Plane className={`w-8 h-8 mx-auto mb-2 ${isProfit ? 'text-blue-500' : 'text-teal-accent'}`} />
            <p className="text-3xl font-bold text-charcoal-dark mb-2">
              {vacationCount}
            </p>
            <p className="text-sm text-charcoal">
              {isProfit ? "Vacations Missed" : "Dream Vacations Protected"}
            </p>
            <p className="text-xs text-charcoal-light mt-1">
              {isProfit
                ? "Could've been on a beach..."
                : "Your future beach plans are safe!"}
            </p>
          </div>
        </div>

        {/* Retirement Impact */}
        <div className="text-center">
          <div className={`bg-warm-gray-lighter rounded-lg p-4 ${isProfit ? 'bg-green-50' : ''}`}>
            <Clock className={`w-8 h-8 mx-auto mb-2 ${isProfit ? 'text-green-500' : 'text-teal-accent'}`} />
            <p className="text-3xl font-bold text-charcoal-dark mb-2">
              {isProfit ? retirementYears : 0}
            </p>
            <p className="text-sm text-charcoal">
              {isProfit
                ? "Years Earlier Retirement"
                : "Retirement Timeline Impact"}
            </p>
            <p className="text-xs text-charcoal-light mt-1">
              {isProfit
                ? "Early retirement was within reach!"
                : "Your retirement plan stays intact"}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-charcoal-light text-center mt-4">
        {isProfit
          ? "Based on average prices: $15/pizza, $3,000/vacation, $40,000/year for retirement"
          : "Silver lining: these everyday luxuries are still within reach!"}
      </p>
    </div>
  );
};
