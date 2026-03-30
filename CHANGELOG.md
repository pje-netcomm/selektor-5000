# Changelog

All notable changes to Selektor 5000 will be documented in this file.

## v3 - 2026-03-30

### Changed
- **Tab Reuse**: Opened URLs now reuse the same browser tab instead of creating new tabs each time
- **No Reset Confirmation**: Reset button no longer prompts for confirmation
- **UI Terminology**: Changed all references from "URL" to "Selectee" in user-facing text

### Technical
- Use named window target for tab reuse instead of '_blank'
- Removed confirmation dialog from reset function

## v2 - 2026-03-30

### Added
- **Sound Effects**: Spin sound during animation and celebration sound on selection
- **Sound Toggle**: Enable/disable sound effects in Configuration Mode
- **Skip Animation**: Press Enter during animation to skip straight to selection
- **Click-to-Select**: Display box is now clickable to trigger selection (removed button)

### Changed
- **Simplified UI**: Removed "Select Random URL" button in favor of clicking the display box
- **Display Text**: Changed from "Press the button to start!" to "Select Random URL"
- **Smart Animation**: When only 1 URL remains, skip spinning animation
- **Visual Feedback**: Display box scales on hover and click for better interactivity

### Technical
- Web Audio API for synthesized sound effects (no external files)
- Sound preference saved in localStorage and exported configs
- Backward compatible config imports (old configs default sound to enabled)
- Enter key listener added/removed cleanly during selection

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
