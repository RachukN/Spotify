import React, {  useEffect } from 'react';
import './SubscriptionPage.css';
import Frame217 from './Images/Frame 217.png';
import Frame218 from './Images/Frame 218.png';
import Frame219 from './Images/Frame 219.png';
import PlusIcon from './Images/Frame 210.png';
import Frame216 from './Images/Frame 72.png';
import Sidebar from '../Sidebar/Sidebar';
import Logo from './Images/Group.png';
import Edit from './Images/edit.png';
import History from './Images/Frame 211.png';
import Saved from './Images/Frame 212.png';
import Salled from './Images/Frame 213.png';
import Change from './Images/Frame 214.png';
import Bods from './Images/Frame 215.png';
import Bell from './Images/Frame 216.png';
import Pyt from './Images/Frame 220.png';
import Night from './Images/Frame 288.png';
import Logo2 from './Images/Group (2).png';
import TopNavigation from '../Navigation/TopNavigation';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const SubscriptionPage: React.FC = () => {
    const { language } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    

    return (
        <div className={`subscription-page ${isDarkMode ? 'dark' : 'light'}`}>
          <Sidebar />
          <TopNavigation />
    
          <div className={`subscription-header ${isDarkMode ? 'dark-header' : 'light-header'}`}>
            <h3 className={`plan ${isDarkMode ? 'dark' : 'light'}`}>{language.yourPlan}</h3>
            <h1 className="plan-title">SymphoNix PREMIUM</h1>
            <span>
              <span className="logo">
                <img src={Logo2} alt="Support" />
              </span>
            </span>
          </div>
    
          <div className={`section ${isDarkMode ? 'dark-section' : 'light-section'}`}>
            <h2 className={`sectio-h2 ${isDarkMode ? 'dark' : 'light'}`}>{language.account}</h2>
            <Link to={`/profile`} className={`dark ${isDarkMode ? 'dark' : 'light'}`}>
              <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
                <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                  <img src={Logo} alt="Manage Subscription" />
                </span>
                <span className="left">{language.manageSubscription}</span>
                <span className="right">
                  <img src={Frame216} alt="Right Arrow" />
                </span>
              </div>
            </Link>
            <Link to={`/editprofile`} className={`dark ${isDarkMode ? 'dark' : 'light'}`}>
              <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
                <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                  <img src={Edit} alt="Edit Profile" />
                </span>
                <span className="left">{language.editProfile}</span>
                <span className="right">
                  <img src={Frame216} alt="Right Arrow" />
                </span>
              </div>
            </Link>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={PlusIcon} alt="Restore Playlists" />
              </span>
              <span className="left">{language.restorePlaylists}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
          </div>
    
          <div className={`section ${isDarkMode ? 'dark-section' : 'light-section'}`}>
            <h2 className={`sectio-h2 ${isDarkMode ? 'dark' : 'light'}`}>{language.payment}</h2>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={History} alt="Order History" />
              </span>
              <span className="left">{language.orderHistory}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Saved} alt="Saved Payment Cards" />
              </span>
              <span className="left">{language.savedCards}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Salled} alt="Redeem" />
              </span>
              <span className="left">{language.redeem}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
          </div>
    
          <div className={`section ${isDarkMode ? 'dark-section' : 'light-section'}`}>
            <h2 className={`sectio-h2 ${isDarkMode ? 'dark' : 'light'}`}>{language.securityPrivacy}</h2>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Change} alt="Change Password" />
              </span>
              <span className="left">{language.changePassword}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Bods} alt="Manage Apps" />
              </span>
              <span className="left">{language.manageApps}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Bell} alt="Notification Settings" />
              </span>
              <span className="left">{language.notificationSettings}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Frame217} alt="Privacy Settings" />
              </span>
              <span className="left">{language.privacySettings}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Frame218} alt="Edit Login Methods" />
              </span>
              <span className="left">{language.editLoginMethods}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Frame219} alt="Log Out Everywhere" />
              </span>
              <span className="left">{language.logOutEverywhere}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
          </div>
    
          <div className={`section ${isDarkMode ? 'dark-section' : 'light-section'}`}>
            <h2 className={`sectio-h2 ${isDarkMode ? 'dark' : 'light'}`}>{language.help}</h2>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Pyt} alt="Support" />
              </span>
              <span className="left">{language.support}</span>
              <span className="right">
                <img src={Frame216} alt="Right Arrow" />
              </span>
            </div>
            <div className={`section-item ${isDarkMode ? 'dark-item' : 'light-item'}`}>
              <span className={`frame ${isDarkMode ? 'dark' : 'light'}`}>
                <img src={Night} alt="Dark Theme" />
              </span>
              <span className="left">{language.appearance}</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="dark-mode"
                  className="toggle-checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <label htmlFor="dark-mode" className="toggle-label"></label>
              </div>
            </div>
          </div>
          <div className="footers">
            <Footer />
          </div>
        </div>
      );
};

export default SubscriptionPage;
