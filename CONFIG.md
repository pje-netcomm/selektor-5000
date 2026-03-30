# Selektor 5000 - Configuration Guide

## Important: HTTP Server Required for Default Config

**Note:** To use the default configuration feature (`default-config.json`), you must serve the application via an HTTP server. Opening `index.html` directly with the `file://` protocol will prevent the default config from loading due to browser security restrictions.

### Quick Start with HTTP Server

In the app directory, run:
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then open: `http://localhost:8000/`

## Using Default Configuration

The application can load a default set of URLs when first opened (if no browser-local configuration exists).

### Setting Up Defaults

1. **Edit default-config.json**: Modify the JSON file with your desired URLs:
   ```json
   {
     "urls": [
       {
         "displayName": "My Site",
         "url": "https://mysite.com"
       },
       {
         "displayName": "Another Site",
         "url": "https://another.com"
       }
     ]
   }
   ```

2. **Deploy Together**: Keep `default-config.json` in the same directory as `index.html`

3. **First Use**: When users first open the app (with no saved config), they'll automatically load these defaults

### Exporting and Importing Configuration

**Export Config**: 
- Go to Configuration Mode
- Click "Export Config" button
- Downloads `selektor-5000-config.json`
- This file can be shared or used to replace `default-config.json`

**Import Config**:
- Click "Import Config" button
- Select a previously exported JSON file
- Replaces current URLs with imported ones

**Reset to Defaults**:
- Loads the configuration from `default-config.json`
- Useful to revert to the original setup

**Clear All**:
- Removes all URLs from configuration
- Cannot be undone (unless you reset to defaults or import)

### Using Exported Config as Default Config

To use an exported config as the default:

1. Export your current configuration (downloads `selektor-5000-config.json`)
2. Rename the file to `default-config.json`
3. Replace the existing `default-config.json` file with the new one
4. Users will now get your configuration as their defaults

The exported file format is identical to the default config format, so no conversion is needed!
