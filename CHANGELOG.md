# Changelog

All notable changes to Selektor 5000 will be documented in this file.

## v1 - 2026-03-30

### Initial Release

#### Features
- **Random URL Selection**: Select random URLs from a configured list with fun spinning animation
- **Dual Display Modes**: 
  - Selection Mode: Focus on the random selection experience
  - Configuration Mode: Manage URL list
- **URL Management**:
  - Add URLs with custom display names
  - Remove individual URLs
  - Visual indication of used vs. available URLs
- **Tracking System**: 
  - Tracks which URLs have been selected
  - Shows count of remaining URLs
  - Prevents reselection until reset
- **Reset Functionality**: Clear used URLs to start over with full list
- **Configuration Import/Export**:
  - Export current configuration to JSON file
  - Import previously exported configurations
  - Reset to default configuration
  - Clear all URLs option
- **Default Configuration**: 
  - Load defaults from `default-config.json` on first use
  - Requires HTTP server for fetch API access
- **Persistent Storage**: URLs and usage state saved in browser localStorage
- **Fun Animations**:
  - Cycling animation through available URLs before selection
  - Celebration effect when URL is selected
  - Smooth transitions between modes
- **Modern UI**:
  - Purple gradient theme
  - Responsive design for mobile devices
  - Clean, accessible interface
  - Emoji icons for visual appeal

#### Technical Details
- Single-page application (SPA)
- No backend required
- Pure HTML, CSS, and JavaScript
- LocalStorage for persistence
- HTTP server required for default config loading (due to CORS)

#### Files
- `index.html` - Main application structure
- `script.js` - Application logic
- `styles.css` - Styling and animations
- `default-config.json` - Default URL configuration
- `CONFIG.md` - Configuration guide
- `project.md` - Project description
- `.gitignore` - Git ignore rules
