import React from 'react';
import { Brain } from 'lucide-react';
import { TopSite } from '../types';
import { formatTimeDisplay } from '../utils';

interface TopSitesListProps {
  topSites: TopSite[];
  title: string;
}

const TopSitesList: React.FC<TopSitesListProps> = ({ topSites, title }) => {
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      ai: 'bg-purple-100 text-purple-700',
      development: 'bg-blue-100 text-blue-700',
      productive: 'bg-green-100 text-green-700',
      educational: 'bg-yellow-100 text-yellow-700',
      entertainment: 'bg-red-100 text-red-700',
      social: 'bg-pink-100 text-pink-700',
      news: 'bg-cyan-100 text-cyan-700',
      shopping: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {topSites && topSites.length > 0 ? (
          topSites.slice(0, 8).map((site, index) => (
            <div 
              key={site.domain} 
              className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full text-sm font-bold text-gray-600">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  {site.category === 'ai' && (
                    <div className="p-1 bg-purple-100 rounded">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{site.title}</p>
                    <p className="text-xs text-gray-500">{site.domain}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-gray-800 text-sm">
                    {formatTimeDisplay(site.totalTime)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {site.visits} visit{site.visits !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(site.category)}`}>
                  {site.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No sites tracked yet</p>
            <p className="text-gray-400 text-sm">Start browsing to see your top sites</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSitesList;