export interface Avatar {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  appearance: AvatarAppearance;
  mood: AvatarMood;
  stats: AvatarStats;
}

export interface AvatarAppearance {
  gender: 'neutral' | 'male' | 'female';
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
    accessories: string[];
  };
}

export type AvatarMood = 'energetic' | 'focused' | 'sleepy' | 'distracted' | 'happy' | 'stressed';

export interface AvatarStats {
  focusStreak: number;
  sleepStreak: number;
  totalFocusTime: number;
  totalSleepHours: number;
  tasksCompleted: number;
  distractionsAvoided: number;
}

export interface Currency {
  focusPoints: number; // FP
  sleepCoins: number;  // SC
}

export interface Cottage {
  id: string;
  rooms: Room[];
  theme: CottageTheme;
  cleanliness: number; // 0-100
  brightness: number;  // 0-100
  organization: number; // 0-100
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  furniture: FurnitureItem[];
  unlocked: boolean;
  size: { width: number; height: number };
}

export type RoomType = 'bedroom' | 'study' | 'kitchen' | 'garden' | 'living';
export type CottageTheme = 'cozy' | 'modern' | 'nature' | 'minimal' | 'vintage';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  position: { x: number; y: number };
  unlocked: boolean;
  cost: { focusPoints?: number; sleepCoins?: number };
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type FurnitureCategory = 'seating' | 'desk' | 'decoration' | 'plant' | 'lighting' | 'storage';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: 'daily' | 'weekly' | 'monthly';
  progress: number;
  target: number;
  reward: QuestReward;
  completed: boolean;
  expiresAt?: Date;
}

export type QuestType = 'sleep' | 'focus' | 'avoidDistraction' | 'customization' | 'social';

export interface QuestReward {
  xp: number;
  focusPoints?: number;
  sleepCoins?: number;
  unlockItems?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: AchievementRequirement;
  reward: QuestReward;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface AchievementRequirement {
  type: 'streak' | 'total' | 'milestone';
  category: 'focus' | 'sleep' | 'tasks' | 'level';
  target: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  cost: { focusPoints?: number; sleepCoins?: number };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockLevel: number;
  previewImage: string;
  type: 'clothing' | 'furniture' | 'booster' | 'theme';
}

export type ShopCategory = 'appearance' | 'cottage' | 'boosters' | 'themes';

export interface ProductivityBooster {
  id: string;
  name: string;
  description: string;
  effect: BoosterEffect;
  duration: number; // in milliseconds
  active: boolean;
  activatedAt?: Date;
}

export interface BoosterEffect {
  type: 'xpMultiplier' | 'fpBonus' | 'streakProtection' | 'moodBoost';
  value: number;
}

export interface GameState {
  avatar: Avatar;
  cottage: Cottage;
  currency: Currency;
  quests: Quest[];
  achievements: Achievement[];
  inventory: ShopItem[];
  activeBoosters: ProductivityBooster[];
  lastActive: Date;
  totalPlayTime: number;
}