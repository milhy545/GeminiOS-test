# 🛠️ ClaudeOS - Developer Documentation

Komplexní vývojářská dokumentace pro práci s ClaudeOS kódem.

---

## 📚 Obsah

1. [Architektura](#architektura)
2. [API Reference](#api-reference)
3. [Přidání nové aplikace](#přidání-nové-aplikace)
4. [Rozšíření AI funkcí](#rozšíření-ai-funkcí)
5. [Debug a testování](#debug-a-testování)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architektura

### Struktura souborů

```
ClaudeOS-test/
│
├── index.html              # Hlavní HTML struktura
├── style.css               # Veškerý styling
│
├── debug.js                # Debug modul (volitelný)
├── config.js               # Správa konfigurace a localStorage
├── ai-engine.js            # AI API integrace
├── window-manager.js       # Správa oken
├── apps.js                 # Aplikace a generování
├── os.js                   # Hlavní řídící logika
│
├── test.html               # Testovací suite
├── README.md               # Uživatelská dokumentace
├── DEMO.md                 # Quick start guide
├── FEATURES.md             # Seznam funkcí
└── DEVELOPER.md            # Tato dokumentace
```

### Životní cyklus OS

```
1. DOM loaded
   ↓
2. Debug module init (debug.js)
   ↓
3. Config init (config.js)
   ↓
4. WindowManager init (window-manager.js)
   ↓
5. Apps init (apps.js)
   ↓
6. OS init (os.js)
   ↓
7. Check API key
   ├─ Yes → Start desktop
   └─ No → Show welcome screen
   ↓
8. Desktop ready
```

### Modulární architektura

```
┌─────────────────────────────────────────┐
│              os.js (Main)                │
│         ClaudeOS Controller              │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┬──────────┐
    │        │        │          │
    ▼        ▼        ▼          ▼
┌───────┐ ┌────┐ ┌────────┐ ┌────────┐
│Window │ │Apps│ │AI      │ │Config  │
│Manager│ │    │ │Engine  │ │        │
└───────┘ └────┘ └────────┘ └────────┘
```

---

## 📖 API Reference

### Config (config.js)

#### Class: `Config`

Správa konfigurace a localStorage.

**Constructor:**
```javascript
const config = new Config();
```

**Methods:**

```javascript
// Get/Set hodnot
config.get(key)                    // Získat hodnotu
config.set(key, value)             // Nastavit hodnotu

// API klíče
config.getApiKey(provider)         // Získat API klíč pro providera
config.setApiKey(provider, key)    // Nastavit API klíč
config.getCurrentProvider()        // Aktuální AI provider
config.setCurrentProvider(provider)// Nastavit AI providera
config.getCurrentApiKey()          // Aktuální API klíč

// Aplikace
config.addGeneratedApp(appData)    // Přidat vygenerovanou aplikaci
config.getGeneratedApps()          // Získat všechny aplikace
```

**Storage Structure:**
```javascript
{
  aiProvider: 'gemini',           // 'gemini' | 'claude' | 'openai'
  apiKeys: {
    gemini: '',
    claude: '',
    openai: ''
  },
  wallpaper: 'gradient',          // 'gradient' | 'dark' | 'light'
  theme: 'default',
  generatedApps: [
    {
      id: 'ai-app-123456',
      name: 'App Name',
      prompt: 'Original prompt',
      code: '<html>...</html>',
      created: '2024-01-01T00:00:00.000Z'
    }
  ]
}
```

---

### WindowManager (window-manager.js)

#### Class: `WindowManager`

Správa oken - vytváření, focus, minimize, maximize, zavírání.

**Constructor:**
```javascript
const wm = new WindowManager();
```

**Methods:**

```javascript
// Vytvoření okna
wm.createWindow(options)
// Options:
{
  title: 'Window Title',       // Titulek okna
  icon: '📄',                   // Emoji ikona
  width: 600,                   // Šířka v px
  height: 400,                  // Výška v px
  x: 100,                       // X pozice
  y: 50,                        // Y pozice
  content: '<div>...</div>',    // HTML string nebo HTMLElement
  resizable: true,              // Povolit resize
  closable: true,               // Povolit zavření
  minimizable: true,            // Povolit minimalizaci
  maximizable: true             // Povolit maximalizaci
}
// Returns: windowId (string)

// Správa oken
wm.focusWindow(windowId)          // Aktivovat okno
wm.closeWindow(windowId)          // Zavřít okno
wm.minimizeWindow(windowId)       // Minimalizovat/obnovit
wm.toggleMaximize(windowId)       // Maximalizovat/obnovit

// Získání informací
wm.getWindow(windowId)            // Získat data okna
wm.getAllWindows()                // Pole všech oken

// Aktualizace obsahu
wm.updateWindowContent(windowId, content)
```

**Window Object:**
```javascript
{
  element: HTMLElement,          // DOM element okna
  config: { ... },              // Konfigurace okna
  minimized: false,             // Je minimalizováno?
  maximized: false,             // Je maximalizováno?
  lastPosition: { x, y },       // Poslední pozice
  lastSize: { width, height }   // Poslední velikost
}
```

**Events:**
- Click na okno → `focusWindow()`
- Drag titlebar → Přesun okna
- Double-click titlebar → `toggleMaximize()`
- Click na close button → `closeWindow()`
- Click na minimize button → `minimizeWindow()`
- Click na maximize button → `toggleMaximize()`

---

### AIEngine (ai-engine.js)

#### Class: `AIEngine`

Integrace s AI API (Gemini, Claude, OpenAI).

**Constructor:**
```javascript
const ai = new AIEngine();
```

**Methods:**

```javascript
// Nastavení providera
ai.setProvider(provider, apiKey)

// Generování aplikací
await ai.generateAppCode(prompt)
// Returns: HTML string

// Chat
await ai.chat(message, conversationHistory)
// Returns: AI response string

// Low-level API calls
await ai.callGemini(prompt)
await ai.callClaude(prompt)
await ai.callOpenAI(prompt)

// HTML utilities
ai.extractHTML(response)        // Extrahovat HTML z odpovědi
```

**System Prompt pro generování aplikací:**

AI engine posílá následující systémový prompt:

```
Jsi AI asistent, který generuje HTML/CSS/JavaScript kód pro mini aplikace v lite OS.

DŮLEŽITÉ PRAVIDLA:
1. Vrať POUZE čistý HTML kód
2. Vše musí být v jednom HTML bloku (inline CSS a JS)
3. Kód musí být funkční a kompletní
4. Nepoužívej externí knihovny (pouze vanilla JS)
5. Design musí být moderní a responzivní
6. Nepřidávej žádný markdown nebo komentáře mimo HTML
```

---

### Apps (apps.js)

#### Class: `Apps`

Správa aplikací a AI generování.

**Constructor:**
```javascript
const apps = new Apps();
```

**Methods:**

```javascript
// Registrace aplikace
apps.installedApps.set('app-id', {
  name: 'App Name',
  icon: '📱',
  launch: () => { ... }
})

// Spuštění aplikace
apps.launchApp(appId)

// AI generování
await apps.generateAndLaunchApp(prompt, statusDiv)

// Výchozí aplikace
apps.launchAILauncher()
apps.launchSettings()
apps.launchTerminal()
apps.launchBrowser()

// Utility
apps.updateGeneratedAppsList()
apps.launchGeneratedApp(appId)
```

---

### ClaudeOS (os.js)

#### Class: `ClaudeOS`

Hlavní řídící třída OS.

**Constructor:**
```javascript
const os = new ClaudeOS();
```

**Methods:**

```javascript
// Lifecycle
os.init()                        // Inicializace
os.checkApiKey()                 // Zkontrolovat API klíč
os.showWelcomeScreen()           // Zobrazit welcome screen
os.startOS()                     // Spustit OS
os.initializeDesktop()           // Inicializovat desktop

// Event handlers
os.setupEventListeners()         // Setup všech event listenerů
os.startClock()                  // Spustit hodiny
os.updateAIStatus()              // Aktualizovat AI status
```

---

### Debug (debug.js)

#### Class: `ClaudeOSDebug`

Debug modul pro vývojáře.

**Methods:**

```javascript
// Ovládání
ClaudeOSDebug.enable()           // Zapnout debug mód
ClaudeOSDebug.disable()          // Vypnout debug mód

// Logging
ClaudeOSDebug.log(message, type, data)
ClaudeOSDebug.logWindow(action, windowId, data)
ClaudeOSDebug.logAI(message, data)
ClaudeOSDebug.logAPI(message, data)
ClaudeOSDebug.logPerf(message, duration)
ClaudeOSDebug.logError(message, error)

// Utility
ClaudeOSDebug.clearLogs()        // Vymazat logy
ClaudeOSDebug.exportLogs()       // Exportovat logy
ClaudeOSDebug.togglePanel()      // Skrýt/zobrazit panel
```

**Aktivace:**
- URL: `index.html?debug=true`
- Console: `ClaudeOSDebug.enable()`
- Keyboard: `Ctrl+Shift+D`

---

## 🎨 Přidání nové aplikace

### Jednoduchá aplikace

```javascript
// V apps.js, v konstruktoru Apps třídy

this.installedApps.set('my-app', {
    name: 'Moje Aplikace',
    icon: '🎯',
    launch: () => this.launchMyApp()
});
```

```javascript
// Metoda pro spuštění

launchMyApp() {
    const content = `
        <div style="padding: 20px;">
            <h2>Moje Aplikace</h2>
            <p>Tady je můj obsah!</p>
            <button onclick="alert('Hello!')">Klikni</button>
        </div>
    `;

    window.windowManager.createWindow({
        title: 'Moje Aplikace',
        icon: '🎯',
        width: 500,
        height: 300,
        content: content
    });
}
```

### Interaktivní aplikace s event listenery

```javascript
launchInteractiveApp() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>Interaktivní App</h2>
            <input type="text" id="my-input" placeholder="Zadej text">
            <button id="my-button">Submit</button>
            <div id="output"></div>
        </div>
    `;

    const windowId = window.windowManager.createWindow({
        title: 'Interactive App',
        icon: '⚡',
        width: 600,
        height: 400,
        content: content
    });

    // Setup event listeners PO vytvoření okna
    setTimeout(() => {
        const button = document.getElementById('my-button');
        const input = document.getElementById('my-input');
        const output = document.getElementById('output');

        button.addEventListener('click', () => {
            output.textContent = `Zadáno: ${input.value}`;
        });
    }, 100);
}
```

### Aplikace s localStorage

```javascript
launchNotesApp() {
    const STORAGE_KEY = 'myapp_notes';

    // Load notes
    let notes = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) notes = JSON.parse(stored);
    } catch (e) {
        console.error('Error loading notes:', e);
    }

    const content = document.createElement('div');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2>📝 Poznámky</h2>
            <textarea id="note-input" rows="5" style="width: 100%;"></textarea>
            <button id="save-note">Uložit</button>
            <div id="notes-list"></div>
        </div>
    `;

    window.windowManager.createWindow({
        title: 'Poznámky',
        icon: '📝',
        width: 600,
        height: 500,
        content: content
    });

    setTimeout(() => {
        const input = document.getElementById('note-input');
        const saveBtn = document.getElementById('save-note');
        const list = document.getElementById('notes-list');

        // Display notes
        const displayNotes = () => {
            list.innerHTML = notes.map((note, i) => `
                <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
                    ${note}
                    <button onclick="deleteNote(${i})">Smazat</button>
                </div>
            `).join('');
        };

        // Save note
        saveBtn.addEventListener('click', () => {
            const note = input.value.trim();
            if (note) {
                notes.push(note);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
                input.value = '';
                displayNotes();
            }
        });

        // Delete note (global function)
        window.deleteNote = (index) => {
            notes.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            displayNotes();
        };

        displayNotes();
    }, 100);
}
```

---

## 🤖 Rozšíření AI funkcí

### Vlastní AI provider

```javascript
// V ai-engine.js, přidat novou metodu

async callMyAI(prompt) {
    const url = 'https://my-ai-api.com/generate';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
            prompt: prompt,
            model: 'my-model'
        })
    });

    if (!response.ok) {
        throw new Error('My AI API error');
    }

    const data = await response.json();
    return data.result;
}
```

### Upravit systémový prompt

```javascript
// V ai-engine.js, metoda generateAppCode()

async generateAppCode(prompt) {
    const systemPrompt = `
        Tvůj vlastní systémový prompt zde.
        Můžeš přidat vlastní pravidla.

        Uživatel požaduje: ${prompt}
    `;

    // ... zbytek kódu
}
```

---

## 🧪 Debug a testování

### Zapnutí debug módu

**URL parametr:**
```
index.html?debug=true
```

**Console:**
```javascript
ClaudeOSDebug.enable()
```

**Keyboard:**
```
Ctrl + Shift + D
```

### Debug logging

```javascript
// V jakémkoliv souboru

ClaudeOSDebug.log('Základní log', 'log');
ClaudeOSDebug.log('Info zpráva', 'info');
ClaudeOSDebug.log('Varování', 'warn');
ClaudeOSDebug.logError('Chyba', error);
ClaudeOSDebug.logWindow('created', windowId);
ClaudeOSDebug.logAI('AI response', data);
ClaudeOSDebug.logPerf('Operation', duration);
```

### Testování

**Otevřít test suite:**
```
test.html
```

**Run all tests:**
```javascript
// V test.html console
runAllTests()
```

**Export test results:**
```javascript
exportResults()
```

---

## ✅ Best Practices

### 1. Window Management

```javascript
// ✅ DOBŘE - Použij setTimeout pro event listenery
const windowId = windowManager.createWindow({ ... });

setTimeout(() => {
    document.getElementById('my-button').addEventListener('click', ...);
}, 100);

// ❌ ŠPATNĚ - Okamžitě nepůjde najít element
const windowId = windowManager.createWindow({ ... });
document.getElementById('my-button').addEventListener('click', ...);
```

### 2. Error Handling

```javascript
// ✅ DOBŘE - Vždy wrap AI calls v try-catch
try {
    const result = await aiEngine.generateAppCode(prompt);
    // Success handling
} catch (error) {
    console.error('AI Error:', error);
    ClaudeOSDebug.logError('AI generation failed', error);
    // User-friendly error message
    alert(`Chyba: ${error.message}`);
}
```

### 3. LocalStorage

```javascript
// ✅ DOBŘE - Wrap v try-catch
try {
    const data = JSON.parse(localStorage.getItem('key'));
} catch (e) {
    console.error('Parse error:', e);
    // Fallback
}

// ✅ DOBŘE - Kontrola existence
const data = localStorage.getItem('key');
if (data) {
    const parsed = JSON.parse(data);
}
```

### 4. Memory Management

```javascript
// ✅ DOBŘE - Cleanup při zavření okna
wm.closeWindow(windowId);  // WindowManager už to dělá

// ✅ DOBŘE - Odstranění event listenerů
const handler = () => { ... };
element.addEventListener('click', handler);
// Později:
element.removeEventListener('click', handler);
```

### 5. Performance

```javascript
// ✅ DOBŘE - Debounce pro časté události
let timeout;
input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // Zpracování
    }, 300);
});

// ✅ DOBŘE - Batch DOM updates
const fragment = document.createDocumentFragment();
items.forEach(item => {
    const el = document.createElement('div');
    el.textContent = item;
    fragment.appendChild(el);
});
container.appendChild(fragment);
```

---

## 🐛 Troubleshooting

### API klíč nefunguje

**Příznaky:** "API error" při generování

**Řešení:**
1. Zkontroluj platnost API klíče
2. Zkontroluj, že klíč je pro správného providera
3. Zkontroluj CORS (některé API vyžadují server)
4. Zkontroluj rate limity

### Okno se nevytváří

**Příznaky:** `createWindow()` vrací ID, ale nic se nezobrazí

**Řešení:**
```javascript
// Zkontroluj, že containers existují
const container = document.getElementById('windows-container');
const taskbar = document.getElementById('taskbar-apps');

if (!container || !taskbar) {
    console.error('Containers not found!');
}
```

### Event listenery nefungují

**Příznaky:** Click na tlačítko nedělá nic

**Řešení:**
```javascript
// Použij setTimeout
setTimeout(() => {
    const btn = document.getElementById('my-btn');
    if (btn) {
        btn.addEventListener('click', handler);
    } else {
        console.error('Button not found!');
    }
}, 100);
```

### LocalStorage je plný

**Příznaky:** Chyba při ukládání

**Řešení:**
```javascript
// Vymazat staré data
config.set('generatedApps', []);

// Nebo úplně vyčistit
localStorage.clear();
```

### AI generuje špatný kód

**Příznaky:** Aplikace nefunguje nebo vypadá špatně

**Řešení:**
1. Zkus jiný prompt (více konkrétní)
2. Zkus jiného AI providera
3. Zkontroluj `extractHTML()` metodu
4. Přidej více pravidel do systémového promptu

---

## 📊 Performance Monitoring

### Měření výkonu

```javascript
// Start timer
const start = performance.now();

// Operace
await someOperation();

// End timer
const end = performance.now();
const duration = end - start;

ClaudeOSDebug.logPerf('Operation completed', Math.round(duration));
```

### Memory monitoring

```javascript
if (performance.memory) {
    const used = performance.memory.usedJSHeapSize;
    const total = performance.memory.totalJSHeapSize;

    console.log(`Memory: ${(used / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB`);
}
```

---

## 🔐 Security Best Practices

### 1. API Klíče
- ✅ Ukládej pouze v localStorage (ne v kódu)
- ✅ Nikdy je neposílej na server
- ✅ Varuj uživatele před sdílením

### 2. User Input
```javascript
// ✅ DOBŘE - Escapuj HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ❌ ŠPATNĚ - Přímo vkládat input
element.innerHTML = userInput;  // XSS!

// ✅ DOBŘE
element.textContent = userInput;
```

### 3. eval() a innerHTML
```javascript
// ❌ NIKDY nepoužívej eval() na user input
eval(userCode);  // Velmi nebezpečné!

// ✅ Pro AI generovaný kód je innerHTML OK
// protože pochází z trusted AI API
windowContent.innerHTML = aiGeneratedHTML;
```

---

## 📝 Changelog

### Jak přidat features

1. Přidej kód do příslušného souboru
2. Aktualizuj FEATURES.md
3. Přidej test do test.html
4. Aktualizuj DEVELOPER.md (tuto dokumentaci)
5. Commitni změny s popisem

---

## 🤝 Contributing

Pokud chceš přispět:

1. Fork repo
2. Vytvoř feature branch
3. Přidej testy
4. Aktualizuj dokumentaci
5. Vytvoř pull request

---

## 📞 Support

- **Issues:** GitHub Issues
- **Dokumentace:** README.md, DEMO.md, FEATURES.md
- **Tests:** test.html
- **Debug:** debug.js + `?debug=true`

---

**Happy coding! 🚀**
