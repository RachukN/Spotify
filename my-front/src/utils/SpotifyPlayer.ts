// src/utils/SpotifyPlayer.ts
import axios from 'axios';

interface Device {
  id: string;
  is_active: boolean;
}

// Function to get active device
export const getActiveDeviceId = async (): Promise<string | null> => {
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const handlePlayAlbum = async (albumUri: string, retryCount = 0) => {
  const token = localStorage.getItem('spotifyAccessToken');
  const deviceId = await getActiveDeviceId();

  if (!deviceId) {
    alert('No active device found, please start Spotify on one of your devices.');
    return;
  }

  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { context_uri: albumUri },
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
    if (error.response && error.response.status === 502 && retryCount < 3) {
      console.log('Retrying to connect player...');
      await delay(2000 * (retryCount + 1)); // Exponential backoff
      handlePlayAlbum(albumUri, retryCount + 1);
    }
  }
};



// Function to play a specific track
export const handlePlayTrack = async (trackUri: string) => {
  const token = localStorage.getItem('spotifyAccessToken');
  const deviceId = await getActiveDeviceId();

  if (!deviceId) {
    alert('No active device found, please start Spotify on one of your devices.');
    return;
  }

  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { uris: [trackUri] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Track is playing');
  } catch (error: any) {
    console.error('Error playing track:', error?.response || error.message || error);
    if (error.response && error.response.status === 502) {
      console.log('Retrying to connect player...');
      setTimeout(() => handlePlayTrack(trackUri), 2000); // Retry after delay
    }
  }
};

// Function to play an array of tracks in sequence
export const handlePlayTrackList = async (trackUris: string[], startUri?: string) => {
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
          uris: trackUris, // Pass the full list of tracks to Spotify
          offset: startUri ? { uri: startUri } : undefined, // Optionally start from a specific track
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Track list is playing');
    } catch (error: any) {
      console.error('Error playing track list:', error?.response || error.message || error);
      if (error.response && error.response.status === 404) {
        console.log('Retrying to connect player...');
        setTimeout(() => handlePlayTrackList(trackUris, startUri), 2000); // Retry after delay
      }
    }
  };
  export  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
 
  