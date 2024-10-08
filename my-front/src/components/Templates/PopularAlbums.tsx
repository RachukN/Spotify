import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListAlbum from './SpotifyContentListAlbum';
import { handlePlayAlbum } from '../../utils/SpotifyPlayer';
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

// Define the Album interface based on Spotify's API structure
interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string, id: string }[];
  uri: string;
}

const PopularAlbums: React.FC = () => {
  // Explicitly define the state as an array of Album objects
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { language } = useLanguage();
  useEffect(() => {
    const fetchPopularAlbums = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        // Fetch popular artists' albums
        const popularArtists = '1Xyo4u8uXC1ZmMpatF05PJ,6eUKZXaKkcviH0Ku9w2n3V,4NHQUGzhtTLFvgF5SZesLK,1vCWHaC5f2uS3yhpwWbIA6';

        const response = await axios.get(`https://api.spotify.com/v1/artists`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ids: popularArtists,
          },
        });

        const artistData = response.data.artists;

        // Get albums from the popular artists
        const albumPromises = artistData.map(async (artist: any) => {
          const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              include_groups: 'album', // Only fetch albums
              limit: 10,
            },
          });
          return albumsResponse.data.items;
        });

        const albumResults = await Promise.all(albumPromises);
        const flattenedAlbums = albumResults.flat();

        // Explicitly set the albums as an array of Album
        setAlbums(flattenedAlbums);
      } catch (err) {
        setError('An error occurred while fetching popular albums.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAlbums();
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
      title={language.popularAlbums}
    />
  );
};

export default PopularAlbums;
