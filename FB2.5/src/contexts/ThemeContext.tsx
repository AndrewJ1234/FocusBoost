import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'lavender' | 'autumn';

interface ThemeColors {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  gradient: string;
  shadow: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  light: {
    name: 'Light',
    description: 'Clean and bright',
    primary: '#2563EB',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceHover: '#F3F4F6',
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280'
    },
    border: '#E5E7EB',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    gradient: 'from-blue-500 to-purple-600',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  dark: {
    name: 'Dark',
    description: 'Easy on the eyes',
    primary: '#3B82F6',
    secondary: '#A855F7',
    accent: '#06B6D4',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      muted: '#94A3B8'
    },
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
    gradient: 'from-blue-400 to-purple-500',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
  },
  ocean: {
    name: 'Ocean',
    description: 'Deep blue serenity',
    primary: '#0EA5E9',
    secondary: '#0284C7',
    accent: '#06B6D4',
    background: '#F0F9FF',
    surface: '#E0F2FE',
    surfaceHover: '#BAE6FD',
    text: {
      primary: '#0C4A6E',
      secondary: '#0369A1',
      muted: '#0284C7'
    },
    border: '#7DD3FC',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    gradient: 'from-cyan-400 to-blue-500',
    shadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)'
  },
  forest: {
    name: 'Forest',
    description: 'Natural green focus',
    primary: '#059669',
    secondary: '#047857',
    accent: '#10B981',
    background: '#F0FDF4',
    surface: '#DCFCE7',
    surfaceHover: '#BBF7D0',
    text: {
      primary: '#14532D',
      secondary: '#166534',
      muted: '#15803D'
    },
    border: '#86EFAC',
    success: '#10B981',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    gradient: 'from-green-400 to-emerald-500',
    shadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)'
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm and energizing',
    primary: '#EA580C',
    secondary: '#DC2626',
    accent: '#F59E0B',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    surfaceHover: '#FDE68A',
    text: {
      primary: '#92400E',
      secondary: '#B45309',
      muted: '#D97706'
    },
    border: '#FCD34D',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    gradient: 'from-orange-400 to-red-500',
    shadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2)'
  },
  midnight: {
    name: 'Midnight',
    description: 'Deep purple mystery',
    primary: '#7C3AED',
    secondary: '#5B21B6',
    accent: '#A855F7',
    background: '#1E1B4B',
    surface: '#312E81',
    surfaceHover: '#3730A3',
    text: {
      primary: '#E0E7FF',
      secondary: '#C7D2FE',
      muted: '#A5B4FC'
    },
    border: '#4C1D95',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
    gradient: 'from-purple-500 to-indigo-600',
    shadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)'
  },
  lavender: {
    name: 'Lavender',
    description: 'Soft purple calm',
    primary: '#8B5CF6',
    secondary: '#A855F7',
    accent: '#C084FC',
    background: '#FAF5FF',
    surface: '#F3E8FF',
    surfaceHover: '#E9D5FF',
    text: {
      primary: '#581C87',
      secondary: '#6B21A8',
      muted: '#7C2D92'
    },
    border: '#D8B4FE',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    gradient: 'from-purple-400 to-pink-400',
    shadow: '0 4px 6px -1px rgba(139, 92, 246, 0.2)'
  },
  autumn: {
    name: 'Autumn',
    description: 'Warm earth tones',
    primary: '#B45309',
    secondary: '#92400E',
    accent: '#D97706',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    surfaceHover: '#FDE68A',
    text: {
      primary: '#78350F',
      secondary: '#92400E',
      muted: '#A16207'
    },
    border: '#FCD34D',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    gradient: 'from-amber-400 to-orange-500',
    shadow: '0 4px 6px -1px rgba(180, 83, 9, 0.2)'
  }
};

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: ThemeColors;
  setTheme: (theme: ThemeType) => void;
  availableThemes: Array<{ key: ThemeType; theme: ThemeColors }>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('focusboost-theme');
    return (saved as ThemeType) || 'light';
  });

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('focusboost-theme', theme);
  };

  const availableThemes = Object.entries(themes).map(([key, theme]) => ({
    key: key as ThemeType,
    theme
  }));

  // Apply CSS custom properties for the current theme
  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-surface-hover', theme.surfaceHover);
    root.style.setProperty('--color-text-primary', theme.text.primary);
    root.style.setProperty('--color-text-secondary', theme.text.secondary);
    root.style.setProperty('--color-text-muted', theme.text.muted);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--color-success', theme.success);
    root.style.setProperty('--color-warning', theme.warning);
    root.style.setProperty('--color-error', theme.error);
    root.style.setProperty('--color-info', theme.info);
    root.style.setProperty('--shadow', theme.shadow);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme: themes[currentTheme],
      setTheme,
      availableThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};