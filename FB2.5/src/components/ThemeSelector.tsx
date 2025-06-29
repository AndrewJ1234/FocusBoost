import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeData = availableThemes.find(t => t.key === currentTheme)?.theme;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Palette size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentThemeData?.name}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Choose Theme
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {availableThemes.map(({ key, theme }) => (
                    <motion.button
                      key={key}
                      onClick={() => {
                        setTheme(key);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        currentTheme === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Theme Preview */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: theme.secondary }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />
                        {currentTheme === key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Check size={14} className="text-blue-600" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {theme.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {theme.description}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;