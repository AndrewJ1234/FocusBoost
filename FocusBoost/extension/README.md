# FocusBoost Browser Extension

This browser extension enables real-time tab tracking for the FocusBoost dashboard.

## Installation Instructions

### For Chrome/Chromium browsers:

1. **Enable Developer Mode**
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

2. **Load the Extension**
   - Click "Load unpacked"
   - Select the `/extension` folder from this project
   - The FocusBoost extension should appear in your extensions list

3. **Verify Installation**
   - Look for the FocusBoost icon in your browser toolbar
   - Click it to see the popup with tracking stats
   - Refresh the FocusBoost dashboard to connect with the extension

### For Firefox:

1. **Temporary Installation**
   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `/extension` folder

## Features

- **Real-time tab tracking** across all websites
- **Automatic categorization** of websites (productive, entertainment, social, etc.)
- **Time tracking** for each tab and website
- **Privacy-focused** - all data stays local in your browser
- **Dashboard integration** - seamlessly connects with the FocusBoost web dashboard

## Permissions Explained

- **tabs**: Required to monitor tab switches and get tab information
- **activeTab**: Needed to track the currently active tab
- **storage**: Used to save tracking data locally in your browser
- **background**: Enables continuous tracking even when dashboard is closed
- **scripting**: Allows communication between extension and dashboard
- **<all_urls>**: Necessary to track activity across all websites

## Privacy

- All tracking data is stored locally in your browser
- No data is sent to external servers
- You have full control over your data with export/reset options
- The extension only tracks tab metadata (URL, title, time) - not page content

## Troubleshooting

- **Extension not connecting**: Refresh the dashboard page after installing
- **No data showing**: Make sure the extension is enabled and permissions are granted
- **Popup not working**: Try reloading the extension in chrome://extensions/

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `background.js` - Service worker for tab tracking
- `content.js` - Communication bridge with dashboard
- `popup.html/js` - Extension popup interface