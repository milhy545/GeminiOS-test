// Window Manager - handles window creation, dragging, resizing, minimizing, etc.

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.windowCounter = 0;
        this.zIndexCounter = 100;
        this.container = document.getElementById('windows-container');
        this.taskbarApps = document.getElementById('taskbar-apps');
    }

    createWindow(options) {
        const windowId = `window-${this.windowCounter++}`;

        // Default options
        const defaults = {
            title: 'Nové okno',
            icon: '📄',
            width: 600,
            height: 400,
            x: 100 + (this.windowCounter * 30),
            y: 50 + (this.windowCounter * 30),
            content: '',
            resizable: true,
            closable: true,
            minimizable: true,
            maximizable: true
        };

        const config = { ...defaults, ...options };

        // Create window element
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = windowId;
        windowEl.style.width = `${config.width}px`;
        windowEl.style.height = `${config.height}px`;
        windowEl.style.left = `${config.x}px`;
        windowEl.style.top = `${config.y}px`;
        windowEl.style.zIndex = this.zIndexCounter++;

        // Create titlebar
        const titlebar = document.createElement('div');
        titlebar.className = 'window-titlebar';
        titlebar.innerHTML = `
            <div class="window-title">
                <span class="window-icon">${config.icon}</span>
                <span>${config.title}</span>
            </div>
            <div class="window-controls">
                ${config.minimizable ? '<div class="window-control minimize"></div>' : ''}
                ${config.maximizable ? '<div class="window-control maximize"></div>' : ''}
                ${config.closable ? '<div class="window-control close"></div>' : ''}
            </div>
        `;

        // Create content area
        const content = document.createElement('div');
        content.className = 'window-content';
        if (typeof config.content === 'string') {
            content.innerHTML = config.content;
        } else if (config.content instanceof HTMLElement) {
            content.appendChild(config.content);
        }

        windowEl.appendChild(titlebar);
        windowEl.appendChild(content);
        this.container.appendChild(windowEl);

        // Store window data
        this.windows.set(windowId, {
            element: windowEl,
            config: config,
            minimized: false,
            maximized: false,
            lastPosition: null,
            lastSize: null
        });

        // Setup event listeners
        this.setupWindowEvents(windowId, titlebar);
        this.addToTaskbar(windowId, config);
        this.focusWindow(windowId);

        return windowId;
    }

    setupWindowEvents(windowId, titlebar) {
        const window = this.windows.get(windowId);
        const windowEl = window.element;

        // Focus on click
        windowEl.addEventListener('mousedown', () => {
            this.focusWindow(windowId);
        });

        // Dragging
        let isDragging = false;
        let dragStartX, dragStartY, windowStartX, windowStartY;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            if (window.maximized) return;

            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;

            const rect = windowEl.getBoundingClientRect();
            windowStartX = rect.left;
            windowStartY = rect.top;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;

            windowEl.style.left = `${windowStartX + deltaX}px`;
            windowEl.style.top = `${windowStartY + deltaY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Window controls
        const closeBtn = titlebar.querySelector('.window-control.close');
        const minimizeBtn = titlebar.querySelector('.window-control.minimize');
        const maximizeBtn = titlebar.querySelector('.window-control.maximize');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeWindow(windowId));
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowId));
        }

        // Double click to maximize
        titlebar.addEventListener('dblclick', (e) => {
            if (!e.target.classList.contains('window-control')) {
                this.toggleMaximize(windowId);
            }
        });
    }

    focusWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        // Remove focus from other windows
        this.windows.forEach((win, id) => {
            win.element.style.zIndex = parseInt(win.element.style.zIndex) < this.zIndexCounter
                ? win.element.style.zIndex
                : this.zIndexCounter - 1;
        });

        // Focus this window
        window.element.style.zIndex = this.zIndexCounter++;
        this.activeWindow = windowId;

        // Update taskbar
        this.updateTaskbar();
    }

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        // Remove from DOM
        window.element.remove();

        // Remove from taskbar
        const taskbarBtn = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarBtn) taskbarBtn.remove();

        // Remove from windows map
        this.windows.delete(windowId);

        // Focus another window if this was active
        if (this.activeWindow === windowId) {
            const remaining = Array.from(this.windows.keys());
            if (remaining.length > 0) {
                this.focusWindow(remaining[remaining.length - 1]);
            } else {
                this.activeWindow = null;
            }
        }
    }

    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        window.minimized = !window.minimized;
        window.element.style.display = window.minimized ? 'none' : 'flex';

        this.updateTaskbar();
    }

    toggleMaximize(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        const windowEl = window.element;

        if (window.maximized) {
            // Restore
            windowEl.classList.remove('maximized');
            if (window.lastPosition) {
                windowEl.style.left = window.lastPosition.x + 'px';
                windowEl.style.top = window.lastPosition.y + 'px';
                windowEl.style.width = window.lastSize.width + 'px';
                windowEl.style.height = window.lastSize.height + 'px';
            }
            window.maximized = false;
        } else {
            // Maximize
            window.lastPosition = {
                x: parseInt(windowEl.style.left),
                y: parseInt(windowEl.style.top)
            };
            window.lastSize = {
                width: parseInt(windowEl.style.width),
                height: parseInt(windowEl.style.height)
            };
            windowEl.classList.add('maximized');
            window.maximized = true;
        }
    }

    addToTaskbar(windowId, config) {
        const taskbarBtn = document.createElement('div');
        taskbarBtn.className = 'taskbar-app';
        taskbarBtn.setAttribute('data-window-id', windowId);
        taskbarBtn.innerHTML = `
            <span>${config.icon}</span>
            <span class="taskbar-app-title">${config.title}</span>
        `;

        taskbarBtn.addEventListener('click', () => {
            const window = this.windows.get(windowId);
            if (!window) return;

            if (window.minimized) {
                this.minimizeWindow(windowId);
            } else if (this.activeWindow === windowId) {
                this.minimizeWindow(windowId);
            } else {
                this.focusWindow(windowId);
            }
        });

        this.taskbarApps.appendChild(taskbarBtn);
    }

    updateTaskbar() {
        this.taskbarApps.querySelectorAll('.taskbar-app').forEach(btn => {
            const windowId = btn.getAttribute('data-window-id');
            btn.classList.toggle('active', this.activeWindow === windowId);
        });
    }

    updateWindowContent(windowId, content) {
        const window = this.windows.get(windowId);
        if (!window) return;

        const contentEl = window.element.querySelector('.window-content');
        if (typeof content === 'string') {
            contentEl.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            contentEl.innerHTML = '';
            contentEl.appendChild(content);
        }
    }

    getWindow(windowId) {
        return this.windows.get(windowId);
    }

    getAllWindows() {
        return Array.from(this.windows.entries());
    }
}

// Global instance
window.windowManager = new WindowManager();
