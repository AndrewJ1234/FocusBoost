import { useState } from 'react';

interface ProductivityTrend {
  today: number;
  weekly: number;
  focus: number;
  distraction: number;
}

interface CategoryData {
  name: string;
  value: number;
  hours: number;
  minutes: number;
  percentage: number;
  productivityScore: number;
}

interface UseProductivityDataReturn {
  todayScore: number;
  weeklyAverage: number;
  trend: ProductivityTrend;
  focusTime: number; // in minutes
  distractionTime: number; // in minutes
  categoryData: CategoryData[];
}

export const useProductivityData = (): UseProductivityDataReturn => {
  const [data] = useState({
    todayScore: 78,
    weeklyAverage: 72,
    trend: {
      today: 12, // +12% vs yesterday
      weekly: 8,  // +8% vs last week
      focus: 15,  // +15% focus time
      distraction: -22 // -22% distraction time
    },
    focusTime: 285, // 4h 45m
    distractionTime: 95, // 1h 35m
    categoryData: [
      {
        name: 'Development',
        value: 240,
        hours: 4,
        minutes: 0,
        percentage: 45,
        productivityScore: 88
      },
      {
        name: 'Learning',
        value: 120,
        hours: 2,
        minutes: 0,
        percentage: 22,
        productivityScore: 82
      },
      {
        name: 'Communication',
        value: 80,
        hours: 1,
        minutes: 20,
        percentage: 15,
        productivityScore: 65
      },
      {
        name: 'Break',
        value: 60,
        hours: 1,
        minutes: 0,
        percentage: 11,
        productivityScore: 50
      },
      {
        name: 'Entertainment',
        value: 40,
        hours: 0,
        minutes: 40,
        percentage: 7,
        productivityScore: 25
      }
    ]
  });

  return data;
};