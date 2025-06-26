import React from 'react';
import { Eye } from 'lucide-react';
import { Tab } from '../types';

interface CurrentActivityProps {
  currentTab: Tab | null;
}

export const CurrentActivity: React.FC<CurrentActivityProps> = ({ currentTab }) => {
  if (!currentTab) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 mb-6">
        <h3 className="flex items-center gap-3 text-green-700 font-semibold text-lg mb-2">
          <Eye className="w-5 h-5" />
          Currently Viewing
        </h3>
        <div className="text-green-600">
          FocusBoost Dashboard - Ready to track your activity
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 mb-6">
      <h3 className="flex items-center gap-3 text-green-700 font-semibold text-lg mb-2">
        <Eye className="w-5 h-5" />
        Currently Viewing
      </h3>
      <div className="text-green-600">
        <span className="font-medium">{currentTab.title}</span>
        <span className="mx-2">-</span>
        <span className="text-sm">{currentTab.url}</span>
        <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium capitalize">
          {currentTab.category}
        </span>
      </div>
    </div>
  );
};