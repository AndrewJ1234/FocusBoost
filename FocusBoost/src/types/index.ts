// types/index.ts
export interface ProductivityStats {
  productivityScore: number;
  productiveTime: number;
  entertainmentTime: number;
  totalTime: number;
  sessionCount: number;
}

export interface CategoryStats {
  [key: string]: number;
}

export interface CurrentSession {
  title: string;
  domain: string;
  category: string;
}

export interface TopSite {
  domain: string;
  title: string;
  category: string;
  totalTime: number;
  visits: number;
}

export interface HistoricalDataPoint {
  date: string;
  productivityScore: number;
  sleepHours: number;
  productiveTime: number;
  totalTime: number;
}

export interface HistoricalData {
  [key: string]: HistoricalDataPoint[];
}

export interface ExtensionData {
  productivityStats: ProductivityStats;
  categoryStats: CategoryStats;
  currentSession: CurrentSession | null;
  topSites: TopSite[];
  sessionTime: number;
  isTracking: boolean;
  historicalData: HistoricalData;
}

export interface TimePeriod {
  key: string;
  label: string;
  days: number;
}

export interface Page {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SleepInput {
  sleepTime: string;
  wakeTime: string;
}

export type ExtensionStatus = 'checking' | 'connected' | 'disconnected';
export type ChartType = 'productivity' | 'sleep';

// export interface Tab {
//   url: string;
//   title: string;
//   category: TabCategory;
//   favicon: string;
//   timeSpent: number;
//   visits: number;
//   lastVisit: number;
//   startTime?: number;
// }

// export interface RecentActivity {
//   url: string;
//   title: string;
//   category: TabCategory;
//   favicon: string;
//   action: 'switched' | 'closed' | 'opened';
//   timestamp: string;
// }

// export type TabCategory = 
//   | 'productive' 
//   | 'entertainment' 
//   | 'social' 
//   | 'educational' 
//   | 'news' 
//   | 'shopping' 
//   | 'work' 
//   | 'other';

// export interface CategoryStats {
//   [key: string]: number;
// }

// export interface ProductivityStats {
//   productiveTime: number;
//   entertainmentTime: number;
//   totalTime: number;
//   productivityScore: number;
// }