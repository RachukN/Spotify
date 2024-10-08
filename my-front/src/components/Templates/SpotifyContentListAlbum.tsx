import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (2).png';
import LeftGreen from '../Main/Images/Frame 73 (2).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import '../../styles/Music.css';
import { useTheme } from '../../services/ThemeContext';


interface SpotifyItem {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string, id: string }[];
  uri: string;
}

interface SpotifyContentListProps {
  items: SpotifyItem[];
  handlePlay: (uri: string) => void;
  title: string;
}

const SpotifyContentListAlbum: React.FC<SpotifyContentListProps> = ({ items, handlePlay, title }) => {
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
          <img src={leftArrow} alt="Scroll Left" className={`img-l ${isDarkMode ? 'dark' : 'light'}`} onClick={scrollLeft} />
          <img src={rightArrow} alt="Scroll Right" className={`img-r ${isDarkMode ? 'dark' : 'light'}`} onClick={scrollRight} />
          <div className={`main-title ${isDarkMode ? 'dark' : 'light'}`}
          >{title}</div>
          <div ref={scrollRef} className='music-c' onScroll={updateArrows}>
            {items.map((item) => (
              <div key={item.id} className="img-container">
                <div className='img-content'>
                  <img
                    src={item.images[0]?.url || 'default-image.png'}
                    alt={item.name}
                    className='m-5'
                  />
                  <div onClick={() => handlePlay(item.uri)} className="play-icon">
                    <img src={Play} alt="Play" />
                  </div>
                </div>
                <div>
                <div className="hover">
                    <Link to={`/album/${item.id}`}>
                      <span className={`auth ${isDarkMode ? 'dark' : 'light'}`} style={{ margin: '10px 0', cursor: 'pointer' }}>
                       
                      {item.name.length > 16 ? `${item.name.substring(0, 12)}...` : item.name}
                      </span>
                    </Link>
                  </div>
                  <p className='artist-name' style={{ fontSize: 'small' }}>
                    {item.artists.map(artist => (
                      <Link key={artist.id} to={`/artist/${artist.id}`}>
                        <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`} style={{ cursor: 'pointer' }}>
                        {artist.name.length > 16 ? `${artist.name.substring(0, 12)}. ..` : artist.name}
                        </span>
                      </Link>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyContentListAlbum;
