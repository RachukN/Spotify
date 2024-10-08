import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import bannerImage from './Images/Rectangle 4.png';
import './Mainpage.css'; // Styling for the main page and sidebar
import RockMusic from '../Templates/RockMusic';
import Shows from '../Templates/Shows';
import NewReleases from '../Templates/NewReleases';
import SymphoNixAlbums from '../Templates/SymphoNixAlbums';
import PopularAlbums from '../Templates/PopularAlbums';
import PopularRadio from '../Templates/PopularRadio';
import Footer from '../Footer/Footer';
import Filter from '../Navigation/Filter';
import NewTracks from '../Templates/NewTrack';
import TopArtists from '../Templates/TopArtists';
import LoadingPageWithSidebar from '../Loading/LoadingPage';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const MainPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all'); // Track the current filter ("all", "music", etc.)
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
 
  useEffect(() => {
    // Check if the page has been reloaded once already
    const isHomeReloaded = localStorage.getItem('isHomeReloaded');

    if (!isHomeReloaded) {
      // Set the flag in localStorage to avoid further reloads
      localStorage.setItem('isHomeReloaded', 'true');
      // Reload the page
      window.location.reload();
    } else {
      // Show the loading screen for 1 second
      setTimeout(() => {
        setLoading(false); // Hide the loading screen after 1 second
      }, 300);
    }
  }, []);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter); // Update the filter state when a new filter is selected
  };

  if (loading) {
    return <div><LoadingPageWithSidebar /></div>;
  }

  return (

    <div className={`main-container ${isDarkMode ? 'dark' : 'light'}`}>

      <div className='sidebar'><Sidebar  /></div>
      
      <div className={`content ${isDarkMode ? 'dark' : 'light'}`}>
  
        <div className="banner-container">
          <img src={bannerImage} alt="Banner" className="banner-image" />
        </div>

        <div className='cont'>
          <RockMusic />
        </div>

        <div className='cont'>
          <TopArtists />
        </div>

        {/* Only show this section when filter is "all" */}
        {filter === 'all' && (
          <div className='cont'>
            <h2 className={`section-title ${isDarkMode ? 'dark' : 'light'}`}>{language.showsToWatch}</h2>
            <Shows />
          </div>
        )}

        <div className='cont'>
          <NewReleases />
        </div>

        <div className='cont'>
          <NewTracks />
        </div>

        <div className='cont'>
           <h2 className={`section-title ${isDarkMode ? 'dark' : 'light'}`}>{language.topCharts}</h2>
            <SymphoNixAlbums />
        </div>

        <div className='cont'>
          <PopularAlbums />
        </div>

        <div className='cont'>
          <PopularRadio />
        </div>

        <div className='filter'><TopNavigation   /></div>
        <div className='filter-f'>
          <Filter onFilterChange={handleFilterChange} /> {/* Pass the handler to Filter */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
