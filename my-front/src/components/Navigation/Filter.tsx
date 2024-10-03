import React, { useState } from 'react';
import './Filter.css';
import { useTheme } from '../../services/ThemeContext';
interface FilterProps {
  onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all'); // Track active button
  const { isDarkMode } = useTheme();
  // Handle button click
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter); // Set the clicked button as active
    onFilterChange(filter); // Trigger the filter change in the parent
  };

  return (
   
      <div className={`top-navigation ${isDarkMode ? 'dark' : 'light'}`}>
    
      <div className={`nav-left ${isDarkMode ? 'dark' : 'light'}`}>
    
        <button
          className={`nav-button  ${activeFilter === 'all' ? 'active' : ''}`} // Apply 'active' class if 'all' is selected
          onClick={() => handleFilterClick('all')}
        >
          Усе
        </button>
        <button
          className={`nav-button ${activeFilter === 'music' ? 'active' : ''}`} // Apply 'active' class if 'music' is selected
          onClick={() => handleFilterClick('music')}
        >
          Музика
        </button>
      </div>
    </div>
  );
};

export default Filter;
