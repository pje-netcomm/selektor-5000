# Changelog

All notable changes to Selektor 5000 will be documented in this file.

## v7.1.1 - Retro Animation Polish (2026-04-16)

### Animation Improvements 🎮
- **Extended animation durations** for better visibility:
  - Pac-Man: minimum 3.5 seconds
  - Space Invaders: minimum 4 seconds  
  - Pong: minimum 3 seconds
- **Enhanced Pong animation**:
  - Added paddles at left and right edges
  - Added top and bottom court boundaries
  - Ball bounces realistically off paddles and boundaries
  - More complex ball trajectory with 9 waypoints
- **Enhanced Space Invaders animation**:
  - Added player ship at bottom with horizontal patrol
  - Added dynamic laser shooting from ship position
  - Lasers shoot straight up from ship's current location
  - JavaScript-driven laser animation for accurate positioning
  - Ship and aliens properly separated with clear spacing

### Visual Fixes 🎨
- Removed pixel square effects between game animations and celebrations
- Fixed celebration layout so "Press The Any Key" always appears below text
- Improved vertical spacing in all retro animations

### Documentation 📖
- Added comprehensive test mode documentation to README
- Documented "spispopd" activation sequence
- Listed all 8 test mode animation options

## v7.1.0 - Enhanced Retro Animations (2026-04-15)

### Tetris Animation Improvements 🎮
- Complete refactor of Tetris animation with proper physics
- Blocks fall vertically from random positions
- Rotate 0-3 times in 90-degree increments during fall
- Proper collision detection (blocks stack on each other and bottom)
- Speed-based block counts: 2/4/6/8 for fast/normal/slow/very-slow
- Animation duration automatically extends to show all blocks

### Animation Distribution System 🎲
- Implemented shuffle bag algorithm for fair animation distribution
- Each animation (Pac-Man, Space Invaders, Pong, Tetris) appears exactly once every 4 selections
- No repetition within a cycle, but order is randomized
- Separate bags for spin and celebration animations

### Test Mode Enhancements 🧪
- Test mode now works from any screen (including initial C64 prompt)
- Animations run continuously until Escape is pressed
- Two-level Escape: first press returns to menu, second exits test mode
- Added "ESC TO MENU" prompts during animations
- Sound effects continue properly in test mode

### Bug Fixes 🐛
- Fixed Tetris blocks continuing to fall after spin animation completes
- Fixed Tetris pieces overlapping with name display
- Improved animation cleanup and state management

---

## v7.0.0 - Retro 8-Bit UI Mode (2026-04-14)

### New Retro UI Mode 🎮
- Added authentic Commodore 64 / Game Boy inspired interface
- Green phosphor screen with CRT-style scanlines
- Authentic C64 BASIC boot sequence with blinking cursor
- Program loading animation (first selection only)
- Terminal-style scrolling display

### Retro Visual Effects ✨
- Screen shake and glitch pixels during selection
- Explosion, pixel bursts, and starfield effects
- Flashing border and celebration effects
- 8-bit sound effects with arcade-style blips and victory fanfare

---

## v6.8.0 - Customizable Icons & Persistent Card Order (2026-04-14)

### New Features
- **Customizable Card Icons**: Choose emoji icons for your cards
  - 150+ emojis organized in 10 categories (Games, Stars, Party, Food, Awards, Work, Travel, Hearts, Nature, Animals)
  - Click card icon in settings to open picker
  - Type or paste custom emojis
  - Icons persist per profile
  - Keyboard shortcuts for emoji picker (ESC to cancel, Enter to apply)
  - Paste support for custom emojis
  
- **Persistent Card Order**: Card order maintained across page reloads
  - Cards shuffle once, then stay in same order
  - Prevents unexpected re-shuffling


## v6.7.0 - Cards UI Polish (2026-04-08)

### Improvements
- Better card sizing algorithm prevents layout issues
- Cards automatically resize when window resizes
- Wider layout (1200px max-width) for better use of screen space
- Double-click flipped cards to reopen their URL
- Fun colorful 🎯 favicon added

---

## v6.6.0 - Cards Grid UI (2026-04-08)

### New Cards UI Mode
- Grid of face-down cards representing selectees
- Click individual cards OR use "Select Random Card" button
- Smooth 3D flip animation with celebration emojis
- Used cards become semi-transparent
- Selected card highlighted with golden glow
- Auto-scroll to selected card
- Cards automatically sized for optimal display

### Settings Enhancement
- UI Type selector: choose between Default (animated) or Cards (grid)
- Setting saved per profile

---

## v6.5.0 - UX Improvements (2026-04-07)

### New Features
- **Collapsible sections** in setup mode for better organization
- **Auto-reset**: Clicking when all items used automatically resets (no alert needed)

### Improvements
- Click section headers to collapse/expand
- Better focus on what you're editing

---

## v6.4.0 - Enhanced Settings (2026-04-07)

### New Settings
- **Sound volume control** (0-100%)
- **Animation speed control** (Disabled, Fast, Normal, Slow, Very Slow)
- **URL opening toggle** (enable/disable automatic URL opening)
- **Space bar trigger** for selection (in addition to Enter key)
- All settings saved per profile
- Skip animation entirely by setting speed to "Disabled"

---

## v6.3.1 - Better Randomization (2026-04-07)

### Bug Fixes
- Improved random selection algorithm to prevent repeats
- More fair distribution across multiple selections

---

## v6.3 - Fixed Configuration Mode (2026-03-31)

### New Feature: Fixed Configuration Mode
- Deploy read-only configurations for team environments
- Place `fixed-config.json` alongside app files for automatic detection
- URLs and branding become read-only (locked with 🔒 indicators)
- Users can still customize personal settings and track their own progress
- Perfect for teams: admin manages URLs, users track individually

### How It Works
- App auto-detects and loads `fixed-config.json` on startup
- Add/Remove/Edit controls disabled for URLs
- Profile customization disabled
- Settings and used items still saved per user
- Visual indicators show fixed mode (orange theme, 🔒 badges)

---

## v6.2 - Interactive JSON Tree View (2026-03-31)

### Debug View Improvements
- Interactive JSON tree view with expand/collapse
- VS Code-style syntax highlighting
- Expand All / Collapse All controls
- Better navigation of complex configurations

---

## v6.1 - Changelog Viewer (2026-03-31)

### New Features
- Changelog viewer in debug mode
- Tabbed interface (Configuration, Browser State, Changelog)
- Beautiful markdown rendering with purple theme
- Easy version history access

---

## v6 - Profile System (2026-03-31)

### Major New Features
- **Multiple Profile Support**: Create and manage unlimited profiles
  - Each profile has independent URLs, settings, and tracking
  - Switch between profiles instantly
  - Create, rename, and delete profiles

- **Customizable Branding**: Configure per-profile
  - Custom title (e.g., "Team Picker", "Movie Night")
  - Custom subtitle/tagline
  - Custom topic name (e.g., "Team Member", "Restaurant", "Movie")
  - UI dynamically updates throughout

- **Profile Migration**: Automatically upgrades old data to new format

### UI Improvements
- Clean profile header bar with dropdown selector
- Inline edit panel (replaces modal dialogs)
- Keyboard shortcuts: Enter to save, Escape to cancel
- Better visual hierarchy
- Mobile responsive layout

---

## v5 - Context Menu & Documentation (2026-03-30)

### New Features
- **Right-click context menu** on URLs:
  - Check URL (verify accessibility)
  - Open URL (test in new tab)
  - Duplicate (create numbered copy)
  - Mark Done (toggle used/available)

### Documentation
- Comprehensive standalone app packaging guide
- Multiple approaches covered (Electron, Tauri, NW.js, Python, PWA)

---

## v4 - Fun & Usability (2026-03-30)

### New Features
- **Funny hints during spin**: 80+ humorous phrases
- **Hidden debug view**: Click footer 5 times to access developer tools
- **Inline editing**: Click names or URLs to edit in place
- **Enter key support** in selection mode

### Changes
- Compact list view with better space efficiency
- Always-visible controls (pinned at bottom)
- Improved default config loading

---

## v3 - Tab Behavior (2026-03-30)

### Changes
- URLs now reuse the same browser tab (instead of creating new tabs)
- Reset button no longer requires confirmation
- UI terminology changed from "URL" to "Selectee"

---

## v2 - Sound & Animation (2026-03-30)

### New Features
- Sound effects (spin and celebration sounds)
- Sound toggle in settings
- Skip animation by pressing Enter
- Click display box to trigger selection (button removed)

### Improvements
- Smart animation: skips spinning when only 1 item remains
- Better visual feedback with hover effects

---

## v1 - Initial Release (2026-03-30)

### Core Features
- Random URL selection with spinning animation
- Dual modes: Selection and Configuration
- URL management (add/remove with display names)
- Smart tracking (prevents repeats until reset)
- Reset functionality
- Configuration import/export
- Default configuration support
- Persistent storage in browser
- Fun animations and celebration effects
- Modern purple gradient UI
- Mobile responsive design

---

**Note**: This is a simplified changelog focused on user-facing features. Technical implementation details have been removed for clarity.
