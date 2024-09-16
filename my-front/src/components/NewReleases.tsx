import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Left from './Main/Frame 73.png';
import Right from './Main/Frame 72.png';
import Play from '../images/Frame 76.png';
import '../styles/Music.css';

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  external_urls: { spotify: string } | null;
  uri: string;
}

interface Device {
  id: string;
  is_active: boolean;
}

const NewReleases: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: 'US', // Adjust market as needed
            limit: 20,
          },
        });

        if (response.status === 200 && response.data.albums && response.data.albums.items) {
          setAlbums(response.data.albums.items);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching new releases:', error?.response || error.message || error);
        setError('An error occurred while fetching new releases.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  const getActiveDeviceId = async (): Promise<string | null> => {
    const token = localStorage.getItem('spotifyAccessToken');

    if (!token) {
      console.error('No access token found');
      return null;
    }

    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const devices: Device[] = response.data.devices;
      if (devices.length === 0) {
        console.error('No active devices found');
        return null;
      }

      const activeDevice = devices.find((device: Device) => device.is_active);
      return activeDevice ? activeDevice.id : devices[0].id;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return null;
    }
  };

  const handlePlayAlbum = async (albumUri: string) => {
    const token = localStorage.getItem('spotifyAccessToken');

    if (!token) {
      console.error('No access token found');
      return;
    }

    const deviceId = await getActiveDeviceId();
    if (!deviceId) {
      alert('Please open Spotify on one of your devices to start playback.');
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          context_uri: albumUri,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Album is playing');
    } catch (error: any) {
      console.error('Error playing album:', error?.response || error.message || error);
      if (error.response && error.response.status === 404) {
        // Retry logic for specific errors
        console.log('Retrying to connect player...');
        setTimeout(() => handlePlayAlbum(albumUri), 2000); // Retry after delay
      }
    }
  };

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
    return <div>Loading new releases...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (albums.length === 0) {
    return <div>No new releases available.</div>;
  }

  return (
    <div className='music-c'>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={Left} alt="Scroll Left" className="img-l" onClick={scrollLeft} />
          <img src={Right} alt="Scroll Right" className="img-r" onClick={scrollRight} />

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
            {albums.map((album) => {
              if (!album || !album.external_urls || !album.uri) {
                return null;
              }
              return (
                <div
                  key={album.id}
                  onClick={() => handlePlayAlbum(album.uri)}
                  className="img-container"
                  style={{
                    minWidth: '140px',
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <img
                    src={album.images[0]?.url || 'default-album.png'}
                    alt={album.name}
                    style={{ width: '140px', height: '140px', borderRadius: '8px' }}
                  />
                  <div className="play-icon">
                    <img src={Play} alt="Play" />
                  </div>
                  <p className='auth' style={{ margin: '10px 0' }}>{album.name}</p>
                  <p style={{ fontSize: 'small', color: '#666' }}>
                    {album.artists.map((artist) => artist.name).join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReleases;