import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  entryDate: Date | null;
  exitDate: Date | null;
  onEntryDateChange: (date: Date | null) => void;
  onExitDateChange: (date: Date | null) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  entryDate,
  exitDate,
  onEntryDateChange,
  onExitDateChange,
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="relative flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Entry Date
        </label>
        <div className="relative">
          <DatePicker
            selected={entryDate}
            onChange={onEntryDateChange}
            maxDate={exitDate || new Date()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select entry date"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
        </div>
      </div>
      
      <div className="relative flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exit Date
        </label>
        <div className="relative">
          <DatePicker
            selected={exitDate}
            onChange={onExitDateChange}
            minDate={entryDate || undefined}
            maxDate={new Date()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select exit date"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
        </div>
      </div>
    </div>
  );
};