import { ExtensionData, HistoricalDataPoint } from '../types';

export const ENHANCED_CATEGORY_RULES = {
  ai: {
    domains: [
      'openai.com', 'chatgpt.com', 'claude.ai', 'anthropic.com', 'perplexity.ai',
      'midjourney.com', 'stability.ai', 'huggingface.co', 'replicate.com',
      'cohere.ai', 'bard.google.com', 'copilot.microsoft.com', 'character.ai',
      'jasper.ai', 'copy.ai', 'grammarly.com', 'notion.so/ai', 'cursor.sh',
      'replit.com/ai', 'codeium.com', 'tabnine.com', 'v0.dev', 'bolt.new'
    ],
    keywords: ['ai', 'gpt', 'claude', 'chatbot', 'assistant', 'artificial intelligence', 'copilot', 'bard', 'gemini'],
    weight: 1.0
  },
  development: {
    domains: [
      'github.com', 'gitlab.com', 'stackoverflow.com', 'codepen.io',
      'jsfiddle.net', 'codesandbox.io', 'replit.com', 'vscode.dev',
      'leetcode.com', 'hackerrank.com', 'developer.mozilla.org'
    ],
    keywords: ['code', 'programming', 'development', 'git', 'api', 'documentation'],
    weight: 0.9
  },
  productive: {
    domains: [
      'docs.google.com', 'notion.so', 'obsidian.md', 'trello.com',
      'asana.com', 'figma.com', 'canva.com', 'slack.com', 'teams.microsoft.com'
    ],
    keywords: ['document', 'notes', 'project', 'task', 'meeting'],
    weight: 0.9
  },
  educational: {
    domains: [
      'coursera.org', 'udemy.com', 'khanacademy.org', 'edx.org',
      'wikipedia.org', 'w3schools.com', 'freecodecamp.org', 'codecademy.com'
    ],
    keywords: ['learn', 'course', 'tutorial', 'education', 'study'],
    weight: 0.8
  },
  entertainment: {
    domains: [
      'youtube.com', 'netflix.com', 'twitch.tv', 'spotify.com',
      'tiktok.com', 'instagram.com', 'reddit.com'
    ],
    keywords: ['video', 'music', 'entertainment', 'stream', 'game'],
    weight: 0.3
  },
  social: {
    domains: ['facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'discord.com'],
    keywords: ['social', 'chat', 'message', 'friend'],
    weight: 0.4
  },
  news: {
    domains: ['news.google.com', 'cnn.com', 'bbc.com', 'reuters.com', 'techcrunch.com'],
    keywords: ['news', 'article', 'breaking', 'update'],
    weight: 0.5
  },
  shopping: {
    domains: ['amazon.com', 'ebay.com', 'etsy.com', 'shopify.com'],
    keywords: ['shop', 'buy', 'cart', 'product'],
    weight: 0.4
  }
};

export const categorizeWebsite = (url: string, title: string = ''): string => {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();
  
  const aiKeywords = [
    'ai', 'gpt', 'claude', 'chatbot', 'assistant', 'artificial intelligence',
    'machine learning', 'neural', 'deeplearning', 'openai', 'anthropic',
    'copilot', 'bard', 'gemini', 'llm', 'generative', 'prompt', 'chat',
    'midjourney', 'dall-e', 'stable diffusion', 'hugging face'
  ];
  
  if (ENHANCED_CATEGORY_RULES.ai.domains.some(domain => urlLower.includes(domain))) {
    return 'ai';
  }
  
  const hasAiKeyword = aiKeywords.some(keyword => 
    urlLower.includes(keyword) || titleLower.includes(keyword)
  );
  
  if (hasAiKeyword) {
    const nonAiDomains = [
      'stackoverflow.com', 'github.com', 'reddit.com', 'wikipedia.org'
    ];
    
    const isNonAiDomain = nonAiDomains.some(domain => urlLower.includes(domain));
    
    if (!isNonAiDomain) {
      return 'ai';
    }
  }
  
  const scores: Record<string, number> = {};
  
  Object.entries(ENHANCED_CATEGORY_RULES).forEach(([category, rules]) => {
    if (category === 'ai') return; // Already handled above
    
    let score = 0;
    
    if (rules.domains.some(domain => urlLower.includes(domain))) {
      score += rules.weight * 10;
    }
    
    rules.keywords.forEach(keyword => {
      if (urlLower.includes(keyword)) score += rules.weight * 3;
      if (titleLower.includes(keyword)) score += rules.weight * 2;
    });
    
    scores[category] = score;
  });
  
  const bestCategory = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
  return bestCategory[1] > 0 ? bestCategory[0] : 'other';
};

export const formatTimeDisplay = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const formatSessionClock = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

const generateTimeSeriesData = (days: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      productivityScore: Math.floor(Math.random() * 40) + 50,
      sleepHours: Math.random() * 3 + 6,
      productiveTime: Math.floor(Math.random() * 4000000) + 2000000,
      totalTime: Math.floor(Math.random() * 2000000) + 6000000
    });
  }
  return data;
};

export const generateSimulatedData = (): ExtensionData => ({
  productivityStats: {
    productivityScore: 72,
    productiveTime: 4200000,
    entertainmentTime: 1800000,
    totalTime: 6000000,
    sessionCount: 24
  },
  categoryStats: {
    productive: 4200000,
    ai: 2400000,
    development: 3600000,
    entertainment: 1800000,
    social: 600000,
    educational: 900000,
    news: 300000
  },
  currentSession: {
    title: 'FocusBoost Dashboard - Demo Mode',
    domain: 'localhost',
    category: 'development'
  },
  topSites: [
    { domain: 'github.com', title: 'GitHub', category: 'development', totalTime: 2400000, visits: 12 },
    { domain: 'chatgpt.com', title: 'ChatGPT', category: 'ai', totalTime: 2100000, visits: 10 },
    { domain: 'claude.ai', title: 'Claude AI', category: 'ai', totalTime: 1800000, visits: 8 },
    { domain: 'copilot.microsoft.com', title: 'GitHub Copilot', category: 'ai', totalTime: 1500000, visits: 7 },
    { domain: 'stackoverflow.com', title: 'Stack Overflow', category: 'development', totalTime: 1200000, visits: 6 },
    { domain: 'youtube.com', title: 'YouTube', category: 'entertainment', totalTime: 1800000, visits: 5 }
  ],
  sessionTime: 5400,
  isTracking: true,
  historicalData: {
    day: generateTimeSeriesData(1),
    week: generateTimeSeriesData(7),
    month: generateTimeSeriesData(30),
    '3month': generateTimeSeriesData(90),
    '6month': generateTimeSeriesData(180),
    year: generateTimeSeriesData(365)
  }
});

export const timePeriods = [
  { key: 'day', label: '1 Day', days: 1 },
  { key: 'week', label: '1 Week', days: 7 },
  { key: 'month', label: '1 Month', days: 30 },
  { key: '3month', label: '3 Months', days: 90 },
  { key: '6month', label: '6 Months', days: 180 },
  { key: 'year', label: '1 Year', days: 365 }
];