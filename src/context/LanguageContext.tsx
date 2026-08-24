import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'ta';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LOCAL_STORAGE_LANG_KEY = 'swasthya_setu_language_v1';

const translations: Record<Language, Record<string, string>> = {
  en: {
    app_name: 'SwasthyaSetu',
    tagline: 'Connected care, closer to every village.',
    citizen: 'Citizen / Patient',
    health_worker: 'Health Worker',
    official: 'Higher Official',
    view_only: 'View Only',
    editor: 'Editor',
    dashboard: 'Dashboard',
    my_health_record: 'My Health Record',
    appointments: 'Appointments',
    referrals: 'Referrals',
    test_results: 'Test Results',
    medicines: 'Medicines & Diagnostics',
    follow_ups: 'Follow-ups',
    notifications: 'Notifications',
    profile: 'Profile',
    patients: 'Patients',
    register_patient: 'Register Patient',
    triage: 'Smart Triage',
    services: 'Services & Facilities',
    facility_performance: 'Facility Performance',
    referral_analytics: 'Referral Analytics',
    high_risk_monitoring: 'High-Risk Monitoring',
    reports: 'Reports',
    online: 'Online',
    offline: 'Offline',
    pending_sync: 'Pending Sync',
    sync_now: 'Sync Now',
    call_108: 'Call 108 Emergency',
    switch_demo_user: 'Switch Demo User',
    logout: 'Logout',
    access_restricted: 'Access Restricted',
    access_restricted_msg: 'Your role has view-only access. Please contact an authorized health worker for updates.',
    return_to_dashboard: 'Return to Dashboard',
    high_contrast: 'High Contrast',
    font_size: 'Font Size',
    normal: 'Normal',
    large: 'Large',
    extra_large: 'Extra Large',
    view_only_banner: 'Your health information is view-only. Contact your health worker for corrections or updates.',
    official_view_banner: 'You have view-only access to operational and aggregate health data.',
    medical_disclaimer: 'This tool supports frontline decision-making and does not replace qualified clinical diagnosis.'
  },
  hi: {
    app_name: 'स्वास्थ्यसेतु',
    tagline: 'हर गाँव के करीब, सशक्त स्वास्थ्य देखभाल।',
    citizen: 'नागरिक / मरीज',
    health_worker: 'स्वास्थ्य कार्यकर्ता',
    official: 'उच्च अधिकारी',
    view_only: 'केवल देखने योग्य',
    editor: 'संपादक',
    dashboard: 'डैशबोर्ड',
    my_health_record: 'मेरा स्वास्थ्य रिकॉर्ड',
    appointments: 'नियुक्तियाँ (Appointments)',
    referrals: 'रेफरल (Referrals)',
    test_results: 'जाँच परिणाम',
    medicines: 'दवाएँ एवं डायग्नोस्टिक्स',
    follow_ups: 'फॉलो-अप (Follow-ups)',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    patients: 'मरीज सूची',
    register_patient: 'मरीज पंजीकृत करें',
    triage: 'स्मार्ट ट्राइएज (Triage)',
    services: 'सेवाएं एवं अस्पताल',
    facility_performance: 'अस्पताल कार्यप्रदर्शन',
    referral_analytics: 'रेफरल विश्लेषण',
    high_risk_monitoring: 'उच्च जोखिम निगरानी',
    reports: 'रिपोर्ट',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    pending_sync: 'सिंक लंबित (Pending)',
    sync_now: 'अभी सिंक करें',
    call_108: '108 आपातकालीन कॉल',
    switch_demo_user: 'डेमो यूजर बदलें',
    logout: 'लॉगआउट',
    access_restricted: 'अभिगम प्रतिबंधित (Access Restricted)',
    access_restricted_msg: 'आपकी भूमिका केवल देखने की अनुमति देती है। बदलाव के लिए कृपया स्वास्थ्य कार्यकर्ता से संपर्क करें।',
    return_to_dashboard: 'डैशबोर्ड पर वापस जाएं',
    high_contrast: 'उच्च कंट्रास्ट',
    font_size: 'फ़ॉन्ट आकार',
    normal: 'सामान्य',
    large: 'बड़ा',
    extra_large: 'अति बड़ा',
    view_only_banner: 'आपकी स्वास्थ्य जानकारी केवल देखने के लिए है। अपडेट के लिए स्वास्थ्य कार्यकर्ता से संपर्क करें।',
    official_view_banner: 'आपको केवल परिचालन एवं समेकित डेटा देखने का अधिकार है।',
    medical_disclaimer: 'यह उपकरण केवल सहायता के लिए है और चिकित्सकीय निदान का स्थान नहीं लेता।'
  },
  mr: {
    app_name: 'स्वास्थ्यसेतु',
    tagline: 'प्रत्येक गावाच्या जवळ, जोडलेली आरोग्य सेवा.',
    citizen: 'नागरीक / रुग्ण',
    health_worker: 'आरोग्य सेवक (ASHA/ANM)',
    official: 'वरिष्ठ अधिकारी',
    view_only: 'फक्त पाहण्यासाठी',
    editor: 'संपादन हक्क',
    dashboard: 'डॅशबोर्ड',
    my_health_record: 'माझी आरोग्य नोंद',
    appointments: 'अपॉइंटमेंट्स',
    referrals: 'रिफरल्स',
    test_results: 'तपासणी निकाल',
    medicines: 'औषधे व लॅब',
    follow_ups: 'फॉलो-अप्स',
    notifications: 'सूचना',
    profile: 'प्रोफाइल',
    patients: 'रुग्ण यादी',
    register_patient: 'रुग्ण नोंदणी',
    triage: 'स्मार्ट ट्रायज',
    services: 'आरोग्य केंद्रे',
    facility_performance: 'केंद्र कामगिरी',
    referral_analytics: 'रिफरल विश्लेषण',
    high_risk_monitoring: 'हाय-रिस्क निरीक्षण',
    reports: 'अहवाल (Reports)',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    pending_sync: 'सिंक प्रलंबित',
    sync_now: 'आता सिंक करा',
    call_108: '१०८ आणीबाणी कॉल',
    switch_demo_user: 'डेमो खाते बदला',
    logout: 'बाहेर पडा',
    access_restricted: 'प्रवेश मर्यादित (Access Restricted)',
    access_restricted_msg: 'आपल्या खात्यास केवळ पाहण्याचे हक्क आहेत. बदलासाठी आरोग्य सेवकाशी संपर्क साधा.',
    return_to_dashboard: 'मुख्य पानावर जा',
    high_contrast: 'हाय कॉन्ट्रास्ट',
    font_size: 'फॉन्ट आकार',
    normal: 'सामान्य',
    large: 'मोठा',
    extra_large: 'खूप मोठा',
    view_only_banner: 'आपली आरोग्य माहिती फक्त पाहण्यासाठी आहे. दुरुस्तीसाठी आरोग्य सेवकांशी संपर्क साधा.',
    official_view_banner: 'आपल्याला केवळ विश्लेषणात्मक माहिती पाहण्याचा अधिकार आहे.',
    medical_disclaimer: 'हे साधन केवळ निर्णयांना मदत करण्यासाठी आहे आणि वैद्यकीय निदानाचा पर्याय नाही.'
  },
  ta: {
    app_name: 'சுவாஸ்த்யசேது',
    tagline: 'ஒவ்வொரு கிராமத்திற்கும் அருகிலுள்ள இணைக்கப்பட்ட பராமரிப்பு.',
    citizen: 'குடிமகன் / நோயாளி',
    health_worker: 'சுகாதாரப் பணியாளர் (ASHA)',
    official: 'உயர் அதிகாரி',
    view_only: 'பார்வை மட்டும்',
    editor: 'பதிவு செய்பவர்',
    dashboard: 'டாஷ்போர்டு',
    my_health_record: 'என் சுகாதாரப் பதிவு',
    appointments: 'சந்திப்புகள் (Appointments)',
    referrals: 'பரிந்துரைகள் (Referrals)',
    test_results: 'பரிசோதனை முடிவுகள்',
    medicines: 'மருந்துகள் & பரிசோதனை',
    follow_ups: 'பின்தொடர்தல் (Follow-ups)',
    notifications: 'அறிவிப்புகள்',
    profile: 'சுயவிவரம்',
    patients: 'நோயாளிகள் பட்டியல்',
    register_patient: 'நோயாளி பதிவு',
    triage: 'ஸ்மார்ட் ட்ரையேஜ்',
    services: 'சுகாதார மையங்கள்',
    facility_performance: 'மையங்களின் செயல்பாடு',
    referral_analytics: 'பரிந்துரை பகுப்பாய்வு',
    high_risk_monitoring: 'அதிக ஆபத்து கண்காணிப்பு',
    reports: 'அறிக்கைகள் (Reports)',
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன்',
    pending_sync: 'ஒத்திசைவு நிலுவை',
    sync_now: 'இப்போது ஒத்திசைக்கவும்',
    call_108: '108 அவசர அழைப்பு',
    switch_demo_user: 'டெமோ கணக்கை மாற்றுக',
    logout: 'வெளியேறு',
    access_restricted: 'அணுகல் கட்டுப்படுத்தப்பட்டது',
    access_restricted_msg: 'உங்கள் கணக்கு பார்வைக்கு மட்டுமே அனுமதிக்கப்பட்டுள்ளது. விவரங்களை மாற்ற சுகாதாரப் பணியாளரைத் தொடர்பு கொள்ளவும்.',
    return_to_dashboard: 'முகப்புக்குச் செல்லவும்',
    high_contrast: 'உயர் கான்ட்ராஸ்ட்',
    font_size: 'எழுத்து அளவு',
    normal: 'இயல்பு',
    large: 'பெரியது',
    extra_large: 'மிகப்பெரியது',
    view_only_banner: 'உங்கள் சுகாதாரத் தகவல் பார்வைக்கு மட்டுமே. புதுப்பிப்புகளுக்கு சுகாதாரப் பணியாளரைத் தொடர்பு கொள்ளவும்.',
    official_view_banner: 'செயல்பாட்டுத் தரவை மட்டும் பார்க்க உங்களுக்கு அனுமதி உள்ளது.',
    medical_disclaimer: 'இது ஒரு முடிவு ஆதரவு கருவி மட்டுமே, மருத்துவரின் நோயறிதலுக்கு மாற்றாகாது.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
