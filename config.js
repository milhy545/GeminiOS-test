// Configuration Manager

class Config {
    constructor() {
        this.storageKey = 'geminiOS_config';
        this.data = this.load();
    }

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading config:', e);
        }

        // Default config
        return {
            aiProvider: 'gemini',
            apiKeys: {
                gemini: '',
                claude: '',
                openai: ''
            },
            wallpaper: 'gradient',
            theme: 'default',
            generatedApps: []
        };
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving config:', e);
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
    }

    getApiKey(provider) {
        return this.data.apiKeys[provider] || '';
    }

    setApiKey(provider, key) {
        this.data.apiKeys[provider] = key;
        this.save();
    }

    getCurrentProvider() {
        return this.data.aiProvider;
    }

    setCurrentProvider(provider) {
        this.data.aiProvider = provider;
        this.save();
    }

    getCurrentApiKey() {
        return this.getApiKey(this.getCurrentProvider());
    }

    addGeneratedApp(appData) {
        if (!this.data.generatedApps) {
            this.data.generatedApps = [];
        }
        this.data.generatedApps.push(appData);
        this.save();
    }

    getGeneratedApps() {
        return this.data.generatedApps || [];
    }
}

// Global instance
window.config = new Config();
