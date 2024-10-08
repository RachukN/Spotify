// src/components/Artists.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from '../Main/Images/Frame 73.png';
import Right from '../Main/Images/Frame 72.png';
import '../../styles/Music.css';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchArtists = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // List of artist IDs
        const artistIds = [
          '2CIMQHirSU0MQqyYHq0eOx', '57dN52uHvrHOxijzpIgu3E', '1vCWHaC5f2uS3yhpwWbIA6',
          '6eUKZXaKkcviH0Ku9w2n3V', '3TVXtAsR1Inumwj472S9r4', '66CXWjxzNUsdJxJ2JdwvnR',
          '4q3ewBCX7sLwd24euuV69X', '7dGJo4pcD2V6oG8kP0tJRR', '5K4W6rqBFWDnAN6FQUkS6x',
          '3WrFJ7ztbogyGnTHbHJFl2', '3Nrfpe0tUJi4K4DXYWgMUX', '1dfeR4HaWDbWqFHLkxsg1d',
          '1Xyo4u8uXC1ZmMpatF05PJ', '6vWDO969PvNqNYHIOW5v0m', '5KNNVgR6LBIABRIomyCwKJ',
          '0du5cEVh5yTK9QJze8zA0C', '1HY2Jd0NmPuamShAr6KMms', '1KCSPY1glIKqW2TotWuXOR',
          '5cj0lLjcoR7YOSnhnX0Po5', '7jy3rLJdDQY21OgRLCZ9sD'
        ].join(',');

        const response = await axios.get(`https://api.spotify.com/v1/artists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: artistIds,
          },
        });

        if (response.status === 200 && response.data.artists) {
          setArtists(response.data.artists);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching artists:', error?.response || error.message || error);
        setError('An error occurred while fetching artists.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return <div>Loading artists...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (artists.length === 0) {
    return <div>No artists available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={Left} alt="Scroll Left" className="  img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className="  img-r" onClick={scrollRight} />

          <div
            ref={scrollRef}
            className='music-c'
            style={{
              width: '1100px',
              overflowX: 'hidden',
              display: 'flex',
              gap: '20px',
              padding: '10px 0',
              scrollBehavior: 'smooth',
            }}
          >
            {artists.map((artist) => (
              <div
                key={artist.id}
                style={{
                  minWidth: '140px',
                  textAlign: 'center',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
              >
                <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {artist.images.length > 0 && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      style={{ width: '140px', height: '140px', borderRadius: '50%' }} // Circular image
                    />
                  )}
                  <p className='auth' style={{ margin: '10px 0' }}>{artist.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>{language.performer}</p> {/* Subtitle */}
                </a>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Artists;
