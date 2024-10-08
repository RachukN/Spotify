import React from 'react';
import { useLanguage } from './LanguageContext';
import { languages } from './languageService'; // Import the languages object

const LanguageSwitcher = () => {
  const { setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value as keyof typeof languages; // Type cast to ensure correct type
    if (selectedLanguage in languages) {
      setLanguage(selectedLanguage);
    }
  };

  return (
    <select onChange={handleLanguageChange}>
      <option value="uk">Українська</option>
      <option value="en">English</option>
      <option value="cz">Čeština</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LanguageSwitcher;
