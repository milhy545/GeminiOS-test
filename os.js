// Main OS Controller

class GeminiOS {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        // Check if API key is already set
        const hasApiKey = this.checkApiKey();

        if (hasApiKey) {
            this.startOS();
        } else {
            this.showWelcomeScreen();
        }

        this.setupEventListeners();
        this.startClock();
    }

    checkApiKey() {
        const provider = window.config.getCurrentProvider();
        const apiKey = window.config.getCurrentApiKey();
        return apiKey && apiKey.length > 0;
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const desktop = document.getElementById('desktop');

        welcomeScreen.classList.remove('hidden');
        desktop.classList.add('hidden');

        // Setup welcome screen
        const startBtn = document.getElementById('start-os');
        const providerRadios = document.querySelectorAll('input[name="ai-provider"]');

        startBtn.addEventListener('click', () => {
            const selectedProvider = document.querySelector('input[name="ai-provider"]:checked').value;
            let apiKey = '';

            if (selectedProvider === 'gemini') {
                apiKey = document.getElementById('gemini-key').value.trim();
            } else if (selectedProvider === 'claude') {
                apiKey = document.getElementById('claude-key').value.trim();
            } else if (selectedProvider === 'openai') {
                apiKey = document.getElementById('openai-key').value.trim();
            }

            if (!apiKey) {
                alert('Zadejte prosím API klíč pro vybraného providera!');
                return;
            }

            // Save configuration
            window.config.setCurrentProvider(selectedProvider);
            window.config.setApiKey(selectedProvider, apiKey);
            window.aiEngine.setProvider(selectedProvider, apiKey);

            this.startOS();
        });
    }

    startOS() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const desktop = document.getElementById('desktop');

        welcomeScreen.classList.add('hidden');
        desktop.classList.remove('hidden');

        if (!this.initialized) {
            this.initializeDesktop();
            this.initialized = true;
        }

        // Update AI status
        this.updateAIStatus();
    }

    initializeDesktop() {
        // Load generated apps from storage
        const generatedApps = window.config.getGeneratedApps();
        generatedApps.forEach(app => {
            window.apps.installedApps.set(app.id, {
                name: app.name,
                icon: '🤖',
                launch: () => {
                    window.windowManager.createWindow({
                        title: app.name,
                        icon: '🤖',
                        width: 700,
                        height: 500,
                        content: app.code
                    });
                }
            });
        });

        // Update generated apps list in start menu
        window.apps.updateGeneratedAppsList();
    }

    setupEventListeners() {
        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const appId = icon.dataset.app;
                window.apps.launchApp(appId);
            });
        });

        // Start menu button
        const startMenuBtn = document.querySelector('.start-menu-btn');
        const startMenu = document.getElementById('start-menu');

        startMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('hidden');
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startMenuBtn.contains(e.target)) {
                startMenu.classList.add('hidden');
            }
        });

        // Start menu items
        document.querySelectorAll('.menu-item[data-app]').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.dataset.app;
                window.apps.launchApp(appId);
                startMenu.classList.add('hidden');
            });
        });

        // Generate app from start menu
        const generateBtn = document.getElementById('generate-app');
        const promptInput = document.getElementById('ai-prompt');

        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                const prompt = promptInput.value.trim();
                if (!prompt) {
                    alert('Zadejte prosím popis aplikace!');
                    return;
                }

                startMenu.classList.add('hidden');
                await window.apps.generateAndLaunchApp(prompt);
                promptInput.value = '';
            });

            promptInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    generateBtn.click();
                }
            });
        }

        // Prevent context menu on desktop
        document.querySelector('.desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const clockEl = document.getElementById('clock');
            if (clockEl) {
                clockEl.textContent = `${hours}:${minutes}`;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    updateAIStatus() {
        const statusEl = document.getElementById('ai-provider-name');
        if (!statusEl) return;

        const provider = window.config.getCurrentProvider();
        const names = {
            gemini: 'Gemini',
            claude: 'Claude',
            openai: 'OpenAI'
        };

        statusEl.textContent = names[provider] || 'AI';
    }
}

// Start the OS when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.geminiOS = new GeminiOS();

    // Fun easter egg - Konami code
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
            alert('🎉 Easter egg! AI OS je awesome! 🚀');
            konamiCode = [];
        }
    });
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('OS Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});
