import React from 'react';
import { timePeriods } from '../utils';

interface TimePeriodSelectorProps {
  selected: string;
  onChange: (period: string) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ 
  selected, 
  onChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {timePeriods.map(period => (
        <button
          key={period.key}
          onClick={() => onChange(period.key)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            selected === period.key
              ? 'bg-blue-600 text-white shadow-md transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default TimePeriodSelector;