# Selektor 5000

A single-page application that randomly selects from a set of configurable URLs. Once selected, the URL opens in a new browser tab and won't be chosen again until reset.

## Features

### Core Functionality
- **Random Selection**: Randomly select from configured selectees with one click on the display box or Enter key
- **Smart Tracking**: Selected items are marked as used and won't be chosen again (session only - resets on page reload)
- **Auto-Open**: Selected URLs automatically open in a new browser tab (reuses same tab)
- **Reset System**: Clear used items to start over with the full list (no confirmation needed)
- **Sound Effects**: Optional spin and celebration sounds during selection
- **Skip Animation**: Press Enter during animation to jump straight to selection
- **Funny Hints**: 80+ humorous phrases appear during spin animation for entertainment

### Dual Display Modes
- **Selection Mode**: Clean, focused interface for the random selection experience
  - Large clickable display box (click or press Enter to select)
  - Remaining selectee counter
  - Reset button
  - Funny hints during animation
- **Configuration Mode**: Complete selectee management interface
  - Add/remove selectees with display names
  - Inline editing: click to edit names or URLs in place
  - Right-click context menu: Check URL, Open URL, Duplicate, Mark Done
  - Visual indication of used vs. available selectees
  - Compact list view for maximum visibility
  - Scrollable list with pinned controls
  - Import/export configuration
  - Reset to defaults or clear all
  - Sound effects toggle

### Configuration Management
- **Export Config**: Download current configuration as JSON file
- **Import Config**: Upload previously exported configurations
- **Default Config**: Automatically loads from `default-config.json` on first use
- **Reset to Defaults**: Restore original configuration from `default-config.json`
- **Clear All**: Remove all URLs with confirmation
- **Context Menu**: Right-click any entry for quick actions
  - Check URL to verify accessibility
  - Open URL in new tab for testing
  - Duplicate entry with auto-numbered unique name
  - Mark Done to manually toggle used/available status

### Fun & Interactive UI
- **Click-to-Select**: Click the large display box or press Enter to trigger selection
- **Funny Hints**: 80+ humorous phrases during spin ("🎯 Is it...", "🔥 Hot pick:", "🎸 Guitar solo for...")
- **Spinning Animation**: Cycles through available selectee names before selection (skips if only 1 remains)
- **Celebration Effect**: Animated fanfare when a selectee is chosen
- **Sound Effects**: Optional spin beeps and celebration chord
- **Keyboard Shortcuts**: Enter to select/skip animation, Escape to cancel editing
- **Inline Editing**: Click any name or URL to edit in place with validation
- **Context Menu**: Right-click for quick actions (check, open, duplicate, mark done)
- **Smooth Transitions**: Fade animations when switching between modes
- **Compact Layout**: More entries visible with efficient spacing
- **Modern Design**: Purple gradient theme with clean, accessible interface
- **Responsive**: Works great on desktop and mobile devices
- **Visual Feedback**: Hover effects, emoji icons and color coding for better UX

### Technical Features
- **No Backend Required**: Pure client-side application (HTML, CSS, JavaScript)
- **Persistent Storage**: Configuration saved in browser localStorage
- **Session-Only Tracking**: Used selectees reset on page reload for fresh starts
- **Single Page Application**: Fast, responsive, no page reloads
- **Export Format**: Standard JSON format for easy sharing and backup
- **Default Configuration**: JSON-based defaults deployable with the app
- **Hidden Debug View**: Developer tools accessible via secret activation (5 clicks on footer)
- **Async Initialization**: Properly loads defaults before rendering

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

Current version: **v4**
