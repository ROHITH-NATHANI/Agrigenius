
import { getSystemInstruction, LANGUAGES } from "../constants";
import type { Reference } from "../types";

type HistoryItem = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export class GeminiService {
  private currentLang: string = 'en';
  private history: HistoryItem[] = [];
  private lastReferences: Reference[] = [];

  constructor() {
    // Lazy init to avoid crashing on module load
  }

  resetSession(langCode: string = 'en') {
    this.currentLang = langCode;
    this.history = [];
    this.lastReferences = [];
  }

  consumeLastReferences(): Reference[] {
    const refs = this.lastReferences;
    this.lastReferences = [];
    return refs;
  }

  async sendMessage(message: string) {
    try {
      const systemInstruction = getSystemInstruction(this.currentLang);
      const payload = {
        message,
        systemInstruction,
        // Keep some context but cap it to avoid huge requests
        history: this.history.slice(-20),
        temperature: 0.6,
        model: 'gemini-2.5-flash',
      };

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({} as any));
      if (!response.ok) {
        throw new Error(data?.error || `Server error (${response.status})`);
      }

      const text = String(data?.text || '');
      const references = Array.isArray(data?.references) ? (data.references as Reference[]) : [];
      this.lastReferences = references;
      this.history.push({ role: 'user', content: message });
      this.history.push({ role: 'assistant', content: text });
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const fullText = await this.sendMessage(message);
      // Preserve the streaming UI without needing server streaming.
      const chunkSize = 48;
      for (let i = 0; i < fullText.length; i += chunkSize) {
        yield fullText.slice(i, i + chunkSize);
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }

  // --- Voice Input (using Web Speech API for robust dictation) ---
  private recognition: any = null;
  private recognitionActive = false;

  startVoiceInput(
    langCode: string,
    onFinal: (text: string) => void,
    onInterim: (text: string) => void
  ): boolean {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Feature not supported in this browser. Please use Chrome/Edge.");
      return false;
    }

    // Use centralized locale configuration
    const langConfig = LANGUAGES.find(l => l.code === langCode);
    const locale = langConfig?.locale || 'en-US';

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = locale;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognitionActive = true;

    this.recognition.onstart = () => console.log("Speech recognition started");
    this.recognition.onsoundstart = () => console.log("Sound detected");
    this.recognition.onspeechstart = () => console.log("Speech detected");

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onInterim(interimTranscript);
      // Re-read ChatInterface: setInput(prev => (prev.length > 0 && !prev.endsWith(' ') ? prev + ' ' : prev) + text);
      // This appends. So we must ONLY send NEW FINAL segments.
      if (finalTranscript) {
        console.log("Final result:", finalTranscript);
        onFinal(finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone permissions.");
        this.stopVoiceInput();
      } else if (event.error === 'no-speech') {
        // Ignore no-speech, it happens often
      } else if (event.error === 'network') {
        alert("Network error. Voice recognition requires internet.");
      } else if (event.error === 'aborted') {
        // Should retry? or just ignore. Aborted often happens if clicked "stop" too fast or another process took over.
        // But user saw this error.
        console.warn("Speech aborted.");
      } else {
        alert(`Voice recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      // Some browsers stop recognition unexpectedly even with continuous=true.
      // If the user didn't explicitly stop, try to restart.
      if (this.recognitionActive && this.recognition) {
        try {
          setTimeout(() => {
            if (this.recognitionActive && this.recognition) {
              this.recognition.start();
            }
          }, 150);
        } catch {
          // Ignore; caller can retry by toggling.
        }
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Speech recognition start failed', e);
      this.stopVoiceInput();
      return false;
    }
  }

  stopVoiceInput() {
    this.recognitionActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
  }
}

export const geminiService = new GeminiService();
