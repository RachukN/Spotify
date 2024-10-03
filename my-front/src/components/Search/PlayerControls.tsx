// src/components/PlayerControls.tsx
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useGlobalPlayer } from './GlobalPlayer';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom'; // Import useLocation to detect the current route

import '../../styles/PlayerControls.css'
import PreviousIcon from './Images/Frame 105.png';
import NextIcon from './Images/Frame 107.png';
import PlayIcon from './Images/Frame 109.png';
import RepeatIcon from './Images/Repeat.png';
import ShuffleIcon from './Images/Mixing mode.png';
import VolumeIcon from './Images/Vector (1).png';
import ProgressBar from './ProgressBar';
import Vic from './Images/Frame 113 (1).png'
import Pause from './Images/Frame 109 (1).png';
import Min from './Images/Frame 436.png';
import { useTheme } from '../../services/ThemeContext';




const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
const PlayerControls: React.FC = () => {
  const { player, repeat, shuffle } = useGlobalPlayer();
  const token = localStorage.getItem('spotifyAccessToken') || '';
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'context'>('off');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    name: string;
    artist: string;
    albumImage: string;

  } | null>(null);
  const { isDarkMode } = useTheme();
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null); // State to store the current device ID
  const [position, setPosition] = useState<number>(0); // Track's current position
  const [duration, setDuration] = useState<number>(0); // Track's duration
  const location = useLocation();
  const { setPlaybackVolume } = useGlobalPlayer();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store the interval ID in a ref
  useEffect(() => {
    // Initialize player and set up event listeners
    const initializePlayer = async () => {
      if (player) {
        player.addListener('ready', ({ device_id }) => {
          console.log('Player is ready with Device ID:', device_id);
          setCurrentDeviceId(device_id); // Update device ID when the player is ready
          setIsPlayerReady(true);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Player not ready with Device ID:', device_id);
          setIsPlayerReady(false);
        });

        player.addListener('player_state_changed', (state) => {
          if (state) {
            const track = state.track_window.current_track;
            setCurrentTrack({
              name: track.name,
              artist: track.artists.map(artist => artist.name).join(', '),
              albumImage: track.album?.images[0]?.url || '', // Якщо album або images не існує, використовуйте опціональний ланцюжок
            });




            setIsPlaying(!state.paused);
            // Calculate the actual position based on how long it's been since the timestamp


            setPosition(state.position);
            setDuration(state.duration);

            // Clear interval if song is paused


            // Start interval to update position while playing
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            // Start interval to update position every second while playing
            if (!state.paused) {
              intervalRef.current = setInterval(() => {
                setPosition((prevPosition) => {
                  if (prevPosition + 1000 <= state.duration) {
                    return prevPosition + 1000;
                  } else {
                    clearInterval(intervalRef.current!);
                    return state.duration;
                  }
                });
              }, 1000);
            }

          }
        });

        player.addListener('initialization_error', ({ message }) => {
          console.error('Initialization error:', message);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('Authentication error:', message);
        });

        player.addListener('account_error', ({ message }) => {
          console.error('Account error:', message);
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('Playback error:', message);
        });

        const connected = await player.connect();
        if (connected) {
          console.log('Spotify Player connected successfully');
        } else {
          console.error('Failed to connect Spotify Player');
        }
      } else {
        console.error('Player is not initialized');
        setIsPlayerReady(false);
      }
    };

    if (player) {
      initializePlayer();
    }

    return () => {
      player?.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      player?.disconnect();

    };

  }, [player]);


  // Handle volume change and update the slider background based on the current value
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);

    // Change background gradient depending on the route
    const sliderClass = location.pathname === '/infomusic' ? 'volume-slider-white' : 'volume-slider-green';
    const slider = document.querySelector(`.${sliderClass}`) as HTMLInputElement;
    if (slider) {
      const color = location.pathname === '/infomusic' ? '#fff' : '#00FF03';
      slider.style.background = `linear-gradient(to right, ${color} ${newVolume}%, rgba(255, 255, 255, 0.52) ${newVolume}%)`;
    }

    setPlaybackVolume(newVolume);
  };

  useEffect(() => {
    // Initialize the slider with the right background based on the route
    const sliderClass = location.pathname === '/infomusic' ? 'volume-slider-white' : 'volume-slider-green';
    const slider = document.querySelector(`.${sliderClass}`) as HTMLInputElement;
    if (slider) {
      const initialColor = location.pathname === '/infomusic' ? '#fff' : '#00FF03';
      slider.style.background = `linear-gradient(to right, ${initialColor} 50%, #888 50%)`;
    }
  }, [location.pathname]);

  const skipToNext = useCallback(
    debounce(async () => {
      if (!token || !currentDeviceId) {
        console.error('Token or Device ID not available');
        return;
      }
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/player/next?device_id=${currentDeviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Skipped to next track');
      } catch (error) {
        console.error('Error skipping to next track:', error);
      }
    }, 500),
    [token, currentDeviceId]
  );

  const skipToPrevious = useCallback(
    debounce(async () => {
      if (!token || !currentDeviceId) {
        console.error('Token or Device ID not available');
        return;
      }
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/player/previous?device_id=${currentDeviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Skipped to previous track');
      } catch (error) {
        console.error('Error skipping to previous track:', error);
      }
    }, 500),
    [token, currentDeviceId]
  );

  // Function to directly pause using the correct Device ID
  const pausePlayback = async () => {
    if (!currentDeviceId) {
      console.error('Current Device ID is not available');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${currentDeviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error pausing playback via direct API call:', errorData);
      } else {
        console.log('Paused playback via direct API call');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing playback via direct API call:', error);
    }
  };

  // Function to directly resume playback using the correct Device ID
  const resumePlayback = async () => {
    if (!currentDeviceId) {
      console.error('Current Device ID is not available');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${currentDeviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error resuming playback via direct API call:', errorData);
      } else {
        console.log('Resumed playback via direct API call');
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error resuming playback via direct API call:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pausePlayback(); // Call the custom pause function
    } else {
      await resumePlayback(); // Call the custom resume function
    }
  };

  const toggleShuffle = async () => {
    try {
      shuffle(!isShuffling);
      setIsShuffling(!isShuffling);
      console.log(`Shuffle is now ${!isShuffling ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling shuffle:', error);
    }
  };

  const toggleRepeat = async () => {
    const nextRepeatMode = repeatMode === 'off' ? 'track' : repeatMode === 'track' ? 'context' : 'off';
    try {
      repeat(nextRepeatMode);
      setRepeatMode(nextRepeatMode);
      console.log(`Repeat mode set to ${nextRepeatMode}`);
    } catch (error) {
      console.error('Error toggling repeat mode:', error);
    }
  };
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000); // Convert ms to seconds
    const minutes = Math.floor(totalSeconds / 60); // Calculate full minutes
    const seconds = totalSeconds % 60; // Calculate remaining seconds
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format as mm:ss
  };

  const generateImagePaths = () => {
    const images = [];
    for (let i = 1; i <= 33; i++) {
      images.push(`/public/progressbar/${i}.png`); // Adjust the path based on the folder you placed them in
    }
    return images;
  };
  const generateImagePathsA = () => {
    const images = [];
    for (let i = 1; i <= 33; i++) {
      images.push(`/public/activ/${i}.png`); // Adjust the path based on the folder you placed them in
    }
    return images;
  };
  const imagePathsA = generateImagePathsA();
  const imagePaths = generateImagePaths();
  const renderPlayerDesign = () => {
    const sliderClass = location.pathname === '/infomusic' ? 'volume-slider-white' : 'volume-slider-green';
    const playerClass = isDarkMode ? 'dark' : 'light';
    if (location.pathname === '/infomusic') {
      return (

        <div className="infomusic-player">
          <div className="play">
            {currentTrack && (
              <div className="info-c">

                <img className="img-bg" src={currentTrack.albumImage} alt="Album cover" />

                <div className='alb-c'>
                  <img className="img-c" src={currentTrack.albumImage} alt="Album cover" />

                </div>


                <div className="track-details-c">
                  <h4 className="nam-c">{currentTrack.name}</h4>
                  <p>{currentTrack.artist}</p>
                </div>
                <div className='mid-c'>
                  <div className='tools-c'>
                    <button onClick={toggleShuffle} disabled={!isPlayerReady}>
                      <img src={ShuffleIcon} alt="Shuffle" />
                    </button>
                    <button onClick={skipToPrevious} disabled={!isPlayerReady}>
                      <img src={PreviousIcon} alt="Previous" />
                    </button>
                    <button onClick={togglePlayPause} disabled={!isPlayerReady}>
                      <img src={isPlaying ? Pause : PlayIcon} alt="Play/Pause" />
                    </button>
                    <button onClick={skipToNext} disabled={!isPlayerReady}>
                      <img src={NextIcon} alt="Next" />
                    </button>
                    <button onClick={toggleRepeat} disabled={!isPlayerReady}>
                      <img src={RepeatIcon} alt="Repeat" />
                    </button></div>
                  <div className="track-progress-c">
                    <span className="title-c">{formatTime(position)}</span>

                    <ProgressBar
                      position={position}
                      duration={duration}
                      inactiveImagePaths={imagePaths}
                      activeImagePaths={imagePathsA}
                    />

                    <span className="title-c">{formatTime(duration)}</span>
                  </div>
                  <div className="link">
                    <Link to="/home" className="imgg">
                      <img className="vic" src={Min} alt="Min" />
                    </Link>

                    <div className="imgg">
                      <div className="volume-control">
                        <img className="zvuk" src={VolumeIcon} alt="Volume" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          className={sliderClass}
                          onChange={handleVolumeChange}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            )}




          </div>
        </div>
      );
    }
    return (

      <div className="default">
          <div className="player-controls">

            {currentTrack && (
              <div className={`info ${playerClass}`}>
                <div className='alb'><img className="img" src={currentTrack.albumImage} alt="Album cover" />
                </div>


                <div className="track-details">
                  <h4 className="nam">{currentTrack.name}</h4>
                  <p>{currentTrack.artist}</p>
                </div>
                <div className='mid'>
                  <div className='tools'>
                    <button onClick={toggleShuffle} disabled={!isPlayerReady}>
                      <img className='imgbtb' src={ShuffleIcon} alt="Shuffle" />
                    </button>
                    <button onClick={skipToPrevious} disabled={!isPlayerReady}>
                      <img src={PreviousIcon} alt="Previous" />
                    </button>
                    <button onClick={togglePlayPause} disabled={!isPlayerReady}>
                      <img src={isPlaying ? Pause : PlayIcon} alt="Play/Pause" />
                    </button>
                    <button onClick={skipToNext} disabled={!isPlayerReady}>
                      <img src={NextIcon} alt="Next" />
                    </button>
                    <button onClick={toggleRepeat} disabled={!isPlayerReady}>
                      <img src={RepeatIcon} alt="Repeat" />
                    </button></div>
                  <div className="track-progress">
                    <span className="title">{formatTime(position)}</span>

                    <ProgressBar
                      position={position}
                      duration={duration}
                      inactiveImagePaths={imagePaths}
                      activeImagePaths={imagePathsA}
                    />

                    <span className="title">{formatTime(duration)}</span>
                  </div>
                </div>
                <Link to="/infomusic" className="sidebar-link">
                  <img className="vic" src={Vic} alt="Vic" />

                </Link>
                <div className="sidebar-link">
                  <img className="zvuk" src={VolumeIcon} alt="Volume" />
                  <div className="volume-control">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      defaultValue="50" // Default slider value to start at 50%
                      onChange={handleVolumeChange} // Handles slider changes
                      className={sliderClass}
                    />
                  </div>
                </div>
              </div>

            )}




          </div>
       
      </div>
    );


  };

  return (
    <div className="player-controls">
      {renderPlayerDesign()}
    </div>
  );
};

export default PlayerControls;
