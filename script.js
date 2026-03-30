class TeamMeter {
    constructor() {
        this.urls = [];
        this.usedUrls = new Set();
        this.currentMode = 'selection';
        this.soundEnabled = true;
        this.urlTabWindow = null;
        this.init();
    }

    async init() {
        await this.loadFromStorage();
        this.setupEventListeners();
        this.createSounds();
        this.setupDebugMode();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('addUrlBtn').addEventListener('click', () => this.addUrl());
        document.getElementById('displayBox').addEventListener('click', () => this.selectRandomUrl());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('selectionModeBtn').addEventListener('click', () => this.switchMode('selection'));
        document.getElementById('configModeBtn').addEventListener('click', () => this.switchMode('config'));
        document.getElementById('exportConfigBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('importConfigBtn').addEventListener('click', () => this.importConfig());
        document.getElementById('resetToDefaultsBtn').addEventListener('click', () => this.resetToDefaults());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('soundToggle').addEventListener('change', (e) => this.toggleSound(e.target.checked));
        
        document.getElementById('importFileInput').addEventListener('change', (e) => this.handleFileImport(e));
        
        document.getElementById('displayNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addUrl();
        });
        
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addUrl();
        });

        // Global Enter key for selection mode
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.currentMode === 'selection' && !this.isSelecting) {
                const displayBox = document.getElementById('displayBox');
                if (!displayBox.classList.contains('disabled')) {
                    this.selectRandomUrl();
                }
            }
        });

        // Debug mode listeners
        document.getElementById('closeDebugBtn').addEventListener('click', () => this.closeDebugView());
        document.getElementById('copyConfigBtn').addEventListener('click', () => this.copyDebugConfig());
        document.getElementById('copyStateBtn').addEventListener('click', () => this.copyDebugState());
        document.getElementById('clearStorageBtn').addEventListener('click', () => this.clearBrowserStorage());
        document.getElementById('reloadPageBtn').addEventListener('click', () => location.reload());
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.mode-content').forEach(content => content.classList.remove('active'));
        
        if (mode === 'selection') {
            document.getElementById('selectionModeBtn').classList.add('active');
            document.getElementById('selectionMode').classList.add('active');
        } else {
            document.getElementById('configModeBtn').classList.add('active');
            document.getElementById('configMode').classList.add('active');
            document.getElementById('soundToggle').checked = this.soundEnabled;
        }
    }

    createSounds() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.spinSound = () => {
            if (!this.soundEnabled) return;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        };
        
        this.celebrationSound = () => {
            if (!this.soundEnabled) return;
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                const startTime = audioContext.currentTime + (index * 0.1);
                gainNode.gain.setValueAtTime(0.15, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        };
    }

    toggleSound(enabled) {
        this.soundEnabled = enabled;
        this.saveToStorage();
    }

    addUrl() {
        const displayNameInput = document.getElementById('displayNameInput');
        const urlInput = document.getElementById('urlInput');
        
        const displayName = displayNameInput.value.trim();
        const url = urlInput.value.trim();
        
        if (!displayName || !url) {
            alert('Please enter both a display name and URL');
            return;
        }
        
        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        const urlObj = {
            id: Date.now() + Math.random(),
            displayName,
            url
        };
        
        this.urls.push(urlObj);
        this.saveToStorage();
        this.render();
        
        displayNameInput.value = '';
        urlInput.value = '';
        displayNameInput.focus();
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    removeUrl(id) {
        this.urls = this.urls.filter(url => url.id !== id);
        this.usedUrls.delete(id);
        this.saveToStorage();
        this.render();
    }

    async selectRandomUrl() {
        const availableUrls = this.urls.filter(url => !this.usedUrls.has(url.id));
        
        if (availableUrls.length === 0) {
            alert('No selectees available! Add some selectees or reset to start over.');
            return;
        }

        const displayBox = document.getElementById('displayBox');
        if (displayBox.classList.contains('disabled') || this.isSelecting) {
            return;
        }
        
        this.isSelecting = true;
        displayBox.classList.add('disabled');
        displayBox.classList.remove('clickable');

        const selectedUrl = availableUrls[Math.floor(Math.random() * availableUrls.length)];

        this.skipAnimation = false;
        const skipHandler = (e) => {
            if (e.key === 'Enter') {
                this.skipAnimation = true;
            }
        };
        document.addEventListener('keydown', skipHandler);

        if (availableUrls.length > 1) {
            await this.animateSelection(availableUrls);
        }
        
        document.removeEventListener('keydown', skipHandler);
        
        await this.showSelection(selectedUrl);

        this.usedUrls.add(selectedUrl.id);
        this.saveToStorage();
        
        if (this.urlTabWindow && !this.urlTabWindow.closed) {
            this.urlTabWindow.location.href = selectedUrl.url;
            this.urlTabWindow.focus();
        } else {
            this.urlTabWindow = window.open(selectedUrl.url, 'selektor5000_tab');
        }
        
        setTimeout(() => {
            this.isSelecting = false;
            this.render();
        }, 1500);
    }

    async animateSelection(availableUrls) {
        const displayBox = document.getElementById('displayBox');
        const displayText = document.getElementById('displayText');
        
        const spinCount = 20;
        const baseDelay = 50;
        
        const funnyHints = [
            '🤔 Maybe...', '👀 Could it be...', '🎯 Is it...', '✨ Perhaps...',
            '🔮 Possibly...', '💫 What about...', '🎪 How about...',
            '🌟 Definitely...', '🎲 Surely...', '🎨 Certainly...',
            '🎭 Absolutely...', '🎪 Totally...', '💥 Obviously...',
            '🌈 Clearly...', '⚡ Undoubtedly...', '🎯 Without a doubt...',
            '✨ This has to be...', '🔥 This must be...', '💎 The chosen one:',
            '🏆 The winner is...', '🎉 It\'s definitely...', '🌟 No way, it\'s...',
            '🎊 Drumroll for...', '🎈 Lucky you...', '🎁 The gift goes to...',
            '⭐ Star of the show:', '🚀 Launching...', '💫 Behold...', 
            '🎪 Ladies and gentlemen...', '🔔 Ding ding ding:', '📢 Announcing...',
            '🎺 Fanfare for...', '🎸 Rock on with...', '🎤 Spotlight on...',
            '👑 Crown goes to...', '🏅 Gold medal for...', '🥇 First place:',
            '💝 With love, it\'s...', '🌺 Blooming for...', '🦄 Magical choice:',
            '🐉 Dragon picks...', '🦸 Hero of the hour:', '🧙 The wizard chooses...',
            '🎮 Player 1...', '🕹️ High score goes to...', '👾 Game on with...',
            '🍕 Slice of luck for...', '🍰 Sweetness is...', '🍀 Lucky clover points to...',
            '🌮 Taco Tuesday picks...', '☕ Fresh brew for...', '🍩 Donut miss...',
            '🎲 Snake eyes on...', '🃏 Wild card:', '🎰 Jackpot...',
            '🔥 Hot pick:', '❄️ Cool choice:', '⚡ Electric selection:',
            '🌪️ Whirlwind winner:', '🌊 Wave of destiny:', '🌋 Erupting with...',
            '🧨 Explosive choice:', '💣 Boom! It\'s...', '🎆 Fireworks for...',
            '🎇 Sparkler says...', '✨ Shimmer and shine:', '💥 Kaboom...',
            '🎪 Center ring for...', '🎡 Ferris wheel stops at...', '🎢 Rollercoaster picks...',
            '🎠 Merry-go-round lands on...', '🎯 Bullseye on...', '🎱 8-ball says...',
            '🏹 Arrow points to...', '⚔️ Sword chooses...', '🛡️ Shield protects...',
            '🔱 Trident selects...', '🪄 Magic wand picks...', '🔮 Crystal ball reveals...',
            '📜 The prophecy speaks:', '🗝️ The key unlocks...', '🧭 Compass points to...',
            '⏰ Time\'s up for...', '⏳ Hourglass settles on...', '🔔 Bell rings for...',
            '📯 Horn sounds for...', '🎺 Trumpet announces...', '🥁 Drums beat for...',
            '🎸 Guitar solo for...', '🎹 Piano plays for...', '🎻 Violin serenades...',
            '🎼 The score goes to...', '🎵 Musical notes spell...', '🎶 The melody is...'
        ];
        
        for (let i = 0; i < spinCount; i++) {
            if (this.skipAnimation) break;
            
            const randomUrl = availableUrls[Math.floor(Math.random() * availableUrls.length)];
            const hint = funnyHints[Math.floor(Math.random() * funnyHints.length)];
            displayText.textContent = `${hint} ${randomUrl.displayName}`;
            displayBox.classList.add('spinning');
            
            this.spinSound();
            
            const delay = baseDelay + (i * 15);
            await this.sleep(delay);
            
            displayBox.classList.remove('spinning');
            await this.sleep(50);
        }
    }

    async showSelection(selectedUrl) {
        const displayBox = document.getElementById('displayBox');
        const displayText = document.getElementById('displayText');
        
        displayText.textContent = `🎉 ${selectedUrl.displayName} 🎉`;
        displayBox.classList.add('selected');
        
        this.celebrationSound();
        
        await this.sleep(600);
        displayBox.classList.remove('selected');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        if (this.usedUrls.size === 0) {
            return;
        }
        
        this.usedUrls.clear();
        this.saveToStorage();
        this.render();
    }

    render() {
        this.renderUrlList();
        this.updateStats();
        this.updateDisplay();
    }

    renderUrlList() {
        const urlList = document.getElementById('urlList');
        
        if (this.urls.length === 0) {
            urlList.innerHTML = '<div class="empty-state"><p>📝 No selectees configured yet. Add some to get started!</p></div>';
            return;
        }
        
        urlList.innerHTML = this.urls.map(url => {
            const isUsed = this.usedUrls.has(url.id);
            return `
                <div class="url-item ${isUsed ? 'used' : ''}">
                    <div class="url-info">
                        <div class="url-display-name">${isUsed ? '✓ ' : ''}${this.escapeHtml(url.displayName)}</div>
                        <div class="url-address">${this.escapeHtml(url.url)}</div>
                    </div>
                    <div class="url-actions">
                        <button class="btn-remove" onclick="app.removeUrl(${url.id})">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const availableCount = this.urls.filter(url => !this.usedUrls.has(url.id)).length;
        const remainingCount = document.getElementById('remainingCount');
        remainingCount.textContent = `${availableCount} remaining`;
        
        const displayBox = document.getElementById('displayBox');
        if (availableCount === 0 && this.urls.length > 0) {
            displayBox.classList.remove('clickable');
            displayBox.classList.add('disabled');
        } else if (availableCount > 0) {
            displayBox.classList.add('clickable');
            displayBox.classList.remove('disabled');
        }
    }

    updateDisplay() {
        const displayText = document.getElementById('displayText');
        const availableCount = this.urls.filter(url => !this.usedUrls.has(url.id)).length;
        
        if (this.urls.length === 0) {
            displayText.textContent = 'Add some selectees to get started!';
        } else if (availableCount === 0) {
            displayText.textContent = 'All selectees used! Reset to start over.';
        } else {
            displayText.textContent = 'Select Random Selectee';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        const data = {
            urls: this.urls,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('selektor5000Data', JSON.stringify(data));
    }

    async loadFromStorage() {
        const stored = localStorage.getItem('selektor5000Data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.urls = data.urls || [];
                this.usedUrls = new Set();
                this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            } catch (e) {
                console.error('Failed to load data from storage:', e);
            }
        } else {
            await this.loadDefaults();
        }
    }

    async loadDefaults() {
        try {
            const response = await fetch('default-config.json');
            if (response.ok) {
                const config = await response.json();
                if (config.urls && Array.isArray(config.urls)) {
                    this.urls = config.urls.map(url => ({
                        ...url,
                        id: Date.now() + Math.random()
                    }));
                    this.usedUrls.clear();
                    if (config.soundEnabled !== undefined) {
                        this.soundEnabled = config.soundEnabled;
                    }
                }
            }
        } catch (e) {
            console.log('No default configuration loaded. If using file:// protocol, serve via HTTP server to load defaults.');
        }
    }

    exportConfig() {
        const config = {
            urls: this.urls.map(({ displayName, url }) => ({ displayName, url })),
            soundEnabled: this.soundEnabled
        };
        
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selektor-5000-config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importConfig() {
        document.getElementById('importFileInput').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                if (config.urls && Array.isArray(config.urls)) {
                    if (confirm('Import configuration? This will replace your current URLs.')) {
                        this.urls = config.urls.map(url => ({
                            ...url,
                            id: Date.now() + Math.random()
                        }));
                        this.usedUrls.clear();
                        if (config.soundEnabled !== undefined) {
                            this.soundEnabled = config.soundEnabled;
                        }
                        this.saveToStorage();
                        this.render();
                    }
                } else {
                    alert('Invalid configuration file format.');
                }
            } catch (e) {
                alert('Failed to parse configuration file: ' + e.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    resetToDefaults() {
        if (confirm('Reset to default configuration? This will replace your current URLs.')) {
            this.resetAndLoadDefaults();
        }
    }

    async resetAndLoadDefaults() {
        try {
            const response = await fetch('default-config.json');
            if (response.ok) {
                const config = await response.json();
                if (config.urls && Array.isArray(config.urls)) {
                    this.urls = config.urls.map(url => ({
                        ...url,
                        id: Date.now() + Math.random()
                    }));
                    this.usedUrls.clear();
                    if (config.soundEnabled !== undefined) {
                        this.soundEnabled = config.soundEnabled;
                    }
                    this.saveToStorage();
                    this.render();
                } else {
                    alert('Invalid default configuration format.');
                }
            } else {
                alert('No default configuration file found (default-config.json).');
            }
        } catch (e) {
            alert('Failed to load default configuration.\n\nIf opening this file directly (file:// protocol), you need to serve it via an HTTP server.\n\nQuick fix: Run this in the same directory:\n  python3 -m http.server 8000\n\nThen open: http://localhost:8000/');
        }
    }

    clearAll() {
        if (confirm('Clear all URLs? This action cannot be undone.')) {
            this.urls = [];
            this.usedUrls.clear();
            this.saveToStorage();
            this.render();
        }
    }

    setupDebugMode() {
        let clickCount = 0;
        let clickTimer = null;
        
        document.querySelector('footer').addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 2000);
            }
            
            if (clickCount === 5) {
                clearTimeout(clickTimer);
                clickCount = 0;
                this.openDebugView();
            }
        });
    }

    openDebugView() {
        const debugView = document.getElementById('debugView');
        debugView.style.display = 'flex';
        this.updateDebugView();
    }

    closeDebugView() {
        document.getElementById('debugView').style.display = 'none';
    }

    updateDebugView() {
        const configJson = {
            urls: this.urls.map(({ displayName, url }) => ({ displayName, url })),
            soundEnabled: this.soundEnabled
        };
        
        document.getElementById('debugConfigJson').textContent = JSON.stringify(configJson, null, 2);
        
        const browserState = {
            localStorage: localStorage.getItem('selektor5000Data') ? JSON.parse(localStorage.getItem('selektor5000Data')) : null,
            currentSession: {
                urls: this.urls,
                usedUrls: Array.from(this.usedUrls),
                soundEnabled: this.soundEnabled,
                currentMode: this.currentMode
            }
        };
        
        document.getElementById('debugBrowserState').textContent = JSON.stringify(browserState, null, 2);
    }

    copyDebugConfig() {
        const text = document.getElementById('debugConfigJson').textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Configuration JSON copied to clipboard!');
        });
    }

    copyDebugState() {
        const text = document.getElementById('debugBrowserState').textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Browser state copied to clipboard!');
        });
    }

    clearBrowserStorage() {
        if (confirm('⚠️ Warning: This will delete all stored data including your URL list!\n\nAre you sure you want to clear browser storage?')) {
            localStorage.removeItem('selektor5000Data');
            alert('Browser storage cleared! The page will now reload.');
            location.reload();
        }
    }
}

const app = new TeamMeter();
