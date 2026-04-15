class TeamMeter {
    constructor() {
        this.profiles = {};
        this.currentProfileId = 'default';
        this.urlTabWindow = null;
        this.editingId = null;
        this.editingField = null;
        this.contextMenuTarget = null;
        this.fixedConfig = null;
        this.isFixedMode = false;
        this.testMode = false;
        this.testModeSequence = '';
        this.init();
    }

    get currentProfile() {
        if (!this.profiles[this.currentProfileId]) {
            this.profiles[this.currentProfileId] = this.createDefaultProfile('default');
        }
        return this.profiles[this.currentProfileId];
    }

    get lastSelectedId() { return this.currentProfile.lastSelectedId || null; }
    set lastSelectedId(val) { this.currentProfile.lastSelectedId = val; this.saveToStorage(); }

    get urls() { 
        return this.isFixedMode ? (this.fixedConfig.urls || []) : this.currentProfile.urls;
    }
    set urls(val) { 
        if (!this.isFixedMode) {
            this.currentProfile.urls = val;
        }
    }
    get usedUrls() { return this.currentProfile.usedUrls; }
    set usedUrls(val) { this.currentProfile.usedUrls = val; }
    get currentMode() { return this.currentProfile.currentMode; }
    set currentMode(val) { this.currentProfile.currentMode = val; }
    get soundEnabled() { return this.currentProfile.soundEnabled; }
    set soundEnabled(val) { this.currentProfile.soundEnabled = val; }
    get openInNewTab() { return this.currentProfile.openInNewTab; }
    set openInNewTab(val) { this.currentProfile.openInNewTab = val; }
    get soundVolume() { return this.currentProfile.soundVolume !== undefined ? this.currentProfile.soundVolume : 0.5; }
    set soundVolume(val) { this.currentProfile.soundVolume = val; }
    get animationDuration() { return this.currentProfile.animationDuration !== undefined ? this.currentProfile.animationDuration : 1; }
    set animationDuration(val) { this.currentProfile.animationDuration = val; }
    get openUrlEnabled() { return this.currentProfile.openUrlEnabled !== undefined ? this.currentProfile.openUrlEnabled : true; }
    set openUrlEnabled(val) { this.currentProfile.openUrlEnabled = val; }
    get uiType() { return this.currentProfile.uiType || 'default'; }
    set uiType(val) { this.currentProfile.uiType = val; this.render(); }
    get cardIcon() { return this.currentProfile.cardIcon || '🎴'; }
    set cardIcon(val) { this.currentProfile.cardIcon = val; this.saveToStorage(); this.render(); }
    get cardOrder() { return this.currentProfile.cardOrder || []; }
    set cardOrder(val) { this.currentProfile.cardOrder = val; this.saveToStorage(); }
    get title() { 
        return this.isFixedMode ? (this.fixedConfig.title || 'Selektor 5000') : this.currentProfile.title;
    }
    set title(val) { 
        if (!this.isFixedMode) {
            this.currentProfile.title = val;
        }
    }
    get subtitle() { 
        return this.isFixedMode ? (this.fixedConfig.subtitle || 'The anti-procrastination dev selector') : this.currentProfile.subtitle;
    }
    set subtitle(val) { 
        if (!this.isFixedMode) {
            this.currentProfile.subtitle = val;
        }
    }
    get topic() { 
        return this.isFixedMode ? (this.fixedConfig.topic || 'Selectee') : this.currentProfile.topic;
    }
    set topic(val) { 
        if (!this.isFixedMode) {
            this.currentProfile.topic = val;
        }
    }
    createDefaultProfile(id, name = 'Default Profile') {
        return {
            id: id,
            name: name,
            title: 'Selektor 5000',
            subtitle: 'The anti-procrastination dev selector',
            topic: 'Selectee',
            urls: [],
            usedUrls: new Set(),
            currentMode: 'selection',
            soundEnabled: true,
            openInNewTab: true,
            soundVolume: 0.5,
            animationDuration: 1,
            openUrlEnabled: true,
            uiType: 'default',
            cardIcon: '🎴',
            cardOrder: [],
            lastSelectedId: null
        };
    }

    async init() {
        await this.loadFixedConfig();
        await this.loadFromStorage();
        this.setupEventListeners();
        this.createSounds();
        this.setupDebugMode();
        this.setupTestMode();
        this.switchMode(this.currentMode);
        this.render();
    }

    setupEventListeners() {
        document.getElementById('addUrlBtn').addEventListener('click', () => this.addUrl());
        document.getElementById('displayBox').addEventListener('click', () => this.selectRandomUrl());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('selectCardBtn').addEventListener('click', () => this.selectRandomCard());
        document.getElementById('selectionModeBtn').addEventListener('click', () => this.switchMode('selection'));
        document.getElementById('configModeBtn').addEventListener('click', () => this.switchMode('config'));
        document.getElementById('exportConfigBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('importConfigBtn').addEventListener('click', () => this.importConfig());
        document.getElementById('resetToDefaultsBtn').addEventListener('click', () => this.resetToDefaults());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('soundToggle').addEventListener('change', (e) => this.toggleSound(e.target.checked));
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.updateVolume(e.target.value));
        document.getElementById('newTabToggle').addEventListener('change', (e) => this.toggleNewTab(e.target.checked));
        document.getElementById('openUrlToggle').addEventListener('change', (e) => this.toggleOpenUrl(e.target.checked));
        document.getElementById('animationSpeed').addEventListener('change', (e) => this.updateAnimationSpeed(parseFloat(e.target.value)));
        document.getElementById('uiTypeSelect').addEventListener('change', (e) => this.updateUIType(e.target.value));
        
        // Emoji picker modal event listeners
        document.getElementById('cardIconDisplay').addEventListener('click', () => this.openEmojiPicker());
        document.getElementById('closeEmojiPickerBtn').addEventListener('click', () => this.closeEmojiPicker());
        document.getElementById('cancelEmojiBtn').addEventListener('click', () => this.closeEmojiPicker());
        document.getElementById('resetCardIconBtn').addEventListener('click', () => this.resetCardIconAndClose());
        document.getElementById('applyEmojiBtn').addEventListener('click', () => this.applyEmojiSelection());
        
        // Close modal on background click
        document.getElementById('emojiPickerModal').addEventListener('click', (e) => {
            if (e.target.id === 'emojiPickerModal') {
                this.closeEmojiPicker();
            }
        });
        
        // Keyboard shortcuts for emoji picker
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('emojiPickerModal');
            // Check if modal is visible (display is 'flex' when open)
            if (modal.style.display !== 'flex') return;
            
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeEmojiPicker();
            } else if (e.key === 'Enter' && e.target.id !== 'emojiPreview') {
                // Apply on Enter, but not when typing in preview (preview has its own handler)
                e.preventDefault();
                this.applyEmojiSelection();
            }
        });
        
        // Preview box - handle paste and input
        const emojiPreview = document.getElementById('emojiPreview');
        
        emojiPreview.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain').trim();
            if (text) {
                // Extract first emoji or characters (up to 4 chars for multi-char emojis)
                const emoji = text.substring(0, 4);
                this.updatePreview(emoji);
            }
        });
        
        emojiPreview.addEventListener('input', (e) => {
            const text = e.target.textContent.trim();
            if (text.length > 4) {
                // Limit to 4 characters
                e.target.textContent = text.substring(0, 4);
                // Move cursor to end
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(e.target);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
        
        emojiPreview.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyEmojiSelection();
            }
        });
        
        // Category tabs
        document.querySelectorAll('.emoji-category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchEmojiCategory(e.target.dataset.category);
            });
        });
        
        // Emoji selection buttons - just update preview, don't apply
        document.querySelectorAll('.emoji-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emoji = e.target.dataset.emoji;
                this.updatePreview(emoji);
            });
        });
        
        // Collapsible section handlers
        document.getElementById('urlConfigHeader').addEventListener('click', () => this.toggleCollapsible('urlConfig'));
        document.getElementById('settingsHeader').addEventListener('click', () => this.toggleCollapsible('settings'));
        
        document.getElementById('profileSelector').addEventListener('change', (e) => this.switchProfile(e.target.value));
        document.getElementById('newProfileBtn').addEventListener('click', () => this.createNewProfile());
        document.getElementById('editProfileBtn').addEventListener('click', () => this.openEditPanel());
        document.getElementById('deleteProfileBtn').addEventListener('click', () => this.deleteProfile());
        document.getElementById('closeEditPanelBtn').addEventListener('click', () => this.closeEditPanel());
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfileEdits());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeEditPanel());
        
        document.getElementById('importFileInput').addEventListener('change', (e) => this.handleFileImport(e));
        
        document.getElementById('displayNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addUrl();
        });
        
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addUrl();
        });

        // Global Enter/Space key for selection mode
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && this.currentMode === 'selection' && !this.isSelecting) {
                e.preventDefault(); // Prevent space from scrolling page
                
                if (this.uiType === 'cards') {
                    // In cards mode, trigger random card selection
                    this.selectRandomCard();
                } else {
                    // In default mode, trigger display box selection
                    const displayBox = document.getElementById('displayBox');
                    if (!displayBox.classList.contains('disabled')) {
                        this.selectRandomUrl();
                    }
                }
            }
            
            // Escape key closes edit panel
            if (e.key === 'Escape') {
                const panel = document.getElementById('profileEditPanel');
                if (panel && panel.style.display !== 'none') {
                    this.closeEditPanel();
                }
            }
        });
        
        // Window resize handler for cards UI
        window.addEventListener('resize', () => {
            if (this.uiType === 'cards' && this.currentMode === 'selection') {
                this.renderCards();
            }
        });
        
        // Enter key in profile edit fields
        ['profileNameInput', 'profileTitleInput', 'profileSubtitleInput', 'profileTopicInput'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.saveProfileEdits();
                    }
                });
            }
        });

        // Debug mode listeners
        document.getElementById('closeDebugBtn').addEventListener('click', () => this.closeDebugView());
        document.getElementById('copyConfigBtn').addEventListener('click', () => this.copyDebugConfig());
        document.getElementById('copyStateBtn').addEventListener('click', () => this.copyDebugState());
        document.getElementById('clearStorageBtn').addEventListener('click', () => this.clearBrowserStorage());
        document.getElementById('reloadPageBtn').addEventListener('click', () => location.reload());
        document.getElementById('expandAllConfigBtn').addEventListener('click', () => this.expandAllNodes('debugConfigJson'));
        document.getElementById('collapseAllConfigBtn').addEventListener('click', () => this.collapseAllNodes('debugConfigJson'));
        document.getElementById('expandAllStateBtn').addEventListener('click', () => this.expandAllNodes('debugBrowserState'));
        document.getElementById('collapseAllStateBtn').addEventListener('click', () => this.collapseAllNodes('debugBrowserState'));
        
        // Debug tabs
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchDebugTab(e.target.dataset.tab));
        });

        // Context menu listeners
        document.addEventListener('click', () => this.hideContextMenu());
        document.getElementById('contextCheckUrl').addEventListener('click', () => this.checkUrl());
        document.getElementById('contextOpenUrl').addEventListener('click', () => this.openUrl());
        document.getElementById('contextDuplicate').addEventListener('click', () => this.duplicateEntry());
        document.getElementById('contextMarkDone').addEventListener('click', () => this.markDone());
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
            document.getElementById('volumeSlider').value = Math.round(this.soundVolume * 100);
            document.getElementById('volumeValue').textContent = `${Math.round(this.soundVolume * 100)}%`;
            document.getElementById('newTabToggle').checked = this.openInNewTab;
            document.getElementById('openUrlToggle').checked = this.openUrlEnabled;
            document.getElementById('animationSpeed').value = this.animationDuration.toString();
            document.getElementById('uiTypeSelect').value = this.uiType;
            
            // Update card icon display
            const display = document.getElementById('cardIconDisplay');
            if (display) {
                display.textContent = this.cardIcon;
            }
            
            // Show/hide card icon setting based on UI type
            const cardIconSetting = document.getElementById('cardIconSetting');
            cardIconSetting.style.display = this.uiType === 'cards' ? 'block' : 'none';
        }
        this.saveToStorage();
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
            
            const volume = 0.1 * this.soundVolume;
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.1), audioContext.currentTime + 0.05);
            
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
                const volume = 0.15 * this.soundVolume;
                gainNode.gain.setValueAtTime(volume, startTime);
                gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.067), startTime + 0.3);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        };
    }

    toggleSound(enabled) {
        this.soundEnabled = enabled;
        this.saveToStorage();
    }

    updateVolume(value) {
        this.soundVolume = value / 100;
        document.getElementById('volumeValue').textContent = `${value}%`;
        this.saveToStorage();
    }

    toggleNewTab(enabled) {
        this.openInNewTab = enabled;
        this.saveToStorage();
    }

    toggleOpenUrl(enabled) {
        this.openUrlEnabled = enabled;
        this.saveToStorage();
    }

    updateAnimationSpeed(value) {
        this.animationDuration = value;
        this.saveToStorage();
    }

    updateUIType(value) {
        this.uiType = value;
        // Show/hide card icon setting based on UI type
        const cardIconSetting = document.getElementById('cardIconSetting');
        if (cardIconSetting) {
            cardIconSetting.style.display = value === 'cards' ? 'block' : 'none';
        }
        this.saveToStorage();
    }

    openEmojiPicker() {
        const modal = document.getElementById('emojiPickerModal');
        modal.style.display = 'flex';
        
        // Set preview to current icon
        const preview = document.getElementById('emojiPreview');
        if (preview) {
            preview.textContent = this.cardIcon;
        }
        
        // Highlight current emoji in grid
        this.updatePreview(this.cardIcon);
    }

    closeEmojiPicker() {
        const modal = document.getElementById('emojiPickerModal');
        modal.style.display = 'none';
    }

    switchEmojiCategory(category) {
        // Update tabs
        document.querySelectorAll('.emoji-category-tab').forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update grids
        document.querySelectorAll('.emoji-grid').forEach(grid => {
            if (grid.dataset.category === category) {
                grid.classList.add('active');
            } else {
                grid.classList.remove('active');
            }
        });
    }

    updatePreview(emoji) {
        const preview = document.getElementById('emojiPreview');
        if (preview) {
            preview.textContent = emoji;
        }
        
        // Update visual selection in emoji grid
        document.querySelectorAll('.emoji-option').forEach(btn => {
            if (btn.dataset.emoji === emoji) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    applyEmojiSelection() {
        const preview = document.getElementById('emojiPreview');
        const emoji = preview.textContent.trim();
        
        if (emoji) {
            this.cardIcon = emoji;
            
            // Update display on main UI
            const display = document.getElementById('cardIconDisplay');
            if (display) {
                display.textContent = emoji;
            }
            
            this.closeEmojiPicker();
        }
    }

    resetCardIconAndClose() {
        // Just update the preview to default, don't close dialog
        this.updatePreview('🎴');
    }

    resetCardIcon() {
        // This is used when switching modes to update display
        const display = document.getElementById('cardIconDisplay');
        if (display) {
            display.textContent = this.cardIcon;
        }
    }

    toggleCollapsible(section) {
        const header = document.getElementById(`${section}Header`);
        const content = document.getElementById(`${section}Content`);
        
        const isCurrentlyActive = header.classList.contains('active');
        
        // Close all collapsibles
        const allHeaders = ['urlConfig', 'settings'];
        allHeaders.forEach(s => {
            const h = document.getElementById(`${s}Header`);
            const c = document.getElementById(`${s}Content`);
            h.classList.remove('active');
            c.classList.remove('expanded');
        });
        
        // If this section was NOT active, open it (toggle behavior)
        if (!isCurrentlyActive) {
            header.classList.add('active');
            content.classList.add('expanded');
        }
        // If it was active, it stays closed (all sections can be collapsed)
    }

    addUrl() {
        if (this.isFixedMode) {
            alert('Cannot add URLs in fixed configuration mode. URLs are read-only.');
            return;
        }
        
        const displayNameInput = document.getElementById('displayNameInput');
        const urlInput = document.getElementById('urlInput');
        
        const displayName = displayNameInput.value.trim();
        const url = urlInput.value.trim();
        
        if (!displayName || !url) {
            alert(`Please enter both a display name and URL for the ${this.topic.toLowerCase()}`);
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
        if (this.isFixedMode) {
            alert('Cannot remove URLs in fixed configuration mode. URLs are read-only.');
            return;
        }
        this.urls = this.urls.filter(url => url.id !== id);
        this.usedUrls.delete(id);
        this.saveToStorage();
        this.render();
    }

    async selectRandomUrl() {
        const availableUrls = this.urls.filter(url => !this.usedUrls.has(url.id));
        
        if (availableUrls.length === 0) {
            // Auto-reset when no selectees are available
            if (this.urls.length > 0) {
                this.reset();
                return;
            } else {
                alert('No selectees available! Add some selectees in Setup mode.');
                return;
            }
        }

        const displayBox = document.getElementById('displayBox');
        if ((displayBox.classList.contains('disabled') || this.isSelecting) && this.uiType !== 'retro') {
            return;
        }
        
        this.isSelecting = true;
        if (this.uiType !== 'retro') {
            displayBox.classList.add('disabled');
            displayBox.classList.remove('clickable');
        }

        // C64 BASIC loading simulation on first selection in retro mode
        const isFirstSelection = this.uiType === 'retro' && this.usedUrls.size === 0;
        if (isFirstSelection && this.animationDuration > 0) {
            await this.simulateC64Loading();
        }

        this.skipAnimation = false;
        const skipHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.skipAnimation = true;
            }
        };
        document.addEventListener('keydown', skipHandler);

        // Skip animation if duration is 0 or if only 1 URL available
        if (availableUrls.length > 1 && this.animationDuration > 0) {
            if (this.uiType === 'retro') {
                await this.playRetroSpinAnimation(availableUrls);
            } else {
                await this.animateSelection(availableUrls);
            }
        }
        
        document.removeEventListener('keydown', skipHandler);
        
        // Make final random selection AFTER animation
        // Add extra randomization by using current timestamp
        const seed = Date.now() % availableUrls.length;
        const randomIndex = (seed + Math.floor(Math.random() * availableUrls.length)) % availableUrls.length;
        const selectedUrl = availableUrls[randomIndex];
        
        // Persist selection IMMEDIATELY before any further animations
        this.usedUrls.add(selectedUrl.id);
        this.lastSelectedId = selectedUrl.id;
        this.saveToStorage();
        
        await this.showSelection(selectedUrl);
        
        // Open URL if enabled
        if (this.openUrlEnabled) {
            if (this.openInNewTab) {
                if (this.urlTabWindow && !this.urlTabWindow.closed) {
                    this.urlTabWindow.location.href = selectedUrl.url;
                    this.urlTabWindow.focus();
                } else {
                    this.urlTabWindow = window.open(selectedUrl.url, 'selektor5000_tab');
                }
            } else {
                window.location.href = selectedUrl.url;
            }
        }
        
        setTimeout(() => {
            this.isSelecting = false;
            this.render();
        }, 1500);
    }

    async animateSelection(availableUrls) {
        const displayBox = document.getElementById('displayBox');
        const displayText = document.getElementById('displayText');
        
        // Calculate spin count and delays based on animationDuration
        // 0 = disabled, 0.5 = fast, 1 = normal, 2 = slow
        const spinCount = Math.round(20 * this.animationDuration);
        const baseDelay = Math.round(50 * this.animationDuration);
        
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
            
            const delay = baseDelay + Math.round(i * 15 * this.animationDuration);
            await this.sleep(delay);
            
            displayBox.classList.remove('spinning');
            await this.sleep(Math.round(50 * this.animationDuration));
        }
    }

    async showSelection(selectedUrl) {
        if (this.uiType === 'retro') {
            await this.playRetroSelectAnimation(selectedUrl);
        } else {
            const displayBox = document.getElementById('displayBox');
            const displayText = document.getElementById('displayText');
            
            displayText.textContent = `🎉 ${selectedUrl.displayName} 🎉`;
            displayBox.classList.add('selected');
            
            this.celebrationSound();
            
            await this.sleep(600);
            displayBox.classList.remove('selected');
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        if (this.usedUrls.size === 0) {
            return;
        }
        
        this.usedUrls.clear();
        this.lastSelectedId = null;
        // Shuffle card order on reset - store only IDs
        const shuffled = [...this.urls].sort(() => Math.random() - 0.5);
        this.cardOrder = shuffled.map(u => u.id);
        this.saveToStorage();
        this.render();
    }

    renderCards() {
        const cardsGrid = document.getElementById('cardsGrid');
        const availableUrls = this.urls.filter(url => !this.usedUrls.has(url.id));
        
        // Create or maintain shuffled order - shuffle if:
        // 1. Card order doesn't exist or is empty
        // 2. URL list length changed (URLs added/removed)
        // 3. URL IDs don't match (different URLs)
        const urlIds = this.urls.map(u => u.id).sort().join(',');
        const orderIds = [...this.cardOrder].sort().join(',');
        
        if (!this.cardOrder || this.cardOrder.length === 0 || 
            this.cardOrder.length !== this.urls.length || 
            urlIds !== orderIds) {
            // Store only IDs, not full objects
            const shuffled = [...this.urls].sort(() => Math.random() - 0.5);
            this.cardOrder = shuffled.map(u => u.id);
            this.saveToStorage();
        }
        
        // Reconstruct ordered URL objects from IDs
        const orderedUrls = this.cardOrder
            .map(id => this.urls.find(u => u.id === id))
            .filter(u => u); // Remove any URLs that no longer exist
        
        // Calculate optimal card size
        this.calculateCardSize(cardsGrid);
        
        cardsGrid.innerHTML = '';
        
        orderedUrls.forEach(url => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.urlId = url.id; // Store ID for scrolling
            if (this.usedUrls.has(url.id)) {
                card.classList.add('flipped', 'used');
            }
            if (this.lastSelectedId === url.id) {
                card.classList.add('just-selected');
            }
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-icon">${this.escapeHtml(this.cardIcon)}</div>
                    </div>
                    <div class="card-back">
                        <div class="card-name">${this.escapeHtml(url.displayName)}</div>
                    </div>
                </div>
            `;
            
            if (!this.usedUrls.has(url.id)) {
                card.addEventListener('click', () => this.selectCard(url));
            } else {
                // For flipped/used cards, double-click launches URL
                card.addEventListener('dblclick', () => this.launchCardUrl(url));
            }
            
            cardsGrid.appendChild(card);
        });
        
        // Update remaining count
        document.getElementById('cardsRemainingCount').textContent = `${availableUrls.length} remaining`;
    }

    calculateCardSize(cardsGrid) {
        const numCards = this.urls.length;
        if (numCards === 0) return;
        
        // Get available space for cards grid
        const cardsContainer = cardsGrid.parentElement;
        const statsHeight = 40; // Stats area height
        const controlsHeight = 80; // Controls (buttons) height
        const padding = 40; // Total padding
        
        const availableHeight = cardsContainer.clientHeight - statsHeight;
        const availableWidth = cardsContainer.clientWidth - padding;
        
        // Find longest text with emojis
        const longestName = this.urls.reduce((max, url) => 
            url.displayName.length > max.length ? url.displayName : max, ''
        );
        const textWithEmojis = `🎉 ${longestName} 🎉`;
        
        // Calculate minimum width to prevent text wrapping
        // At 12pt font, average char width is ~7-8px, emojis are ~14px each
        const avgCharWidth = 8;
        const emojiWidth = 14;
        const numEmojis = 2;
        const numChars = longestName.length;
        const textWidth = (numChars * avgCharWidth) + (numEmojis * emojiWidth);
        const minCardWidthForText = Math.ceil(textWidth + 40); // +40 for padding
        
        // Absolute minimum for 12pt font readability
        const absoluteMinWidth = Math.max(120, minCardWidthForText);
        const maxCardWidth = 300;
        const aspectRatio = 4/3; // height = width * 4/3
        
        const gap = 15;
        
        // Calculate how many columns fit with minimum width
        let cols = Math.floor((availableWidth + gap) / (absoluteMinWidth + gap));
        if (cols < 1) cols = 1;
        
        // Try to fit all cards in available height
        let cardWidth = absoluteMinWidth;
        let cardHeight = cardWidth * aspectRatio;
        let rows = Math.ceil(numCards / cols);
        let totalHeight = (rows * cardHeight) + ((rows - 1) * gap);
        
        // If we can fit all cards, try to make them larger
        if (totalHeight <= availableHeight) {
            // Calculate max width that still fits everything
            const maxPossibleRows = Math.floor((availableHeight + gap) / (absoluteMinWidth * aspectRatio + gap));
            if (maxPossibleRows >= rows) {
                // We have vertical space, try to use it
                const availableWidthPerCard = (availableWidth - ((cols - 1) * gap)) / cols;
                const availableHeightPerRow = (availableHeight - ((rows - 1) * gap)) / rows;
                const maxWidthByHeight = availableHeightPerRow / aspectRatio;
                
                cardWidth = Math.min(availableWidthPerCard, maxWidthByHeight, maxCardWidth);
                cardWidth = Math.max(cardWidth, absoluteMinWidth);
            }
        }
        
        // Apply the calculated size
        cardsGrid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${Math.floor(cardWidth)}px, 1fr))`;
        
        // Set font size to ensure text never wraps
        const fontSize = Math.max(12, Math.min(16, cardWidth / 10));
        cardsGrid.style.fontSize = `${fontSize}px`;
    }

    async selectRandomCard() {
        const availableUrls = this.urls.filter(url => !this.usedUrls.has(url.id));
        
        if (availableUrls.length === 0) {
            // Auto-reset when no selectees are available
            if (this.urls.length > 0) {
                this.reset();
                return;
            } else {
                alert('No selectees available! Add some selectees in Setup mode.');
                return;
            }
        }

        if (this.isSelecting) return;
        
        // Randomly select from available URLs
        const seed = Date.now() % availableUrls.length;
        const randomIndex = (seed + Math.floor(Math.random() * availableUrls.length)) % availableUrls.length;
        const selectedUrl = availableUrls[randomIndex];
        
        await this.selectCard(selectedUrl, true);
    }

    async selectCard(url, withFanfare = false) {
        if (this.isSelecting) return;
        
        this.isSelecting = true;
        
        // Persist selection IMMEDIATELY before any animations
        this.usedUrls.add(url.id);
        this.saveToStorage();
        
        // Clear previous highlights from all cards
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('just-selected', 'fanfare');
        });
        
        // Find the card element
        const cards = document.querySelectorAll('.card');
        let selectedCard = null;
        
        for (let card of cards) {
            const cardName = card.querySelector('.card-name').textContent;
            if (cardName === url.displayName) {
                selectedCard = card;
                break;
            }
        }
        
        if (selectedCard) {
            // Scroll to the selected card
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add fanfare effect immediately when using button
            if (withFanfare) {
                selectedCard.classList.add('fanfare');
            }
            
            // Flip the card and play sound immediately
            selectedCard.classList.add('flipped');
            this.celebrationSound();
            
            await this.sleep(600);
            
            // Add celebration emojis to the card back
            const cardBack = selectedCard.querySelector('.card-back');
            const cardName = cardBack.querySelector('.card-name');
            cardName.innerHTML = `🎉 ${this.escapeHtml(url.displayName)} 🎉`;
            
            selectedCard.classList.add('used');
            this.lastSelectedId = url.id;
            selectedCard.classList.add('just-selected');
            
            // Wait longer to show the highlight before opening URL
            await this.sleep(1500);
        }
        
        // Open URL if enabled
        if (this.openUrlEnabled) {
            if (this.openInNewTab) {
                if (this.urlTabWindow && !this.urlTabWindow.closed) {
                    this.urlTabWindow.location.href = url.url;
                    this.urlTabWindow.focus();
                } else {
                    this.urlTabWindow = window.open(url.url, 'selektor5000_tab');
                }
            } else {
                window.location.href = url.url;
            }
        }
        
        setTimeout(() => {
            this.isSelecting = false;
            this.renderCards();
        }, 500);
    }

    launchCardUrl(url) {
        // Double-click on flipped card launches the URL
        if (this.openInNewTab) {
            if (this.urlTabWindow && !this.urlTabWindow.closed) {
                this.urlTabWindow.location.href = url.url;
                this.urlTabWindow.focus();
            } else {
                this.urlTabWindow = window.open(url.url, 'selektor5000_tab');
            }
        } else {
            window.location.href = url.url;
        }
    }

    renderRetro() {
        const retroText = document.getElementById('retroText');
        const retroPixels = document.getElementById('retroPixels');
        const availableUrls = this.urls.filter(url => !this.usedUrls.has(url.id));
        
        // Update display based on state
        if (availableUrls.length === 0 && this.usedUrls.size > 0) {
            // All selections made - show C64 "end of program" message
            this.showC64EndProgram();
        } else if (this.lastSelectedId) {
            const lastUrl = this.urls.find(u => u.id === this.lastSelectedId);
            if (lastUrl) {
                retroText.textContent = lastUrl.displayName.toUpperCase();
                retroText.classList.remove('c64-prompt');
                // Show idle state (keeps celebration, adds message)
                this.showRetroIdleState();
            }
        } else {
            // No selections yet - show C64 BASIC prompt
            this.showC64Prompt();
        }
        
        // Update remaining count
        document.getElementById('retroRemainingCount').textContent = `${availableUrls.length} remaining`;
        
        // Set up click handler
        const retroDisplay = document.getElementById('retroDisplay');
        retroDisplay.onclick = () => {
            if (this.currentMode === 'selection' && availableUrls.length > 0) {
                this.selectRandomUrl();
            }
        };
    }
    
    showC64Prompt() {
        const retroText = document.getElementById('retroText');
        const retroPixels = document.getElementById('retroPixels');
        
        retroText.classList.add('c64-prompt');
        retroText.innerHTML = `
            <div class="c64-line c64-center">**** SELEKTOR 5K (VERY)BASIC V2 ****</div>
            <div class="c64-line c64-center">&nbsp;&nbsp;64K RAM&nbsp;&nbsp;38911 BASIC BYTES FREE</div>
            <div class="c64-line">READY.</div>
            <div class="c64-line"><span class="c64-cursor">█</span></div>
        `;
        retroPixels.innerHTML = '';
    }
    
    showC64EndProgram() {
        const retroText = document.getElementById('retroText');
        const retroPixels = document.getElementById('retroPixels');
        
        retroText.classList.add('c64-prompt');
        retroText.innerHTML = `
            <div class="c64-line">END OF PROGRAM</div>
            <div class="c64-line">READY.</div>
            <div class="c64-line"><span class="c64-cursor">█</span></div>
        `;
        retroPixels.innerHTML = '';
    }
    
    async simulateC64Loading() {
        const retroText = document.getElementById('retroText');
        retroText.classList.add('c64-prompt');
        
        // Maximum visible lines (like a C64 screen)
        const maxLines = 10;
        let lines = [
            { text: '**** SELEKTOR 5K (VERY)BASIC V2 ****', centered: true },
            { text: '  64K RAM  38911 BASIC BYTES FREE', centered: true },
            { text: 'READY.', centered: false }
        ];
        
        const updateScreen = (addCursor = false, cursorLine = '') => {
            // Keep only last maxLines
            const visibleLines = lines.slice(-maxLines);
            let html = visibleLines.map(line => {
                const centered = line.centered ? ' c64-center' : '';
                return `<div class="c64-line${centered}">${line.text}</div>`;
            }).join('');
            if (addCursor) {
                html += `<div class="c64-line">${cursorLine}<span class="c64-cursor">█</span></div>`;
            }
            retroText.innerHTML = html;
        };
        
        // Show initial cursor
        updateScreen(true, '');
        await this.sleep(300);
        
        // Type LOAD command character by character
        const loadCmd = 'LOAD "SELEKTOR",8,1';
        for (let i = 0; i <= loadCmd.length; i++) {
            updateScreen(true, loadCmd.substring(0, i));
            await this.sleep(80 + Math.random() * 40);
        }
        
        // Press enter - add command to history
        lines.push({ text: loadCmd, centered: false });
        updateScreen();
        await this.sleep(400);
        
        // Show SEARCHING message
        lines.push({ text: 'SEARCHING FOR SELEKTOR', centered: false });
        updateScreen();
        await this.sleep(400);
        
        // Show LOADING with dots
        for (let j = 0; j <= 3; j++) {
            const loadingLine = 'LOADING' + '...'.substring(0, j);
            // Update or add loading line
            if (j === 0) {
                lines.push({ text: loadingLine, centered: false });
            } else {
                lines[lines.length - 1] = { text: loadingLine, centered: false };
            }
            updateScreen();
            await this.sleep(200);
        }
        await this.sleep(300);
        
        // Show READY prompt
        lines.push({ text: 'READY.', centered: false });
        updateScreen();
        await this.sleep(400);
        
        // Show cursor for RUN command
        updateScreen(true, '');
        await this.sleep(300);
        
        // Type RUN command
        const runCmd = 'RUN';
        for (let i = 0; i <= runCmd.length; i++) {
            updateScreen(true, runCmd.substring(0, i));
            await this.sleep(80 + Math.random() * 40);
        }
        
        await this.sleep(200);
        
        // Clear content and class for normal operation
        retroText.innerHTML = '';
        retroText.classList.remove('c64-prompt');
    }
    
    createRetroPixels(count) {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'retro-pixel';
            pixel.style.animationDelay = `${i * 0.05}s`;
            retroPixels.appendChild(pixel);
        }
    }
    
    playRetroSpinAnimation(availableUrls) {
        const retroText = document.getElementById('retroText');
        const retroDisplay = document.getElementById('retroDisplay');
        const retroScreen = retroDisplay.closest('.retro-screen');
        
        return new Promise((resolve) => {
            // Retro spin effect - cycle through names quickly
            const spinDuration = this.animationDuration * 1000; // Convert to ms
            const spinInterval = 100; // 8-bit style fast cycling
            let currentIndex = 0;
            
            if (spinDuration === 0 || availableUrls.length === 1) {
                resolve();
                return;
            }
            
            retroDisplay.classList.add('spinning');
            retroScreen.classList.add('retro-shaking');
            
            // Start random spin animation
            const spinAnimType = this.getRandomSpinAnimation();
            switch (spinAnimType) {
                case 'pacman':
                    this.createPacManAnimation();
                    break;
                case 'invaders':
                    this.createSpaceInvadersAnimation();
                    break;
                case 'pong':
                    this.createPongBallAnimation();
                    break;
                case 'tetris':
                    this.createTetrisAnimation();
                    break;
            }
            
            // Play spinning sound effects
            let soundTimer;
            if (this.soundEnabled) {
                soundTimer = setInterval(() => {
                    this.playRetroBlip();
                }, 200);
            }
            
            const spinTimer = setInterval(() => {
                retroText.textContent = availableUrls[currentIndex % availableUrls.length].displayName.toUpperCase();
                retroText.classList.add('animating');
                setTimeout(() => retroText.classList.remove('animating'), 100);
                currentIndex++;
                
                // Occasional screen flash
                if (Math.random() > 0.7) {
                    retroScreen.classList.add('retro-flash');
                    setTimeout(() => retroScreen.classList.remove('retro-flash'), 50);
                }
            }, spinInterval);
            
            setTimeout(() => {
                clearInterval(spinTimer);
                if (soundTimer) clearInterval(soundTimer);
                retroDisplay.classList.remove('spinning');
                retroScreen.classList.remove('retro-shaking');
                // Clear spin animation
                document.getElementById('retroPixels').innerHTML = '';
                resolve();
            }, spinDuration);
        });
    }
    
    createRetroGlitchPixels() {
        const retroPixels = document.getElementById('retroPixels');
        const count = Math.floor(Math.random() * 4) + 2;
        
        // Clear old glitch pixels
        retroPixels.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'retro-pixel retro-glitch';
            pixel.style.animationDelay = `${i * 0.03}s`;
            // Random positioning
            pixel.style.opacity = Math.random() * 0.5 + 0.5;
            retroPixels.appendChild(pixel);
        }
    }
    
    playRetroBlip() {
        // Quick blip sound during spinning
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.value = 440; // A4 note
        
        const startTime = audioContext.currentTime;
        const duration = 0.05; // Very short blip
        
        gainNode.gain.setValueAtTime(this.soundVolume * 0.1, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    playRetroSelectAnimation(selectedUrl) {
        const retroText = document.getElementById('retroText');
        const retroDisplay = document.getElementById('retroDisplay');
        const retroScreen = retroDisplay.closest('.retro-screen');
        
        return new Promise((resolve) => {
            // Show selected item with explosion effect
            retroText.textContent = selectedUrl.displayName.toUpperCase();
            retroDisplay.classList.add('selected', 'retro-explosion');
            
            // Initial pixel burst
            this.createRetroPixels(12);
            
            // Play 8-bit select sound if enabled
            if (this.soundEnabled) {
                this.playRetroSelectSound();
            }
            
            // Add pulsing effect
            setTimeout(() => {
                retroScreen.classList.add('retro-pulse');
            }, 200);
            
            // Starfield effect - pixels expanding outward
            setTimeout(() => {
                this.createRetroStarfield();
            }, 300);
            
            // Final celebration flash
            setTimeout(() => {
                retroScreen.classList.add('retro-flash');
                setTimeout(() => retroScreen.classList.remove('retro-flash'), 100);
            }, 600);
            
            // Multiple pixel bursts for extra effect
            setTimeout(() => {
                this.createRetroPixels(16);
            }, 400);
            
            // Start random celebration animation (replaces pixel bursts)
            setTimeout(() => {
                const celebType = this.getRandomCelebrationAnimation();
                switch (celebType) {
                    case 'fireworks':
                        this.createFireworksAnimation();
                        break;
                    case 'trophy':
                        this.createTrophyAnimation();
                        break;
                    case 'scrolling':
                        this.createScrollingMessageAnimation();
                        break;
                    case 'quotes':
                        this.createRetroQuotesAnimation();
                        break;
                }
            }, 800);
            
            setTimeout(() => {
                retroDisplay.classList.remove('selected', 'retro-explosion');
                retroScreen.classList.remove('retro-pulse');
                // Do NOT clear retroPixels - keep celebration visible
                resolve();
            }, this.animationDuration * 1000);
        });
    }
    
    createRetroStarfield() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        
        // Create expanding star pattern
        for (let i = 0; i < 20; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'retro-pixel retro-star';
            pixel.style.animationDelay = `${i * 0.02}s`;
            pixel.style.setProperty('--angle', `${(i * 18)}deg`);
            retroPixels.appendChild(pixel);
        }
    }
    
    playRetroSelectSound() {
        // Create 8-bit style victory fanfare
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Victory jingle: C5, E5, G5, C6 (arpeggio up)
        const notes = [
            { freq: 523.25, time: 0, duration: 0.15 },      // C5
            { freq: 659.25, time: 0.1, duration: 0.15 },    // E5
            { freq: 783.99, time: 0.2, duration: 0.15 },    // G5
            { freq: 1046.50, time: 0.3, duration: 0.3 }     // C6 (held longer)
        ];
        
        notes.forEach((note) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'square'; // 8-bit style square wave
            oscillator.frequency.value = note.freq;
            
            const startTime = audioContext.currentTime + note.time;
            
            gainNode.gain.setValueAtTime(this.soundVolume * 0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + note.duration);
        });
        
        // Add bass note for depth (C3)
        const bass = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        
        bass.connect(bassGain);
        bassGain.connect(audioContext.destination);
        
        bass.type = 'square';
        bass.frequency.value = 130.81; // C3
        
        const bassStart = audioContext.currentTime + 0.3;
        bassGain.gain.setValueAtTime(this.soundVolume * 0.15, bassStart);
        bassGain.gain.exponentialRampToValueAtTime(0.01, bassStart + 0.4);
        
        bass.start(bassStart);
        bass.stop(bassStart + 0.4);
    }

    // Spinning Animation Methods (during selection)
    createPacManAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-pacman-container';
        
        // Create Pac-Man
        const pacman = document.createElement('div');
        pacman.className = 'retro-pacman';
        pacman.textContent = 'ᗧ';
        
        // Create dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'retro-pacman-dots';
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('span');
            dot.className = 'retro-dot';
            dot.textContent = '·';
            dot.style.animationDelay = `${i * 0.1}s`;
            dotsContainer.appendChild(dot);
        }
        
        retroPixels.appendChild(pacman);
        retroPixels.appendChild(dotsContainer);
    }

    createSpaceInvadersAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-invaders-container';
        
        // Create 3 rows of aliens
        for (let row = 0; row < 3; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'retro-invader-row';
            rowDiv.style.animationDelay = `${row * 0.1}s`;
            
            for (let i = 0; i < 6; i++) {
                const alien = document.createElement('span');
                alien.className = 'retro-alien';
                alien.textContent = '👾';
                alien.style.animationDelay = `${i * 0.05}s`;
                rowDiv.appendChild(alien);
            }
            
            retroPixels.appendChild(rowDiv);
        }
    }

    createPongBallAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-pong-container';
        
        // Create ball
        const ball = document.createElement('div');
        ball.className = 'retro-pong-ball';
        ball.textContent = '●';
        
        retroPixels.appendChild(ball);
    }

    createTetrisAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-tetris-container';
        
        // Define actual Tetris tetromino shapes (7 classic pieces)
        const tetrominos = [
            { name: 'I', pattern: [[1,1,1,1]], color: '#9bbc0f' },           // ████
            { name: 'O', pattern: [[1,1],[1,1]], color: '#8bac0f' },         // ██
                                                                              // ██
            { name: 'T', pattern: [[1,1,1],[0,1,0]], color: '#7b9c0f' },     // ███
                                                                              //  █
            { name: 'S', pattern: [[0,1,1],[1,1,0]], color: '#6b8c0f' },     //  ██
                                                                              // ██
            { name: 'Z', pattern: [[1,1,0],[0,1,1]], color: '#9bbc0f' },     // ██
                                                                              //  ██
            { name: 'L', pattern: [[1,0],[1,0],[1,1]], color: '#8bac0f' },   // █
                                                                              // █
                                                                              // ██
            { name: 'J', pattern: [[0,1],[0,1],[1,1]], color: '#7b9c0f' }    //  █
                                                                              //  █
                                                                              // ██
        ];
        
        // Create 5 falling tetrominoes
        for (let i = 0; i < 5; i++) {
            const tetromino = tetrominos[i % tetrominos.length];
            const piece = document.createElement('div');
            piece.className = 'retro-tetromino';
            piece.style.left = `${10 + i * 18}%`;
            piece.style.animationDelay = `${i * 0.4}s`;
            piece.style.animationDuration = `${1.8 + Math.random() * 0.6}s`;
            
            // Create grid for the tetromino
            const grid = document.createElement('div');
            grid.className = 'tetromino-grid';
            
            // Build the shape from the pattern
            tetromino.pattern.forEach(row => {
                row.forEach(cell => {
                    const block = document.createElement('div');
                    block.className = cell ? 'tetromino-block' : 'tetromino-empty';
                    if (cell) {
                        block.style.backgroundColor = tetromino.color;
                    }
                    grid.appendChild(block);
                });
            });
            
            // Set grid template based on pattern dimensions
            const cols = tetromino.pattern[0].length;
            const rows = tetromino.pattern.length;
            grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
            
            piece.appendChild(grid);
            retroPixels.appendChild(piece);
        }
    }

    // Celebration Animation Methods (after selection)
    createFireworksAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-fireworks-container';
        
        const symbols = ['*', '✦', '✧', '★', '☆', '✨'];
        
        // Create multiple bursts
        for (let burst = 0; burst < 4; burst++) {
            setTimeout(() => {
                for (let i = 0; i < 16; i++) {
                    const star = document.createElement('div');
                    star.className = 'retro-firework';
                    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    star.style.setProperty('--angle', `${(i * 22.5)}deg`);
                    star.style.animationDelay = `${burst * 0.3}s`;
                    retroPixels.appendChild(star);
                }
            }, burst * 300);
        }
    }

    createTrophyAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-trophy-container';
        
        // Trophy descending
        const trophy = document.createElement('div');
        trophy.className = 'retro-trophy';
        trophy.innerHTML = '🏆';
        
        // Sparkles around trophy
        const sparkles = document.createElement('div');
        sparkles.className = 'retro-trophy-sparkles';
        sparkles.innerHTML = '✨ ✨';
        
        retroPixels.appendChild(trophy);
        retroPixels.appendChild(sparkles);
    }

    createScrollingMessageAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-scroll-container';
        
        const messages = [
            '>>> WINNER WINNER CHICKEN DINNER <<<',
            '>>> SELECTION COMPLETE <<<',
            '>>> CONGRATULATIONS <<<',
            '>>> RANDOM CHOICE ACHIEVED <<<',
            '>>> THE COMPUTER HAS SPOKEN <<<'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const scrollText = document.createElement('div');
        scrollText.className = 'retro-scroll-text';
        scrollText.textContent = message;
        
        retroPixels.appendChild(scrollText);
    }

    createRetroQuotesAnimation() {
        const retroPixels = document.getElementById('retroPixels');
        retroPixels.innerHTML = '';
        retroPixels.className = 'retro-pixels retro-quote-container';
        
        const quotes = [
            '"CONGRATULATIONS!!!"<br>- THE COMPUTER',
            '"EXCELLENT CHOICE"<br>- SELEKTOR 5000',
            '"PROBABILITY: 1 IN ' + this.urls.filter(u => !this.usedUrls.has(u.id)).length + '"<br>- MATH',
            '"TASK FAILED SUCCESSFULLY"<br>- WINDOWS XP',
            '"MISSION ACCOMPLISHED"<br>- SYSTEM',
            '"ALL YOUR BASE ARE BELONG TO US"<br>- ZERO WING'
        ];
        
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'retro-quote';
        quoteDiv.innerHTML = quote;
        
        retroPixels.appendChild(quoteDiv);
    }

    // Helper Methods for Random Selection
    getRandomSpinAnimation() {
        const animations = ['pacman', 'invaders', 'pong', 'tetris'];
        return animations[Math.floor(Math.random() * animations.length)];
    }

    getRandomCelebrationAnimation() {
        const animations = ['fireworks', 'trophy', 'scrolling', 'quotes'];
        return animations[Math.floor(Math.random() * animations.length)];
    }

    showRetroIdleState() {
        const retroPixels = document.getElementById('retroPixels');
        
        // Keep existing celebration animation if it exists
        // Only add idle message if not already present
        if (!retroPixels.querySelector('.retro-idle-message')) {
            const idleMessage = document.createElement('div');
            idleMessage.className = 'retro-idle-message';
            idleMessage.textContent = 'Press The Any Key....';
            retroPixels.appendChild(idleMessage);
        }
    }


    render() {
        this.renderUrlList();
        this.updateStats();
        this.updateDisplay();
        this.updateProfileSelector();
        this.updateUI();
        
        // Show/hide UI based on type
        const defaultUI = document.getElementById('defaultUI');
        const cardsUI = document.getElementById('cardsUI');
        const retroUI = document.getElementById('retroUI');
        const selectCardBtn = document.getElementById('selectCardBtn');
        
        if (this.uiType === 'cards') {
            defaultUI.style.display = 'none';
            cardsUI.style.display = 'flex';
            retroUI.style.display = 'none';
            selectCardBtn.style.display = 'block';
            this.renderCards();
        } else if (this.uiType === 'retro') {
            defaultUI.style.display = 'none';
            cardsUI.style.display = 'none';
            retroUI.style.display = 'flex';
            selectCardBtn.style.display = 'none';
            this.renderRetro();
        } else {
            defaultUI.style.display = 'flex';
            cardsUI.style.display = 'none';
            retroUI.style.display = 'none';
            selectCardBtn.style.display = 'none';
        }
    }

    updateUI() {
        // Update title and subtitle
        document.querySelector('header h1').textContent = `🎯 ${this.title}`;
        document.querySelector('header .subtitle').textContent = this.subtitle;
        
        // Show/hide fixed mode indicator
        const existingIndicator = document.querySelector('.fixed-mode-indicator');
        if (this.isFixedMode && !existingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'fixed-mode-indicator';
            indicator.innerHTML = '🔒 Fixed Config Mode';
            indicator.title = 'URLs and branding are read-only';
            document.querySelector('header').appendChild(indicator);
        } else if (!this.isFixedMode && existingIndicator) {
            existingIndicator.remove();
        }
        
        // Update topic references
        document.getElementById('topicLabel').textContent = `${this.topic}s`;
        document.getElementById('addUrlBtn').innerHTML = `<span class="btn-icon">➕</span> Add ${this.topic}`;
        document.getElementById('displayNameInput').placeholder = `${this.topic} Name`;
        
        // Disable/enable edit controls in fixed mode
        document.getElementById('addUrlBtn').disabled = this.isFixedMode;
        document.getElementById('displayNameInput').disabled = this.isFixedMode;
        document.getElementById('urlInput').disabled = this.isFixedMode;
        document.getElementById('editProfileBtn').disabled = this.isFixedMode;
        document.getElementById('clearAllBtn').disabled = this.isFixedMode;
        
        // Update settings checkboxes to match current profile
        document.getElementById('soundToggle').checked = this.soundEnabled;
        document.getElementById('volumeSlider').value = Math.round(this.soundVolume * 100);
        document.getElementById('volumeValue').textContent = `${Math.round(this.soundVolume * 100)}%`;
        document.getElementById('newTabToggle').checked = this.openInNewTab;
        document.getElementById('openUrlToggle').checked = this.openUrlEnabled;
        document.getElementById('animationSpeed').value = this.animationDuration.toString();
        document.getElementById('uiTypeSelect').value = this.uiType;
        
        const displayText = document.getElementById('displayText');
        const availableCount = this.urls.filter(url => !this.usedUrls.has(url.id)).length;
        
        if (this.urls.length === 0) {
            displayText.textContent = `Add some ${this.topic.toLowerCase()}s to get started!`;
        } else if (availableCount === 0) {
            displayText.textContent = `🔄 Click to reset and start over`;
        } else if (!this.isSelecting) {
            displayText.textContent = `Select Random ${this.topic}`;
        }
    }

    renderUrlList() {
        const urlList = document.getElementById('urlList');
        
        if (this.urls.length === 0) {
            urlList.innerHTML = `<div class="empty-state"><p>📝 No ${this.topic.toLowerCase()}s configured yet. Add some to get started!</p></div>`;
            return;
        }
        
        if (this.isFixedMode) {
            urlList.innerHTML = `
                <div class="fixed-mode-notice">
                    🔒 <strong>Fixed Configuration Mode</strong><br>
                    URLs and branding are read-only. Only settings and tracking are saved locally.
                </div>
            ` + this.urls.map(url => {
                const isUsed = this.usedUrls.has(url.id);
                return `
                    <div class="url-item ${isUsed ? 'used' : ''} fixed-item">
                        <div class="url-info">
                            <div class="url-display-name">
                                ${isUsed ? '✓ ' : ''}${this.escapeHtml(url.displayName)}
                            </div>
                            <div class="url-address">
                                ${this.escapeHtml(url.url)}
                            </div>
                        </div>
                        <div class="url-actions">
                            <span class="fixed-badge">🔒 Read-only</span>
                        </div>
                    </div>
                `;
            }).join('');
            return;
        }        
        urlList.innerHTML = this.urls.map(url => {
            const isUsed = this.usedUrls.has(url.id);
            const editingName = this.editingId === url.id && this.editingField === 'name';
            const editingUrl = this.editingId === url.id && this.editingField === 'url';
            
            return `
                <div class="url-item ${isUsed ? 'used' : ''}" data-url-id="${url.id}">
                    <div class="url-info">
                        <div class="url-display-name" ${!editingName ? `onclick="app.startEdit(${url.id}, 'name')" oncontextmenu="app.showContextMenu(event, ${url.id}); return false;"` : ''}>
                            ${editingName 
                                ? `<input type="text" id="edit-name-${url.id}" value="${this.escapeHtml(url.displayName)}" class="edit-input" onblur="app.saveEdit(${url.id}, 'name')" onkeydown="app.handleEditKeydown(event, ${url.id}, 'name')" autofocus>`
                                : (isUsed ? '✓ ' : '') + this.escapeHtml(url.displayName)
                            }
                        </div>
                        <div class="url-address" ${!editingUrl ? `onclick="app.startEdit(${url.id}, 'url')" oncontextmenu="app.showContextMenu(event, ${url.id}); return false;"` : ''}>
                            ${editingUrl
                                ? `<input type="url" id="edit-url-${url.id}" value="${this.escapeHtml(url.url)}" class="edit-input" onblur="app.saveEdit(${url.id}, 'url')" onkeydown="app.handleEditKeydown(event, ${url.id}, 'url')" autofocus>`
                                : this.escapeHtml(url.url)
                            }
                        </div>
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
            // Keep clickable to allow auto-reset
            displayBox.classList.add('clickable');
            displayBox.classList.remove('disabled');
        } else if (availableCount > 0) {
            displayBox.classList.add('clickable');
            displayBox.classList.remove('disabled');
        } else {
            // No URLs configured
            displayBox.classList.remove('clickable');
            displayBox.classList.add('disabled');
        }
    }

    updateDisplay() {
        const displayText = document.getElementById('displayText');
        const availableCount = this.urls.filter(url => !this.usedUrls.has(url.id)).length;
        
        if (this.urls.length === 0) {
            displayText.textContent = `Add some ${this.topic.toLowerCase()}s to get started!`;
        } else if (availableCount === 0) {
            displayText.textContent = `🔄 Click to reset and start over`;
        } else {
            displayText.textContent = `Select Random ${this.topic}`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        try {
            const profilesData = {};
            for (const [id, profile] of Object.entries(this.profiles)) {
                profilesData[id] = {
                    ...profile,
                    usedUrls: Array.from(profile.usedUrls)
                };
            }
            
            const data = {
                profiles: profilesData,
                currentProfileId: this.currentProfileId
            };
            const jsonData = JSON.stringify(data);
            localStorage.setItem('selektor5000Data', jsonData);
            console.log('Saved to storage:', jsonData.length, 'chars');
        } catch (e) {
            console.error('Failed to save to storage:', e);
        }
    }

    async loadFromStorage() {
        const stored = localStorage.getItem('selektor5000Data');
        console.log('Loading from storage:', stored ? stored.length + ' chars' : 'empty');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                console.log('Parsed data, profiles:', Object.keys(data.profiles || {}));
                
                // Check if this is old format (pre-profiles)
                if (data.urls && !data.profiles) {
                    // Migrate old format to profiles
                    const defaultProfile = this.createDefaultProfile('default');
                    defaultProfile.urls = data.urls || [];
                    defaultProfile.usedUrls = new Set(data.usedUrls || []);
                    defaultProfile.currentMode = data.currentMode || 'selection';
                    defaultProfile.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
                    defaultProfile.openInNewTab = data.openInNewTab !== undefined ? data.openInNewTab : true;
                    this.profiles = { 'default': defaultProfile };
                    this.currentProfileId = 'default';
                    this.saveToStorage(); // Save migrated data
                } else if (data.profiles) {
                    // New format with profiles
                    this.profiles = {};
                    for (const [id, profileData] of Object.entries(data.profiles)) {
                        this.profiles[id] = {
                            ...profileData,
                            usedUrls: new Set(profileData.usedUrls || []),
                            // Ensure new fields exist with defaults
                            cardIcon: profileData.cardIcon || '🎴',
                            cardOrder: profileData.cardOrder || [],
                            lastSelectedId: profileData.lastSelectedId || null
                        };
                    }
                    this.currentProfileId = data.currentProfileId || 'default';
                } else {
                    await this.loadDefaults();
                }
            } catch (e) {
                console.error('Failed to load data from storage:', e);
                await this.loadDefaults();
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
                const defaultProfile = this.createDefaultProfile('default');
                
                if (config.urls && Array.isArray(config.urls)) {
                    defaultProfile.urls = config.urls.map(url => ({
                        ...url,
                        id: Date.now() + Math.random()
                    }));
                }
                if (config.soundEnabled !== undefined) {
                    defaultProfile.soundEnabled = config.soundEnabled;
                }
                if (config.openInNewTab !== undefined) {
                    defaultProfile.openInNewTab = config.openInNewTab;
                }
                if (config.title) defaultProfile.title = config.title;
                if (config.subtitle) defaultProfile.subtitle = config.subtitle;
                if (config.topic) defaultProfile.topic = config.topic;
                
                this.profiles = { 'default': defaultProfile };
                this.currentProfileId = 'default';
            }
        } catch (e) {
            console.log('No default configuration loaded. If using file:// protocol, serve via HTTP server to load defaults.');
            this.profiles = { 'default': this.createDefaultProfile('default') };
            this.currentProfileId = 'default';
        }
    }

    async loadFixedConfig() {
        try {
            const response = await fetch('fixed-config.json');
            if (response.ok) {
                const config = await response.json();
                this.fixedConfig = {
                    name: config.name || 'Fixed Configuration',
                    title: config.title || 'Selektor 5000',
                    subtitle: config.subtitle || 'The anti-procrastination dev selector',
                    topic: config.topic || 'Selectee',
                    urls: (config.urls || []).map(url => ({
                        ...url,
                        id: Date.now() + Math.random()
                    }))
                };
                this.isFixedMode = true;
                console.log('Fixed configuration loaded. URLs and branding are read-only.');
            }
        } catch (e) {
            this.isFixedMode = false;
        }
    }

    exportConfig() {
        const config = {
            name: this.currentProfile.name,
            title: this.title,
            subtitle: this.subtitle,
            topic: this.topic,
            urls: this.urls.map(({ displayName, url }) => ({ displayName, url })),
            soundEnabled: this.soundEnabled,
            openInNewTab: this.openInNewTab
        };
        
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `selektor-5000-${this.currentProfile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
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
                    if (confirm('Import configuration? This will replace your current profile.')) {
                        this.urls = config.urls.map(url => ({
                            ...url,
                            id: Date.now() + Math.random()
                        }));
                        this.usedUrls.clear();
                        if (config.soundEnabled !== undefined) {
                            this.soundEnabled = config.soundEnabled;
                        }
                        if (config.openInNewTab !== undefined) {
                            this.openInNewTab = config.openInNewTab;
                        }
                        if (config.title) this.title = config.title;
                        if (config.subtitle) this.subtitle = config.subtitle;
                        if (config.topic) this.topic = config.topic;
                        if (config.name) this.currentProfile.name = config.name;
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
        this.resetAndLoadDefaults();
    }

    async resetAndLoadDefaults() {
        if (!confirm('Reset to default configuration? This will replace your current profile.')) {
            return;
        }
        
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
                    if (config.openInNewTab !== undefined) {
                        this.openInNewTab = config.openInNewTab;
                    }
                    if (config.title) this.title = config.title;
                    if (config.subtitle) this.subtitle = config.subtitle;
                    if (config.topic) this.topic = config.topic;
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
        if (this.isFixedMode) {
            alert('Cannot clear URLs in fixed configuration mode.');
            return;
        }
        if (confirm('Clear all URLs? This action cannot be undone.')) {
            this.urls = [];
            this.usedUrls.clear();
            this.saveToStorage();
            this.render();
        }
    }

    // Profile Management Methods
    updateProfileSelector() {
        const selector = document.getElementById('profileSelector');
        selector.innerHTML = '';
        
        for (const [id, profile] of Object.entries(this.profiles)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = profile.name;
            option.selected = id === this.currentProfileId;
            selector.appendChild(option);
        }
        
        // Enable/disable delete button
        document.getElementById('deleteProfileBtn').disabled = Object.keys(this.profiles).length <= 1;
    }

    switchProfile(profileId) {
        if (this.profiles[profileId]) {
            this.currentProfileId = profileId;
            this.saveToStorage();
            this.render();
        }
    }

    createNewProfile() {
        const name = prompt('Enter a name for the new profile:', 'New Profile');
        if (!name || !name.trim()) return;
        
        const id = 'profile_' + Date.now();
        this.profiles[id] = this.createDefaultProfile(id, name.trim());
        this.currentProfileId = id;
        this.saveToStorage();
        this.closeEditPanel();
        this.render();
    }

    deleteProfile() {
        if (Object.keys(this.profiles).length <= 1) {
            alert('Cannot delete the last profile.');
            return;
        }
        
        const profileName = this.currentProfile.name;
        if (!confirm(`Delete profile "${profileName}"? This cannot be undone.`)) {
            return;
        }
        
        delete this.profiles[this.currentProfileId];
        this.currentProfileId = Object.keys(this.profiles)[0];
        this.closeEditPanel();
        this.saveToStorage();
        this.render();
    }

    openEditPanel() {
        if (this.isFixedMode) {
            alert('Profile customization is disabled in fixed configuration mode.');
            return;
        }
        
        const panel = document.getElementById('profileEditPanel');
        const profile = this.currentProfile;
        
        // Populate form fields
        document.getElementById('profileNameInput').value = profile.name;
        document.getElementById('profileTitleInput').value = profile.title;
        document.getElementById('profileSubtitleInput').value = profile.subtitle;
        document.getElementById('profileTopicInput').value = profile.topic;
        
        // Show panel
        panel.style.display = 'block';
        document.getElementById('profileNameInput').focus();
    }

    closeEditPanel() {
        document.getElementById('profileEditPanel').style.display = 'none';
    }

    saveProfileEdits() {
        const profile = this.currentProfile;
        
        const name = document.getElementById('profileNameInput').value.trim();
        const title = document.getElementById('profileTitleInput').value.trim();
        const subtitle = document.getElementById('profileSubtitleInput').value.trim();
        const topic = document.getElementById('profileTopicInput').value.trim();
        
        if (!name) {
            alert('Profile name cannot be empty');
            return;
        }
        
        if (!title) {
            alert('Title cannot be empty');
            return;
        }
        
        if (!topic) {
            alert('Topic cannot be empty');
            return;
        }
        
        profile.name = name;
        profile.title = title;
        profile.subtitle = subtitle;
        profile.topic = topic;
        
        this.closeEditPanel();
        this.saveToStorage();
        this.render();
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

    setupTestMode() {
        // Listen for "spispopd" sequence to activate test mode
        document.addEventListener('keydown', (e) => {
            // Ignore if in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Handle Escape key to exit test mode
            if (e.key === 'Escape' && this.testMode) {
                this.testMode = false;
                this.testModeSequence = '';
                console.log('🎮 Test Mode DEACTIVATED (Escape pressed)');
                this.hideTestModeUI();
                return;
            }

            // Build sequence
            this.testModeSequence += e.key.toLowerCase();
            
            // Keep only last 8 characters
            if (this.testModeSequence.length > 8) {
                this.testModeSequence = this.testModeSequence.slice(-8);
            }
            
            // Check for activation sequence
            if (this.testModeSequence.includes('spispopd')) {
                this.testMode = !this.testMode;
                this.testModeSequence = '';
                
                if (this.testMode) {
                    console.log('🎮 Test Mode ACTIVATED');
                    this.showTestModeUI();
                } else {
                    console.log('🎮 Test Mode DEACTIVATED');
                    this.hideTestModeUI();
                }
                return;
            }
            
            // If in test mode and retro UI, handle number keys
            if (this.testMode && this.uiType === 'retro' && this.currentMode === 'selection') {
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= 8) {
                    this.triggerTestAnimation(num);
                }
            }
        });
    }

    showTestModeUI() {
        if (this.uiType !== 'retro') {
            alert('Test mode only works in Retro UI mode. Please switch to Retro UI in Settings.');
            this.testMode = false;
            return;
        }
        
        const retroText = document.getElementById('retroText');
        const retroPixels = document.getElementById('retroPixels');
        
        retroText.classList.add('c64-prompt');
        retroText.innerHTML = `
            <div class="c64-line c64-center">🎮 TEST MODE ACTIVE 🎮</div>
            <div class="c64-line">PRESS NUMBER TO TEST:</div>
            <div class="c64-line">1 = PAC-MAN SPIN</div>
            <div class="c64-line">2 = SPACE INVADERS SPIN</div>
            <div class="c64-line">3 = PONG BALL SPIN</div>
            <div class="c64-line">4 = TETRIS SPIN</div>
            <div class="c64-line">5 = FIREWORKS CELEBRATION</div>
            <div class="c64-line">6 = TROPHY CELEBRATION</div>
            <div class="c64-line">7 = SCROLLING MESSAGE</div>
            <div class="c64-line">8 = RETRO QUOTES</div>
            <div class="c64-line">TYPE 'spispopd' TO EXIT</div>
        `;
        retroPixels.innerHTML = '';
    }

    hideTestModeUI() {
        if (this.uiType === 'retro') {
            this.renderRetro();
        }
    }

    triggerTestAnimation(num) {
        const retroText = document.getElementById('retroText');
        const retroPixels = document.getElementById('retroPixels');
        
        console.log(`🎮 Testing animation ${num}`);
        
        // Clear previous animation
        retroPixels.innerHTML = '';
        retroText.classList.remove('c64-prompt');
        
        // Set up repeating sound effects for spin animations (1-4)
        let soundInterval;
        
        switch(num) {
            case 1:
                retroText.textContent = 'PAC-MAN ANIMATION';
                this.createPacManAnimation();
                // Play spinning sound repeatedly for spin animations
                if (this.soundEnabled) {
                    this.playRetroBlip();
                    soundInterval = setInterval(() => this.playRetroBlip(), 200);
                }
                break;
            case 2:
                retroText.textContent = 'SPACE INVADERS ANIMATION';
                this.createSpaceInvadersAnimation();
                if (this.soundEnabled) {
                    this.playRetroBlip();
                    soundInterval = setInterval(() => this.playRetroBlip(), 200);
                }
                break;
            case 3:
                retroText.textContent = 'PONG BALL ANIMATION';
                this.createPongBallAnimation();
                if (this.soundEnabled) {
                    this.playRetroBlip();
                    soundInterval = setInterval(() => this.playRetroBlip(), 200);
                }
                break;
            case 4:
                retroText.textContent = 'TETRIS ANIMATION';
                this.createTetrisAnimation();
                if (this.soundEnabled) {
                    this.playRetroBlip();
                    soundInterval = setInterval(() => this.playRetroBlip(), 200);
                }
                break;
            case 5:
                retroText.textContent = 'FIREWORKS CELEBRATION';
                this.createFireworksAnimation();
                // Play celebration sound once for celebration animations
                if (this.soundEnabled) {
                    this.playRetroSelectSound();
                }
                break;
            case 6:
                retroText.textContent = 'TROPHY CELEBRATION';
                this.createTrophyAnimation();
                if (this.soundEnabled) {
                    this.playRetroSelectSound();
                }
                break;
            case 7:
                retroText.textContent = 'SCROLLING MESSAGE';
                this.createScrollingMessageAnimation();
                if (this.soundEnabled) {
                    this.playRetroSelectSound();
                }
                break;
            case 8:
                retroText.textContent = 'RETRO QUOTES';
                this.createRetroQuotesAnimation();
                if (this.soundEnabled) {
                    this.playRetroSelectSound();
                }
                break;
        }
        
        // Show test menu again after 5 seconds and stop sounds
        setTimeout(() => {
            if (soundInterval) {
                clearInterval(soundInterval);
            }
            if (this.testMode) {
                this.showTestModeUI();
            }
        }, 5000);
    }

    openDebugView() {
        const debugView = document.getElementById('debugView');
        debugView.style.display = 'flex';
        this.updateDebugView();
        this.loadChangelog();
    }

    closeDebugView() {
        document.getElementById('debugView').style.display = 'none';
    }

    switchDebugTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.debug-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.content === tabName);
        });
    }

    async loadChangelog() {
        try {
            const response = await fetch('CHANGELOG.md');
            if (response.ok) {
                const markdown = await response.text();
                const html = this.markdownToHtml(markdown);
                document.getElementById('changelogContent').innerHTML = html;
            } else {
                document.getElementById('changelogContent').innerHTML = 
                    '<p style="color: #999;">Changelog not found. Make sure CHANGELOG.md is in the same directory.</p>';
            }
        } catch (e) {
            document.getElementById('changelogContent').innerHTML = 
                '<p style="color: #999;">Could not load changelog. Serve via HTTP server to view.</p>';
        }
    }

    markdownToHtml(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Horizontal rules
        html = html.replace(/^\-\-\-$/gim, '<hr>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Paragraphs
        html = html.split('\n\n').map(para => {
            if (!para.match(/^<[h|u|l|hr]/)) {
                return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
            }
            return para;
        }).join('\n');
        
        return html;
    }

    updateDebugView() {
        const configJson = {
            name: this.currentProfile.name,
            title: this.title,
            subtitle: this.subtitle,
            topic: this.topic,
            urls: this.urls.map(({ displayName, url }) => ({ displayName, url })),
            soundEnabled: this.soundEnabled,
            openInNewTab: this.openInNewTab
        };
        
        document.getElementById('debugConfigJson').innerHTML = this.renderJsonTree(configJson, 'config');
        
        const browserState = {
            localStorage: localStorage.getItem('selektor5000Data') ? JSON.parse(localStorage.getItem('selektor5000Data')) : null,
            currentSession: {
                currentProfileId: this.currentProfileId,
                profileNames: Object.keys(this.profiles).map(id => ({ id, name: this.profiles[id].name })),
                currentProfile: {
                    name: this.currentProfile.name,
                    title: this.title,
                    subtitle: this.subtitle,
                    topic: this.topic,
                    urls: this.urls,
                    usedUrls: Array.from(this.usedUrls),
                    currentMode: this.currentMode,
                    soundEnabled: this.soundEnabled,
                    openInNewTab: this.openInNewTab
                }
            }
        };
        
        document.getElementById('debugBrowserState').innerHTML = this.renderJsonTree(browserState, 'state');
    }

    renderJsonTree(obj, prefix, depth = 0, key = null) {
        const indent = depth * 20;
        let html = '';
        
        if (obj === null) {
            return `<span class="json-null">null</span>`;
        }
        
        if (typeof obj === 'boolean') {
            return `<span class="json-boolean">${obj}</span>`;
        }
        
        if (typeof obj === 'number') {
            return `<span class="json-number">${obj}</span>`;
        }
        
        if (typeof obj === 'string') {
            return `<span class="json-string">"${this.escapeHtml(obj)}"</span>`;
        }
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) {
                return `<span class="json-bracket">[]</span>`;
            }
            
            const itemId = `${prefix}-${depth}-${key || 'root'}`.replace(/[^a-z0-9-]/gi, '-');
            const isExpanded = depth < 2; // Auto-expand first 2 levels
            
            html += `<div class="json-tree-node">`;
            html += `<span class="json-toggle ${isExpanded ? 'expanded' : ''}" onclick="app.toggleJsonNode('${itemId}')">▶</span>`;
            html += `<span class="json-bracket">[</span>`;
            html += `<span class="json-count">${obj.length} items</span>`;
            html += `<div class="json-children ${isExpanded ? 'expanded' : ''}" id="${itemId}">`;
            
            obj.forEach((item, index) => {
                html += `<div class="json-item" style="padding-left: ${indent + 20}px;">`;
                html += `<span class="json-key">${index}</span>: `;
                html += this.renderJsonTree(item, prefix, depth + 1, `arr-${index}`);
                if (index < obj.length - 1) html += ',';
                html += `</div>`;
            });
            
            html += `</div>`;
            html += `<span class="json-bracket" style="padding-left: ${indent}px">]</span>`;
            html += `</div>`;
            
            return html;
        }
        
        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                return `<span class="json-bracket">{}</span>`;
            }
            
            const itemId = `${prefix}-${depth}-${key || 'root'}`.replace(/[^a-z0-9-]/gi, '-');
            const isExpanded = depth < 2; // Auto-expand first 2 levels
            
            html += `<div class="json-tree-node">`;
            html += `<span class="json-toggle ${isExpanded ? 'expanded' : ''}" onclick="app.toggleJsonNode('${itemId}')">▶</span>`;
            html += `<span class="json-bracket">{</span>`;
            html += `<span class="json-count">${keys.length} keys</span>`;
            html += `<div class="json-children ${isExpanded ? 'expanded' : ''}" id="${itemId}">`;
            
            keys.forEach((k, index) => {
                html += `<div class="json-item" style="padding-left: ${indent + 20}px;">`;
                html += `<span class="json-key">"${this.escapeHtml(k)}"</span>: `;
                html += this.renderJsonTree(obj[k], prefix, depth + 1, k);
                if (index < keys.length - 1) html += ',';
                html += `</div>`;
            });
            
            html += `</div>`;
            html += `<span class="json-bracket" style="padding-left: ${indent}px">}</span>`;
            html += `</div>`;
            
            return html;
        }
        
        return String(obj);
    }

    toggleJsonNode(nodeId) {
        const node = document.getElementById(nodeId);
        const toggle = node.previousElementSibling.previousElementSibling;
        
        if (node && toggle) {
            node.classList.toggle('expanded');
            toggle.classList.toggle('expanded');
        }
    }

    expandAllNodes(containerId) {
        const container = document.getElementById(containerId);
        container.querySelectorAll('.json-children').forEach(child => {
            child.classList.add('expanded');
        });
        container.querySelectorAll('.json-toggle').forEach(toggle => {
            toggle.classList.add('expanded');
        });
    }

    collapseAllNodes(containerId) {
        const container = document.getElementById(containerId);
        container.querySelectorAll('.json-children').forEach(child => {
            child.classList.remove('expanded');
        });
        container.querySelectorAll('.json-toggle').forEach(toggle => {
            toggle.classList.remove('expanded');
        });
    }

    copyDebugConfig() {
        const configJson = {
            name: this.currentProfile.name,
            title: this.title,
            subtitle: this.subtitle,
            topic: this.topic,
            urls: this.urls.map(({ displayName, url }) => ({ displayName, url })),
            soundEnabled: this.soundEnabled,
            openInNewTab: this.openInNewTab
        };
        const text = JSON.stringify(configJson, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            alert('Configuration JSON copied to clipboard!');
        });
    }

    copyDebugState() {
        const browserState = {
            localStorage: localStorage.getItem('selektor5000Data') ? JSON.parse(localStorage.getItem('selektor5000Data')) : null,
            currentSession: {
                currentProfileId: this.currentProfileId,
                profileNames: Object.keys(this.profiles).map(id => ({ id, name: this.profiles[id].name })),
                currentProfile: {
                    name: this.currentProfile.name,
                    title: this.title,
                    subtitle: this.subtitle,
                    topic: this.topic,
                    urls: this.urls,
                    usedUrls: Array.from(this.usedUrls),
                    currentMode: this.currentMode,
                    soundEnabled: this.soundEnabled,
                    openInNewTab: this.openInNewTab
                }
            }
        };
        const text = JSON.stringify(browserState, null, 2);
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

    startEdit(id, field) {
        this.editingId = id;
        this.editingField = field;
        this.renderUrlList();
    }

    saveEdit(id, field) {
        const inputId = `edit-${field}-${id}`;
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const newValue = input.value.trim();
        if (!newValue) {
            alert('Value cannot be empty');
            this.editingId = null;
            this.editingField = null;
            this.renderUrlList();
            return;
        }
        
        if (field === 'url' && !this.isValidUrl(newValue)) {
            alert('Please enter a valid URL');
            return;
        }
        
        const urlObj = this.urls.find(u => u.id === id);
        if (urlObj) {
            if (field === 'name') {
                urlObj.displayName = newValue;
            } else if (field === 'url') {
                urlObj.url = newValue;
            }
            this.saveToStorage();
        }
        
        this.editingId = null;
        this.editingField = null;
        this.renderUrlList();
    }

    handleEditKeydown(event, id, field) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.saveEdit(id, field);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            this.editingId = null;
            this.editingField = null;
            this.renderUrlList();
        }
    }

    showContextMenu(event, id) {
        event.preventDefault();
        this.contextMenuTarget = id;
        
        const menu = document.getElementById('contextMenu');
        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
    }

    hideContextMenu() {
        document.getElementById('contextMenu').style.display = 'none';
    }

    async checkUrl() {
        this.hideContextMenu();
        const urlObj = this.urls.find(u => u.id === this.contextMenuTarget);
        if (!urlObj) return;

        try {
            const response = await fetch(urlObj.url, { method: 'HEAD', mode: 'no-cors' });
            alert(`✓ URL appears to be accessible:\n${urlObj.url}`);
        } catch (e) {
            alert(`⚠️ Could not verify URL (may still work):\n${urlObj.url}\n\nNote: CORS restrictions may prevent verification.`);
        }
    }

    openUrl() {
        this.hideContextMenu();
        const urlObj = this.urls.find(u => u.id === this.contextMenuTarget);
        if (urlObj) {
            window.open(urlObj.url, '_blank');
        }
    }

    duplicateEntry() {
        this.hideContextMenu();
        const urlObj = this.urls.find(u => u.id === this.contextMenuTarget);
        if (!urlObj) return;

        // Find a unique name by appending a number
        let baseName = urlObj.displayName;
        let counter = 2;
        let newName = `${baseName} ${counter}`;
        
        while (this.urls.some(u => u.displayName === newName)) {
            counter++;
            newName = `${baseName} ${counter}`;
        }

        const duplicate = {
            id: Date.now() + Math.random(),
            displayName: newName,
            url: urlObj.url
        };

        this.urls.push(duplicate);
        this.saveToStorage();
        this.render();
    }

    markDone() {
        this.hideContextMenu();
        const urlObj = this.urls.find(u => u.id === this.contextMenuTarget);
        if (!urlObj) return;

        if (this.usedUrls.has(urlObj.id)) {
            this.usedUrls.delete(urlObj.id);
        } else {
            this.usedUrls.add(urlObj.id);
        }
        this.render();
    }
}

const app = new TeamMeter();
