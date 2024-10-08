import { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css'; // Ensure you have a CSS file for styling this form
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import TopNavigation from '../Navigation/TopNavigation';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext';

const EditProfile = () => {
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Жінка');
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState('Березень');
  const [year, setYear] = useState(2003);
  const [country, setCountry] = useState('Україна');
  const [region, setRegion] = useState('');
  const [userId, setUserId] = useState('');
  const { isDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();


  // Fetch the user profile on component mount

  useEffect(() => {
    const storedUserId = localStorage.getItem('spotifyUserId');
    const storedLanguage = localStorage.getItem('selectedLanguage'); // Restore language
    const storedCountry = localStorage.getItem('selectedCountry'); // Restore country
    const storedRegion = localStorage.getItem('selectedRegion'); // Restore region
  
    console.log("Restoring values from localStorage: ");
    console.log("Stored Language: ", storedLanguage);
    console.log("Stored Country: ", storedCountry);
    console.log("Stored Region: ", storedRegion);
  
    if (storedLanguage && ['uk', 'en', 'cz', 'de'].includes(storedLanguage)) {
      setLanguage(storedLanguage as 'uk' | 'en' | 'cz' | 'de'); // Restore language from localStorage
    }
  
    if (storedCountry) {
      setCountry(storedCountry); // Restore country from localStorage
    }
  
    if (storedRegion) {
      setRegion(storedRegion); // Restore region from localStorage
    }
  
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserProfile(storedUserId); // Fetch the user profile
    }
  }, [setLanguage]);
  
  
  
  
  


  const handleCountryChange = (selectedCountry: string) => {
    console.log("Selected country: ", selectedCountry);
    setCountry(selectedCountry);
    localStorage.setItem('selectedCountry', selectedCountry); // Persist the selected country
    
    let newLanguage: 'uk' | 'en' | 'cz' | 'de' = 'uk'; // Default to Ukrainian
    let newRegion = ''; // Default to empty string
    
    if (['США', 'Канада', 'Мексика'].includes(selectedCountry)) {
      newLanguage = 'en';
      newRegion = language.northAmerica; // Set region to North America
      console.log("Setting region to: ", newRegion);
    } else if (['Чехія', 'Німеччина', 'Україна'].includes(selectedCountry)) {
      newLanguage = selectedCountry === 'Чехія' ? 'cz' : selectedCountry === 'Німеччина' ? 'de' : 'uk';
      newRegion = language.europe; // Set region to Europe
      console.log("Setting region to: ", newRegion);
    }
    
    console.log("Changing language to: ", newLanguage);
    
    setLanguage(newLanguage); // Set language in state
    setRegion(newRegion); // Set region in state
    localStorage.setItem('selectedLanguage', newLanguage); // Persist the language to localStorage
    localStorage.setItem('selectedRegion', newRegion); // Persist the region to localStorage
  };
  
  
  
  
  

  const fetchUserProfile = async (id: string) => {
    try {
      const response = await axios.get(`https://localhost:5051/api/UserProfile/${id}`);
      const profile = response.data;
      setEmail(profile.email);
      setGender(profile.gender || 'Жінка');
      setDay(profile.birthDay || 1);
      setMonth(profile.birthMonth || 'Січень');
      setYear(profile.birthYear || 2000); // Restore country value
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };


  const handleSave = async () => {
    const updatedProfile = {
      gender,
      birthDay: day,
      birthMonth: month,
      birthYear: year,
      country,
      region,
    };

    try {
      await axios.put(`https://localhost:5051/api/UserProfile/${userId}`, updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className={`content ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar />
      <div className={`edit-profile ${isDarkMode ? 'dark' : 'light'}`}>
        <TopNavigation />
        <h2>{language.editProfileTitle || 'Редагувати профіль'}</h2>
        <form className={`edit-profile-form ${isDarkMode ? 'dark' : 'light'}`}>
          <label className={`ch ${isDarkMode ? 'dark' : 'light'}`} htmlFor="email">
            {language.email || 'Електронна пошта'}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />

          <label>{language.genderAndBirthDate || 'Стать та дата народження'}</label>
          <div className="row">
            <select className={`chol ${isDarkMode ? 'dark' : 'light'}`} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="woman">{language.woman}</option>
              <option value="man">{language.man}</option>
              <option value="nonBinary">{language.nonBinary}</option>
              <option value="preferNotToSay">{language.preferNotToSay}</option>
              <option value="other">{language.other}</option>
            </select>
            <select className={`chol ${isDarkMode ? 'dark' : 'light'}`} value={day} onChange={(e) => setDay(parseInt(e.target.value))}>
              {[...Array(31).keys()].map((d) => (
                <option key={d + 1} value={d + 1}>
                  {d + 1}
                </option>
              ))}
            </select>
            <select className={`chol ${isDarkMode ? 'dark' : 'light'}`} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="january">{language.january}</option>
              <option value="february">{language.february}</option>
              <option value="march">{language.march}</option>
              <option value="april">{language.april}</option>
              <option value="may">{language.may}</option>
              <option value="june">{language.june}</option>
              <option value="july">{language.july}</option>
              <option value="august">{language.august}</option>
              <option value="september">{language.september}</option>
              <option value="october">{language.october}</option>
              <option value="november">{language.november}</option>
              <option value="december">{language.december}</option>
            </select>
            <select className={`chol ${isDarkMode ? 'dark' : 'light'}`} value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
              {Array.from({ length: 100 }, (_, i) => 2024 - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="country">{language.country || 'Країна'}</label>
          <select
            className={`ch ${isDarkMode ? 'dark' : 'light'}`}
            id="country"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="Україна">{language.ukraine}</option>
            <option value="США">{language.usa}</option>
            <option value="Канада">{language.canada}</option>
            <option value="Мексика">{language.mexico}</option>
            <option value="Чехія">{language.czechRepublic}</option>
            <option value="Німеччина">{language.germany}</option>
          </select>




          <label htmlFor="region">{language.region || 'Регіон'}</label>
          <input
  id="region"
  value={region}
  onChange={(e) => setRegion(e.target.value)}
  disabled
/>

          <div className="buttons">
            <button type="button" className={`cancel-button ${isDarkMode ? 'dark' : 'light'}`}>
              {language.cancel || 'Скасувати'}
            </button>
            <button type="button" className="save-button" onClick={handleSave}>
              {language.saveProfile || 'Зберегти профіль'}
            </button>
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
};

export default EditProfile;
