// components/CurrentActivity.tsx
import React from 'react';
import { Brain, Clock, Activity, Book, PlayCircle, BarChart3 } from 'lucide-react';
import { CurrentSession, ExtensionStatus } from '../types';

interface CurrentActivityProps {
  currentSession: CurrentSession | null;
  sessionTime: number;
  isTracking: boolean;
  extensionStatus: ExtensionStatus;
}

const CurrentActivity: React.FC<CurrentActivityProps> = ({
  currentSession,
  sessionTime,
  isTracking,
  extensionStatus
}) => {
  const formatSessionClock = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Brain className="w-5 h-5 text-purple-600" />;
      case 'development': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'productive': return <BarChart3 className="w-5 h-5 text-green-600" />;
      case 'educational': return <Book className="w-5 h-5 text-orange-600" />;
      case 'entertainment': return <PlayCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          extensionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`}></div>
        Currently Active {extensionStatus === 'disconnected' && '(No Extension)'}
      </h3>

      <div className="space-y-4">
        {/* Session Timer */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold text-gray-900 font-mono mb-1">
            {formatSessionClock(sessionTime)}
          </p>
          <p className="text-sm text-gray-600">Current Session</p>
          <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs ${
            isTracking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`} />
            {isTracking ? 'Tracking' : 'Paused'}
          </div>
        </div>

        {/* Current Session Details */}
        {currentSession && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              {getCategoryIcon(currentSession.category)}
              <div>
                <p className="font-medium text-gray-800">{currentSession.title}</p>
                <p className="text-sm text-gray-600">{currentSession.domain}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium capitalize flex items-center gap-1">
              {currentSession.category === 'ai' && <Brain className="w-3 h-3" />}
              {currentSession.category}
            </span>
          </div>
        )}

        {!currentSession && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No active session</p>
            <p className="text-sm">Start browsing to begin tracking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentActivity;

