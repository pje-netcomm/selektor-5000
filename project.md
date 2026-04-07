# Selektor 5000

A single-page application that randomly selects from a set of configurable URLs. Once selected, the URL opens in a new browser tab and won't be chosen again until reset. Supports multiple profiles with customizable titles and topics.

## Features

### Core Functionality
- **Random Selection**: Randomly select from configured selectees with one click on the display box or Enter key
- **Smart Tracking**: Selected items are marked as used and won't be chosen again (persisted across page reloads)
- **Persistent State**: Current mode, used items, and all settings are remembered across page reloads
- **Auto-Open**: Selected URLs automatically open in a new tab (or same tab based on settings)
- **Tab Behavior**: Choose between opening URLs in new tab (reuses same tab) or same tab (navigates away)
- **Reset System**: Clear used items to start over with the full list (no confirmation needed)
- **Sound Effects**: Optional spin and celebration sounds during selection
- **Skip Animation**: Press Enter during animation to jump straight to selection
- **Funny Hints**: 80+ humorous phrases appear during spin animation for entertainment

### Multiple Profiles
- **Profile Management**: Create, switch, rename, and delete multiple profiles
- **Independent Settings**: Each profile has its own URLs, settings, and used item tracking
- **Customizable Branding**: Configure title, subtitle, and topic/item name per profile
  - Title: Main header text (default: "Selektor 5000")
  - Subtitle: Tagline text (default: "The anti-procrastination dev selector")
  - Topic: Singular item name (default: "Selectee") - used throughout UI
- **Profile Migration**: Automatically migrates old single-profile data to new format
- **Profile Export/Import**: Each profile can be exported and imported independently

### Dual Display Modes
- **Selection Mode**: Clean, focused interface for the random selection experience
  - Large clickable display box (click or press Enter to select)
  - Remaining selectee counter
  - Reset button
  - Funny hints during animation
  - Dynamic UI based on profile's custom title/topic
- **Configuration Mode**: Complete selectee management interface
  - Profile selector and management (create, rename, customize, delete)
  - Add/remove selectees with display names
  - Inline editing: click to edit names or URLs in place
  - Right-click context menu: Check URL, Open URL, Duplicate, Mark Done
  - Visual indication of used vs. available selectees
  - Compact list view for maximum visibility
  - Scrollable list with pinned controls
  - Import/export configuration
  - Reset to defaults or clear all
  - Sound effects toggle
  - New tab behavior toggle

### Configuration Management
- **Profile Operations**: Create, switch, rename, and delete profiles
- **Customize Profile**: Set custom title, subtitle, and topic name per profile
- **Fixed Configuration Mode**: Deploy read-only configs for shared environments
  - Place `fixed-config.json` alongside app files
  - URLs and branding become read-only
  - Users can still customize sound effects, tab behavior, and track used items
  - Perfect for teams - admin sets URLs, users have personal tracking
- **Export Config**: Download current profile configuration as JSON file
- **Import Config**: Upload previously exported profile configurations
- **Default Config**: Automatically loads from `default-config.json` on first use
- **Reset to Defaults**: Restore original configuration from `default-config.json`
- **Clear All**: Remove all URLs from current profile with confirmation
- **Settings**: Toggle sound effects and URL opening behavior (new tab vs same tab)
- **Context Menu**: Right-click any entry for quick actions
  - Check URL to verify accessibility
  - Open URL in new tab for testing
  - Duplicate entry with auto-numbered unique name (disabled in fixed mode)
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
- **Persistent Storage**: All profiles, configurations, used items, and settings saved in browser localStorage
- **State Persistence**: All state persists across page reloads for seamless experience
- **Profile System**: Multiple independent profiles with separate configurations
- **Fixed Configuration Mode**: Read-only config deployment for shared/team environments
  - Detects `fixed-config.json` file automatically
  - URLs and branding locked, settings and tracking stay local
  - Enables centralized URL management with personal tracking
- **Automatic Migration**: Seamlessly migrates old single-profile data to new multi-profile format
- **Single Page Application**: Fast, responsive, no page reloads
- **Export Format**: Standard JSON format for easy sharing and backup (per-profile)
- **Default Configuration**: JSON-based defaults deployable with the app
- **Hidden Debug View**: Developer tools accessible via secret activation (5 clicks on footer)
  - Configuration JSON viewer with copy function
  - Browser state inspector
  - Changelog viewer with full markdown rendering
  - LocalStorage management tools
- **Async Initialization**: Properly loads defaults before rendering

## Use Cases

With the profile system, you can create different configurations for different contexts:

- **Team Member Selector**: Randomly pick someone for daily standups
- **Code Review Roulette**: Distribute code reviews fairly among team members
- **Restaurant Picker**: Decide where to have lunch (configure topic as "Restaurant")
- **Movie Chooser**: Pick tonight's movie from your watchlist
- **Task Assignment**: Randomly assign tasks or responsibilities
- **Learning Queue**: Work through tutorials or courses in random order
- **Multiple Teams**: Separate profiles for different teams or projects
- **Shared Team Config**: Use fixed-config.json for team-wide URL list while each user tracks their own progress

## Fixed Configuration Mode

Deploy `fixed-config.json` alongside the app to enable read-only mode:

### Use Case
Perfect for **teams** or **shared environments** where:
- Admin maintains a centralized list of URLs
- Users cannot modify the URL list or branding
- Each user still has personal tracking of used items
- Individual sound/tab preferences saved locally

### How It Works
1. Create `fixed-config.json` with your URLs and branding
2. Deploy it with the app files
3. App auto-detects and loads it on startup
4. URL list becomes read-only (🔒 indicators shown)
5. Users can still:
   - Toggle sound effects (personal preference)
   - Change tab opening behavior (personal preference)
   - Track which items they've used (personal state)
   - Reset their used items

### What's Locked
- ❌ Cannot add/remove/edit URLs
- ❌ Cannot change title, subtitle, or topic
- ❌ Cannot clear all URLs
- ❌ Cannot customize profile branding

### What's Personal
- ✅ Sound effect preference (saved locally)
- ✅ Open in new tab preference (saved locally)
- ✅ Used items tracking (saved locally)
- ✅ Current mode (Selection vs Setup)

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

Current version: **v6.5.0**

# Things to do (not yet, when I'm ready)
- [config-versioning] localStorage configuration must be tolerant of breaking changes.  If an old format configuration is seen it should import with reasonable behaviour for new or altered config parameters. if a "too new" version is seen, alert that the configuration is not compatible and offer to reset to defaults.  If rejected, changes to localStorage are blocked, and the app is unable to run.
- [alternate-ui-cards]
   - Display selectees "select" mode as a grid of cards, randomly ordered, initially face down, when selected they flip over to reveal the name, and are marked as used.  This would be a more visual and engaging way to interact with the selectees, and could be toggled on/off in settings.  The last selected card should be highlighted in some way.
- [alternate-ui-wheel]
   - Change the "select" mode to be a spinning wheel (like a roulette or prize wheel) with the selectees as segments on the wheel.  When the user clicks to select, the wheel spins and lands on a random segment, which is the selected item.  This would be a fun and visually appealing way to select items, and could also be toggled on/off in settings.  The wheel should have sound effects and animation for extra engagement.
- [alternate-ui-retro]
   - Implement a retro 8-bit style "select" mode, where the selectees are displayed as pixelated characters or icons, and the selection process is accompanied by 8-bit sound effects and animations.  This would give the app a nostalgic and playful vibe, and could be toggled on/off in settings.  The selected item could be highlighted with a flashing border or explosion effect for extra fun.
