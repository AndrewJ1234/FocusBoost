import React from 'react';
import { Download, Chrome, AlertCircle } from 'lucide-react';

export const ExtensionPrompt: React.FC = () => {
  const handleInstallExtension = () => {
    const extensionFiles = {
      'manifest.json': JSON.stringify({
        "manifest_version": 3,
        "name": "FocusBoost - Real-Time Tab Tracker",
        "version": "1.0.0",
        "description": "Track your browsing habits and productivity in real-time",
        "permissions": ["tabs", "activeTab", "storage", "background", "scripting"],
        "host_permissions": ["<all_urls>"],
        "background": {
          "service_worker": "background.js",
          "type": "module"
        },
        "content_scripts": [{
          "matches": ["<all_urls>"],
          "js": ["content.js"],
          "run_at": "document_start"
        }],
        "action": {
          "default_popup": "popup.html",
          "default_title": "FocusBoost"
        },
        "icons": {
          "16": "icon16.png",
          "32": "icon32.png",
          "48": "icon48.png",
          "128": "icon128.png"
        }
      }, null, 2)
    };

    alert('Extension files are ready! Please check the /extension folder in your project and follow the installation instructions below.');
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-r-xl">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Extension Required for Real Tab Tracking
          </h3>
          <p className="text-yellow-700 mb-4">
            Currently showing simulated data. Install the FocusBoost browser extension to track your actual browsing activity across all websites.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Chrome className="w-4 h-4 mr-2" />
              Installation Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Open Chrome and navigate to <code className="bg-gray-100 px-1 rounded">chrome://extensions/</code></li>
              <li>Enable "Developer mode" in the top right corner</li>
              <li>Click "Load unpacked" and select the <code className="bg-gray-100 px-1 rounded">/extension</code> folder from this project</li>
              <li>The FocusBoost extension will appear in your extensions list</li>
              <li>Refresh this dashboard page to connect with the extension</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleInstallExtension}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              View Extension Files
            </button>
            <a
              href="https://developer.chrome.com/docs/extensions/mv3/getstarted/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <Chrome className="w-4 h-4" />
              Extension Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};