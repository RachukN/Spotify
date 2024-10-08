import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListAlbum from './SpotifyContentListAlbum';
import { handlePlayAlbum } from '../../utils/SpotifyPlayer';
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const NewReleases: React.FC = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { language } = useLanguage();
  useEffect(() => {
    const fetchNewReleases = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
          headers: { Authorization: `Bearer ${token}` },
          params: { market: 'US', limit: 21 },
        });

        setAlbums(response.data.albums.items);
      } catch (err) {
        setError('An error occurred while fetching new releases.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) {
    return <div><LoadingTrackAlbum/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SpotifyContentListAlbum
      items={albums}
      handlePlay={handlePlayAlbum}
      title={language.newForYou}
    />
  );
};

export default NewReleases;
