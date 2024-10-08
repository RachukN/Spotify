// src/components/Shows.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../styles/Music.css';
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';
import { useTheme } from '../../services/ThemeContext';

interface Show {
  id: string;
  name: string;
  publisher: string;
  images: { url: string }[];
  external_urls: { spotify: string } | null;
}

const Shows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchShows = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        setLoading(true);
        // List of show IDs
        const showIds = [
          '5CfCWKI5pZ28U0uOzXkDHe', '5as3aKmN2k11yfDDDSrvaZ', '4rOoJ6Egrf8K2IrywzwOMk',
          '6k8o1zAIaawYZd4hFpFKjG', '3iGvn2pQEBxi8DTeYmUOwu', '7m9ZCy4ImoIk6I9XfYND7d',
          '2r43d4HpsHdHmdLRtPZnnQ', '0R9aeQBPFL8Je9r2DrtVKJ', '6SZvU8k3ohbwhu5MTUO8Ba',
          '1nEq4glJ1bAlzjszC4kQTa', '5AVZjkrP2f15m2LUzHjdYW', '7cSJFg9CF9laPYpqcKMRo9',
          '4jFMOpRJu4B9OS3Of99Ebo', '7pbMwEWEqf5RviV7w9el5v', '5zHcUjQRkRBpERn5cFhX8n',
          '1KGeB2uGG7DO8Mdi2wwA5i', '0SLq48sCX7lt7LyCWeaRP0', '4MdDXL7W2vMYxgAQzZdtqf',
          '2W4U3GCGedll7RZzTYxv4K', '4Uy8SLgG2HUZ55RTgoF7k4'
        ].join(',');

        const response = await axios.get(`https://api.spotify.com/v1/shows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: showIds,
            market: 'US',
          },
        });

        if (response.status === 200 && response.data.shows) {
          setShows(response.data.shows);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching shows:', error?.response || error.message || error);
        setError('An error occurred while fetching shows.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);



  if (loading) {
    return <div><LoadingTrackAlbum /></div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (shows.length === 0) {
    return <div>No shows available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>

          <div
            ref={scrollRef}
            className='music-c'
            style={{
              marginTop: '-20px',
              width: '1100px',
              overflowX: 'hidden',
              display: 'flex',
              gap: '20px',
              padding: '10px 0',
              scrollBehavior: 'smooth',
            }}
          >
            {shows.map((show) => {
              if (!show || !show.external_urls || !show.external_urls.spotify) {
                return null; // Skip if show data is incomplete
              }
              return (
                <div
                  key={show.id}
                  style={{
                    minWidth: '140px',
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                >
                  <a href={show.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    {show.images.length > 0 && (
                      <img
                        src={show.images[0].url}
                        alt={show.name}
                        style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                      />
                    )}
                    <p className={`auth ${isDarkMode ? 'dark' : 'light'}`}
                      style={{ margin: '10px 0' }}>{show.name}</p>
                    <p className={` result-name ${isDarkMode ? 'dark' : 'light'}`}
                    >{show.publisher}</p> {/* Show's publisher */}
                  </a>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shows;
