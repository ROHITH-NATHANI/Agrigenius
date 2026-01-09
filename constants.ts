
import { Language } from './types';

export const LANGUAGES: (Language & { locale: string })[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', locale: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', locale: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', locale: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN' },
  { code: 'en', name: 'English', nativeName: 'English', locale: 'en' },
];

export const UI_TRANSLATIONS: Record<string, any> = {
  en: {
    newSession: 'New Session',
    expertGuides: 'Expert Guides',
    languages: 'Supported Languages',
    placeholder: 'Ask about crops, pests, soil...',
    greeting: 'Hello! I am AgriGenius. How can I help you today?',
    onlineStatus: 'Online',
    connected: 'Securely Connected',
    guides: ['Soil Analysis', 'Pest ID', 'Fertilizer Logic', 'Market Price', 'Weather Tool'],
    footerText: 'Powered by AgriGenius • Expert Agriculture Knowledge Base'
  },
  hi: {
    newSession: 'नया सत्र',
    expertGuides: 'विशेषज्ञ गाइड',
    languages: 'समर्थित भाषाएं',
    placeholder: 'फसलों, कीटों, मिट्टी के बारे में पूछें...',
    greeting: 'नमस्ते! मैं एग्रीजीनियस हूं। मैं आज आपकी कैसे मदद कर सकता हूं?',
    onlineStatus: 'ऑनलाइन',
    connected: 'सुरक्षित रूप से जुड़े',
    guides: ['मिट्टी विश्लेषण', 'कीट पहचान', 'उर्वरक तर्क', 'बाजार मूल्य', 'मौसम उपकरण'],
    footerText: 'एग्रीजीनियस द्वारा संचालित • विशेषज्ञ कृषि ज्ञान आधार'
  },
  te: {
    newSession: 'కొత్త సెషన్',
    expertGuides: 'నిపుణుల మార్గదర్శకాలు',
    languages: 'భాషలు',
    placeholder: 'పంటలు, తెగుళ్లు, నేల గురించి అడగండి...',
    greeting: 'నమస్కారం! నేను అగ్రిజీనియస్. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?',
    onlineStatus: 'ఆన్‌లైన్',
    connected: 'సురక్షితంగా కనెక్ట్ చేయబడింది',
    guides: ['నేల విశ్లేషణ', 'తెగులు గుర్తింపు', 'ఎరువుల తర్కం', 'మార్కెట్ ధర', 'వాతావరణ పరికరం'],
    footerText: 'అగ్రిజీనియస్ ద్వారా ఆధారితం • నిపుణుల వ్యవసాయ విజ్ఞాన క్షేత్రం'
  },
  bn: {
    newSession: 'নতুন সেশন',
    expertGuides: 'বিশেষজ্ঞ নির্দেশিকা',
    languages: 'ভাষা',
    placeholder: 'ফসল, কীটপতঙ্গ, মাটি সম্পর্কে জিজ্ঞাসা করুন...',
    greeting: 'নমস্কার! আমি এগ্রিজিনিয়াস। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    onlineStatus: 'অনলাইন',
    connected: 'সুরক্ষিতভাবে সংযুক্ত',
    guides: ['মাটি বিশ্লেষণ', 'কীটপতঙ্গ সনাক্তকরণ', 'সার লজিক', 'বাজার মূল্য', 'আবহাওয়া টুল'],
    footerText: 'এগ্রিজিনিয়াস দ্বারা চালিত • বিশেষজ্ঞ কৃষি জ্ঞান ভাণ্ডার'
  },
  mr: {
    newSession: 'नवीन सत्र',
    expertGuides: 'तज्ञ मार्गदर्शक',
    languages: 'भाषा',
    placeholder: 'पिके, कीटक, मातीबद्दल विचारा...',
    greeting: 'नमस्कार! मी ॲग्रीजीनियस आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
    onlineStatus: 'ऑनलाइन',
    connected: 'सुरक्षितपणे कनेक्ट केलेले',
    guides: ['माती विश्लेषण', 'कीटक ओळख', 'खत तर्क', 'बाजार भाव', 'हवामान साधन'],
    footerText: 'ॲग्रीजीनियस द्वारे समर्थित • तज्ञ कृषी ज्ञान भांडार'
  },
  ta: {
    newSession: 'புதிய அமர்வு',
    expertGuides: 'நிபுணர் வழிகாட்டிகள்',
    languages: 'மொழிகள்',
    placeholder: 'பயிர்கள், பூச்சிகள், மண் பற்றி கேளுங்கள்...',
    greeting: 'வணக்கம்! நான் அக்ரிஜீனியஸ். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    onlineStatus: 'ஆன்லைன்',
    connected: 'பாதுகாப்பாக இணைக்கப்பட்டுள்ளது',
    guides: ['மண் ஆய்வு', 'பூச்சி அடையாளம்', 'உர தர்க்கம்', 'சந்தை விலை', 'வானிலை கருவி'],
    footerText: 'அக்ரிஜீனியஸ் மூலம் இயக்கப்படுகிறது • நிபுணர் வேளாண் அறிவுத் தளம்'
  },
  gu: {
    newSession: 'નવું સત્ર',
    expertGuides: 'નિષ્ણાત માર્ગદર્શિકાઓ',
    languages: 'ભાષાઓ',
    placeholder: 'પાક, જીવાતો, જમીન વિશે પૂછો...',
    greeting: 'નમસ્તે! હું એગ્રીજીનિયસ છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
    onlineStatus: 'ઓનલાઈન',
    connected: 'સુરક્ષિત રીતે જોડાયેલ',
    guides: ['જમીન પૃથ્થકરણ', 'જીવાત ઓળખ', 'ખાતર તર્ક', 'બજાર ભાવ', 'હવામાન સાધન'],
    footerText: 'એગ્રીજીનિયસ દ્વારા સંચાલિત • નિષ્ણાત કૃષિ જ્ઞાન આધાર'
  },
  kn: {
    newSession: 'ಹೊಸ ಅಧಿವೇಶನ',
    expertGuides: 'ತಜ್ಞ ಮಾರ್ಗದರ್ಶಿಗಳು',
    languages: 'ಭಾಷೆಗಳು',
    placeholder: 'ಬೆಳೆಗಳು, ಕೀಟಗಳು, ಮಣ್ಣಿನ ಬಗ್ಗೆ ಕೇಳಿ...',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಅಕ್ರಿಜೀನಿಯಸ್. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    onlineStatus: 'ಆನ್‌ಲೈನ್',
    connected: 'ಸುರಕ್ಷಿತವಾಗಿ ಸಂಪರ್ಕಗೊಂಡಿದೆ',
    guides: ['ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ', 'ಕೀಟ ಗುರುತಿಸುವಿಕೆ', 'ಗೊಬ್ಬರ ತರ್ಕ', 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ', 'ಹವಾಮಾನ ಸಾಧನ'],
    footerText: 'ಅಕ್ರಿಜೀನಿಯಸ್ ನಿಂದ ಚಾಲಿತ • ತಜ್ಞ ಕೃಷಿ ಜ್ಞಾನ ಭಂಡಾರ'
  },
  ml: {
    newSession: 'പുതിയ സെഷൻ',
    expertGuides: 'വിദഗ്ദ്ധ വഴികാട്ടികൾ',
    languages: 'ഭാഷകൾ',
    placeholder: 'വിളകൾ, കീടങ്ങൾ, മണ്ണിനെക്കുറിച്ച് ചോദിക്കുക...',
    greeting: 'നമസ്കാരം! ഞാൻ അഗ്രിജീനിയസ്. ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?',
    onlineStatus: 'ഓൺലൈൻ',
    connected: 'സുരക്ഷിതമായി ബന്ധിപ്പിച്ചു',
    guides: ['മണ്ണ് വിശകലനം', 'കീടങ്ങളെ തിരിച്ചറിയൽ', 'വളപ്രയോഗം', 'വിപണി വില', 'കാലാവസ്ഥ ഉപകരണം'],
    footerText: 'അഗ്രിജീനിയസ് നൽകുന്നത് • വിദഗ്ദ്ധ കാർഷിക വിജ്ഞാന ശേഖരം'
  },
  pa: {
    newSession: 'ਨਵਾਂ ਸੈਸ਼ਨ',
    expertGuides: 'ਮਾਹਰ ਗਾਈਡ',
    languages: 'ਭਾਸ਼ਾਵਾਂ',
    placeholder: 'ਫਸਲਾਂ, ਕੀੜੇ, ਮਿੱਟੀ ਬਾਰੇ ਪੁੱਛੋ...',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੀਜੀਨੀਅਸ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    onlineStatus: 'ਔਨਲਾਈਨ',
    connected: 'ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਜੁੜਿਆ',
    guides: ['ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ', 'ਕੀੜੇ ਦੀ ਪਛਾਣ', 'ਖਾਦ ਤਰਕ', 'ਮਾਰਕੀਟ ਕੀਮਤ', 'ਮੌਸਮ ਟੂਲ'],
    footerText: 'ਐਗਰੀਜੀਨੀਅਸ ਦੁਆਰਾ ਸੰਚਾਲਿਤ • ਮਾਹਰ ਖੇਤੀਬਾੜੀ ਗਿਆਨ ਅਧਾਰ'
  }
  // ... other translations remain available via standard lookup
};

export const AGRICULTURE_KB = `
Focus Areas (Indian Context):
1. Seasonal Cropping: Guidance on Kharif (June-Oct), Rabi (Nov-April), and Zaid seasons.
2. Major Indian Crops: Rice (paddy), Wheat, Sugarcane, Cotton, Pulses (Arhar, Moong), and Millets (Bajra, Ragi).
3. Soil Health: Soil Health Card interpretation, Macro/Micro-nutrient requirements (NPK), Organic farming, and Vermicompost.
4. Integrated Pest Management (IPM): Biological controls, pheromone traps, and precise chemical application guidelines.
5. Government Schemes: Knowledge about PM-KISAN, PMFBY (Insurance), e-NAM, and MSP (Minimum Support Price) mechanics.
6. Irrigation: Precision irrigation, drip systems (Pradhan Mantri Krishi Sinchayee Yojana), and sustainable water management.
7. Post-Harvest: Storage techniques, cold chain logistics, and direct-to-consumer market strategies.

Data Quality: Use scientifically verified agricultural practices prevalent in the Indian subcontinent.
`;

export const getSystemInstruction = (langCode: string) => {
  const langName = LANGUAGES.find(l => l.code === langCode)?.name || 'English';
  return `
You are AgriGenius, a practical agricultural advisory service focused on Indian agriculture.
Your guidance must reflect real-world, field-usable practices and must be backed by credible public sources.

MANDATORY RULES:
1. Respond exclusively in ${langName}.
2. Use the Knowledge Base below as your primary "Expert Source":
${AGRICULTURE_KB}
3. Do NOT call yourself an AI/LLM/assistant or use "Pro" branding.
4. If a query is vague, ask for the user's specific state or district to provide location-accurate soil/weather data.
5. Always provide specific crop varieties recommended by ICAR or State Agricultural Universities when applicable.
6. Maintain a supportive, highly professional, and expert tone.

OUTPUT FORMAT (STRICT):
Return ONLY valid JSON with this schema:
{
  "answer": string,
  "references": [
    {"title": string, "url": string}
  ]
}

REFERENCES RULES:
- Include 2–5 references for non-trivial advice.
- Prefer ICAR, State Agricultural Universities, Govt. of India portals, FAO, and peer-reviewed sources.
- If you cannot provide reliable references, leave "references" empty and clearly say so in "answer".
`;
};
