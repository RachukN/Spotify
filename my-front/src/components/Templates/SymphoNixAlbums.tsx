import React, { useRef } from 'react';
import '../../styles/Music.css';

// Імпортуйте зображення альбомів
import Album1 from '../../images/Rectangle 2.png';
import Album2 from '../../images/Rectangle 2 (1).png';
import Album3 from '../../images/Rectangle 2 (2).png';
import Album4 from '../../images/Rectangle 2 (3).png';
import Album5 from '../../images/Rectangle 2 (4).png';
import Album6 from '../../images/Rectangle 2 (5).png';
import Album7 from '../../images/Rectangle 2 (6).png';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const SymphoNixAlbums: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const albums = [
    { src: Album1, title: language.viral },
    { src: Album2, title: language.rapTop },
    { src: Album3, title: language.hipHopTop },
    { src: Album4, title: language.top50Ukraine },
    { src: Album5, title: language.top100World },
    { src: Album6, title: language.top50World },
    { src: Album7, title: language.topSongsWorld },
  ];

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            ref={scrollRef}
            className='music-c'
            style={{
              marginTop:'-20px',
              width: '1100px',
              overflowX: 'hidden',
              display: 'flex',
              gap: '20px',
              padding: '10px 0',
              scrollBehavior: 'smooth',
            }}
          >
            {albums.map((album, index) => (
              <div
                key={index}
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  display: 'inline-block',
                }}
              >
                <img
                  src={album.src}
                  alt={album.title}
                  style={{ width: '140px', height: '140px', borderRadius: '5%' }} // Зображення зроблено круглим
                />
                <p className='auth' style={{ margin: '10px 0' }}>{album.title}</p>
                <p style={{ fontSize: 'small', color: '#666' }}>SymphoNix</p> {/* Додає текст "SymphoNix" */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymphoNixAlbums;
