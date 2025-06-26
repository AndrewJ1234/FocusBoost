import React from 'react';
import { Play, Pause, RotateCcw, Download, Zap } from 'lucide-react';

interface HeaderProps {
  isTracking: boolean;
  sessionTime: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onExport: () => void;
  isUsingExtension?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isTracking,
  sessionTime,
  onStart,
  onPause,
  onReset,
  onExport,
  isUsingExtension = false
}) => {
  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center text-white mb-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
        🎯 FocusBoost
      </h1>
      <p className="text-xl mb-2 text-blue-100">Real-Time Productivity & Entertainment Tracking</p>
      
      {isUsingExtension && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium">Extension Connected - Real Data</span>
        </div>
      )}
      
      <div className="bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 mb-6 mx-auto max-w-md border border-white/20">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="font-medium">
              {isTracking ? 'Actively Tracking' : 'Tracking Paused'}
            </span>
          </div>
          <div className="text-2xl font-mono font-bold">
            {formatSessionTime(sessionTime)}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={onStart}
          disabled={isTracking}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
        <button
          onClick={onPause}
          disabled={!isTracking}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};