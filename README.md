<div align="center">

<img width="200" height="200" alt="ClaudeOS Logo" src="https://via.placeholder.com/200/D97D54/FFFFFF?text=C" />

  <h1>🛡️ ClaudeOS - Constitutional AI Operating System</h1>

  <p><strong>Helpful • Harmless • Honest</strong></p>

  <p>Lite webový OS postavený na principech Anthropic Constitutional AI</p>

  <p>
    <img src="https://img.shields.io/badge/AI-Constitutional-D97D54?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Claude-Powered-E76F51?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Safety-First-F4A261?style=for-the-badge" />
  </p>

</div>

---

## 🛡️ Co je ClaudeOS?

**ClaudeOS** je experimentální lite operační systém běžící v prohlížeči, postavený na principech **Constitutional AI** od Anthropic. Na rozdíl od jiných AI OS, ClaudeOS klade důraz na **bezpečnost, etiku a transparentnost**.

### 🌟 Klíčové principy

ClaudeOS je postaven na čtyřech pilířích Constitutional AI:

| Princip | Popis |
|---------|-------|
| 🛡️ **Safety First** | Bezpečnost a ochrana dat na prvním místě |
| 🤝 **Helpful** | AI jako užitečný asistent, ne hrozba |
| ❤️ **Harmless** | Etické chování a respekt k uživateli |
| 💎 **Honest** | Transparentnost a pravdivost odpovědí |

---

## ✨ Unikátní funkce

### 🧠 **Thinking Space**
Vizualizace toho, jak AI přemýšlí - vidíte proces myšlení v reálném čase

### ✅ **Ethical Check**
Kontrola etičnosti obsahu před vygenerováním

### 🎨 **AI Creator**
Bezpečné vytváření aplikací s Constitutional AI filtrem

### 💻 **Safe Terminal**
Konverzační terminál s etickými guardrails

### 📜 **Constitution Viewer**
Zobrazení a správa AI principů

---

## 🚀 Jak začít

### 1. Otevřete `index.html`

```bash
open index.html
# nebo jednoduše přetáhněte do prohlížeče
```

### 2. Zadejte API klíč

ClaudeOS **doporučuje Claude** (Anthropic), ale podporuje i další:

- **🎖️ Claude (Doporučeno)** → [console.anthropic.com](https://console.anthropic.com/)
- Gemini → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- OpenAI → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. Užijte si Constitutional AI!

Po spuštění můžete:
- ✨ Generovat etické a bezpečné aplikace
- 🧠 Vidět AI myšlení v reálném čase
- ✅ Kontrolovat etičnost obsahu
- 💬 Chatovat s AI asist

entem

---

## 🎨 Design

ClaudeOS používá **Anthropic Design System**:

```css
Primární:  #D97D54 (Anthropic Orange)
Tmavá:     #191919, #2A2A2A
Accent:    #E76F51, #F4A261
```

- 🌑 Tmavý minimalistický design
- 🍊 Oranžové akcenty všude
- ✨ Glassmorphism efekty
- 🎭 Thinking mode visualization

---

## 🏗️ Architektura

```
ClaudeOS/
├── index.html              # Hlavní HTML s Constitutional UI
├── style.css               # Anthropic Design System
├── os.js                   # Hlavní řídící logika
├── window-manager.js       # Správa oken
├── ai-engine.js            # AI API (s Constitutional filtrem)
├── apps.js                 # ClaudeOS aplikace
├── config.js               # Konfigurace
│
├── debug.js                # Debug modul
├── test.html               # Test suite
├── api-tester.html         # API tester
│
└── README.md               # Tato dokumentace
```

---

## 🔧 Technické detaily

### Constitutional AI Engine

```javascript
// Všechny AI požadavky procházejí Constitutional filtrem
const response = await aiEngine.generateAppCode(prompt);
// ✅ Bezpečný, etický, transparentní
```

### Window Manager
- Drag & drop oken
- Minimize/Maximize/Close
- Oranžové Anthropic titlebary
- Focus management

### Thinking Mode
```javascript
// Viditelné myšlení AI
showThinking("Claude analyzuje požadavek...");
```

---

## 🧪 Testování

### Test Suite
```bash
open test.html
```

Automatické testy všech core funkcí.

### API Tester
```bash
open api-tester.html
```

Otestujte API klíče před použitím.

### Debug Mode
```
index.html?debug=true
```
nebo `Ctrl+Shift+D`

---

## 📊 Srovnání s GeminiOS

| Feature | GeminiOS | **ClaudeOS** |
|---------|----------|--------------|
| Zaměření | Generování | **Constitutional AI** |
| Design | Modrý/Fialový | **Anthropic Orange** |
| Priorita | Rychlost | **Bezpečnost & Etika** |
| Thinking Mode | ❌ | **✅ Vizualizace** |
| Ethical Check | ❌ | **✅ Zabudováno** |
| Constitution | ❌ | **✅ 4 principy** |

---

## 🚫 Co ClaudeOS NENÍ

- ❌ **Není Skynet** - AI je nástroj, ne hrozba
- ❌ **Není copy GeminiOS** - originální projekt s vlastními principy
- ❌ **Není nezodpovědný** - každá AI odpověď je filtrovaná
- ❌ **Není špión** - API klíče pouze v localStorage

---

## 🎯 Použití

### Pro vývojáře
```javascript
// Přidání vlastní aplikace s Constitutional principy
apps.installedApps.set('my-app', {
    name: 'Moje Etická App',
    icon: '✨',
    launch: () => { ... }
});
```

### Pro uživatele
1. Otevřete ClaudeOS
2. Zadejte co chcete vytvořit
3. AI vygeneruje bezpečně a eticky
4. Užívejte si!

---

## 📝 Dokumentace

- **README.md** - Tento soubor
- **DEMO.md** - Quick start guide
- **FEATURES.md** - Kompletní seznam funkcí
- **DEVELOPER.md** - Vývojářská dokumentace

---

## 🔐 Bezpečnost

### API Klíče
✅ Uloženy pouze v localStorage
✅ Nikdy neodesílány na server
✅ Šifrované v paměti prohlížeče

### Constitutional AI
✅ Filtrování škodlivého obsahu
✅ Etické guardrails
✅ Transparentní AI myšlení

---

## 💡 Proč ClaudeOS?

1. **Constitutional AI** - Jediný OS s vestavěnými etickými principy
2. **Thinking Mode** - Vidíte jak AI myslí
3. **Safety First** - Bezpečnost není kompromis
4. **Anthropic Design** - Krásný, profesionální vzhled
5. **Open Source** - Můžete vidět a upravit vše

---

## 🌐 Browser Support

- ✅ Chrome/Edge (Doporučeno)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile (částečná podpora)

---

## 📈 Statistiky

- **Velikost:** ~130 KB (nekomprimované)
- **Řádky kódu:** ~3000+
- **Principy AI:** 4 (Helpful, Harmless, Honest, Safety)
- **Aplikace:** 6 výchozích + neomezené AI generované
- **Tests:** 15+

---

## 🎉 Fun Facts

- Každá AI odpověď prochází Constitutional filtrem
- "Thinking mode" ukazuje skutečný proces myšlení
- Anthropic oranžová je všude (i ve scrollbaru!)
- Kód je 100% open source a auditovatelný
- Žádný "Skynet" - AI je pomocník, ne vládce

---

## 🙏 Credits

- **Inspirace:** Anthropic Constitutional AI principy
- **Design:** Anthropic Design System (#D97D54)
- **Vytvořeno s:** Claude (samozřejmě!)
- **Pro:** Lidi, kteří věří v etickou AI

---

## 📜 License

MIT License - použijte jak chcete, ale zachovejte Constitutional AI principy!

---

<div align="center">

**🛡️ ClaudeOS - Where AI Meets Ethics 🛡️**

**Helpful • Harmless • Honest**

*No Skynet. Just Constitutional AI.*

---

Made with ❤️ and Constitutional AI

</div>
