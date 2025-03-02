import React, { useState } from 'react';
import { DollarSign, TrendingUp, Briefcase, Lightbulb, Coins } from 'lucide-react';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  multiplier: number;
  color: string;
}

interface ScenarioSelectorProps {
  onScenarioSelect: (scenario: Scenario | null) => void;
  selectedScenarioId: string | null;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onScenarioSelect,
  selectedScenarioId,
}) => {
  const scenarios: Scenario[] = [
    {
      id: 'sp500',
      name: 'S&P 500 Index',
      description: 'Compare with the market benchmark',
      icon: <TrendingUp size={20} />,
      multiplier: 1,
      color: 'rgb(59, 130, 246)', // blue
    },
    {
      id: 'tech',
      name: 'Tech Giants',
      description: 'FAANG stocks average performance',
      icon: <Lightbulb size={20} />,
      multiplier: 1.5,
      color: 'rgb(139, 92, 246)', // purple
    },
    {
      id: 'conservative',
      name: 'Conservative Portfolio',
      description: '60% bonds, 40% stocks',
      icon: <Briefcase size={20} />,
      multiplier: 0.7,
      color: 'rgb(16, 185, 129)', // green
    },
    {
      id: 'crypto',
      name: 'Crypto Basket',
      description: 'Top 5 cryptocurrencies by market cap',
      icon: <Coins size={20} />,
      multiplier: 2.5,
      color: 'rgb(245, 158, 11)', // amber
    },
  ];

  const handleScenarioClick = (scenario: Scenario) => {
    if (selectedScenarioId === scenario.id) {
      onScenarioSelect(null);
    } else {
      onScenarioSelect(scenario);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-charcoal-dark dark:text-dark-text-primary flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-teal-accent dark:text-dark-text-accent" />
        Compare with Alternative Scenarios
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario)}
            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
              selectedScenarioId === scenario.id
                ? 'border-teal-accent dark:border-dark-text-accent bg-teal-accent bg-opacity-10 dark:bg-opacity-20'
                : 'border-warm-gray dark:border-dark-bg-tertiary hover:border-teal-accent dark:hover:border-dark-text-accent'
            }`}
          >
            <div className="flex items-center mb-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                style={{ 
                  backgroundColor: selectedScenarioId === scenario.id 
                    ? 'rgba(20, 184, 166, 0.2)' 
                    : 'rgba(229, 231, 235, 0.5)',
                  color: scenario.color
                }}
              >
                {scenario.icon}
              </div>
              <h4 className="font-medium text-charcoal-dark dark:text-dark-text-primary">
                {scenario.name}
              </h4>
            </div>
            <p className="text-sm text-charcoal dark:text-dark-text-secondary">
              {scenario.description}
            </p>
          </button>
        ))}
      </div>
      
      {selectedScenarioId && (
        <p className="mt-3 text-sm text-charcoal-light dark:text-dark-text-secondary">
          <span className="italic">Note:</span> This is a simulated comparison based on historical trends.
        </p>
      )}
    </div>
  );
};
