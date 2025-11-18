// Apps - Default applications and AI app generator

class Apps {
    constructor() {
        this.installedApps = new Map();
        this.registerDefaultApps();
    }

    registerDefaultApps() {
        // AI Launcher
        this.installedApps.set('ai-launcher', {
            name: 'AI Launcher',
            icon: '🚀',
            launch: () => this.launchAILauncher()
        });

        // Settings
        this.installedApps.set('settings', {
            name: 'Nastavení',
            icon: '⚙️',
            launch: () => this.launchSettings()
        });

        // AI Terminal
        this.installedApps.set('terminal', {
            name: 'AI Terminal',
            icon: '💻',
            launch: () => this.launchTerminal()
        });

        // AI Browser
        this.installedApps.set('browser', {
            name: 'AI Browser',
            icon: '🌐',
            launch: () => this.launchBrowser()
        });
    }

    launchApp(appId) {
        const app = this.installedApps.get(appId);
        if (app) {
            app.launch();
        }
    }

    launchAILauncher() {
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="margin-bottom: 20px; color: #333;">🚀 AI Launcher</h2>
                <p style="margin-bottom: 20px; color: #666;">
                    Zadejte, co chcete vytvořit, a AI vygeneruje aplikaci pro vás!
                </p>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #555;">
                        Co chcete vytvořit?
                    </label>
                    <textarea
                        id="ai-app-prompt"
                        rows="4"
                        style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; font-family: inherit; resize: vertical;"
                        placeholder="Např: Vytvořit kalkulačku, To-do list, Časovač, Hru piškvorky..."
                    ></textarea>
                </div>

                <button
                    id="generate-ai-app"
                    style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s;"
                    onmouseover="this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.transform='translateY(0)'"
                >
                    Generovat aplikaci s AI
                </button>

                <div id="launcher-status" style="margin-top: 15px; padding: 10px; border-radius: 6px; display: none;"></div>

                <div style="margin-top: 30px;">
                    <h3 style="margin-bottom: 15px; color: #555; font-size: 16px;">💡 Příklady:</h3>
                    <div id="example-prompts" style="display: grid; gap: 10px;">
                        <button class="example-prompt" data-prompt="Kalkulačka s moderním designem">🔢 Kalkulačka</button>
                        <button class="example-prompt" data-prompt="To-do list s možností přidávat a mazat úkoly">✅ To-do List</button>
                        <button class="example-prompt" data-prompt="Odpočítávání času s možností nastavit čas">⏱️ Časovač</button>
                        <button class="example-prompt" data-prompt="Hra piškvorky pro dva hráče">🎮 Piškvorky</button>
                        <button class="example-prompt" data-prompt="Poznámkový blok s barevným formátováním">📝 Poznámky</button>
                        <button class="example-prompt" data-prompt="Generátor náhodných hesel">🔐 Generátor hesel</button>
                    </div>
                </div>
            </div>

            <style>
                .example-prompt {
                    padding: 10px 15px;
                    background: #f5f5f5;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                    font-size: 14px;
                }
                .example-prompt:hover {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                    transform: translateX(5px);
                }
            </style>
        `;

        const windowId = window.windowManager.createWindow({
            title: 'AI Launcher',
            icon: '🚀',
            width: 600,
            height: 600,
            content: content
        });

        // Setup event listeners after window is created
        setTimeout(() => {
            const promptInput = document.getElementById('ai-app-prompt');
            const generateBtn = document.getElementById('generate-ai-app');
            const statusDiv = document.getElementById('launcher-status');

            generateBtn.addEventListener('click', async () => {
                const prompt = promptInput.value.trim();
                if (!prompt) {
                    this.showStatus(statusDiv, 'Zadejte prosím popis aplikace', 'error');
                    return;
                }

                await this.generateAndLaunchApp(prompt, statusDiv);
            });

            // Example prompts
            document.querySelectorAll('.example-prompt').forEach(btn => {
                btn.addEventListener('click', () => {
                    promptInput.value = btn.dataset.prompt;
                });
            });
        }, 100);
    }

    async generateAndLaunchApp(prompt, statusDiv = null) {
        try {
            if (statusDiv) {
                this.showStatus(statusDiv, 'AI generuje aplikaci...', 'loading');
            }

            this.showLoading(true, 'AI generuje vaši aplikaci...');

            const appCode = await window.aiEngine.generateAppCode(prompt);

            this.showLoading(false);

            if (statusDiv) {
                this.showStatus(statusDiv, 'Aplikace úspěšně vygenerována!', 'success');
            }

            // Launch the generated app
            const appId = `ai-app-${Date.now()}`;
            const appName = this.extractAppName(prompt);

            this.installedApps.set(appId, {
                name: appName,
                icon: '🤖',
                launch: () => {
                    window.windowManager.createWindow({
                        title: appName,
                        icon: '🤖',
                        width: 700,
                        height: 500,
                        content: appCode
                    });
                }
            });

            // Save to config
            window.config.addGeneratedApp({
                id: appId,
                name: appName,
                prompt: prompt,
                code: appCode,
                created: new Date().toISOString()
            });

            // Launch the app
            this.launchApp(appId);

            // Update start menu
            this.updateGeneratedAppsList();

        } catch (error) {
            console.error('Error generating app:', error);
            this.showLoading(false);
            if (statusDiv) {
                this.showStatus(statusDiv, `Chyba: ${error.message}`, 'error');
            } else {
                alert(`Chyba při generování aplikace: ${error.message}`);
            }
        }
    }

    extractAppName(prompt) {
        // Try to extract a meaningful name from the prompt
        const words = prompt.toLowerCase().split(' ');
        const keywords = ['kalkulačka', 'calculator', 'todo', 'timer', 'časovač', 'hra', 'game', 'poznámky', 'notes'];

        for (const keyword of keywords) {
            if (prompt.toLowerCase().includes(keyword)) {
                return keyword.charAt(0).toUpperCase() + keyword.slice(1);
            }
        }

        // Default name
        return 'AI App ' + Math.floor(Math.random() * 1000);
    }

    showStatus(element, message, type) {
        element.style.display = 'block';
        element.textContent = message;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            loading: '#667eea'
        };

        element.style.background = colors[type] + '20';
        element.style.color = colors[type];
        element.style.border = `2px solid ${colors[type]}`;
    }

    showLoading(show, message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const text = document.getElementById('loading-text');

        if (show) {
            overlay.classList.remove('hidden');
            text.textContent = message;
        } else {
            overlay.classList.add('hidden');
        }
    }

    launchSettings() {
        const currentProvider = window.config.getCurrentProvider();

        const content = document.createElement('div');
        content.innerHTML = `
            <div class="settings-section">
                <h3>🤖 AI Provider</h3>
                <div class="setting-item">
                    <label>Aktivní AI Provider:</label>
                    <select id="setting-provider">
                        <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                        <option value="claude" ${currentProvider === 'claude' ? 'selected' : ''}>Anthropic Claude</option>
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI GPT-4</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>API Klíč:</label>
                    <input type="password" id="setting-apikey" value="${window.config.getCurrentApiKey()}" placeholder="Zadejte API klíč">
                </div>
                <button id="save-settings" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    💾 Uložit nastavení
                </button>
            </div>

            <div class="settings-section">
                <h3>🎨 Vzhled</h3>
                <div class="setting-item">
                    <label>Tapeta:</label>
                    <select id="setting-wallpaper">
                        <option value="gradient">Gradient (výchozí)</option>
                        <option value="dark">Tmavá</option>
                        <option value="light">Světlá</option>
                    </select>
                </div>
            </div>

            <div class="settings-section">
                <h3>📊 Informace</h3>
                <p style="color: #666;">
                    <strong>GeminiOS</strong> - AI-Generated Lite OS<br>
                    Verze: 1.0.0<br>
                    AI Provider: ${currentProvider}<br>
                    Generované aplikace: ${window.config.getGeneratedApps().length}
                </p>
            </div>

            <div class="settings-section">
                <h3>🗑️ Data</h3>
                <button id="clear-apps" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    Smazat všechny AI aplikace
                </button>
            </div>
        `;

        window.windowManager.createWindow({
            title: 'Nastavení',
            icon: '⚙️',
            width: 500,
            height: 600,
            content: content
        });

        // Setup event listeners
        setTimeout(() => {
            document.getElementById('save-settings').addEventListener('click', () => {
                const provider = document.getElementById('setting-provider').value;
                const apiKey = document.getElementById('setting-apikey').value;

                window.config.setCurrentProvider(provider);
                window.config.setApiKey(provider, apiKey);
                window.aiEngine.setProvider(provider, apiKey);

                alert('Nastavení uloženo!');
            });

            document.getElementById('setting-wallpaper').addEventListener('change', (e) => {
                const wallpaper = document.querySelector('.wallpaper');
                const value = e.target.value;

                if (value === 'gradient') {
                    wallpaper.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
                } else if (value === 'dark') {
                    wallpaper.style.background = '#1a1a1a';
                } else if (value === 'light') {
                    wallpaper.style.background = '#e0e0e0';
                }
            });

            document.getElementById('clear-apps').addEventListener('click', () => {
                if (confirm('Opravdu chcete smazat všechny AI generované aplikace?')) {
                    window.config.set('generatedApps', []);
                    location.reload();
                }
            });
        }, 100);
    }

    launchTerminal() {
        const content = document.createElement('div');
        content.className = 'app-terminal';
        content.innerHTML = `
            <div id="terminal-output"></div>
            <div class="terminal-input-line">
                <span class="terminal-prompt">❯</span>
                <input type="text" id="terminal-input" class="terminal-input" autofocus>
            </div>

            <style>
                .app-terminal {
                    background: #1e1e1e;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 15px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                #terminal-output {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 10px;
                }
                .terminal-line {
                    margin-bottom: 5px;
                    white-space: pre-wrap;
                }
            </style>
        `;

        const windowId = window.windowManager.createWindow({
            title: 'AI Terminal',
            icon: '💻',
            width: 700,
            height: 400,
            content: content
        });

        setTimeout(() => {
            const output = document.getElementById('terminal-output');
            const input = document.getElementById('terminal-input');

            const conversationHistory = [];

            const addLine = (text, isUser = false) => {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.textContent = (isUser ? '❯ ' : '🤖 ') + text;
                output.appendChild(line);
                output.scrollTop = output.scrollHeight;
            };

            addLine('AI Terminal připraven. Zadejte příkaz nebo otázku pro AI...');

            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    const command = input.value.trim();
                    if (!command) return;

                    addLine(command, true);
                    input.value = '';

                    try {
                        addLine('Zpracovávám...');
                        const response = await window.aiEngine.chat(command, conversationHistory);

                        output.removeChild(output.lastChild); // Remove "Zpracovávám..."
                        addLine(response);

                        conversationHistory.push(
                            { role: 'user', content: command },
                            { role: 'assistant', content: response }
                        );
                    } catch (error) {
                        addLine(`Chyba: ${error.message}`);
                    }
                }
            });

            input.focus();
        }, 100);
    }

    launchBrowser() {
        const content = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div style="padding: 10px; border-bottom: 2px solid #e0e0e0; display: flex; gap: 10px;">
                    <input
                        type="text"
                        id="browser-url"
                        placeholder="Zadejte URL nebo AI prompt..."
                        style="flex: 1; padding: 8px; border: 2px solid #e0e0e0; border-radius: 6px;"
                    >
                    <button id="browser-go" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Generovat
                    </button>
                </div>
                <div id="browser-content" style="flex: 1; padding: 20px; overflow: auto;">
                    <div style="text-align: center; color: #999; padding: 50px;">
                        <h2>🌐 AI Browser</h2>
                        <p>Zadejte URL nebo popište obsah, který chcete zobrazit, a AI ho vygeneruje!</p>
                    </div>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            title: 'AI Browser',
            icon: '🌐',
            width: 800,
            height: 600,
            content: content
        });

        setTimeout(() => {
            const urlInput = document.getElementById('browser-url');
            const goBtn = document.getElementById('browser-go');
            const contentDiv = document.getElementById('browser-content');

            const loadContent = async () => {
                const input = urlInput.value.trim();
                if (!input) return;

                try {
                    contentDiv.innerHTML = '<div style="text-align: center; padding: 50px;"><div class="spinner"></div><p>AI generuje obsah...</p></div>';

                    const prompt = `Vygeneruj HTML obsah pro toto zadání: ${input}. Vrať pouze HTML kód s inline CSS. Obsah by měl být vizuálně atraktivní a funkční.`;
                    const html = await window.aiEngine.generateAppCode(prompt);

                    contentDiv.innerHTML = html;
                } catch (error) {
                    contentDiv.innerHTML = `<div style="color: red; padding: 20px;">Chyba: ${error.message}</div>`;
                }
            };

            goBtn.addEventListener('click', loadContent);
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loadContent();
            });
        }, 100);
    }

    updateGeneratedAppsList() {
        const listEl = document.getElementById('generated-apps-list');
        if (!listEl) return;

        const apps = window.config.getGeneratedApps();

        if (apps.length === 0) {
            listEl.innerHTML = '<div style="padding: 10px; color: #999; font-style: italic;">Žádné AI aplikace</div>';
            return;
        }

        listEl.innerHTML = apps.map(app =>
            `<div class="menu-item" onclick="window.apps.launchGeneratedApp('${app.id}')">
                🤖 ${app.name}
            </div>`
        ).join('');
    }

    launchGeneratedApp(appId) {
        const apps = window.config.getGeneratedApps();
        const app = apps.find(a => a.id === appId);

        if (app) {
            window.windowManager.createWindow({
                title: app.name,
                icon: '🤖',
                width: 700,
                height: 500,
                content: app.code
            });
        }
    }
}

// Global instance
window.apps = new Apps();
