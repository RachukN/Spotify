import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (2).png';
import LeftGreen from '../Main/Images/Frame 73 (2).png';
import RightGreen from '../Main/Images/Frame 72.png';
import '../../styles/Music.css';
import { useTheme } from '../../services/ThemeContext';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface SpotifyContentListArtistProps {
  artists: Artist[];
  title: string;
}

const SpotifyContentListArtist: React.FC<SpotifyContentListArtistProps> = ({ artists, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leftArrow, setLeftArrow] = useState(LeftGray);
  const [rightArrow, setRightArrow] = useState(RightGreen);
  const { isDarkMode } = useTheme();

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setLeftArrow(scrollLeft === 0 ? LeftGray : LeftGreen);
      setRightArrow(scrollLeft + clientWidth >= scrollWidth - 1 ? RightGray : RightGreen);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
      setTimeout(updateArrows, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
      setTimeout(updateArrows, 300);
    }
  };

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={leftArrow} alt="Scroll Left" className="img-l" onClick={scrollLeft} />
          <img src={rightArrow} alt="Scroll Right" className="img-r" onClick={scrollRight} />
          <div className={`main-title ${isDarkMode ? 'dark' : 'light'}`}>
            {title}
          </div>
          <div ref={scrollRef} className='music-c' onScroll={updateArrows}>
            {artists.map((artist, index) => (
              <div key={`${artist.id}-${index}`} className="img-container">
                <div className='img-content'>
                  <img
                    src={artist.images[0]?.url || 'default-artist.png'}
                    alt={artist.name}
                    className='m-5-artist'
                    style={{ borderRadius: '50%', width: '140px', height: '140px' }} // Circular artist image
                  />
                </div>
                <div className="hover">
                  <Link to={`/artist/${artist.id}`} >
                    <span className={`auth ${isDarkMode ? 'dark' : 'light'}`} style={{ margin: '10px 0', cursor: 'pointer' }}>
                      {artist.name.length > 16 ? `${artist.name.substring(0, 12)}...` : artist.name}
                    </span>
                  </Link>
                </div>
                <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>Виконавець</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyContentListArtist;
