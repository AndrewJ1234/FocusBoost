// components/OverviewPage.tsx
import React from 'react';
import StatsPanel from './StatsPanel';
import CurrentActivity from './CurrentActivity';
import PieChartComponent from './PieChartComponent';
import TopSitesList from './TopSitesList';
import { ExtensionData, ExtensionStatus } from '../types';

interface OverviewPageProps {
  data: ExtensionData;
  extensionStatus: ExtensionStatus;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedChart: 'productivity' | 'sleep';
  setSelectedChart: (chart: 'productivity' | 'sleep') => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ 
  data, 
  extensionStatus
}) => {
  return (
    <div className="space-y-8">
      <StatsPanel 
        productivityStats={data.productivityStats}
        categoryStats={data.categoryStats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CurrentActivity
          currentSession={data.currentSession}
          sessionTime={data.sessionTime}
          isTracking={data.isTracking}
          extensionStatus={extensionStatus}
        />

        <PieChartComponent 
          data={data.categoryStats} 
          title="Time by Category" 
        />
      </div>

      <TopSitesList 
        topSites={data.topSites}
        title="Top Sites Today"
      />

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-blue-700 text-xs font-bold">?</span>
          </div>
          What are Sessions?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">📊 Session Tracking</h4>
            <p className="leading-relaxed">
              Sessions are continuous periods of focused work or activity. Each time you start working 
              on a task or open a new app category, a new session begins. This helps track your focus patterns.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">⏱️ Session Duration</h4>
            <p className="leading-relaxed">
              The current session timer shows how long you've been active. Sessions pause automatically 
              during breaks or when sleep mode is enabled, giving you accurate productivity metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;