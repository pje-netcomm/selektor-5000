# Configuration Guide - Selektor 5000 v6

Selektor 5000 supports **multiple configuration profiles**, each with its own settings, branding, and selectee list.

## Profile System

### What is a Profile?

A profile is a complete, independent configuration that includes:
- **URL List**: Your own set of selectees
- **Used Items**: Which items have been selected (persists across page reloads)
- **Settings**: Sound effects and tab opening preferences
- **Branding**: Custom title, subtitle, and topic name
- **Mode**: Last used view (Selection or Setup)

### Why Use Multiple Profiles?

Different contexts need different configurations:
- **Work Team**: Team member selector with professional tone
- **Lunch Spots**: Restaurant picker with casual branding  
- **Movie Night**: Movie chooser with entertainment theme
- **Code Review**: Fair distribution of review assignments

## Managing Profiles

### Creating a New Profile

1. Click the **Setup** tab
2. Click the **➕** button in the profile section
3. Enter a name (e.g., "Restaurant Picker", "Dev Team")
4. Your new profile is created with default settings

### Switching Between Profiles

Use the **profile dropdown** to switch instantly. Each profile remembers:
- ✅ Its own URL list
- ✅ Which items were already selected
- ✅ Sound effect preference (on/off)
- ✅ Tab opening behavior (new tab vs same tab)
- ✅ Last used mode (Selection vs Setup)
- ✅ Custom title, subtitle, and topic

### Customizing Profile Branding

Click the **🎨 Customize** button to personalize:

**Title** - Main header text
- Default: "Selektor 5000"
- Examples: "Restaurant Roulette", "Team Picker", "Movie Night"

**Subtitle** - Tagline/description
- Default: "The anti-procrastination dev selector"
- Examples: "Can't decide? Let fate choose!", "Fair team member selection"

**Topic** - Singular item name (used throughout UI)
- Default: "Selectee"
- Examples: "Restaurant", "Team Member", "Movie", "Task"

When you set topic to "Restaurant", the UI automatically updates:
- Button: "Add Restaurant" (instead of "Add Selectee")
- Display: "Select Random Restaurant"
- Placeholder: "Restaurant Name"
- Empty state: "No restaurants configured yet"

### Profile-Specific Settings

Each profile independently stores these settings:

#### Sound Effects
- Toggle per profile: some contexts need silence, others can be fun
- Setting saved when you toggle the checkbox
- Restored when you switch back to this profile

#### Open URLs in New Tab
- **Checked (New Tab)**: Opens in separate tab, reuses same tab
- **Unchecked (Same Tab)**: Navigates away from Selektor 5000
- Useful for different URL types per profile

### Renaming a Profile

1. Switch to the profile you want to rename
2. Click the **✏️ Rename** button
3. Enter the new name
4. Profile name updates immediately

### Deleting a Profile

1. Switch to the profile you want to delete
2. Click the **🗑️ Delete** button
3. Confirm deletion (cannot be undone)
4. Note: Cannot delete the last remaining profile

## Configuration File Format

```json
{
  "name": "Restaurant Picker",
  "title": "Lunch Roulette",
  "subtitle": "Can't decide? Let fate choose!",
  "topic": "Restaurant",
  "soundEnabled": true,
  "openInNewTab": true,
  "urls": [
    {
      "displayName": "Pizza Palace",
      "url": "https://maps.google.com/?q=Pizza+Palace"
    },
    {
      "displayName": "Sushi Express",
      "url": "https://maps.google.com/?q=Sushi+Express"
    }
  ]
}
```

### Field Descriptions

**Profile Metadata**
- `name` (string): Profile display name
- `title` (string): Main header text
- `subtitle` (string): Tagline text  
- `topic` (string): Singular item name

**Settings**
- `soundEnabled` (boolean): Enable/disable sound effects
- `openInNewTab` (boolean): Open URLs in new tab (true) or same tab (false)

**Data**
- `urls` (array): List of selectee objects
  - `displayName` (string): Name shown in UI
  - `url` (string): URL to open when selected

## Import & Export

### Exporting a Profile

1. Switch to the profile you want to export
2. Click **Setup** tab
3. Click **Export Config** button
4. File downloads as `selektor-5000-{profile-name}.json`
5. Contains ALL profile data: URLs, settings, branding

### Importing a Profile

1. Click **Setup** tab
2. Click **Import Config** button
3. Select a JSON file
4. Confirm to replace current profile
5. Imports: URLs, title, subtitle, topic, sound, tab behavior

## Default Configuration

### Setting Up Defaults

Edit `default-config.json` with your desired configuration:

```json
{
  "name": "Default Profile",
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

**Important**: Requires HTTP server (see below)

### Using Exported Config as Default

1. Export your configured profile
2. Rename downloaded file to `default-config.json`
3. Replace the original `default-config.json`
4. New users will get your configuration

### Reset to Defaults

- Click **Reset to Defaults** button
- Loads configuration from `default-config.json`
- Replaces current profile's settings and URLs
- Useful to revert changes

## HTTP Server Requirement

**Required for**: Loading `default-config.json` on first use

The `file://` protocol prevents loading external files due to browser security (CORS). Serve via HTTP:

```bash
# Python 3
python3 -m http.server 8000

# Python 2  
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000/`

## Storage Details

All profiles stored in browser localStorage:

```json
{
  "profiles": {
    "default": {
      "id": "default",
      "name": "Default Profile",
      "title": "Selektor 5000",
      "subtitle": "The anti-procrastination dev selector", 
      "topic": "Selectee",
      "urls": [...],
      "usedUrls": [123, 456],
      "currentMode": "selection",
      "soundEnabled": true,
      "openInNewTab": true
    },
    "profile_1234567890": {
      "id": "profile_1234567890",
      "name": "Restaurant Picker",
      ...
    }
  },
  "currentProfileId": "default"
}
```

## Example Configurations

See included example files:
- `example-team-config.json` - Team member selector
- `example-restaurant-config.json` - Restaurant picker

## Migration

Existing v5 data automatically upgrades to v6:
- Creates "Default Profile" from old data
- Preserves all URLs and settings
- Maintains used items tracking
- Zero data loss
- Seamless user experience

## Tips

1. **Create profiles for different contexts** - work, personal, team activities
2. **Customize the topic** - makes the UI feel purpose-built
3. **Export backups** - save important configurations
4. **Share configs** - export and send to team members
5. **Independent settings** - each profile can have different sound/tab preferences
