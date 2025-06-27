// components/AvatarShop.tsx - Shop System
import React, { useState } from 'react';
import { 
  ShoppingBag, Shirt, Home, Zap, Palette, Star, Lock,
  Coins, Crown, Sparkles, TreePine, Lamp, Coffee
} from 'lucide-react';
import { ShopItem, Currency, ShopCategory } from '../types/avatar';

interface AvatarShopProps {
  currency: Currency;
  inventory: ShopItem[];
  avatarLevel: number;
  onPurchase: (itemId: string) => void;
  onClose: () => void;
}

const AvatarShop: React.FC<AvatarShopProps> = ({
  currency,
  inventory,
  avatarLevel,
  onPurchase,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('appearance');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Mock shop items - in real app, these would come from backend
  const shopItems: ShopItem[] = [
    // Appearance Items
    {
      id: 'hair_modern',
      name: 'Modern Cut',
      description: 'A sleek, contemporary hairstyle',
      category: 'appearance',
      cost: { focusPoints: 50 },
      rarity: 'common',
      unlockLevel: 1,
      previewImage: '💇',
      type: 'clothing'
    },
    {
      id: 'glasses_focus',
      name: 'Focus Glasses',
      description: 'Stylish glasses that boost concentration',
      category: 'appearance',
      cost: { focusPoints: 120 },
      rarity: 'rare',
      unlockLevel: 3,
      previewImage: '🤓',
      type: 'clothing'
    },
    {
      id: 'crown_legendary',
      name: 'Productivity Crown',
      description: 'A legendary crown for true focus masters',
      category: 'appearance',
      cost: { focusPoints: 500, sleepCoins: 100 },
      rarity: 'legendary',
      unlockLevel: 10,
      previewImage: '👑',
      type: 'clothing'
    },
    
    // Cottage Items
    {
      id: 'desk_premium',
      name: 'Premium Study Desk',
      description: 'A beautiful oak desk perfect for productivity',
      category: 'cottage',
      cost: { focusPoints: 200 },
      rarity: 'rare',
      unlockLevel: 5,
      previewImage: '🪑',
      type: 'furniture'
    },
    {
      id: 'plant_focus',
      name: 'Focus Fern',
      description: 'A calming plant that grows with your streaks',
      category: 'cottage',
      cost: { sleepCoins: 75 },
      rarity: 'common',
      unlockLevel: 2,
      previewImage: '🌿',
      type: 'furniture'
    },
    {
      id: 'lamp_magical',
      name: 'Magical Focus Lamp',
      description: 'Illuminates your path to productivity',
      category: 'cottage',
      cost: { focusPoints: 300, sleepCoins: 50 },
      rarity: 'epic',
      unlockLevel: 7,
      previewImage: '💡',
      type: 'furniture'
    },
    
    // Boosters
    {
      id: 'booster_xp',
      name: 'XP Multiplier',
      description: '2x XP for 24 hours',
      category: 'boosters',
      cost: { focusPoints: 150 },
      rarity: 'rare',
      unlockLevel: 4,
      previewImage: '⚡',
      type: 'booster'
    },
    {
      id: 'booster_streak',
      name: 'Streak Shield',
      description: 'Protects your streak for one day',
      category: 'boosters',
      cost: { sleepCoins: 100 },
      rarity: 'epic',
      unlockLevel: 6,
      previewImage: '🛡️',
      type: 'booster'
    }
  ];

  const categories = [
    { id: 'appearance', label: 'Appearance', icon: Shirt },
    { id: 'cottage', label: 'Cottage', icon: Home },
    { id: 'boosters', label: 'Boosters', icon: Zap },
    { id: 'themes', label: 'Themes', icon: Palette }
  ] as const;

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-300',
    rare: 'bg-blue-100 text-blue-700 border-blue-300',
    epic: 'bg-purple-100 text-purple-700 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  };

  const filteredItems = shopItems.filter(item => {
    const categoryMatch = item.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || item.rarity === selectedRarity;
    const levelMatch = avatarLevel >= item.unlockLevel;
    const notOwned = !inventory.some(owned => owned.id === item.id);
    
    return categoryMatch && rarityMatch && levelMatch && notOwned;
  });

  const canAfford = (item: ShopItem): boolean => {
    const fpCost = item.cost.focusPoints || 0;
    const scCost = item.cost.sleepCoins || 0;
    return currency.focusPoints >= fpCost && currency.sleepCoins >= scCost;
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'rare': return <Star className="w-4 h-4" />;
      case 'epic': return <Crown className="w-4 h-4" />;
      case 'legendary': return <Sparkles className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Focus Shop</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4" />
                <span className="font-semibold">{currency.focusPoints} FP</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4" />
                <span className="font-semibold">{currency.sleepCoins} SC</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4 border-r">
            <div className="space-y-2 mb-6">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Rarity Filter */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Rarity Filter</h4>
              <div className="space-y-2">
                {['all', 'common', 'rare', 'epic', 'legendary'].map(rarity => (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      selectedRarity === rarity
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {rarity !== 'all' && getRarityIcon(rarity)}
                      <span className="capitalize">{rarity}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 capitalize mb-2">
                {selectedCategory} Items
              </h3>
              <p className="text-gray-600">
                {filteredItems.length} items available • Level {avatarLevel} unlocked
              </p>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-200 ${
                      rarityColors[item.rarity]
                    }`}
                  >
                    {/* Item Preview */}
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                        {item.previewImage}
                      </div>
                      
                      {/* Rarity Badge */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {getRarityIcon(item.rarity)}
                        <span className="text-xs font-medium capitalize">{item.rarity}</span>
                      </div>
                    </div>

                    {/* Item Info */}
                    <h4 className="font-bold text-gray-800 mb-2">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                    {/* Cost & Purchase */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        {item.cost.focusPoints && (
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span>{item.cost.focusPoints} FP</span>
                          </div>
                        )}
                        {item.cost.sleepCoins && (
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-purple-500" />
                            <span>{item.cost.sleepCoins} SC</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onPurchase(item.id)}
                        disabled={!canAfford(item)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          canAfford(item)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford(item) ? 'Purchase' : 'Cannot Afford'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Items Available</h3>
                  <p className="text-gray-600">
                    {selectedCategory === 'appearance' && 'You own all available appearance items!'}
                    {selectedCategory === 'cottage' && 'You own all available cottage items!'}
                    {selectedCategory === 'boosters' && 'No boosters available right now.'}
                    {selectedCategory === 'themes' && 'Themes coming soon!'}
                  </p>
                </div>
              )}
            </div>

            {/* Locked Items Preview */}
            {avatarLevel < 10 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Coming Soon
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Unlock more amazing items by leveling up your avatar!
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {shopItems
                    .filter(item => item.unlockLevel > avatarLevel)
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="text-center p-3 bg-white rounded-lg border opacity-60">
                        <div className="text-2xl mb-1">{item.previewImage}</div>
                        <p className="text-xs text-gray-500 font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">Level {item.unlockLevel}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarShop;