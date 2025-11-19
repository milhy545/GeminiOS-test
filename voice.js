// ClaudeOS Voice Module - Speech-to-Text & Text-to-Speech
// Using Web Speech API (nativní v browseru)

class ClaudeOSVoice {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;

        // Podporované jazyky
        this.languages = {
            'cs': 'cs-CZ',    // Čeština
            'en': 'en-US',    // Angličtina
            'sk': 'sk-SK',    // Slovenština
            'de': 'de-DE',    // Němčina
        };

        this.currentLanguage = 'cs-CZ';

        // Callback funkce
        this.onResult = null;
        this.onError = null;
        this.onStart = null;
        this.onEnd = null;

        this.initRecognition();

        console.log('🎤 ClaudeOS Voice Module initialized');
    }

    initRecognition() {
        // Zkontroluj podporu Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('⚠️ Speech Recognition není podporováno v tomto prohlížeči');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = this.currentLanguage;
        this.recognition.continuous = false;  // false = zastaví se po jedné větě
        this.recognition.interimResults = true; // true = průběžné výsledky
        this.recognition.maxAlternatives = 1;

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('🎤 Listening started...');
            if (this.onStart) this.onStart();

            // Debug
            if (window.ClaudeOSDebug) {
                window.ClaudeOSDebug.log('Voice: Listening started', 'info');
            }
        };

        this.recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript;
            const isFinal = result.isFinal;

            console.log(`🎤 ${isFinal ? 'Final' : 'Interim'}: ${transcript}`);

            if (this.onResult) {
                this.onResult(transcript, isFinal);
            }

            // Debug
            if (window.ClaudeOSDebug && isFinal) {
                window.ClaudeOSDebug.log(`Voice: "${transcript}"`, 'success');
            }
        };

        this.recognition.onerror = (event) => {
            console.error('🎤 Recognition error:', event.error);
            this.isListening = false;

            if (this.onError) {
                this.onError(event.error);
            }

            // Debug
            if (window.ClaudeOSDebug) {
                window.ClaudeOSDebug.logError('Voice recognition error', event.error);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('🎤 Listening ended');

            if (this.onEnd) {
                this.onEnd();
            }

            // Debug
            if (window.ClaudeOSDebug) {
                window.ClaudeOSDebug.log('Voice: Listening ended', 'info');
            }
        };
    }

    // Zahájit naslouchání
    startListening() {
        if (!this.recognition) {
            alert('⚠️ Hlasové ovládání není podporováno v tomto prohlížeči.\n\nPoužijte Chrome, Edge nebo Safari.');
            return false;
        }

        if (this.isListening) {
            console.warn('Already listening...');
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Error starting recognition:', error);
            return false;
        }
    }

    // Zastavit naslouchání
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    // Změnit jazyk
    setLanguage(langCode) {
        if (this.languages[langCode]) {
            this.currentLanguage = this.languages[langCode];
            if (this.recognition) {
                this.recognition.lang = this.currentLanguage;
            }
            console.log(`🌐 Language changed to: ${this.currentLanguage}`);
        }
    }

    // Text-to-Speech - přečíst text nahlas
    speak(text, options = {}) {
        if (!this.synthesis) {
            console.error('Speech Synthesis není podporováno');
            return false;
        }

        // Zastav aktuální mluvení
        this.stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);

        // Nastavení
        utterance.lang = options.lang || this.currentLanguage;
        utterance.rate = options.rate || 1.0;      // Rychlost (0.1 - 10)
        utterance.pitch = options.pitch || 1.0;    // Výška hlasu (0 - 2)
        utterance.volume = options.volume || 1.0;  // Hlasitost (0 - 1)

        // Vyber hlas (preferuj ženský český hlas)
        const voices = this.synthesis.getVoices();
        const czechVoice = voices.find(v => v.lang.startsWith('cs'));
        if (czechVoice) {
            utterance.voice = czechVoice;
        }

        // Event handlers
        utterance.onstart = () => {
            this.isSpeaking = true;
            console.log('🔊 Speaking started');

            if (window.ClaudeOSDebug) {
                window.ClaudeOSDebug.log('TTS: Speaking started', 'info');
            }
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            console.log('🔊 Speaking ended');

            if (window.ClaudeOSDebug) {
                window.ClaudeOSDebug.log('TTS: Speaking ended', 'info');
            }
        };

        utterance.onerror = (event) => {
            this.isSpeaking = false;
            console.error('🔊 Speaking error:', event.error);

            if (window.ClaudeOSDebug) {
                window.ClaudeOSDebug.logError('TTS error', event.error);
            }
        };

        // Spusť syntézu řeči
        this.synthesis.speak(utterance);

        return true;
    }

    // Zastavit mluvení
    stopSpeaking() {
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    // Pauza
    pauseSpeaking() {
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.pause();
        }
    }

    // Pokračovat
    resumeSpeaking() {
        if (this.synthesis) {
            this.synthesis.resume();
        }
    }

    // Získat dostupné hlasy
    getVoices() {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices();
    }

    // Zkontrolovat podporu
    static isSupported() {
        const hasRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        const hasSynthesis = !!window.speechSynthesis;

        return {
            recognition: hasRecognition,
            synthesis: hasSynthesis,
            full: hasRecognition && hasSynthesis
        };
    }

    // Helper: Přečti AI odpověď s pěkným formátováním
    speakAIResponse(text) {
        // Odstraň markdown formatting
        let cleanText = text
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`([^`]+)`/g, '$1')    // Remove inline code
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
            .replace(/\*([^*]+)\*/g, '$1')     // Remove italic
            .replace(/#{1,6}\s/g, '')          // Remove headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .trim();

        // Rozděl na věty a přidej pauzy
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim());

        // Přečti postupně s pauzami
        this.speakSentences(sentences);
    }

    speakSentences(sentences, index = 0) {
        if (index >= sentences.length) return;

        const text = sentences[index].trim();
        if (!text) {
            this.speakSentences(sentences, index + 1);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.currentLanguage;

        utterance.onend = () => {
            // Krátká pauza mezi větami
            setTimeout(() => {
                this.speakSentences(sentences, index + 1);
            }, 300);
        };

        this.synthesis.speak(utterance);
    }

    // Utility: Vytvoř voice button pro input
    static createVoiceButton(inputElement, callback) {
        const button = document.createElement('button');
        button.className = 'voice-button';
        button.innerHTML = '🎤';
        button.title = 'Hlasové diktování (Ctrl+Shift+V)';
        button.type = 'button';

        let isListening = false;

        button.addEventListener('click', () => {
            if (!window.voice) {
                alert('Voice modul není inicializován');
                return;
            }

            if (isListening) {
                window.voice.stopListening();
                button.innerHTML = '🎤';
                button.classList.remove('listening');
                isListening = false;
            } else {
                window.voice.onResult = (transcript, isFinal) => {
                    if (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA') {
                        inputElement.value = transcript;
                    }

                    if (isFinal && callback) {
                        callback(transcript);
                    }
                };

                window.voice.onEnd = () => {
                    button.innerHTML = '🎤';
                    button.classList.remove('listening');
                    isListening = false;
                };

                const started = window.voice.startListening();
                if (started) {
                    button.innerHTML = '🔴';
                    button.classList.add('listening');
                    isListening = true;
                }
            }
        });

        return button;
    }

    // Utility: Vytvoř speaker button
    static createSpeakerButton(textGetter) {
        const button = document.createElement('button');
        button.className = 'speaker-button';
        button.innerHTML = '🔊';
        button.title = 'Přečíst nahlas';
        button.type = 'button';

        button.addEventListener('click', () => {
            if (!window.voice) {
                alert('Voice modul není inicializován');
                return;
            }

            if (window.voice.isSpeaking) {
                window.voice.stopSpeaking();
                button.innerHTML = '🔊';
            } else {
                const text = typeof textGetter === 'function' ? textGetter() : textGetter;
                if (text) {
                    window.voice.speakAIResponse(text);
                    button.innerHTML = '🔇';

                    // Reset po dokončení
                    setTimeout(() => {
                        if (!window.voice.isSpeaking) {
                            button.innerHTML = '🔊';
                        }
                    }, 500);
                }
            }
        });

        return button;
    }
}

// Inicializuj globální voice instance
window.voice = new ClaudeOSVoice();

// Keyboard shortcut: Ctrl+Shift+V pro voice
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        console.log('🎤 Voice shortcut triggered');

        // Najdi aktivní input/textarea
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            if (window.voice.isListening) {
                window.voice.stopListening();
            } else {
                window.voice.onResult = (transcript, isFinal) => {
                    activeElement.value = transcript;
                };
                window.voice.startListening();
            }
        }
    }
});

// Log support info
const support = ClaudeOSVoice.isSupported();
console.log('🎤 Voice Support:', support);

if (!support.full) {
    console.warn('⚠️ Některé voice funkce nejsou podporovány v tomto prohlížeči');
    if (!support.recognition) console.warn('   - Speech Recognition není k dispozici');
    if (!support.synthesis) console.warn('   - Speech Synthesis není k dispozici');
}
