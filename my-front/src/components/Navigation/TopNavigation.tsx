import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNavigation.css';
import Bell from '../Main/Images/Bell.png';
import User from '../Main/Images/user-128.png'; // Your user image
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

// Add the isDarkMode prop and the function to toggle the theme


const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [dropdownActive, setDropdownActive] = useState(false);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
   

  const handleAccountClick = () => {
    navigate('/profileseting'); // Redirect to the account page
  };

  const handleProfileClick = () => {
    navigate('/userprofile'); // Redirect to the user profile page
  };

  const handleLogoutClick = () => {
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <div className={`top-navigation ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="nav-left">
        {/* Add other left-side navigation items here */}
      </div>
      <div className="nav-right">
        {/* Theme Toggle Button */}
       

        <img src={Bell} alt="Bell" className="icon" />
        <div
          className="profile-container"
          onMouseEnter={() => setDropdownActive(true)}
          onMouseLeave={() => setDropdownActive(false)}
        >
          <img
            src={User}
            alt="User"
            className="icon profile-icon"
            style={{ cursor: 'pointer' }}
          />
          <div className={`user-dropdown ${dropdownActive ? 'active' : ''}`}>
          <a onClick={handleAccountClick}>{language.account}</a>
      <a onClick={handleProfileClick}>{language.profile}</a>
      <hr />
      <a onClick={handleLogoutClick}>{language.logout}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
