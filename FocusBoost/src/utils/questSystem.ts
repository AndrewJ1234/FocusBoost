import { Quest, Achievement, Avatar, Currency, GameState } from '../types/avatar';
import { ExtensionData } from '../types';

export class QuestSystem {
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  generateDailyQuests(): Quest[] {
    const today = new Date().toISOString().split('T')[0];
    
    return [
      {
        id: `sleep_${today}`,
        title: 'Get Quality Sleep',
        description: 'Sleep for 7+ hours tonight',
        type: 'sleep',
        difficulty: 'easy',
        duration: 'daily',
        progress: 0,
        target: 7, // hours
        reward: {
          xp: 50,
          sleepCoins: 25
        },
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      },
      {
        id: `focus_${today}`,
        title: 'Focus Session Master',
        description: 'Complete 2 hours of focused work',
        type: 'focus',
        difficulty: 'medium',
        duration: 'daily',
        progress: 0,
        target: 7200000, // 2 hours in milliseconds
        reward: {
          xp: 75,
          focusPoints: 50
        },
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: `avoid_distraction_${today}`,
        title: 'Distraction Destroyer',
        description: 'Avoid social media for 4 hours',
        type: 'avoidDistraction',
        difficulty: 'medium',
        duration: 'daily',
        progress: 0,
        target: 14400000, // 4 hours in milliseconds
        reward: {
          xp: 60,
          focusPoints: 30
        },
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: `ai_productivity_${today}`,
        title: 'AI Power User',
        description: 'Use AI tools productively for 30 minutes',
        type: 'focus',
        difficulty: 'easy',
        duration: 'daily',
        progress: 0,
        target: 1800000, // 30 minutes in milliseconds
        reward: {
          xp: 40,
          focusPoints: 20
        },
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ];
  }

  updateQuestProgress(extensionData: ExtensionData): void {
    const activeQuests = this.gameState.quests.filter(
      (quest: Quest) => !quest.completed && new Date() < (quest.expiresAt || new Date())
    );

    activeQuests.forEach((quest: Quest) => {
      switch (quest.type) {
        case 'focus':
          if (quest.id.includes('focus_')) {
            const productiveTime = extensionData.productivityStats.productiveTime;
            quest.progress = Math.min(productiveTime, quest.target);
          } else if (quest.id.includes('ai_productivity_')) {
            const aiTime = extensionData.categoryStats.ai || 0;
            quest.progress = Math.min(aiTime, quest.target);
          }
          break;

        case 'avoidDistraction':
          const totalTime = extensionData.productivityStats.totalTime;
          const distractingTime = (extensionData.categoryStats.entertainment || 0) + 
                                 (extensionData.categoryStats.social || 0);
          const focusedTime = totalTime - distractingTime;
          quest.progress = Math.min(focusedTime, quest.target);
          break;

        case 'sleep':
          break;
      }

      if (quest.progress >= quest.target) {
        quest.completed = true;
      }
    });
  }

  completeQuest(questId: string): { xpGained: number; currencyGained: Currency } {
    const quest = this.gameState.quests.find((q: Quest) => q.id === questId);
    
    if (!quest || quest.completed) {
      return { xpGained: 0, currencyGained: { focusPoints: 0, sleepCoins: 0 } };
    }

    quest.completed = true;

    const xpGained = quest.reward.xp;
    const fpGained = quest.reward.focusPoints || 0;
    const scGained = quest.reward.sleepCoins || 0;

    this.gameState.avatar.xp += xpGained;
    this.gameState.currency.focusPoints += fpGained;
    this.gameState.currency.sleepCoins += scGained;

    this.checkLevelUp();

    return {
      xpGained,
      currencyGained: {
        focusPoints: fpGained,
        sleepCoins: scGained
      }
    };
  }

  private checkLevelUp(): boolean {
    const avatar = this.gameState.avatar;
    
    if (avatar.xp >= avatar.xpToNextLevel) {
      avatar.level += 1;
      avatar.xp -= avatar.xpToNextLevel;
      avatar.xpToNextLevel = this.calculateXPForNextLevel(avatar.level);
      
      this.gameState.currency.focusPoints += avatar.level * 10;
      this.gameState.currency.sleepCoins += avatar.level * 5;
      
      return true;
    }
    
    return false;
  }

  private calculateXPForNextLevel(currentLevel: number): number {
    return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
  }

  updateAvatarMood(extensionData: ExtensionData): void {
    const avatar = this.gameState.avatar;
    const stats = extensionData.productivityStats;
    
    if (stats.productivityScore >= 80) {
      avatar.mood = 'focused';
    } else if (stats.productivityScore >= 60) {
      avatar.mood = 'happy';
    } else if (stats.productivityScore >= 40) {
      avatar.mood = 'energetic';
    } else if (stats.entertainmentTime > stats.productiveTime) {
      avatar.mood = 'distracted';
    } else {
      avatar.mood = 'sleepy';
    }
  }

calculateActivityXP(activityType: string, duration: number): number {
  const baseXP: Record<string, number> = {
    'ai': 2, // XP per minute using AI tools
    'development': 1.5,
    'productive': 1.2,
    'educational': 1.8,
    'focus_session': 3, // Bonus for dedicated focus sessions
    'sleep_quality': 50 // Fixed XP for good sleep
  };

  const minutes = duration / (1000 * 60);
  return Math.floor((baseXP[activityType] || 0) * minutes);
}

  
  generateAchievements(): Achievement[] {
    return [
      {
        id: 'first_focus',
        title: 'First Focus',
        description: 'Complete your first focus session',
        icon: '🎯',
        requirement: {
          type: 'total',
          category: 'focus',
          target: 1800000 // 30 minutes
        },
        reward: {
          xp: 100,
          focusPoints: 50
        },
        unlocked: false
      },
      {
        id: 'sleep_master',
        title: 'Sleep Master',
        description: 'Maintain a 7-day sleep streak',
        icon: '😴',
        requirement: {
          type: 'streak',
          category: 'sleep',
          target: 7
        },
        reward: {
          xp: 250,
          sleepCoins: 100
        },
        unlocked: false
      },
      {
        id: 'ai_enthusiast',
        title: 'AI Enthusiast',
        description: 'Use AI tools for 10 hours total',
        icon: '🤖',
        requirement: {
          type: 'total',
          category: 'focus',
          target: 36000000 // 10 hours
        },
        reward: {
          xp: 300,
          focusPoints: 150
        },
        unlocked: false
      },
      {
        id: 'level_10',
        title: 'Rising Star',
        description: 'Reach level 10',
        icon: '⭐',
        requirement: {
          type: 'milestone',
          category: 'level',
          target: 10
        },
        reward: {
          xp: 500,
          focusPoints: 200,
          sleepCoins: 100
        },
        unlocked: false
      }
    ];
  }

  checkAchievements(extensionData: ExtensionData): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    
    this.gameState.achievements.forEach((achievement: Achievement) => {
      if (achievement.unlocked) return;
      
      const req = achievement.requirement;
      let shouldUnlock = false;
      
      switch (req.type) {
        case 'total':
          if (req.category === 'focus') {
            const totalFocusTime = extensionData.productivityStats.productiveTime;
            shouldUnlock = totalFocusTime >= req.target;
          }
          break;
          
        case 'streak':
          if (req.category === 'sleep') {
            shouldUnlock = this.gameState.avatar.stats.sleepStreak >= req.target;
          } else if (req.category === 'focus') {
            shouldUnlock = this.gameState.avatar.stats.focusStreak >= req.target;
          }
          break;
          
        case 'milestone':
          if (req.category === 'level') {
            shouldUnlock = this.gameState.avatar.level >= req.target;
          }
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        
        
        this.gameState.avatar.xp += achievement.reward.xp;
        this.gameState.currency.focusPoints += achievement.reward.focusPoints || 0;
        this.gameState.currency.sleepCoins += achievement.reward.sleepCoins || 0;
        
        unlockedAchievements.push(achievement);
      }
    });
    
    return unlockedAchievements;
  }

  
  static createDefaultGameState(): GameState {
    const defaultAvatar: Avatar = {
      id: 'user_avatar',
      name: 'Focus Twin',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      appearance: {
        gender: 'neutral',
        skinTone: '#FDBCB4',
        hairStyle: 'default',
        hairColor: '#8B4513',
        eyeColor: '#4A4A4A',
        outfit: {
          top: 'casual_shirt',
          bottom: 'jeans',
          shoes: 'sneakers',
          accessories: []
        }
      },
      mood: 'happy',
      stats: {
        focusStreak: 0,
        sleepStreak: 0,
        totalFocusTime: 0,
        totalSleepHours: 0,
        tasksCompleted: 0,
        distractionsAvoided: 0
      }
    };

    const questSystem = new QuestSystem({} as GameState);

    return {
      avatar: defaultAvatar,
      cottage: {
        id: 'default_cottage',
        rooms: [],
        theme: 'cozy',
        cleanliness: 80,
        brightness: 75,
        organization: 70
      },
      currency: {
        focusPoints: 100,
        sleepCoins: 50
      },
      quests: questSystem.generateDailyQuests(),
      achievements: questSystem.generateAchievements(),
      inventory: [],
      activeBoosters: [],
      lastActive: new Date(),
      totalPlayTime: 0
    };
  }
}

export default QuestSystem;