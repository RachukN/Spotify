import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListArtist from '../Templates/SpotifyContentListArtist'; // Import the reusable component
import LoadingArtists from '../Loading/LoadingArtists'; // Import the loading component
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

// Define the Artist interface used across both components
interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
  uri: string; // Add the missing `uri` field
}

const FollowedArtists: React.FC = () => {
  // Set the type for the artists state as an array of Artist objects
  const [artists, setArtists] = useState<Artist[]>([]); // Explicitly define the type as Artist[]
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(''); // State to capture any errors
  const { language } = useLanguage();
  
  useEffect(() => {
    const fetchFollowedArtists = async () => {
      const token = localStorage.getItem('spotifyAccessToken'); // Get the Spotify access token from localStorage
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        let fetchedArtists: Artist[] = []; // Define the correct type for fetched artists
        let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist&limit=20';

        // Fetch followed artists, handling pagination if necessary
        while (nextUrl) {
          const response = await axios.get(nextUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200 && response.data.artists) {
            fetchedArtists = [...fetchedArtists, ...response.data.artists.items];
            nextUrl = response.data.artists.next; // Get the next page URL
          } else {
            setError('Unexpected response format from Spotify API.');
            break;
          }
        }

        setArtists(fetchedArtists); // Set the retrieved artist data
      } catch (error: any) {
        setError(`An error occurred while fetching followed artists: ${error.message}`);
      } finally {
        setLoading(false); // Set loading to false after the request finishes
      }
    };

    fetchFollowedArtists(); // Call the function when the component mounts
  }, []);

  if (loading) {
    return <div><LoadingArtists /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <SpotifyContentListArtist artists={artists} title={language.subscribedArtists} />
    </div>
  );
};

export default FollowedArtists;
