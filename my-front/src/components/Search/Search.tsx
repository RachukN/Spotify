import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import SearchBar from './SearchBar';
import Categories from './Categories';
import { useTheme } from '../../services/ThemeContext';

const Search: React.FC = () => {
  const { isDarkMode } = useTheme();
 
    return (
        <div className="main-container">
      
      <div className='sidebar'><Sidebar  /></div>
      <div  className={` content ${isDarkMode ? 'dark' : 'light'}`}
      >
      <div className='cont' >
      <Categories/>
      <Footer />
      
      </div>
      </div>
      <div className='filter'><TopNavigation/></div>
      <div className='filter-f'><SearchBar /></div>
     
      </div>
    );
};

export default Search;
