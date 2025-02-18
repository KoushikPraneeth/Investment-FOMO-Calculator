import React, { ChangeEvent } from "react";

export interface ComparisonScenario {
  id: string;
  label: string;
  asset1: string;
  asset2: string;
}

// Mock comparison scenarios
const mockComparisons: ComparisonScenario[] = [
  {
    id: "btc-vs-sp500",
    label: "Bitcoin vs S&P 500",
    asset1: "BTC",
    asset2: "SPY",
  },
  {
    id: "eth-vs-tesla",
    label: "Ethereum vs Tesla",
    asset1: "ETH",
    asset2: "TSLA",
  },
  {
    id: "btc-vs-gold",
    label: "Bitcoin vs Gold",
    asset1: "BTC",
    asset2: "GLD",
  },
];

interface ComparisonSelectorProps {
  selectedComparison: string | null;
  onComparisonChange: (comparisonId: string | null) => void;
}

export function ComparisonSelector({
  selectedComparison,
  onComparisonChange,
}: ComparisonSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Compare Against
      </label>
      <select
        value={selectedComparison || ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onComparisonChange(e.target.value || null)
        }
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="">Select comparison</option>
        {mockComparisons.map((comparison) => (
          <option key={comparison.id} value={comparison.id}>
            {comparison.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Export mockComparisons for use in other components
export { mockComparisons };
