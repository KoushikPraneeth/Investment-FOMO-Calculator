import React from 'react';
import { DollarSign } from 'lucide-react';

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onAmountChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Investment Amount
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};