// Debug Module for GeminiOS
// Enable with: GeminiOSDebug.enable() or add ?debug=true to URL

class GeminiOSDebug {
    constructor() {
        this.enabled = false;
        this.logs = [];
        this.maxLogs = 1000;
        this.startTime = Date.now();

        // Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('debug') === 'true') {
            this.enable();
        }

        this.setupKeyboardShortcuts();
    }

    enable() {
        this.enabled = true;
        this.log('🐛 Debug mode enabled', 'info');
        this.createDebugPanel();
        console.log('%c🐛 GeminiOS Debug Mode Enabled', 'color: #10b981; font-size: 16px; font-weight: bold');
    }

    disable() {
        this.enabled = false;
        this.removeDebugPanel();
        this.log('🐛 Debug mode disabled', 'info');
    }

    log(message, type = 'log', data = null) {
        const timestamp = Date.now() - this.startTime;
        const logEntry = {
            timestamp,
            time: new Date().toLocaleTimeString(),
            message,
            type,
            data
        };

        this.logs.push(logEntry);

        // Keep only last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        if (this.enabled) {
            const prefix = this.getPrefix(type);
            const style = this.getStyle(type);

            console.log(`%c${prefix} [${timestamp}ms] ${message}`, style, data || '');

            this.updateDebugPanel();
        }
    }

    getPrefix(type) {
        const prefixes = {
            log: '📝',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            success: '✅',
            window: '🪟',
            ai: '🤖',
            api: '🔌',
            perf: '⚡'
        };
        return prefixes[type] || '📝';
    }

    getStyle(type) {
        const styles = {
            log: 'color: #666',
            info: 'color: #3b82f6',
            warn: 'color: #f59e0b',
            error: 'color: #ef4444; font-weight: bold',
            success: 'color: #10b981',
            window: 'color: #8b5cf6',
            ai: 'color: #ec4899',
            api: 'color: #06b6d4',
            perf: 'color: #f97316'
        };
        return styles[type] || 'color: #666';
    }

    createDebugPanel() {
        if (document.getElementById('debug-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <span class="debug-title">🐛 Debug Console</span>
                <div class="debug-controls">
                    <button class="debug-btn" onclick="GeminiOSDebug.clearLogs()">🧹 Clear</button>
                    <button class="debug-btn" onclick="GeminiOSDebug.exportLogs()">📥 Export</button>
                    <button class="debug-btn" onclick="GeminiOSDebug.togglePanel()">➖</button>
                    <button class="debug-btn" onclick="GeminiOSDebug.disable()">❌</button>
                </div>
            </div>
            <div class="debug-stats">
                <span id="debug-uptime">Uptime: 0s</span>
                <span id="debug-logs-count">Logs: 0</span>
                <span id="debug-memory">Memory: N/A</span>
            </div>
            <div class="debug-content" id="debug-content"></div>
        `;

        document.body.appendChild(panel);

        // Add styles
        this.injectStyles();

        // Update stats periodically
        setInterval(() => this.updateStats(), 1000);

        // Make panel draggable
        this.makeDraggable(panel);
    }

    removeDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) panel.remove();
    }

    updateDebugPanel() {
        const content = document.getElementById('debug-content');
        if (!content) return;

        // Show last 50 logs
        const recentLogs = this.logs.slice(-50);

        content.innerHTML = recentLogs.map(log => {
            const prefix = this.getPrefix(log.type);
            return `
                <div class="debug-log debug-log-${log.type}">
                    <span class="debug-time">${log.time}</span>
                    <span class="debug-prefix">${prefix}</span>
                    <span class="debug-message">${this.escapeHtml(log.message)}</span>
                    ${log.data ? `<span class="debug-data">${this.escapeHtml(JSON.stringify(log.data))}</span>` : ''}
                </div>
            `;
        }).join('');

        content.scrollTop = content.scrollHeight;
    }

    updateStats() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const uptimeEl = document.getElementById('debug-uptime');
        if (uptimeEl) {
            uptimeEl.textContent = `Uptime: ${uptime}s`;
        }

        const logsCountEl = document.getElementById('debug-logs-count');
        if (logsCountEl) {
            logsCountEl.textContent = `Logs: ${this.logs.length}`;
        }

        if (performance.memory) {
            const memoryEl = document.getElementById('debug-memory');
            if (memoryEl) {
                const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                memoryEl.textContent = `Memory: ${used}MB`;
            }
        }
    }

    clearLogs() {
        this.logs = [];
        this.updateDebugPanel();
        console.clear();
        this.log('Logs cleared', 'info');
    }

    exportLogs() {
        const data = {
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.startTime,
            logs: this.logs,
            stats: {
                totalLogs: this.logs.length,
                memory: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize
                } : null
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `geminiOS-debug-${Date.now()}.json`;
        a.click();

        this.log('Debug logs exported', 'success');
    }

    togglePanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.classList.toggle('debug-minimized');
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D to toggle debug
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                if (this.enabled) {
                    this.disable();
                } else {
                    this.enable();
                }
            }

            // Ctrl+Shift+L to clear logs
            if (e.ctrlKey && e.shiftKey && e.key === 'L' && this.enabled) {
                this.clearLogs();
            }
        });
    }

    makeDraggable(element) {
        const header = element.querySelector('.debug-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.debug-controls')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = element.offsetLeft;
            startTop = element.offsetTop;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'default';
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    injectStyles() {
        if (document.getElementById('debug-styles')) return;

        const style = document.createElement('style');
        style.id = 'debug-styles';
        style.textContent = `
            #debug-panel {
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 500px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #3b82f6;
                border-radius: 8px;
                z-index: 999999;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
            }

            #debug-panel.debug-minimized .debug-content,
            #debug-panel.debug-minimized .debug-stats {
                display: none;
            }

            .debug-header {
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 6px 6px 0 0;
                cursor: grab;
                user-select: none;
            }

            .debug-title {
                color: white;
                font-weight: bold;
            }

            .debug-controls {
                display: flex;
                gap: 5px;
            }

            .debug-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                transition: background 0.2s;
            }

            .debug-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .debug-stats {
                display: flex;
                justify-content: space-around;
                padding: 6px;
                background: rgba(255, 255, 255, 0.05);
                color: #aaa;
                font-size: 10px;
                border-bottom: 1px solid #333;
            }

            .debug-content {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
                background: #000;
            }

            .debug-log {
                display: flex;
                gap: 6px;
                padding: 3px 0;
                border-bottom: 1px solid #222;
                align-items: flex-start;
            }

            .debug-time {
                color: #666;
                font-size: 10px;
                min-width: 60px;
            }

            .debug-prefix {
                font-size: 12px;
            }

            .debug-message {
                flex: 1;
                color: #ccc;
            }

            .debug-data {
                color: #888;
                font-size: 10px;
                font-style: italic;
            }

            .debug-log-error .debug-message {
                color: #ef4444;
                font-weight: bold;
            }

            .debug-log-warn .debug-message {
                color: #f59e0b;
            }

            .debug-log-success .debug-message {
                color: #10b981;
            }

            .debug-log-info .debug-message {
                color: #3b82f6;
            }

            .debug-log-ai .debug-message {
                color: #ec4899;
            }

            .debug-log-window .debug-message {
                color: #8b5cf6;
            }

            .debug-log-perf .debug-message {
                color: #f97316;
            }

            #debug-panel::-webkit-scrollbar {
                width: 6px;
            }

            #debug-panel::-webkit-scrollbar-track {
                background: #111;
            }

            #debug-panel::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }

            .debug-content::-webkit-scrollbar {
                width: 6px;
            }

            .debug-content::-webkit-scrollbar-track {
                background: #111;
            }

            .debug-content::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }
        `;

        document.head.appendChild(style);
    }

    // Helper methods for common logging
    logWindow(action, windowId, data) {
        this.log(`Window ${action}: ${windowId}`, 'window', data);
    }

    logAI(message, data) {
        this.log(message, 'ai', data);
    }

    logAPI(message, data) {
        this.log(message, 'api', data);
    }

    logPerf(message, duration) {
        this.log(`${message} (${duration}ms)`, 'perf');
    }

    logError(message, error) {
        this.log(message, 'error', error ? error.toString() : null);
    }
}

// Create global instance
window.GeminiOSDebug = new GeminiOSDebug();

// Make methods accessible globally
window.GeminiOSDebug.enable = window.GeminiOSDebug.enable.bind(window.GeminiOSDebug);
window.GeminiOSDebug.disable = window.GeminiOSDebug.disable.bind(window.GeminiOSDebug);
window.GeminiOSDebug.clearLogs = window.GeminiOSDebug.clearLogs.bind(window.GeminiOSDebug);
window.GeminiOSDebug.exportLogs = window.GeminiOSDebug.exportLogs.bind(window.GeminiOSDebug);
window.GeminiOSDebug.togglePanel = window.GeminiOSDebug.togglePanel.bind(window.GeminiOSDebug);

// Log initialization
window.GeminiOSDebug.log('Debug module loaded', 'success');

console.log('%c🐛 GeminiOS Debug Module Loaded', 'color: #10b981; font-size: 14px');
console.log('%cUse GeminiOSDebug.enable() to start debugging', 'color: #666');
console.log('%cOr add ?debug=true to URL', 'color: #666');
console.log('%cKeyboard shortcut: Ctrl+Shift+D', 'color: #666');
