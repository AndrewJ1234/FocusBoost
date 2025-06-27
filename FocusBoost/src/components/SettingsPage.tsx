import React from 'react';
import { ExtensionStatus } from '../types';

interface SettingsPageProps {
  extensionStatus: ExtensionStatus;
  onExportData: () => void;
  onResetData: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  extensionStatus,
  onExportData,
  onResetData
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Extension Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Real-time Tracking</h4>
              <p className="text-sm text-gray-600">Monitor tab activity across all websites with AI detection</p>
            </div>
            <div className={`w-12 h-6 rounded-full ${
              extensionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-300'
            } relative transition-colors`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                extensionStatus === 'connected' ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Status</h4>
            <p className={`text-sm ${
              extensionStatus === 'connected' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {extensionStatus === 'connected' 
                ? '✅ Extension Connected' 
                : '⚠️ Extension Not Found - Running Demo Mode'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Configuration</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Customize how websites are categorized for better tracking accuracy
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'AI Tools', color: 'purple', count: '15+ sites' },
              { name: 'Development', color: 'blue', count: '12+ sites' },
              { name: 'Productive', color: 'green', count: '10+ sites' },
              { name: 'Educational', color: 'orange', count: '8+ sites' }
            ].map(category => (
              <div key={category.name} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 bg-${category.color}-500 rounded-full mb-2`}></div>
                <p className="font-medium text-sm text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Export Data</h4>
              <p className="text-sm text-gray-600">Download your productivity data as JSON</p>
            </div>
            <button 
              onClick={onExportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Export {extensionStatus === 'disconnected' && '(Extension Required)'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-medium text-red-900">Reset All Data</h4>
              <p className="text-sm text-red-700">Permanently delete all tracking data</p>
            </div>
            <button 
              onClick={onResetData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">About FocusBoost</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            FocusBoost helps students and professionals track their digital habits and improve 
            productivity by monitoring browsing activity and providing actionable insights with 
            advanced AI categorization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Version</h4>
              <p>2.1.0 Enhanced</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Storage</h4>
              <p>Local only (privacy protected)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Detection</h4>
              <p>15+ AI tools recognized</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-2">Features</h4>
            <ul className="space-y-1 text-xs">
              <li>• Smart website categorization with AI tool detection</li>
              <li>• iPhone-style sleep mode with wind down routines</li>
              <li>• Real-time session tracking and productivity scoring</li>
              <li>• Historical analytics with trend analysis</li>
              <li>• Privacy-first local data storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;