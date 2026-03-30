# Selektor 5000

A single-page application that randomly selects from a set of configurable URLs. Once selected, the URL opens in a new browser tab and won't be chosen again until reset.

## Features

### Core Functionality
- **Random URL Selection**: Randomly select from configured URLs with one click
- **Smart Tracking**: Selected URLs are marked as used and won't be chosen again
- **Auto-Open**: Selected URLs automatically open in a new browser tab
- **Reset System**: Clear used URLs to start over with the full list

### Dual Display Modes
- **Selection Mode**: Clean, focused interface for the random selection experience
  - Large display box with animations
  - Remaining URL counter
  - Select and Reset buttons
- **Configuration Mode**: Complete URL management interface
  - Add/remove URLs with display names
  - Visual indication of used vs. available URLs
  - Import/export configuration
  - Reset to defaults or clear all

### Configuration Management
- **Export Config**: Download current configuration as JSON file
- **Import Config**: Upload previously exported configurations
- **Default Config**: Automatically loads from `default-config.json` on first use
- **Reset to Defaults**: Restore original configuration from `default-config.json`
- **Clear All**: Remove all URLs with confirmation

### Fun & Interactive UI
- **Spinning Animation**: Cycles through available URL names before selection
- **Celebration Effect**: Animated fanfare when URL is selected
- **Smooth Transitions**: Fade animations when switching between modes
- **Modern Design**: Purple gradient theme with clean, accessible interface
- **Responsive**: Works great on desktop and mobile devices
- **Visual Feedback**: Emoji icons and color coding for better UX

### Technical Features
- **No Backend Required**: Pure client-side application (HTML, CSS, JavaScript)
- **Persistent Storage**: Configuration saved in browser localStorage
- **Single Page Application**: Fast, responsive, no page reloads
- **Export Format**: Standard JSON format for easy sharing and backup
- **Default Configuration**: JSON-based defaults deployable with the app

## Requirements

- Modern web browser with JavaScript enabled
- HTTP server required for default config loading (due to CORS restrictions with `file://` protocol)

### Quick Start with HTTP Server

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000/`

## Files

- `index.html` - Main application structure
- `script.js` - Application logic
- `styles.css` - Styling and animations
- `default-config.json` - Default URL configuration (optional)
- `CONFIG.md` - Configuration guide
- `CHANGELOG.md` - Version history

## Version

Current version: **v1**
