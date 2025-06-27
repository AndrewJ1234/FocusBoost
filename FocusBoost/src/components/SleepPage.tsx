// components/SleepPage.tsx
import React, { useState } from 'react';
import { Moon, BellOff, Clock, ChevronRight, Headphones, Book, Coffee } from 'lucide-react';
import { ExtensionData, SleepInput, ExtensionStatus } from '../types';

interface SleepPageProps {
  data: ExtensionData;
  sleepInput: SleepInput;
  setSleepInput: React.Dispatch<React.SetStateAction<SleepInput>>;
  extensionStatus: ExtensionStatus;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedChart: 'productivity' | 'sleep';
  setSelectedChart: (chart: 'productivity' | 'sleep') => void;
  onSleepLog: (sleepTime: string, wakeTime: string) => void;
}

const SleepPage: React.FC<SleepPageProps> = ({ 
  data, 
  sleepInput, 
  setSleepInput, 
  extensionStatus,
  onSleepLog
}) => {
  const [sleepMode, setSleepMode] = useState(false);
  const [windDownMinutes, setWindDownMinutes] = useState(30);
  const [showWindDown, setShowWindDown] = useState(false);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${sleepMode ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <Moon className={`w-6 h-6 ${sleepMode ? 'text-purple-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Sleep Mode</h3>
              <p className="text-sm text-gray-600">
                {sleepMode ? 'Sleep mode is active - tracking paused' : 'Enable sleep mode to pause tracking'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setSleepMode(!sleepMode)}
            className={`relative w-16 h-9 rounded-full transition-all duration-300 ${
              sleepMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-transform duration-300 shadow-lg ${
                sleepMode ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {sleepMode && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-800">
              <BellOff className="w-5 h-5" />
              <span className="font-medium">Do Not Disturb is active</span>
            </div>
            
            <button
              onClick={() => setShowWindDown(!showWindDown)}
              className="w-full flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Wind Down Settings</span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${showWindDown ? 'rotate-90' : ''}`} />
            </button>

            {showWindDown && (
              <div className="space-y-4 p-4 bg-white rounded-lg border">
                <div>
                  <p className="text-sm text-gray-600 mb-3">Start wind down routine before sleep:</p>
                  <div className="flex gap-2">
                    {[15, 30, 45, 60].map(minutes => (
                      <button
                        key={minutes}
                        onClick={() => setWindDownMinutes(minutes)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                          windDownMinutes === minutes
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {minutes}min
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">Wind Down Shortcuts:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Headphones, label: 'Calm Music', color: 'green' },
                      { icon: Book, label: 'Reading', color: 'blue' },
                      { icon: Coffee, label: 'Journal', color: 'orange' }
                    ].map(({ icon: Icon, label, color }) => (
                      <button
                        key={label}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-dashed border-${color}-200 hover:border-${color}-400 hover:bg-${color}-50 transition-colors`}
                      >
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                        <span className={`text-xs font-medium text-${color}-700`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sleep Tracking */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Sleep Tracking
        </h3>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Log your sleep times to see productivity correlation and insights
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Time
              </label>
              <input
                type="time"
                value={sleepInput.sleepTime}
                onChange={(e) => setSleepInput(prev => ({ ...prev, sleepTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wake Time
              </label>
              <input
                type="time"
                value={sleepInput.wakeTime}
                onChange={(e) => setSleepInput(prev => ({ ...prev, wakeTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (sleepInput.sleepTime && sleepInput.wakeTime) {
                onSleepLog(sleepInput.sleepTime, sleepInput.wakeTime);
                setSleepInput({ sleepTime: '', wakeTime: '' });
              }
            }}
            disabled={!sleepInput.sleepTime || !sleepInput.wakeTime}
            className="w-full bg-purple-600 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Log Sleep {extensionStatus === 'disconnected' && '(Extension Required)'}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">💤 Sleep Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Sleep & Productivity</h4>
            <p className="text-sm text-purple-700 leading-relaxed">
              Quality sleep directly impacts your focus and productivity. Aim for 7-9 hours 
              of consistent sleep to optimize your cognitive performance and maintain steady energy levels.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Wind Down Benefits</h4>
            <p className="text-sm text-purple-700 leading-relaxed">
              A proper wind-down routine helps signal to your brain that it's time to sleep. 
              This can improve sleep quality and make it easier to fall asleep naturally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepPage;