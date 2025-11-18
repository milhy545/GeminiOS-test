// AI Engine - handles communication with AI APIs

class AIEngine {
    constructor() {
        this.provider = window.config.getCurrentProvider();
        this.apiKey = window.config.getCurrentApiKey();
    }

    setProvider(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        window.config.setCurrentProvider(provider);
        window.config.setApiKey(provider, apiKey);
    }

    async generateAppCode(prompt) {
        const systemPrompt = `Jsi AI asistent, který generuje HTML/CSS/JavaScript kód pro mini aplikace v lite OS.

DŮLEŽITÉ PRAVIDLA:
1. Vrať POUZE čistý HTML kód
2. Vše musí být v jednom HTML bloku (inline CSS a JS)
3. Kód musí být funkční a kompletní
4. Nepoužívej externí knihovny (pouze vanilla JS)
5. Design musí být moderní a responzivní
6. Nepřidávej žádný markdown nebo komentáře mimo HTML

FORMÁT ODPOVĚDI:
Vrať pouze kód v tomto formátu:
<div class="app-container" style="...">
  <!-- obsah aplikace -->
  <style>
    /* CSS styly */
  </style>
  <script>
    // JavaScript kód
  </script>
</div>

Uživatel požaduje: ${prompt}

Vygeneruj kompletní funkční mini aplikaci.`;

        try {
            let response;

            switch (this.provider) {
                case 'gemini':
                    response = await this.callGemini(systemPrompt);
                    break;
                case 'claude':
                    response = await this.callClaude(systemPrompt);
                    break;
                case 'openai':
                    response = await this.callOpenAI(systemPrompt);
                    break;
                default:
                    throw new Error('Neznámý AI provider');
            }

            return this.extractHTML(response);
        } catch (error) {
            console.error('AI Error:', error);
            throw error;
        }
    }

    async callGemini(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callClaude(prompt) {
        const url = 'https://api.anthropic.com/v1/messages';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async callOpenAI(prompt) {
        const url = 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.9,
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    extractHTML(response) {
        // Remove markdown code blocks if present
        let html = response.trim();

        // Remove ```html and ``` markers
        html = html.replace(/```html\n?/g, '');
        html = html.replace(/```\n?/g, '');

        // If response doesn't start with <, wrap it
        if (!html.trim().startsWith('<')) {
            html = `<div class="ai-generated-content">${html}</div>`;
        }

        return html;
    }

    async chat(message, conversationHistory = []) {
        const messages = [
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        try {
            let response;

            switch (this.provider) {
                case 'gemini':
                    response = await this.chatGemini(messages);
                    break;
                case 'claude':
                    response = await this.chatClaude(messages);
                    break;
                case 'openai':
                    response = await this.chatOpenAI(messages);
                    break;
                default:
                    throw new Error('Neznámý AI provider');
            }

            return response;
        } catch (error) {
            console.error('Chat Error:', error);
            throw error;
        }
    }

    async chatGemini(messages) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`;

        const contents = messages.map(msg => ({
            parts: [{ text: msg.content }],
            role: msg.role === 'assistant' ? 'model' : 'user'
        }));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: contents
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API error');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async chatClaude(messages) {
        const url = 'https://api.anthropic.com/v1/messages';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2048,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            })
        });

        if (!response.ok) {
            throw new Error('Claude API error');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async chatOpenAI(messages) {
        const url = 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Global instance
window.aiEngine = new AIEngine();
