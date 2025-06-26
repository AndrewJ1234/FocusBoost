// Content script to communicate with dashboard
(function() {
  'use strict';

  // Only run on FocusBoost dashboard
  if (!window.location.href.includes('localhost') || !window.location.href.includes('5173')) {
    return;
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FOCUSBOOST_UPDATE') {
      // Forward to dashboard
      window.postMessage({
        type: 'FOCUSBOOST_EXTENSION_DATA',
        payload: message.payload
      }, '*');
    }
  });

  // Listen for requests from dashboard
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'FOCUSBOOST_REQUEST') {
      const { action, payload } = event.data;
      
      chrome.runtime.sendMessage({ action, ...payload }, (response) => {
        window.postMessage({
          type: 'FOCUSBOOST_RESPONSE',
          action,
          payload: response
        }, '*');
      });
    }
  });

  // Notify dashboard that extension is available
  window.postMessage({
    type: 'FOCUSBOOST_EXTENSION_READY'
  }, '*');
})();