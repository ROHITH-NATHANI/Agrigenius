
import React from 'react';
import { LANGUAGES, UI_TRANSLATIONS } from '../constants';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onGuideClick: (guide: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  isOpen, 
  onClose, 
  currentLang, 
  onLanguageChange,
  onGuideClick
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.svg"
            alt="AgriGenius"
            width={28}
            height={28}
            style={{ display: 'block' }}
          />
          <h1 className="sidebar-brand">AgriGenius</h1>
        </div>
      </div>

      <button onClick={onNewChat} className="new-chat-btn">
        + {t.newSession}
      </button>

      <div className="guide-list custom-scrollbar">
        {t.guides.map((item: string) => (
          <button 
            key={item} 
            onClick={() => onGuideClick(item)}
            className="guide-item"
          >
            {item}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }}>{t.languages}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {LANGUAGES.slice(0, 4).concat(LANGUAGES.find(l => l.code === 'en') || []).map(lang => (
              <button 
                key={lang.code} 
                onClick={() => onLanguageChange(lang.code)}
                style={{
                  padding: '6px',
                  fontSize: '10px',
                  borderRadius: '6px',
                  border: '1px solid ' + (currentLang === lang.code ? 'var(--primary)' : 'transparent'),
                  background: currentLang === lang.code ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                  color: currentLang === lang.code ? 'var(--primary)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <button 
          onClick={onClose}
          className="md-hidden"
          style={{ position: 'absolute', top: '20px', right: '-50px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '40px', height: '40px', color: 'white' }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Sidebar;
