# Standalone Application Guide

## Making Selektor 5000 a Standalone Desktop App

This document describes various approaches to package Selektor 5000 as a standalone application for Windows and Linux.

## Option 1: Electron (Recommended)

**Pros:**
- Native desktop experience with system tray, notifications, etc.
- Cross-platform (Windows, Linux, macOS)
- Full Node.js integration if needed
- Can bundle everything into a single installer
- Most popular for web-based desktop apps

**Cons:**
- Larger file size (~100-150MB due to bundled Chromium)
- More memory usage

**Implementation:**
```bash
# Install Electron
npm init
npm install electron electron-builder

# Create main.js
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: 'icon.png'
  });
  
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

**package.json:**
```json
{
  "name": "selektor-5000",
  "version": "4.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.selektor5000.app",
    "linux": {
      "target": ["AppImage", "deb", "rpm"]
    },
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

**Build:**
```bash
npm run build
# Outputs installers in dist/
```

## Option 2: Tauri (Lightweight Alternative)

**Pros:**
- Much smaller file size (~5-10MB)
- Lower memory usage (uses system WebView)
- Rust-based, very secure
- Modern and actively developed

**Cons:**
- Newer, smaller community than Electron
- Requires Rust toolchain for development

**Implementation:**
```bash
# Install Tauri CLI
npm install -g @tauri-apps/cli

# Initialize Tauri project
npm install @tauri-apps/api
npx tauri init

# Build
npx tauri build
```

## Option 3: NW.js

**Pros:**
- Similar to Electron but can access DOM from Node.js
- Cross-platform
- Good for HTML/CSS/JS apps

**Cons:**
- Less popular than Electron
- Similar file size issues

## Option 4: Python + WebView (Simple Solution)

**Pros:**
- Very simple implementation
- Uses system browser engine
- Small file size
- Easy to distribute with PyInstaller

**Cons:**
- Different WebView engines on different systems
- Less control over browser features

**Implementation (Python):**
```python
import webview
import os

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(script_dir, 'index.html')

webview.create_window(
    'Selektor 5000',
    f'file://{html_path}',
    width=1000,
    height=800,
    resizable=True
)
webview.start()
```

**Build standalone:**
```bash
pip install pywebview pyinstaller
pyinstaller --onefile --windowed --add-data "index.html:." --add-data "styles.css:." --add-data "script.js:." --add-data "default-config.json:." selektor5000.py
```

## Option 5: Progressive Web App (PWA)

**Pros:**
- No installation required
- Works offline
- Auto-updates
- Cross-platform (any browser)

**Cons:**
- Requires initial web access
- Limited system integration
- Browser-dependent features

**Implementation:**
Add manifest.json and service worker to enable installation from browser.

## Recommended Approach: Electron

For Selektor 5000, **Electron is recommended** because:

1. **Full compatibility**: Guaranteed consistent behavior across platforms
2. **Mature ecosystem**: Extensive documentation and tools
3. **Professional appearance**: Native window controls, menus, tray icons
4. **Easy distribution**: Can create installers with electron-builder
5. **No modifications needed**: Existing HTML/CSS/JS works as-is

## File Structure for Electron App

```
selektor-5000/
├── main.js              # Electron main process
├── package.json         # NPM configuration
├── index.html          # Your existing HTML
├── script.js           # Your existing JS
├── styles.css          # Your existing CSS
├── default-config.json # Default configuration
├── icon.png            # App icon (512x512)
├── icon.ico            # Windows icon
└── build/              # Build outputs
    ├── win/
    │   └── Selektor-5000-Setup-4.0.0.exe
    └── linux/
        ├── Selektor-5000-4.0.0.AppImage
        ├── selektor-5000_4.0.0_amd64.deb
        └── selektor-5000-4.0.0.x86_64.rpm
```

## Additional Features for Desktop App

Once packaged as desktop app, you could add:

1. **Global hotkey**: Press a keyboard shortcut from anywhere to trigger selection
2. **System tray**: Minimize to tray, quick access menu
3. **Notifications**: Desktop notifications when selection is made
4. **Auto-start**: Launch on system startup option
5. **Window always-on-top**: Keep window visible over other apps
6. **Export/Import**: Native file dialogs
7. **Multiple windows**: Open multiple instances
8. **Offline mode**: No HTTP server needed for default-config.json

## Installation Instructions for Users

**Windows:**
```
1. Download Selektor-5000-Setup-4.0.0.exe
2. Run the installer
3. Accept the prompts
4. Launch from Start Menu or Desktop shortcut
```

**Linux (AppImage):**
```bash
# Download Selektor-5000-4.0.0.AppImage
chmod +x Selektor-5000-4.0.0.AppImage
./Selektor-5000-4.0.0.AppImage
```

**Linux (DEB):**
```bash
sudo dpkg -i selektor-5000_4.0.0_amd64.deb
selektor-5000
```

**Linux (RPM):**
```bash
sudo rpm -i selektor-5000-4.0.0.x86_64.rpm
selektor-5000
```

## Distribution

- **GitHub Releases**: Upload installers as release assets
- **Microsoft Store**: Package as MSIX for Windows
- **Snap Store**: Create snap package for Linux
- **Flathub**: Create Flatpak for Linux
- **Website**: Direct download links

## Auto-Updates

With Electron + electron-updater:
```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

This checks GitHub releases for new versions and prompts users to update.

## Conclusion

For maximum reach and ease of development, **Electron** provides the best balance of features, compatibility, and development simplicity for turning Selektor 5000 into a professional desktop application.
