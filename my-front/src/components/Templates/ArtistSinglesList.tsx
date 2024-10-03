import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import '../../styles/Music.css';
import { useTheme } from '../../services/ThemeContext';

interface Single {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
  uri: string;
}

interface ArtistSinglesListProps {
  singles: Single[];
  handlePlayAlbum: (uri: string) => void;
}

const ArtistSinglesList: React.FC<ArtistSinglesListProps> = ({ singles, handlePlayAlbum }) => {
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
    <div className="cont-sa">
      <div style={{ position: "relative", width: "100%" }}>
        <img src={leftArrow} alt="Scroll Left" className="img-l" onClick={scrollLeft} />
        <img src={rightArrow} alt="Scroll Right" className="img-r" onClick={scrollRight} />
        <div ref={scrollRef} className="music-c" onScroll={updateArrows}>
          {singles.map((single) => (
            <div key={single.id} className="img-container">
              <div className="img-content">
                <img
                  src={single.images[0]?.url || "default-single.png"}
                  alt={single.name}
                  className="m-5m"
                />
                <div onClick={() => handlePlayAlbum(single.uri)} className="play-icona">
                  <img src={Play} alt="Play" />
                </div>
                <div className="hover">
                <Link to={`/album/${single.id}`} >
                  <span className={`auth ${isDarkMode ? 'dark' : 'light'}`} style={{ margin: '10px 0', cursor: 'pointer' }}>
                    {single.name.length > 16 ? `${single.name.substring(0, 12)}...` : single.name}
                  </span>
                </Link>
                </div>
                <p className="release-date">{single.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistSinglesList;
