import { Tab, TabCategory, RecentActivity } from '../types';

export class TabTracker {
  private categoryRules: Record<TabCategory, string[]> = {
    productive: [
      'docs.google.com', 'github.com', 'stackoverflow.com', 'codepen.io',
      'jsfiddle.net', 'codesandbox.io', 'notion.so', 'obsidian.md',
      'trello.com', 'asana.com', 'slack.com', 'zoom.us', 'teams.microsoft.com',
      'office.com', 'figma.com', 'canva.com', 'adobe.com'
    ],
    entertainment: [
      'youtube.com', 'netflix.com', 'twitch.tv', 'spotify.com',
      'soundcloud.com', 'hulu.com', 'disneyplus.com', 'primevideo.com',
      'tiktok.com', 'instagram.com', 'snapchat.com', 'gaming', 'game'
    ],
    social: [
      'facebook.com', 'twitter.com', 'linkedin.com', 'reddit.com',
      'discord.com', 'telegram.org', 'whatsapp.com', 'messenger.com'
    ],
    educational: [
      'coursera.org', 'udemy.com', 'khanacademy.org', 'edx.org',
      'wikipedia.org', 'w3schools.com', 'mdn.mozilla.org', 'freecodecamp.org',
      'codecademy.com', 'pluralsight.com', 'lynda.com'
    ],
    news: [
      'news.google.com', 'cnn.com', 'bbc.com', 'reuters.com',
      'techcrunch.com', 'theverge.com', 'ycombinator.com', 'medium.com',
      'hackernews', 'news.ycombinator.com'
    ],
    shopping: [
      'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com',
      'walmart.com', 'target.com', 'alibaba.com', 'bestbuy.com'
    ],
    work: [
      'office.com', 'google.com/drive', 'dropbox.com', 'onedrive.com',
      'salesforce.com', 'hubspot.com', 'mailchimp.com', 'jira.atlassian.com'
    ],
    other: []
  };

  categorizeUrl(url: string, title: string = ''): TabCategory {
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();
    
    for (const [category, domains] of Object.entries(this.categoryRules)) {
      if (category === 'other') continue;
      for (const domain of domains) {
        if (urlLower.includes(domain) || titleLower.includes(domain)) {
          return category as TabCategory;
        }
      }
    }
    
    return 'other';
  }

  getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
    } catch {
      return '';
    }
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return `${diffSeconds}s ago`;
    }
  }
}

export const tabTracker = new TabTracker();