# Configuration Guide - Selektor 5000 v6.3

Selektor 5000 supports **multiple configuration profiles**, each with its own settings, branding, and selectee list. It also supports **fixed configuration mode** for team deployments.

## Configuration Modes

### Normal Mode (Default)
- Users have full control over profiles, URLs, and settings
- All data stored in localStorage
- Profiles can be created, edited, and deleted
- URLs can be added, removed, and modified

### Fixed Configuration Mode
- URLs and branding are **read-only** (locked)
- Deployed via `fixed-config.json` file
- Perfect for **team environments**
- Admin maintains centralized URL list
- Users still have personal settings and tracking

---

## Fixed Configuration Mode

### When to Use Fixed Mode

**Perfect for teams** where:
- ✅ Admin wants to maintain a centralized URL list
- ✅ Users shouldn't modify the URLs
- ✅ Everyone uses the same branding (title, subtitle, topic)
- ✅ Individual users need personal tracking
- ✅ Personal preferences (sound, tabs) should be saved locally

**Example scenarios:**
- Company team selector (admin manages team members)
- Shared restaurant list (owner manages venues)
- Training resources (admin curates learning materials)
- Code review rotation (manager sets team list)

### Setting Up Fixed Mode

1. **Create fixed-config.json**

```json
{
  "name": "Company Team",
  "title": "Team Member Selector",
  "subtitle": "Fair and random team member selection",
  "topic": "Team Member",
  "urls": [
    {
      "displayName": "Alice (Frontend Lead)",
      "url": "https://github.com/alice"
    },
    {
      "displayName": "Bob (Backend Developer)",
      "url": "https://github.com/bob"
    }
  ]
}
```

2. **Deploy with Application**
   - Place `fixed-config.json` in same directory as `index.html`
   - Serve via HTTP server (required for file loading)
   - App automatically detects and loads on startup

3. **Users See Read-Only Interface**
   - 🔒 Fixed Config Mode indicator in header (orange badge)
   - Notice: "URLs and branding are read-only"
   - URLs shown with 🔒 read-only badges
   - Add/Edit/Delete controls disabled
   - Personal settings still editable

### What's Locked in Fixed Mode

❌ **Cannot modify:**
- URL list (add/remove/edit)
- Display names
- URL addresses
- Title, subtitle, topic
- Profile branding customization
- Clear all URLs

✅ **Can still customize:**
- Sound effects (ON/OFF)
- Open in new tab (ON/OFF)
- Track used items (personal)
- Reset used items (personal)
- Switch modes (Selection/Setup)

### Visual Indicators

Fixed mode displays:
- **Header**: Orange "🔒 Fixed Config Mode" badge
- **URL List**: Notice about read-only configuration
- **URL Items**: Orange left border with 🔒 badges
- **Controls**: Disabled/grayed add, edit, delete buttons
- **Edit Panel**: "Edit Profile" button disabled

### Benefits

👥 **For Teams:**
- Centralized URL management
- Consistent branding across users
- Individual progress tracking
- Personal preference settings

🔧 **For Admins:**
- Update `fixed-config.json` to change URLs for everyone
- No user-side maintenance needed
- Prevents accidental modifications
- Easy deployment (just one file)

---

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
