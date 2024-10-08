import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListArtist from './SpotifyContentListArtist'; // The component you created
import LoadingArtists from '../Loading/LoadingArtists';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const TopArtists: React.FC = () => {
  const [artists, setArtists] = useState([]); // State to hold artist data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(''); // State to capture any errors
  const { language } = useLanguage();
  useEffect(() => {
    const fetchTopArtists = async () => {
      const token = localStorage.getItem('spotifyAccessToken'); // Get the Spotify access token from localStorage
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
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
          headers: { Authorization: `Bearer ${token}` },
          params: { ids: artistIds },
        });

        setArtists(response.data.artists); // Set the retrieved artist data
      } catch (error) {
        setError('An error occurred while fetching artists.');
      } finally {
        setLoading(false); // Set loading to false after the request finishes
      }
    };

    fetchTopArtists(); // Call the function when the component mounts
  }, []);

  if (loading) {
    return <div><LoadingArtists/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <SpotifyContentListArtist artists={artists} title={language.popularArtists} />
    </div>
  );
};

export default TopArtists;


