export interface Tab {
  url: string;
  title: string;
  category: TabCategory;
  favicon: string;
  timeSpent: number;
  visits: number;
  lastVisit: number;
  startTime?: number;
}

export interface RecentActivity {
  url: string;
  title: string;
  category: TabCategory;
  favicon: string;
  action: 'switched' | 'closed' | 'opened';
  timestamp: string;
}

export type TabCategory = 
  | 'productive' 
  | 'entertainment' 
  | 'social' 
  | 'educational' 
  | 'news' 
  | 'shopping' 
  | 'work' 
  | 'other';

export interface CategoryStats {
  [key: string]: number;
}

export interface ProductivityStats {
  productiveTime: number;
  entertainmentTime: number;
  totalTime: number;
  productivityScore: number;
}