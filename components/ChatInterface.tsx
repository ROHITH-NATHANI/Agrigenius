
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';
import { UI_TRANSLATIONS, LANGUAGES } from '../constants';
import MessageBubble from './MessageBubble';
import { playTTS } from '../services/ttsService';

interface ChatInterfaceProps {
  lang: string;
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
}

const STORAGE_KEY = 'agri-genius-chat-history';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ lang, initialPrompt, onPromptConsumed }) => {
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });
      } catch (e) { console.error(e); }
    }
    return [{ id: '1', role: 'assistant', content: t.greeting, timestamp: new Date() }];
  });

  const [input, setInput] = useState('');
  const [interimInput, setInterimInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && !isLoading) {
      handleSend(initialPrompt);
      if (onPromptConsumed) onPromptConsumed();
    }
  }, [initialPrompt]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setInterimInput(''); // Clear interim
    setIsLoading(true);

    try {
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', references: [], timestamp: new Date() }]);
      let fullText = '';
      for await (const chunk of geminiService.sendMessageStream(text)) {
        fullText += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m));
      }

      const refs = geminiService.consumeLastReferences();
      if (refs.length > 0) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, references: refs } : m));
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Connection lost. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input + interimInput); // Send combined
  };

  const toggleVoiceInput = async () => {
    if (isRecording) {
      geminiService.stopVoiceInput();
      setIsRecording(false);
      setInterimInput('');
    } else {
      try {
        const started = geminiService.startVoiceInput(lang,
          (finalText) => {
            setInput(prev => (prev + ' ' + finalText).replace(/\s+/g, ' ').trim());
          },
          (interimText) => {
            setInterimInput(interimText ? ' ' + interimText : '');
          }
        );

        if (!started) {
          setIsRecording(false);
          setInterimInput('');
          return;
        }

        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div ref={scrollRef} className="messages-container custom-scrollbar">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onSpeak={() => playTTS(msg.content, lang)}
          />
        ))}

        {(() => {
          const flat = messages
            .filter(m => m.role === 'assistant' && Array.isArray(m.references) && (m.references?.length || 0) > 0)
            .flatMap(m => m.references || []);

          const seen = new Set<string>();
          const unique = flat.filter(r => {
            const key = (r.url || r.title || '').trim();
            if (!key) return false;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          if (unique.length === 0) return null;

          return (
            <div style={{
              marginTop: '14px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid var(--border-glass)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--text-dim)'
            }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                References
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {unique.map((ref, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {ref?.url ? (
                      <a href={ref.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-accent)', textDecoration: 'underline' }}>
                        {ref.title || ref.url}
                      </a>
                    ) : (
                      <span>{ref.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {isLoading && (
          <div className="message-row">
            <div className="bubble assistant" style={{ fontStyle: 'italic', color: 'var(--text-emerald)' }}>Analyzing query...</div>
          </div>
        )}
      </div>

      <div className="input-area">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <textarea
            rows={1}
            value={input + interimInput} // Show combined
            onChange={(e) => {
              // If user types, we update input usually. 
              // Complex with interim. Reset interim if manual typing?
              setInput(e.target.value);
              setInterimInput('');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input + interimInput); } }}
            placeholder={isRecording ? "Listening..." : t.placeholder}
          />
          <button type="button" onClick={toggleVoiceInput} className="action-btn voice-btn" style={{ background: isRecording ? '#ef4444' : '' }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
          <button type="submit" disabled={!input.trim() || isLoading} className="action-btn send-btn">
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

// Add global styles for animations (or add to index.css, but this is quicker for immediate fix)
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
`;
document.head.appendChild(style);
