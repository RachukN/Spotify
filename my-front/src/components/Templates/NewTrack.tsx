import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyContentListTrack from './SpotifyContentListTrack'; // Use the track list component
import { handlePlayTrackList } from '../../utils/SpotifyPlayer'; // Import the new function
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum';

const NewTracks: React.FC = () => {
  const [tracks, setTracks] = useState([]); // Store tracks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewTracks = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 21 },
        });

        setTracks(response.data.items.map((item: any) => item.track)); // Extract track info
      } catch (err) {
        setError('An error occurred while fetching new tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewTracks();
  }, []);

  // Collect the URIs for the tracks
  const trackUris = tracks.map((track: any) => track.uri);

  // Handle the play action for the entire list
  const handlePlay = (startUri: string) => {
    handlePlayTrackList(trackUris, startUri); // Play all tracks, starting from the clicked one
  };

  if (loading) {
    return <div><LoadingTrackAlbum/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SpotifyContentListTrack items={tracks} handlePlay={handlePlay} title="Нові треки для вас" />
  );
};

export default NewTracks;
