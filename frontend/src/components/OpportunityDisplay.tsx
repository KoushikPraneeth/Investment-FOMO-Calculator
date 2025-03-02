import React from "react";
import { Pizza, Plane, Clock, Coffee, Car, Home } from "lucide-react";

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
  const COFFEE_COST = 5;
  const CAR_PAYMENT = 400; // Monthly car payment
  const HOME_DOWN_PAYMENT = 50000;

  // Calculate values
  const pizzaCount = Math.floor(absValue / PIZZA_COST);
  const vacationCount = Math.floor(absValue / VACATION_COST);
  const retirementYears = Math.floor(absValue / RETIREMENT_SAVINGS_NEEDED);
  const coffeeCount = Math.floor(absValue / COFFEE_COST);
  const carPayments = Math.floor(absValue / CAR_PAYMENT);
  const homeDownPaymentPercent = Math.min(100, Math.floor((absValue / HOME_DOWN_PAYMENT) * 100));
  
  // Select which scenarios to show based on the amount
  const showBasicScenarios = absValue < 10000;
  const showMidScenarios = absValue >= 10000 && absValue < 100000;
  const showHighScenarios = absValue >= 100000;

  // Only render one section based on whether there's a profit or loss
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 animate-fade-in">
      <h3 className="text-xl font-bold text-charcoal-dark dark:text-white mb-4 flex items-center">
        {isProfit ? (
          <span className="inline-flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            What You Missed Out On
          </span>
        ) : (
          <span className="inline-flex items-center">
            <span className="w-2 h-2 bg-teal-accent rounded-full mr-2"></span>
            What You Saved From Potential Loss
          </span>
        )}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {/* Pizza Counter - Always show */}
        <div className="text-center">
          <div 
            className={`bg-warm-gray-lighter dark:bg-gray-700 rounded-lg p-3 sm:p-4 ${isProfit ? 'bg-orange-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600' : 'hover:bg-warm-gray-light dark:hover:bg-gray-600'} transition-colors duration-200`}
          >
            <Pizza className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isProfit ? 'text-orange-500' : 'text-teal-accent'}`} />
            <p className="text-2xl sm:text-3xl font-bold text-charcoal-dark dark:text-white mb-1 sm:mb-2">
              {pizzaCount.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-charcoal dark:text-gray-300">
              {isProfit ? "Pizzas Missed" : "Average Pizzas Saved"}
            </p>
            <p className="text-xs text-charcoal-light dark:text-gray-400 mt-1 hidden sm:block">
              {isProfit
                ? "Could've had a pizza party!"
                : "Hey, at least you can still afford these pizzas!"}
            </p>
          </div>
        </div>

        {/* Coffee Counter - Show for small amounts */}
        {showBasicScenarios && (
          <div className="text-center">
            <div 
              className={`bg-warm-gray-lighter dark:bg-gray-700 rounded-lg p-3 sm:p-4 ${isProfit ? 'bg-yellow-50 dark:bg-gray-700 hover:bg-yellow-100 dark:hover:bg-gray-600' : 'hover:bg-warm-gray-light dark:hover:bg-gray-600'} transition-colors duration-200`}
            >
              <Coffee className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isProfit ? 'text-yellow-600' : 'text-teal-accent'}`} />
              <p className="text-2xl sm:text-3xl font-bold text-charcoal-dark dark:text-white mb-1 sm:mb-2">
                {coffeeCount.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-charcoal dark:text-gray-300">
                {isProfit ? "Coffees Missed" : "Coffees Saved"}
              </p>
              <p className="text-xs text-charcoal-light dark:text-gray-400 mt-1 hidden sm:block">
                {isProfit
                  ? "That's a lot of caffeine!"
                  : "Your wallet thanks you!"}
              </p>
            </div>
          </div>
        )}

        {/* Car Payments - Show for mid amounts */}
        {showMidScenarios && (
          <div className="text-center">
            <div 
              className={`bg-warm-gray-lighter dark:bg-gray-700 rounded-lg p-3 sm:p-4 ${isProfit ? 'bg-red-50 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-gray-600' : 'hover:bg-warm-gray-light dark:hover:bg-gray-600'} transition-colors duration-200`}
            >
              <Car className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isProfit ? 'text-red-500' : 'text-teal-accent'}`} />
              <p className="text-2xl sm:text-3xl font-bold text-charcoal-dark mb-1 sm:mb-2">
                {carPayments.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-charcoal">
                {isProfit ? "Monthly Car Payments" : "Car Payments Avoided"}
              </p>
              <p className="text-xs text-charcoal-light mt-1 hidden sm:block">
                {isProfit
                  ? "That's years of car payments!"
                  : "Keep driving what you have!"}
              </p>
            </div>
          </div>
        )}

        {/* Vacation Counter - Always show */}
        <div className="text-center">
          <div 
            className={`bg-warm-gray-lighter rounded-lg p-3 sm:p-4 ${isProfit ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-warm-gray-light'} transition-colors duration-200`}
          >
            <Plane className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isProfit ? 'text-blue-500' : 'text-teal-accent'}`} />
            <p className="text-2xl sm:text-3xl font-bold text-charcoal-dark mb-1 sm:mb-2">
              {vacationCount.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-charcoal">
              {isProfit ? "Vacations Missed" : "Dream Vacations Protected"}
            </p>
            <p className="text-xs text-charcoal-light mt-1 hidden sm:block">
              {isProfit
                ? "Could've been on a beach..."
                : "Your future beach plans are safe!"}
            </p>
          </div>
        </div>

        {/* Home Down Payment - Show for high amounts */}
        {showHighScenarios && (
          <div className="text-center">
            <div 
              className={`bg-warm-gray-lighter rounded-lg p-3 sm:p-4 ${isProfit ? 'bg-purple-50 hover:bg-purple-100' : 'hover:bg-warm-gray-light'} transition-colors duration-200`}
            >
              <Home className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isProfit ? 'text-purple-500' : 'text-teal-accent'}`} />
              <p className="text-2xl sm:text-3xl font-bold text-charcoal-dark mb-1 sm:mb-2">
                {homeDownPaymentPercent}%
              </p>
              <p className="text-xs sm:text-sm text-charcoal">
                {isProfit ? "Home Down Payment" : "Home Down Payment Saved"}
              </p>
              <p className="text-xs text-charcoal-light mt-1 hidden sm:block">
                {isProfit
                  ? "Could've been a homeowner!"
                  : "Your housing situation is unchanged!"}
              </p>
            </div>
          </div>
        )}

        {/* Retirement Impact - Always show */}
        <div className="text-center">
          <div 
            className={`bg-warm-gray-lighter rounded-lg p-3 sm:p-4 ${isProfit ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-warm-gray-light'} transition-colors duration-200`}
          >
            <Clock className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isProfit ? 'text-green-500' : 'text-teal-accent'}`} />
            <p className="text-2xl sm:text-3xl font-bold text-charcoal-dark mb-1 sm:mb-2">
              {isProfit ? retirementYears : 0}
            </p>
            <p className="text-xs sm:text-sm text-charcoal">
              {isProfit
                ? "Years Earlier Retirement"
                : "Retirement Timeline Impact"}
            </p>
            <p className="text-xs text-charcoal-light mt-1 hidden sm:block">
              {isProfit
                ? "Early retirement was within reach!"
                : "Your retirement plan stays intact"}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-charcoal-light dark:text-gray-400 text-center mt-4">
        {isProfit
          ? "Based on average prices: $15/pizza, $5/coffee, $3,000/vacation, $400/month car payment, $50,000 home down payment, $40,000/year for retirement"
          : "Silver lining: these everyday luxuries are still within reach!"}
      </p>
    </div>
  );
};
