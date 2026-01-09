import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { geminiService } from './services/geminiService';
import { UI_TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [lang, setLang] = useState('en');
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const handleNewChat = () => {
    localStorage.removeItem('agri-genius-chat-history');
    geminiService.resetSession(lang);
    setChatKey(prev => prev + 1);
    setPendingPrompt(null);
    setIsSidebarOpen(false);
  };

  const handleLanguageChange = (newLang: string) => {
    localStorage.removeItem('agri-genius-chat-history');
    setLang(newLang);
    geminiService.resetSession(newLang);
    setChatKey(prev => prev + 1);
    setPendingPrompt(null);
    setIsSidebarOpen(false);
  };

  const handleGuideClick = (guide: string) => {
    const guidePrompts: Record<string, string> = {
      'Soil Analysis': 'Explain how to conduct soil analysis and interpret a Soil Health Card for Indian conditions.',
      'Pest ID': 'Help me identify major pests for Kharif and Rabi crops and suggest integrated pest management steps.',
      'Fertilizer Logic': 'Provide a fertilizer application schedule for major Indian staples like Rice and Wheat.',
      'Market Price': 'How can I check the latest Mandi prices using e-NAM and ensure I get a fair price?',
      'Weather Tool': 'Give me seasonal agricultural advice based on current monsoon or winter weather patterns.',
      'मिट्टी विश्लेषण': 'मिट्टी के स्वास्थ्य कार्ड की व्याख्या और मृदा परीक्षण के चरणों के बारे में बताएं।',
      'कीट पहचान': 'प्रमुख फसलों के कीटों की पहचान और उनके नियंत्रण के उपायों के बारे में जानकारी दें।',
      'उर्वरक तर्क': 'चावल और गेहूं जैसी प्रमुख फसलों के लिए उर्वरक उपयोग की सही विधि बताएं।',
      'बाजार मूल्य': 'ई-नाम (e-NAM) का उपयोग करके मंडी भाव कैसे जांचें?',
      'मौसम उपकरण': 'वर्तमान मौसम के आधार पर खेती के लिए सलाह दें।',
      'నేల విశ్లేషణ': 'నేల విశ్లేషణ ఎలా చేయాలో మరియు భారతీయ పరిస్థితుల కోసం సాయిల్ హెల్త్ కార్డ్‌ను ఎలా అర్థం చేసుకోవాలో వివరించండి.',
      'తెగులు గుర్తింపు': 'ఖరీఫ్ మరియు రబీ పంటలకు వచ్చే ప్రధాన తెగుళ్లను గుర్తించడంలో సహాయపడండి మరియు సమీకృత తెగులు నివారణ చర్యలను సూచించండి.',
      'ఎరువుల తర్కం': 'వరి మరియు గోధుమ వంటి ప్రధాన భారతీయ పంటలకు ఎరువుల వినియోగ షెడ్యూల్ను అందించండి.',
      'మార్కెట్ ధర': 'e-NAM ఉపయోగించి తాజా మండి ధరలను ఎలా తనిఖీ చేయాలి మరియు నేను సరసమైన ధరను పొందేలా ఎలా చూసుకోవాలి?',
      'వాతావరణ పరికరం': 'ప్రస్తుత వర్ష రుతువు లేదా శీతాకాలపు వాతావరణ పరిస్థితుల ఆధారంగా కాలానుగుణ వ్యవసాయ సలహాలను ఇవ్వండి.',
      // Bengali
      'মাটি বিশ্লেষণ': 'মাটি বিশ্লেষণ কীভাবে করতে হয় তা ব্যাখ্যা করুন।', 'কীটপতঙ্গ সনাক্তকরণ': 'প্রধান ফসলের কীটপতঙ্গ চিহ্নিত করুন।', 'সার লজিক': 'ধান ও গমের জন্য সারের সময়সূচী দিন।', 'বাজার মূল্য': 'e-NAM ব্যবহার করে বাজারের দাম চেক করুন।', 'আবহাওয়া টুল': 'বর্তমান আবহাওয়ার উপর ভিত্তি করে কৃষি পরামর্শ দিন।',
      // Marathi
      'माती विश्लेषण': 'माती परीक्षणाचे महत्त्व सांगा.', 'कीटक ओळख': 'पिकांवरील कीड कशी ओळखावी?', 'खत तर्क': 'खते कधी आणि कशी वापरावीत?', 'बाजार भाव': 'बाजार भाव कसे तपासायचे?', 'हवामान साधन': 'हवामानानुसार शेतीचा सल्ला द्या.',
      // Tamil
      'மண் ஆய்வு': 'மண் பரிசோதனை முறைகளை விளக்கவும்.', 'பூச்சி அடையாளம்': 'பயிர்களில் பூச்சிகளை கண்டறிவது எப்படி?', 'உர தர்க்கம்': 'உர அட்டவணையை வழங்கவும்.', 'சந்தை விலை': 'சந்தை விலையை சரிபார்ப்பது எப்படி?', 'வானிலை கருவி': 'வானிலை அடிப்படையில் விவசாய குறிப்புகளை வழங்கவும்.',
      // Gujarati
      'જમીન પૃથ્થકરણ': 'જમીન પરીક્ષણ વિશે માહિતી આપો.', 'જીવાત ઓળખ': 'પાકમાં જીવાત નિયંત્રણ.', 'ખાતર તર્ક': 'ખાતરનો ઉપયોગ કેવી રીતે કરવો?', 'બજાર ભાવ': 'બજાર ભાવ જાણો.', 'હવામાન સાધન': 'હવામાન મુજબ ખેતી સલાહ.',
      // Kannada
      'ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ': 'ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ.', 'ಕೀಟ ಗುರುತಿಸುವಿಕೆ': 'ಕೀಟ ನಿಯಂತ್ರಣ ಸಲಹೆಗಳು.', 'ಗೊಬ್ಬರ ತರ್ಕ': 'ಗೊಬ್ಬರ ಬಳಕೆ ವಿಧಾನ.', 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ': 'ಮಾರುಕಟ್ಟೆ ದರ ಪರಿಶೀಲಿಸಿ.', 'ಹವಾಮಾನ ಸಾಧನ': 'ಹವಾಮಾನ ಆಧಾರಿತ ಕೃಷಿ ಸಲಹೆ.',
      // Malayalam
      'മണ്ണ് വിശകലനം': 'മണ്ണുപരിശോധനയെക്കുറിച്ച് വിശദീകരിക്കുക.', 'കീടങ്ങളെ തിരിച്ചറിയൽ': 'കീടനിയന്ത്രണ മാർഗ്ഗങ്ങൾ.', 'വളപ്രയോഗം': 'വളപ്രയോഗ രീതികൾ.', 'വിപണി വില': 'വിപണി വില അറിയുക.', 'കാലാവസ്ഥ ഉപകരണം': 'കാലാവസ്ഥാ അധിഷ്ഠിത കൃഷി ഉപദേശം.',
      // Punjabi
      'ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ': 'ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਬਾਰੇ ਦੱਸੋ।', 'ਕੀੜੇ ਦੀ ਪਛਾਣ': 'ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ।', 'ਖਾਦ ਤਰਕ': 'ਖਾਦ ਦੀ ਵਰਤੋਂ।', 'ਮਾਰਕੀਟ ਕੀਮਤ': 'ਮਾਰਕੀਟ ਭਾਅ ਚੈੱਕ ਕਰੋ।', 'ਮੌਸਮ ਟੂਲ': 'ਮੌਸਮ ਅਨੁਸਾਰ ਖੇਤੀ ਸਲਾਹ।'
    };
    const prompt = guidePrompts[guide] || `Tell me about ${guide}`;
    setPendingPrompt(prompt);
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-root">
      <Sidebar
        currentLang={lang}
        onLanguageChange={handleLanguageChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onGuideClick={handleGuideClick}
      />

      <main className="main-content">
        <header className="agri-ops-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              className="md-hidden"
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'white', fontWeight: 700 }}>AGRI-FIELD</span>
              <span style={{ color: 'var(--text-dim)' }}>/</span>
              <span>main</span>
            </div>
            <div className="status-pill">
              <div className="pulse-dot"></div>
              {t.onlineStatus}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', border: '1px solid var(--border-glass)' }}>
              BUILD: v2.4.0
            </div>
          </div>
        </header>

        <ChatInterface
          key={chatKey}
          lang={lang}
          initialPrompt={pendingPrompt}
          onPromptConsumed={() => setPendingPrompt(null)}
        />
      </main>
    </div>
  );
};

export default App;