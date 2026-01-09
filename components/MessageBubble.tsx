
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onSpeak?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSpeak }) => {
  const isUser = message.role === 'user';
  const references = message.references || [];

  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.trim() === '') return <div key={idx} style={{ height: '8px' }} />;
      return <p key={idx} style={{ marginBottom: '8px' }}>{line}</p>;
    });
  };

  return (
    <div className={`message-row ${isUser ? 'user' : ''}`}>
      <div className={`bubble ${isUser ? 'user' : 'assistant'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '11px', fontWeight: '600', color: isUser ? '#888' : 'var(--primary)' }}>
          {isUser ? 'YOU' : 'AGRIGENIUS'}
          {!isUser && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {references.length > 0 && (
                <span style={{ padding: '2px 6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', fontSize: '9px' }}>
                  SOURCES: {references.length}
                </span>
              )}
              {/* TTS Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onSpeak && onSpeak(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-accent)', padding: 0, display: 'flex' }}
                title="Read Aloud"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              </button>
            </div>
          )}
        </div>
        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 400, lineHeight: '1.6' }}>
          <ReactMarkdown
            components={{
              // Customize paragraph to match existing style
              p: ({ node, ...props }) => <div style={{ marginBottom: '8px' }} {...props} />,
              // Style links
              a: ({ node, ...props }) => <a style={{ color: 'var(--primary-emerald)', textDecoration: 'underline' }} {...props} />,
              // Style lists
              ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', marginBottom: '8px' }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px', marginBottom: '8px' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: '4px' }} {...props} />,
              // Style bold
              strong: ({ node, ...props }) => <span style={{ fontWeight: 'bold', color: 'var(--text-accent)' }} {...props} />,
              // Headers
              h1: ({ node, ...props }) => <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', marginTop: '16px' }} {...props} />,
              h2: ({ node, ...props }) => <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', marginTop: '12px' }} {...props} />,
              h3: ({ node, ...props }) => <h5 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', marginTop: '10px' }} {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {!isUser && references.length > 0 && (
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px', color: 'rgba(255,255,255,0.35)' }}>
              References
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0 }}>
              {references.map((ref, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
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
        )}

        <div style={{
          marginTop: '16px',
          fontSize: '10px',
          color: '#555'
        }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
