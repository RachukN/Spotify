import React, { createContext, useState, useContext, ReactNode } from 'react';
import { languages } from './languageService';

interface LanguageContextProps {
  language: typeof languages.uk; // Use the type of the default language
  setLanguage: (lang: keyof typeof languages) => void;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextProps>({
  language: languages.uk,
  setLanguage: () => {},
});

// Define the props for the LanguageProvider component
interface LanguageProviderProps {
  children: ReactNode;
}

// Create a provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage ? languages[savedLanguage as keyof typeof languages] : languages.uk;
  });

  const setLanguage = (lang: keyof typeof languages) => {
    setLanguageState(languages[lang]);
    localStorage.setItem('selectedLanguage', lang); // Store in localStorage
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
