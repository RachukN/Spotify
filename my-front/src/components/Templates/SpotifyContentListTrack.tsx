import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import Play from '../../images/Frame 76.png';
import '../../styles/Music.css';

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] }; // For tracks, images come from the album object
  artists: { name: string, id: string }[];
  uri: string;
}

interface SpotifyContentListProps {
  items: Track[];
  handlePlay: (uri: string) => void;
  title: string;
}

const SpotifyContentListTrack: React.FC<SpotifyContentListProps> = ({ items, handlePlay, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leftArrow, setLeftArrow] = useState(LeftGray);
  const [rightArrow, setRightArrow] = useState(RightGreen);

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
          <div className='main-title'>{title}</div>

          <div ref={scrollRef} className='music-c' onScroll={updateArrows}>
            {items.map((track, index) => (
              <div key={`${track.id}-${index}`} className="img-container">
                <div className='img-content'>
                  <img
                    src={track.album.images[0]?.url || 'default-image.png'}
                    alt={track.name}
                    className='m-5'
                  />
                  <div onClick={() => handlePlay(track.uri)} className="play-icon">
                    <img src={Play} alt="Play" />
                  </div>
                </div>
                <div>
                  <p>
                    <Link to={`/track/${track.id}`}>
                      <span className="auth" style={{ margin: '10px 0', cursor: 'pointer' }}>
                        {track.name.length > 16 ? `${track.name.substring(0, 12)}...` : track.name}
                      </span>
                    </Link>
                  </p>
                  <p className='artist-name' style={{ fontSize: 'small' }}>
                    {track.artists.map(artist => (
                      <Link key={artist.id} to={`/artist/${artist.id}`}>
                        <span className="result-name" style={{ cursor: 'pointer' }}>
                          {artist.name}
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

export default SpotifyContentListTrack;