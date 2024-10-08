import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (2).png';
import LeftGreen from '../Main/Images/Frame 73 (2).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import '../../styles/Music.css';
import { useTheme } from '../../services/ThemeContext';


interface PlaylistItem {
  id: string;
  name: string;
  images: { url: string }[]; // Playlist cover image
  owner: { display_name: string }; // Playlist owner info
  uri: string;
}

interface SpotifyContentListProps {
  items: PlaylistItem[];
  handlePlay: (uri: string) => void;
  title: string;
}

const SpotifyContentListPlaylist: React.FC<SpotifyContentListProps> = ({ items, handlePlay, title }) => {
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
          <div className={`main-title ${isDarkMode ? 'dark' : 'light'}`}
          >{title}</div>
          <div ref={scrollRef} className='music-c' onScroll={updateArrows}>
            {items.map((item) => (
              <div key={item.id} className="img-container">
                <div className='img-content'>
                  <img
                    src={item.images[0]?.url || 'default-playlist.png'}
                    alt={item.name}
                    className='m-5'
                  />
                  <div onClick={() => handlePlay(item.uri)} className="play-icon">
                    <img src={Play} alt="Play" />
                  </div>
                </div>
                <div>
                  <div className="hover">
                    <Link to={`/playlist/${item.id}`}>
                    <span className={`auth ${isDarkMode ? 'dark' : 'light'}`} style={{ margin: '10px 0', cursor: 'pointer' }}>
                        {item.name.length > 16 ? `${item.name.substring(0, 12)}...` : item.name}
                      </span>
                    </Link>
                  </div>
                  <div className={`result-name ${isDarkMode ? 'dark' : 'light'}`} style={{ cursor: 'pointer' }}>
                    {item.owner.display_name.length > 16
                      ? `${item.owner.display_name.substring(0, 12)}...`
                      : item.owner.display_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyContentListPlaylist;
