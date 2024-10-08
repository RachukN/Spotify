// src/components/PublicPlaylists.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListPlaylist from './SpotifyContentListPlaylist'; // Import the reusable component
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const PublicPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { language } = useLanguage();
  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`https://api.spotify.com/v1/browse/featured-playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: 'US',
            limit: 20, // Fetch 20 public playlists
          },
        });

        if (response.status === 200 && response.data.playlists.items) {
          setPlaylists(response.data.playlists.items);
        } else {
          setError('Unexpected response format from Spotify API.');
        }
      } catch (error: any) {
        console.error('Error fetching public playlists:', error?.response || error.message || error);
        setError('An error occurred while fetching public playlists.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlay = (uri: string) => {
    console.log(`Playing playlist with URI: ${uri}`);
    // Implement the play logic or pass the function to Spotify's playback endpoint
  };

  if (loading) {
    return <div><LoadingTrackAlbum /></div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <SpotifyContentListPlaylist
      items={playlists} // Pass the playlist data
      handlePlay={handlePlay} // Pass the play function
      title={language.publicPlaylists}
    />
  );
};

export default PublicPlaylists;
