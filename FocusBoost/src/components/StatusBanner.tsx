import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExtensionStatus } from '../types';

interface StatusBannerProps {
  extensionStatus: ExtensionStatus;
  retryCount: number;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ 
  extensionStatus, 
  retryCount 
}) => {
  if (extensionStatus === 'checking') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-800">
            Connecting to FocusBoost extension... ({retryCount}/3)
          </span>
        </div>
      </div>
    );
  }
  
  if (extensionStatus === 'disconnected') {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-orange-800 font-medium">
              Extension not found - Showing demo data
            </p>
            <p className="text-orange-700 text-sm">
              Install the FocusBoost extension to track real browsing data
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default StatusBanner;