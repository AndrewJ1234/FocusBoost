import React from 'react';
import { Trophy, Clock } from 'lucide-react';
import { Tab, RecentActivity } from '../types';
import { tabTracker } from '../utils/tabTracker';

interface TabListProps {
  tabs: Tab[];
  title: string;
  icon: 'trophy' | 'clock';
  isLive?: boolean;
}

const categoryColors: Record<string, string> = {
  productive: 'bg-green-500',
  entertainment: 'bg-yellow-500',
  social: 'bg-red-500',
  educational: 'bg-blue-500',
  news: 'bg-purple-500',
  shopping: 'bg-orange-500',
  work: 'bg-gray-600',
  other: 'bg-gray-500'
};

export const TabList: React.FC<TabListProps> = ({ tabs, title, icon, isLive = false }) => {
  const IconComponent = icon === 'trophy' ? Trophy : Clock;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <IconComponent className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">{title}</h2>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tabs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No activity tracked yet. Start browsing to see your tabs here!
          </div>
        ) : (
          tabs.map((tab, index) => (
            <div
              key={`${tab.url}-${index}`}
              className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
            >
              {icon === 'trophy' && (
                <div className="text-xl font-bold text-blue-600 min-w-[40px]">
                  #{index + 1}
                </div>
              )}
              
              <div className="flex-shrink-0">
                {tab.favicon ? (
                  <img
                    src={tab.favicon}
                    alt="favicon"
                    className="w-8 h-8 rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-8 h-8 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-sm" 
                  style={{ display: tab.favicon ? 'none' : 'flex' }}
                >
                  🌐
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{tab.title}</div>
                <div className="text-sm text-gray-500 truncate">{tab.url}</div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-lg font-semibold text-gray-900">
                  {tabTracker.formatTime(tab.timeSpent)}
                </div>
                <div className={`text-xs text-white px-2 py-1 rounded-full font-medium uppercase tracking-wide ${categoryColors[tab.category] || categoryColors.other}`}>
                  {tab.category}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-blue-600">Recent Tab Activity</h2>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No recent activity
          </div>
        ) : (
          activities.slice(0, 8).map((activity, index) => (
            <div
              key={`${activity.url}-${activity.timestamp}-${index}`}
              className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex-shrink-0">
                {activity.favicon ? (
                  <img
                    src={activity.favicon}
                    alt="favicon"
                    className="w-6 h-6 rounded border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-6 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs" 
                  style={{ display: activity.favicon ? 'none' : 'flex' }}
                >
                  🌐
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate text-sm">{activity.title}</div>
                <div className="text-xs text-gray-500 truncate">{activity.url}</div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-500">
                  {tabTracker.getTimeAgo(new Date(activity.timestamp))}
                </div>
                <div className={`text-xs text-white px-2 py-1 rounded-full font-medium uppercase ${categoryColors[activity.category] || categoryColors.other}`}>
                  {activity.category}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};