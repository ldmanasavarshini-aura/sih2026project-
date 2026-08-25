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
    tagline: 'Connected rural healthcare across Maharashtra.',
    citizen: 'Citizen / Patient',
    health_worker: 'Health Worker (ASHA)',
    official: 'Health Officer',
    doctor: 'Doctor',
    view_only: 'View Only',
    editor: 'Create & Edit',
    dashboard: 'Home Dashboard',
    my_health_record: 'Health History',
    appointments: 'Book a Visit',
    referrals: 'Send to Another Hospital',
    test_results: 'Test Results',
    medicines: 'Check Medicines',
    follow_ups: 'Next Check-up',
    notifications: 'Notifications',
    profile: 'Profile',
    patients: 'Patient List',
    register_patient: 'Add New Patient',
    triage: 'Check Patient Risk',
    services: 'Hospital / Health Centre',
    facility_performance: 'Health Centre Overview',
    referral_analytics: 'Hospital Referral Tracking',
    high_risk_monitoring: 'High-Risk Care',
    reports: 'Health Reports',
    online: 'Online',
    offline: 'Offline Buffer',
    pending_sync: 'Sync Pending',
    sync_now: 'Sync Now',
    call_108: 'Call 108 Emergency',
    switch_demo_user: 'Switch User Role',
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
    medical_disclaimer: 'AI Risk Assessment is a clinical decision support tool and does not replace qualified medical diagnosis.',
    find_nearby_hospital: 'Find a Nearby Hospital or Health Centre',
    talk_to_doctor_online: 'Talk to Doctor Online',
    pregnancy_care: 'Pregnancy Care',
    child_care: 'Child Care',
    longterm_care: 'Long-term Health Care',
    get_emergency_help: 'Get Emergency Help',
    book_test: 'Book a Test'
  },
  hi: {
    app_name: 'स्वास्थ्यसेतु',
    tagline: 'महाराष्ट्र के ग्रामीण क्षेत्रों के लिए स्वास्थ्य सेवा।',
    citizen: 'नागरिक / मरीज',
    health_worker: 'स्वास्थ्य कार्यकर्ता (आशा)',
    official: 'स्वास्थ्य अधिकारी',
    doctor: 'डॉक्टर',
    view_only: 'केवल देखने योग्य',
    editor: 'संपादक',
    dashboard: 'होम डैशबोर्ड',
    my_health_record: 'स्वास्थ्य इतिहास',
    appointments: 'अस्पताल यात्रा बुक करें',
    referrals: 'दूसरे अस्पताल भेजें (Referral)',
    test_results: 'जाँच परिणाम',
    medicines: 'दवाएँ जाँचें',
    follow_ups: 'अगली जाँच (Next Check-up)',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    patients: 'मरीज सूची',
    register_patient: 'नया मरीज जोड़ें',
    triage: 'मरीज जोखिम जाँचें',
    services: 'अस्पताल व स्वास्थ्य केंद्र',
    facility_performance: 'स्वास्थ्य केंद्र ओवरव्यू',
    referral_analytics: 'रेफरल ट्रैकिंग',
    high_risk_monitoring: 'उच्च जोखिम देखभाल',
    reports: 'स्वास्थ्य रिपोर्ट',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन बफर',
    pending_sync: 'सिंक लंबित',
    sync_now: 'अभी सिंक करें',
    call_108: '108 आपातकालीन कॉल',
    switch_demo_user: 'यूजर रोल बदलें',
    logout: 'लॉगआउट',
    access_restricted: 'अभिगम प्रतिबंधित',
    access_restricted_msg: 'आपकी भूमिका केवल देखने की अनुमति देती है। बदलाव के लिए कृपया स्वास्थ्य कार्यकर्ता से संपर्क करें।',
    return_to_dashboard: 'डैशबोर्ड पर वापस जाएं',
    high_contrast: 'उच्च कंट्रास्ट',
    font_size: 'फ़ॉन्ट आकार',
    normal: 'सामान्य',
    large: 'बड़ा',
    extra_large: 'अति बड़ा',
    view_only_banner: 'आपकी स्वास्थ्य जानकारी केवल देखने के लिए है। अपडेट के लिए स्वास्थ्य कार्यकर्ता से संपर्क करें।',
    official_view_banner: 'आपको केवल परिचालन एवं समेकित डेटा देखने का अधिकार है।',
    medical_disclaimer: 'एआई जोखिम मूल्यांकन केवल डॉक्टर सहायता के लिए है और चिकित्सकीय निदान का स्थान नहीं लेता।',
    find_nearby_hospital: 'पास का अस्पताल या स्वास्थ्य केंद्र खोजें',
    talk_to_doctor_online: 'डॉक्टर से ऑनलाइन बात करें',
    pregnancy_care: 'गर्भावस्था देखभाल',
    child_care: 'बाल देखभाल',
    longterm_care: 'दीर्घकालिक स्वास्थ्य देखभाल',
    get_emergency_help: 'आपातकालीन सहायता लें',
    book_test: 'जाँच बुक करें'
  },
  mr: {
    app_name: 'स्वास्थ्यसेतु',
    tagline: 'ग्रामीण महाराष्ट्रासाठी जोडलेली आरोग्य सेवा.',
    citizen: 'नागरीक / रुग्ण',
    health_worker: 'आरोग्य सेवक (ASHA/ANM)',
    official: 'आरोग्य अधिकारी',
    doctor: 'डॉक्टर',
    view_only: 'फक्त पाहण्यासाठी',
    editor: 'संपादन हक्क',
    dashboard: 'होम डॅशबोर्ड',
    my_health_record: 'आरोग्य इतिहास',
    appointments: 'भेट बुक करा (Appointment)',
    referrals: 'दुसऱ्या रुग्णालयात पाठवा',
    test_results: 'तपासणी निकाल',
    medicines: 'औषधे तपासा',
    follow_ups: 'पुढील तपासणी (Next Check-up)',
    notifications: 'सूचना',
    profile: 'प्रोफाइल',
    patients: 'रुग्ण यादी',
    register_patient: 'नवीन रुग्ण नोंदवा',
    triage: 'रुग्णाचा धोका तपासा',
    services: 'आरोग्य केंद्र व रुग्णालये',
    facility_performance: 'आरोग्य केंद्र कामगिरी',
    referral_analytics: 'रिफरल ट्रॅकिंग',
    high_risk_monitoring: 'हाय-रिस्क काळजी',
    reports: 'आरोग्य अहवाल',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन बफर',
    pending_sync: 'सिंक प्रलंबित',
    sync_now: 'आता सिंक करा',
    call_108: '१०८ आणीबाणी कॉल',
    switch_demo_user: 'खाते भूमिका बदला',
    logout: 'बाहेर पडा',
    access_restricted: 'प्रवेश मर्यादित',
    access_restricted_msg: 'आपल्या खात्यास केवळ पाहण्याचे हक्क आहेत. बदलासाठी आरोग्य सेवकाशी संपर्क साधा.',
    return_to_dashboard: 'मुख्य पानावर जा',
    high_contrast: 'हाय कॉन्ट्रास्ट',
    font_size: 'फॉन्ट आकार',
    normal: 'सामान्य',
    large: 'मोठा',
    extra_large: 'खूप मोठा',
    view_only_banner: 'आपली आरोग्य माहिती फक्त पाहण्यासाठी आहे. दुरुस्तीसाठी आरोग्य सेवकांशी संपर्क साधा.',
    official_view_banner: 'आपल्याला केवळ विश्लेषणात्मक माहिती पाहण्याचा अधिकार आहे.',
    medical_disclaimer: 'एआई धोका तपासणी केवळ डॉक्टरांना मदत करण्यासाठी आहे, हा वैद्यकीय निर्णय नाही.',
    find_nearby_hospital: 'जवळचे रुग्णालय किंवा आरोग्य केंद्र शोधा',
    talk_to_doctor_online: 'डॉक्टरांशी ऑनलाइन बोला',
    pregnancy_care: 'गर्भवती काळजी',
    child_care: 'बाल संगोपन',
    longterm_care: 'दीर्घकालीन आरोग्य काळजी',
    get_emergency_help: 'आणीबाणी मदत मिळवा',
    book_test: 'तपासणी बुक करा'
  },
  ta: {
    app_name: 'சுவாஸ்த்யசேது',
    tagline: 'மகாராஷ்டிராவின் கிராமப்புறத்திற்கான இணைக்கப்பட்ட பராமரிப்பு.',
    citizen: 'குடிமகன் / நோயாளி',
    health_worker: 'சுகாதாரப் பணியாளர் (ASHA)',
    official: 'சுகாதார அதிகாரி',
    doctor: 'மருத்துவர்',
    view_only: 'பார்வை மட்டும்',
    editor: 'பதிவு செய்பவர்',
    dashboard: 'டாஷ்போர்டு',
    my_health_record: 'சுகாதார வரலாறு',
    appointments: 'சந்திப்பை பதிவு செய்ய',
    referrals: 'மற்றொரு மருத்துவமனைக்கு அனுப்ப',
    test_results: 'பரிசோதனை முடிவுகள்',
    medicines: 'மருந்துகளை சரிபார்க்க',
    follow_ups: 'அடுத்த பரிசோதனை',
    notifications: 'அறிவிப்புகள்',
    profile: 'சுயவிவரம்',
    patients: 'நோயாளிகள் பட்டியல்',
    register_patient: 'புதிய நோயாளியை சேர்க்க',
    triage: 'ஆபத்தை சரிபார்க்க',
    services: 'சுகாதார மையங்கள்',
    facility_performance: 'சுகாதார மையங்கள் மேலோட்டம்',
    referral_analytics: 'பரிந்துரை கண்காணிப்பு',
    high_risk_monitoring: 'அதிக ஆபத்து பராமரிப்பு',
    reports: 'சுகாதார அறிக்கைகள்',
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன் பஃபர்',
    pending_sync: 'ஒத்திசைவு நிலுவை',
    sync_now: 'இப்போது ஒத்திசைக்கவும்',
    call_108: '108 அவசர அழைப்பு',
    switch_demo_user: 'பயனர் கணக்கை மாற்றுக',
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
    medical_disclaimer: 'இது ஒரு முடிவு ஆதரவு கருவி மட்டுமே, மருத்துவரின் நோயறிதலுக்கு மாற்றாகாது.',
    find_nearby_hospital: 'அருகிலுள்ள மருத்துவமனையைக் கண்டறியவும்',
    talk_to_doctor_online: 'மருத்துவருடன் ஆன்லைனில் பேசவும்',
    pregnancy_care: 'கர்ப்பகால பராமரிப்பு',
    child_care: 'குழந்தை பராமரிப்பு',
    longterm_care: 'நீண்டகால சுகாதார பராமரிப்பு',
    get_emergency_help: 'அவசர உதவி பெறவும்',
    book_test: 'பரிசோதனை பதிவு செய்ய'
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
