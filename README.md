<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>🤖 GeminiOS - AI-Generated Lite Operating System</h1>

  <p>Lite webový operační systém, kde AI generuje vše - aplikace, UI, obsah!</p>

  <p><strong>Inspirováno projektem Gemini AI Studio</strong></p>

</div>

---

## 🚀 Co je GeminiOS?

GeminiOS je experimentální lite operační systém běžící v prohlížeči, který využívá sílu AI k generování aplikací a obsahu v reálném čase. Stačí zadat API klíč a AI vytvoří vše ostatní podle vašich požadavků!

### ✨ Klíčové vlastnosti

- **🎨 AI-Generované Aplikace** - Řekněte AI, co chcete, a ona vytvoří funkční aplikaci
- **🧠 Podpora více AI Providerů** - Gemini, Claude, OpenAI
- **🪟 Plnohodnotný Window Manager** - Přesouvání, změna velikosti, minimalizace oken
- **💻 AI Terminal** - Konverzační terminál s AI asistentem
- **🌐 AI Browser** - Prohlížeč, který generuje obsah pomocí AI
- **⚙️ Nastavení** - Přizpůsobte si vzhled a AI providera

---

## 📦 Struktura projektu

```
GeminiOS-test/
├── index.html          # Hlavní HTML struktura OS
├── style.css           # Kompletní styling OS
├── os.js              # Hlavní řídící logika OS
├── window-manager.js  # Správa oken (drag, resize, minimize)
├── ai-engine.js       # Integrace s AI API (Gemini, Claude, OpenAI)
├── apps.js            # Výchozí aplikace a AI generátor
├── config.js          # Konfigurace a localStorage správa
└── README.md          # Dokumentace
```

---

## 🎯 Jak používat

### 1. Otevřete `index.html` v prohlížeči

Stačí otevřít soubor `index.html` ve vašem oblíbeném prohlížeči (Chrome, Firefox, Edge, Safari).

### 2. Zadejte API klíč

Při prvním spuštění se zobrazí welcome screen, kde vyberete AI providera a zadáte API klíč:

**Získání API klíčů:**

- **Google Gemini** → [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **Anthropic Claude** → [https://console.anthropic.com/](https://console.anthropic.com/)
- **OpenAI** → [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**Poznámka:** API klíče jsou uloženy pouze ve vašem prohlížeči (localStorage) a nikam se neodesílají.

### 3. Užijte si AI-generovaný OS!

Po nastavení API klíče se OS spustí a můžete:

- Kliknout na **🚀 AI Launcher** a nechat AI vygenerovat aplikaci
- Otevřít **💻 AI Terminal** pro konverzaci s AI
- Používat **🌐 AI Browser** k generování webového obsahu
- Upravit nastavení v **⚙️ Nastavení**

---

## 🎮 Výchozí aplikace

### 🚀 AI Launcher
Hlavní aplikace pro generování nových AI aplikací. Zadejte popis toho, co chcete:

**Příklady:**
- "Kalkulačka s moderním designem"
- "To-do list s možností přidávat a mazat úkoly"
- "Odpočítávání času s možností nastavit čas"
- "Hra piškvorky pro dva hráče"
- "Poznámkový blok s barevným formátováním"
- "Generátor náhodných hesel"

### 💻 AI Terminal
Konverzační terminál, kde můžete chatovat s AI. AI si pamatuje kontext konverzace.

### 🌐 AI Browser
Zadejte URL nebo popište obsah, který chcete zobrazit, a AI ho vygeneruje jako HTML stránku.

### ⚙️ Nastavení
Změňte AI providera, API klíč, tapetu nebo smažte vygenerované aplikace.

---

## 💡 Jak funguje AI generování

1. **Uživatel zadá prompt** (např. "Vytvořit kalkulačku")
2. **AI Engine připraví systémový prompt** s pravidly pro generování HTML/CSS/JS
3. **Zavolá API vybraného AI providera** (Gemini/Claude/OpenAI)
4. **AI vygeneruje kompletní HTML kód** s inline CSS a JavaScriptem
5. **Kód se vloží do nového okna** a spustí se

Všechny aplikace jsou plně funkční a běží přímo v prohlížeči!

---

## 🔧 Technické detaily

### Window Manager
- **Drag & Drop** - Táhněte okna za záhlaví
- **Minimize** - Skrýt okno do taskbaru
- **Maximize** - Rozbalit na celou obrazovku
- **Close** - Zavřít okno
- **Focus management** - Kliknutím aktivujete okno

### AI Engine
Podporuje 3 poskytovatele:
- **Google Gemini 2.0 Flash** - Rychlý a efektivní
- **Claude Sonnet 4** - Kvalitní generování
- **GPT-4** - OpenAI model

### Bezpečnost
- API klíče jsou uloženy pouze v localStorage
- CORS friendly - všechna volání z browseru
- Žádné serverové komponenty

---

## 🎨 Customizace

### Změna tapety
V nastavení můžete změnit tapetu na:
- Gradient (výchozí)
- Tmavá
- Světlá

### Programová rozšíření
Můžete přidat vlastní aplikace v `apps.js`:

```javascript
this.installedApps.set('my-app', {
    name: 'Moje Aplikace',
    icon: '🎯',
    launch: () => {
        window.windowManager.createWindow({
            title: 'Moje Aplikace',
            icon: '🎯',
            width: 600,
            height: 400,
            content: '<h1>Hello World!</h1>'
        });
    }
});
```

---

## 🐛 Known Issues & Limitations

- **CORS** - Některé API mohou mít omezení CORS při volání z browseru
- **API limity** - Dodržujte rate limity vašeho AI providera
- **Generovaný kód** - Kvalita závisí na AI modelu a vašem promptu
- **Není skutečný OS** - Běží pouze v prohlížeči, nejedná se o reálný operační systém

---

## 🚀 Deployment

### Lokální spuštění
Otevřete `index.html` přímo v prohlížeči.

### Hosting
Nahrajte všechny soubory na jakýkoliv statický hosting:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

**Žádné server-side komponenty nejsou potřeba!**

---

## 📝 License

MIT License - použijte jak chcete!

---

## 🙏 Credits

- Inspirováno **Google AI Studio** a **Gemini projekty**
- Vytvořeno s pomocí **Claude Code**
- Powered by **Gemini, Claude, nebo OpenAI** (dle vašeho výběru)

---

## 🎉 Easter Egg

Zkuste zadat Konami kód: ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️ B A

---

<div align="center">

**Užijte si AI-generovaný operační systém! 🚀**

Made with ❤️ and AI

</div>
