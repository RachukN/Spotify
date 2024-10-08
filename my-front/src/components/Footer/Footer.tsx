import React from 'react';
import './Footer.css'; // Your existing styles for the Footer component
import FacebookIcon from '../../images/Frame 165.png'; // Replace with the correct path
import TwitterIcon from '../../images/Frame 169.png';  // Replace with the correct path
import InstagramIcon from '../../images/Frame 170.png'; // Replace with the correct path
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook


// Add the isDarkMode prop to the Footer component


const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
   
 
  return (
    <footer className={`footer ${isDarkMode ? 'footer-dark' : 'footer-light'}`}>
      <div className="footer-container">
        <div className="footer-column">
          <h3 className={isDarkMode ? 'footer-title-dark' : 'footer-title-light'}>
            {language.company}
          </h3>
          <ul>
            <li>{language.aboutUs}</li>
            <li>{language.careers}</li>
            <li>{language.forArtists}</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className={isDarkMode ? 'footer-title-dark' : 'footer-title-light'}>
            {language.forListeners}
          </h3>
          <ul>
            <li>{language.getStarted}</li>
            <li>{language.faq}</li>
            <li>{language.updatesNews}</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className={isDarkMode ? 'footer-title-dark' : 'footer-title-light'}>
            {language.usefulLinks}
          </h3>
          <ul>
            <li>{language.support}</li>
            <li>{language.mobileApp}</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className={isDarkMode ? 'footer-title-dark' : 'footer-title-light'}>
            {language.symphoNixSubscriptions}
          </h3>
          <ul>
            <li>{language.premiumIndividual}</li>
            <li>{language.premiumDuo}</li>
            <li>{language.premiumFamily}</li>
            <li>{language.premiumStudent}</li>
            <li>{language.symphoNixFree}</li>
          </ul>
        </div>
        <div className="footer-icons">
          <img src={InstagramIcon} alt="Instagram" />
          <img src={TwitterIcon} alt="Twitter" />
          <img src={FacebookIcon} alt="Facebook" />
        </div>
      </div>
      <div className="border"></div>
      <div className={`footer-bottom ${isDarkMode ? 'footer-bottom-dark' : 'footer-bottom-light'}`}>
        <p>© 2024 SymphoNix</p>
      </div>
    </footer>
  );
};

export default Footer;
