# Changelog

All notable changes to Selektor 5000 will be documented in this file.

## v6.7.0 - Cards UI Enhancements & Polish (2026-04-08)

### Enhancements
- **Improved Card Sizing Algorithm**: Robust auto-sizing prevents control collisions
  - Accounts for stats area (40px) and controls (80px) when calculating space
  - Ensures text never wraps with white-space: nowrap
  - Minimum font size enforced at 12pt (12-16px range)
  - Dynamic font scaling based on card width
  - Proper flexbox constraints (min-height: 0, max-height: 100%)
  - Scrollbars only appear when truly necessary

- **Window Resize Support**: Cards automatically recalculate size on window resize
  - Event listener triggers renderCards() on resize
  - Smooth adaptation to screen size changes
  - Prevents layout breaking when window dimensions change
  - Cards always properly sized for viewport

- **Wider Layout**: Increased max-width from 800px to 1200px
  - 50% more horizontal space on wide screens
  - More cards per row in cards UI
  - Better use of modern displays
  - Improved overall visual experience

- **Double-Click URL Launch**: Quick access to already selected items
  - Double-click any flipped card to launch its URL
  - Respects openInNewTab setting
  - Reuses tab window if already open
  - Convenient for revisiting selections

- **Fun Favicon**: Added colorful 🎯 target emoji favicon
  - Purple gradient background (matches app theme)
  - Visible in browser tabs and bookmarks
  - SVG data URI (no external file)

### Technical
- Rewritten calculateCardSize() with precise space calculations
- Text width calculation accounts for emojis (14px each)
- Window resize listener for responsive cards
- launchCardUrl() method for double-click functionality
- Enhanced CSS with proper overflow handling

---

## v6.6.0 - Alternate UI: Cards (2026-04-08)

### Major Feature
- **[alternate-ui-cards] Cards Grid UI**: New visual selection interface
  - Grid of face-down cards representing selectees
  - Click individual cards OR use "Select Random Card" button
  - Keyboard shortcuts: Space/Enter trigger random selection
  - Cards displayed in consistent random order (doesn't reshuffle during session)
  - Smooth 3D flip animation with celebration emojis (🎉)
  - Used cards become semi-transparent
  - Newly selected card highlighted with golden glow (6 seconds)
  - Fanfare wobble animation for button/keyboard selections
  - Auto-scroll to selected card (smooth centering)
  - Responsive grid layout adapts to screen size

### Intelligent Auto-Sizing
- **Content-Aware Card Sizing**: Automatically sizes cards for optimal display
  - Analyzes longest display name + celebration emojis
  - Calculates minimum width needed for readability (100-250px)
  - Tries to fit all cards on screen without scrolling
  - Falls back to minimum size + scrolling when needed
  - Responsive text with clamp(), word-break, and hyphenation
  - Cards never too small to read

### Settings Enhancement
- **UI Type Selector**: Choose between display modes
  - Default (Animated) - Original spinning animation UI
  - Cards (Grid) - New card-based selection UI
  - Setting saved per profile
  - Switch anytime from Settings section

### Interaction Modes
- **Click Cards Directly**: Click any face-down card to select it
- **Use Button**: "Select Random Card" button picks randomly
- **Keyboard Shortcuts**: Space or Enter key selects random card
- **Auto-Reset**: Selecting when all cards used automatically resets

### Visual Effects
- 3D flip animation (0.6s)
- Celebration emojis appear on card back
- Golden highlight pulse (repeats 3x over 6 seconds)
- Fanfare wobble for button/keyboard selections
- Smooth scroll to selected card
- Hover effects on available cards
- Float animation on card icons

### Technical
- All card interactions respect existing settings (sound, URL opening, etc.)
- Cards maintain consistent order during session (reshuffle on reset/URL changes)
- Persistent tracking of last selected item
- Dynamic grid sizing based on content and viewport
- Smooth CSS 3D transforms for card flips
- No overflow issues - cards always contained
- Single clean button layout (Select + Reset)

---

## v6.5.0 - UX Improvements 2 (2026-04-07)

### New Features
- **[ux-improvements-2] Collapsible Configuration Sections**: Better organization of setup mode
  - URL Configuration section with collapse/expand
  - Settings section with collapse/expand
  - Click headers to toggle visibility
  - Focus on what you need, hide the rest
  - Both sections expanded by default

- **[ux-improvements-2] Auto-Reset on Empty**: Smart behavior when no selectees remain
  - Clicking selection button when all used automatically resets instead of showing alert
  - More intuitive workflow - no manual reset needed
  - Still shows alert if no URLs are configured

### UI Enhancements
- Settings now properly organized under "Settings" collapsible header
- Visual distinction with gradient headers
- Smooth expand/collapse animations
- Arrow icons indicate expanded/collapsed state

---

## v6.4.0 - Enhanced Settings & UX Improvements (2026-04-07)

### New Features
- **[ux enhancements] Space Bar Trigger**: Space bar now triggers selection in addition to Enter key and clicking
  - Works seamlessly in selection mode
  - Prevents page scrolling during selection
  
### Settings Enhancements
- **[more-settings] Sound Volume Control**: Adjust sound effect volume from 0-100%
  - Slider control with live percentage display
  - Volume applies to both spin and celebration sounds
  - Saved per profile
  
- **[more-settings] Animation Speed Control**: Customize animation duration
  - Options: Disabled, Fast (0.5x), Normal (1x), Slow (1.5x), Very Slow (2x)
  - Set to "Disabled" to skip animation entirely for instant selection
  - Adjusts both spin count and timing dynamically
  - Saved per profile
  
- **[more-settings] URL Opening Control**: Toggle automatic URL opening
  - Enable/disable opening URLs after selection
  - Useful for testing or when you just want to see the selection
  - Saved per profile

### Technical
- All new settings persist in profile configuration
- Backward compatible with existing profiles (sensible defaults applied)
- Settings: `soundVolume` (0-1), `animationDuration` (0-2), `openUrlEnabled` (boolean)
- Default values: soundVolume=0.5, animationDuration=1, openUrlEnabled=true

---

## v6.3.1 - Randomization Fix (2026-04-07)

### Bug Fixes
- **Improved Random Selection**: Fixed issue where same selectee could be chosen repeatedly
  - Selection now happens after animation (not before)
  - Added timestamp-based seed for extra entropy
  - Combines timestamp seed with Math.random() for better distribution
  - More truly random selection across multiple uses

### Technical
- Moved random selection to after animation completes
- Added: `const seed = Date.now() % availableUrls.length`
- Formula: `(seed + Math.floor(Math.random() * length)) % length`
- Better randomization ensures fair distribution

---

## v6.3 - Fixed Configuration Mode (2026-03-31)

### Major Feature
- **Fixed Configuration Mode**: Deploy read-only configs for shared/team environments
  - Place `fixed-config.json` alongside app files
  - URLs and branding become read-only (locked)
  - Users can still customize personal settings (sound, tab behavior)
  - Individual tracking of used items persists locally
  - Perfect for teams: admin manages URLs, users have personal tracking

### How It Works
- App auto-detects `fixed-config.json` on startup
- If found, switches to fixed mode automatically
- URL list locked with 🔒 indicators
- Add/Remove/Edit URL controls disabled
- Profile customization disabled
- Settings and used items still saved per user

### Read-Only Elements
- URLs (cannot add/remove/edit)
- Title, subtitle, topic (cannot customize)
- Profile branding (edit button disabled)

### User-Specific Elements
- Sound effects toggle (saved locally)
- Open in new tab toggle (saved locally)
- Used items tracking (saved locally)
- Current mode (Selection vs Setup)

### Improvements
- Visual indicators show fixed mode (🔒 badges, orange theme)
- Fixed mode notice displayed in config view
- Disabled controls for locked features
- Orange gradient indicator in header

### Bug Fixes
- Removed duplicate confirmation dialog when resetting to defaults

---

## v6.2 - Interactive JSON Tree View (2026-03-31)

### Added
- **Interactive JSON Tree View**: Collapsible tree view for debug JSON data
  - Click to expand/collapse objects and arrays
  - Syntax highlighting with VS Code dark theme colors
  - Expand All / Collapse All buttons
  - Auto-expands first 2 levels for quick overview
  - Item count badges for arrays and objects
- **Enhanced Debug Experience**
  - Dark theme JSON viewer (#1e1e1e background)
  - Color-coded values: strings (orange), numbers (green), booleans (blue), null (gray)
  - Smooth expand/collapse animations
  - Better readability with proper indentation

### Improvements
- Replaced plain text JSON with interactive tree
- Visual hierarchy with expandable nodes
- Professional syntax highlighting
- Easy navigation of complex nested structures
- Copy buttons now copy formatted JSON

---

## v6.1 - Enhanced Debug View (2026-03-31)

### Added
- **Changelog Viewer in Debug Mode**: View full changelog with markdown rendering
  - Tabbed interface in debug view (Configuration, Browser State, Changelog)
  - Beautiful markdown rendering with styled headers, lists, and code blocks
  - Purple theme matching application design
  - Loads CHANGELOG.md dynamically via fetch
- **Debug Tab System**: Easy navigation between different debug views
  - Smooth tab switching with animations
  - Active tab highlighting

### Improvements
- Debug view now has organized tabs instead of scrolling sections
- Better visual hierarchy in debug interface
- Markdown parser for changelog rendering (headers, lists, bold, code, hr)

---

## v6 - Profile System (2026-03-31)

### Major Features
- **Multiple Profile Support**: Create and manage multiple independent profiles
  - Each profile has its own URLs, settings, and used item tracking
  - Switch between profiles with dropdown selector
  - Create, rename, customize, and delete profiles
- **Customizable Branding**: Configure per-profile
  - Custom title (e.g., "Team Picker", "Movie Night")
  - Custom subtitle/tagline
  - Custom topic/item name (e.g., "Team Member", "Restaurant", "Movie")
  - UI dynamically updates to use custom terminology
- **Profile Migration**: Automatically upgrades old single-profile data to new format
- **Enhanced Export/Import**: Profile configurations include all customization

### UI/UX Improvements
- **Profile Header Bar**: Clean, prominent profile selector at top of config section
  - Gradient purple header with inline controls
  - Compact icon buttons (➕ New, ✏️ Edit, 🗑️ Delete)
- **Inline Edit Panel**: Replaces modal dialogs with smooth slide-down panel
  - Edit profile name, title, subtitle, and topic in one place
  - Keyboard shortcuts: Enter to save, Escape to cancel
  - Validation before saving
  - Animated slide-down effect
- **Better Visual Hierarchy**: Profile management separated from URL configuration
- **Mobile Responsive**: Stacked layout for profile controls on small screens

### Improvements
- Profile selector in configuration mode
- Profile management buttons (New, Rename, Customize, Delete)
- Dynamic placeholders and labels based on topic
- Updated debug view to show profile information
- Automatic profile name in exported filenames
- Settings persist per profile (sound effects, tab behavior)

### Technical
- Complete refactor to support profile architecture
- Backward compatible with old configuration format
- All state now scoped to profiles
- Getter/setter properties for clean profile access

---

## v5 - 2026-03-30

### Added
- **Context Menu**: Right-click on display names or URLs for quick actions
  - Check URL: Verify URL is accessible
  - Open URL: Open in new tab for testing
  - Duplicate: Create copy with numbered unique name
  - Mark Done: Manually toggle used/available status

### Documentation
- **STANDALONE-APP-GUIDE.md**: Comprehensive guide for packaging as desktop app
  - 5 different approaches (Electron, Tauri, NW.js, Python+WebView, PWA)
  - Code examples and build instructions
  - Distribution strategies and installation guides
  - Recommends Electron for best balance

### Technical
- Custom context menu with position tracking
- Right-click event handlers on list items
- Auto-numbering for duplicated entries

## v4 - 2026-03-30

### Added
- **Funny Hints During Spin**: 80+ humorous phrases appear before each selectee name during animation
  - Categories: gaming, food, nature, explosions, carnival, fantasy, music, time/destiny
  - Examples: "🎯 Is it...", "🔥 Hot pick:", "🎸 Guitar solo for..."
- **Hidden Debug View**: Secret developer tools (click footer 5 times within 2 seconds)
  - View configuration JSON and copy to clipboard
  - View in-browser state (localStorage + current session)
  - Clear localStorage with confirmation
  - Reload page button
- **Inline Editing**: Click display names or URLs to edit in place
  - Enter to save, Escape to cancel
  - Input validation for empty values and invalid URLs
  - Hover effects to show clickable fields
- **Enter Key in Selection Mode**: Press Enter to start random selection

### Changed
- **Session-Only Tracking**: Used URLs no longer persist across page reloads (fresh start each session)
- **Compact List View**: Reduced padding/margins by 30-40%, smaller fonts, text truncation for more visible entries
- **Always-Visible Controls**: Config buttons and add form stay pinned at bottom with scrollable URL list
- **Default Config Loading**: Properly awaits default-config.json on first use (fixed race condition)

### Technical
- Made init() async to properly load defaults before rendering
- Added isSelecting flag to prevent double-trigger
- Flexbox layout for config section with overflow scrolling
- Click-to-edit functionality with autofocus inputs
- Custom context menu with position tracking

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
