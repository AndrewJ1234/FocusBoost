import { useState, useEffect } from 'react';
import { useExtensionData } from './useExtensionData';

interface Activity {
  name: string;
  category: string;
  duration: number;
  productivityScore: number;
  timestamp: number;
}

interface UseRealTimeDataReturn {
  currentActivity: Activity;
  recentActivities: Activity[];
  isConnected: boolean;
}

export const useRealTimeData = (): UseRealTimeDataReturn => {
  const extensionData = useExtensionData();

  return {
    currentActivity: extensionData.currentActivity,
    recentActivities: extensionData.recentActivities,
    isConnected: extensionData.isConnected
  };
};