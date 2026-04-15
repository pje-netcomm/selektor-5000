# 🎯 Selektor 5000

A beautiful single-page application for random URL selection with multiple profiles, customizable branding, and persistent state.

![Version](https://img.shields.io/badge/version-7.1.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![No Dependencies](https://img.shields.io/badge/dependencies-none-green)

## ✨ Features

### 🎲 Random Selection
- Click to randomly select from your configured URLs
- Smart tracking - selected items won't repeat until reset
- Animated spinning effect with funny hints
- Celebration sound and visual effects
- Skip animation with Enter key

### 📁 Multiple Profiles
- Create unlimited independent profiles
- Each profile has its own URLs and settings
- Customizable branding per profile:
  - **Title** - Main header text
  - **Subtitle** - Tagline
  - **Topic** - Singular item name (e.g., "Restaurant", "Team Member")
- Switch profiles instantly
- Settings persist per profile (sound effects, tab behavior)

### 🎨 Beautiful UI
- Purple gradient theme
- Smooth animations
- Inline editing - click to edit URLs
- Right-click context menu
- Mobile responsive
- Dark mode friendly

### 💾 Data Persistence
- All data stored in browser localStorage
- Used items persist across page reloads
- Current mode and settings remembered
- Automatic migration from older versions
- No backend required

### 🔧 Configuration
- Import/Export profiles as JSON
- Default configuration support
- Reset to defaults
- Inline profile editing panel
- No modal dialogs - true SPA experience

## 🚀 Quick Start

### Option 1: Use Directly
Just open `index.html` in a web browser. That's it!

### Option 2: With HTTP Server (Recommended)
For default config loading, serve via HTTP:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000/`

## 📖 Usage

### Basic Usage
1. Switch to **Setup** mode
2. Add URLs with display names
3. Switch to **Select** mode
4. Click the big box (or press Enter) to randomly select!

### Profile Management
1. In Setup mode, see profile controls at top
2. Click **➕** to create new profile
3. Click **✏️** to edit profile (name, title, subtitle, topic)
4. Use dropdown to switch between profiles
5. Click **🗑️** to delete current profile

### Example Profiles

**Team Member Selector**
- Title: "Team Member Selector"
- Topic: "Team Member"
- URLs: Team members with GitHub profiles

**Restaurant Picker**
- Title: "Lunch Roulette"
- Topic: "Restaurant"
- URLs: Local restaurants with map links

**Movie Night**
- Title: "Movie Night Chooser"
- Topic: "Movie"
- URLs: Movies on your watchlist

## 🎯 Use Cases

- **Team Standups** - Randomly pick who goes first
- **Code Reviews** - Fair distribution of review assignments
- **Restaurant Decisions** - End the "where should we eat?" debate
- **Movie Selection** - Pick from your watchlist
- **Task Assignment** - Randomly distribute tasks
- **Learning Queue** - Randomize course/tutorial order
- **Content Creation** - Random topic selection

## 📂 Files

```
selektor-5000/
├── index.html              # Main application
├── script.js               # Application logic (1097 lines)
├── styles.css              # Styling and animations (994 lines)
├── default-config.json     # Default configuration
├── example-team-config.json       # Example: Team selector
├── example-restaurant-config.json # Example: Restaurant picker
├── CHANGELOG.md            # Version history
├── CONFIG.md               # Configuration guide
├── project.md              # Project documentation
└── README.md               # This file
```

## ⚙️ Configuration

### Profile JSON Format

```json
{
  "name": "My Profile",
  "title": "Selektor 5000",
  "subtitle": "The anti-procrastination dev selector",
  "topic": "Selectee",
  "soundEnabled": true,
  "openInNewTab": true,
  "urls": [
    {
      "displayName": "GitHub",
      "url": "https://github.com"
    }
  ]
}
```

### Customization
- Edit profile to change title, subtitle, and topic
- Topic changes throughout UI (buttons, placeholders, messages)
- Toggle sound effects per profile
- Choose new tab vs same tab per profile

## 🔍 Hidden Features

### Debug Mode
Click the footer 5 times to access debug mode:
- **Configuration** tab - Interactive JSON tree view with syntax highlighting
- **Browser State** tab - Inspect localStorage with collapsible tree
- **📜 Changelog** tab - View version history with markdown rendering

Features:
- VS Code-style dark theme with syntax colors
- Click triangles to expand/collapse nodes
- Expand All / Collapse All buttons
- Auto-expands first 2 levels
- Copy formatted JSON to clipboard

### Keyboard Shortcuts
- **Enter** - Select random item (in selection mode)
- **Enter** - Skip animation (during spin)
- **Enter** - Save (in profile edit panel)
- **Escape** - Close edit panel

## 🎨 Customization

### Color Theme
The app uses a purple gradient theme. To customize:
1. Edit `styles.css`
2. Replace `#667eea` and `#764ba2` with your colors
3. Update gradient backgrounds throughout

### Sound Effects
- Enable/disable per profile in Setup mode
- Uses Web Audio API for beeps and celebration sounds
- No external audio files needed

## 🌟 Key Features in Detail

### Smart Tracking
- Items marked as "used" persist across reloads
- Reset button clears used items
- Visual indication of used vs available items
- Counter shows remaining items

### Profile System
- Complete isolation between profiles
- Independent URL lists
- Separate used item tracking
- Own settings (sound, tab behavior)
- Custom branding

### Modern UX
- No page reloads - true SPA
- Smooth animations (0.3s transitions)
- Inline editing - click to change
- Form validation before saving
- Mobile-first responsive design

## 📊 Version History

### v6.2 (Current) - Interactive JSON Tree View
- Collapsible tree view with syntax highlighting
- VS Code dark theme for JSON data
- Expand/Collapse All controls
- Better navigation of complex structures

### v6.1 - Enhanced Debug View
- Changelog viewer with markdown rendering
- Tabbed debug interface
- Beautiful styled changelog display

### v6 - Profile System
- Multiple independent profiles
- Customizable branding per profile
- Inline edit panel (no more modals!)
- Profile header bar with gradient design
- Settings persist per profile

### v5 - State Persistence
- Used items persist across reloads
- Current mode remembered
- Settings saved per session

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

## 🛠️ Technical Details

### Stack
- Pure HTML5, CSS3, JavaScript (ES6+)
- No frameworks or libraries
- No build process required
- No backend needed

### Browser Support
- Modern browsers with ES6+ support
- localStorage required
- Web Audio API for sounds (optional)
- Fetch API for default config

### Architecture
- Profile-based state management
- Getter/setter properties for clean access
- localStorage for persistence
- Spread operator for immutable updates
- Event delegation for dynamic content

### Code Quality
- 2,288 total lines (HTML + CSS + JS)
- Well-commented
- Modular methods
- Consistent naming
- No external dependencies

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🤝 Contributing

Contributions welcome! This is a simple, self-contained project:
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 💡 Ideas for Enhancement

See [project.md](project.md) for a comprehensive list of future feature ideas including:
- Visual history/timeline
- Undo functionality
- Drag & drop reordering
- Custom sound uploads
- Theme picker
- Statistics tracking
- And many more!

## 🐛 Issues

Found a bug? Have a suggestion?
- Open an issue on GitHub
- Include your browser version
- Describe steps to reproduce

## 👤 Author

Created with ❤️ for teams who need fair, random selection

## 🙏 Acknowledgments

- Inspired by the need for fair team member selection
- Built as a learning project for modern web development
- No AI was harmed in the making of this app (just kidding!)

---

**⭐ Star this repo if you find it useful!**

Made with 🎯 by developers, for developers (and everyone else who can't decide)
