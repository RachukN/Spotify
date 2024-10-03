import React from 'react';
import { Link } from 'react-router-dom';
import Play from '../../images/Frame 76.png'; // Replace with your play icon path
import '../../styles/Music.css'; // Assuming you have a styles file for consistent styles
import { formatDuration } from '../../utils/SpotifyPlayer'; // Utility function to format track duration
import { useTheme } from '../../services/ThemeContext';

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string, id: string }[];
  uri: string;
  popularity: number;
  duration_ms: number;
}

interface TopTracksListProps {
  tracks: Track[];
  handlePlayTrack: (uri: string) => void; // Function to play the selected track
}

const TopTracksList: React.FC<TopTracksListProps> = ({ tracks, handlePlayTrack }) => {
  const { isDarkMode } = useTheme();
 
  return (
    <ul className="tracks-list">
      {tracks.map((track, index) => (
        <li key={`${track.id}-${index}`} className="track-item">
          <span className="track-index">{index + 1}</span>
          <img
            onClick={() => handlePlayTrack(track.uri)}
            src={track.album.images[0]?.url || 'default-album.png'}
            alt={track.name}
            className="track-image"
          />
          <div className="track-info">
            <p className="track-name">
              <Link to={`/track/${track.id}`} >
                <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`} style={{ margin: '10px 0', cursor: 'pointer' }}>
                  {track.name.length > 16 ? `${track.name.substring(0, 16)}...` : track.name}
                </span>
              </Link>
            </p>
            <p className="artist-name">
              {track.artists.map(artist => (
                <Link key={artist.id} to={`/artist/${artist.id}`}>
                  <span style={{ cursor: 'pointer' }}>
                    {artist.name.length > 16 ? `${artist.name.substring(0, 16)}...` : artist.name}
                  </span>
                </Link>
              ))}
            </p>
          </div>
          <div className="track-popularity">{track.popularity}</div>
          <div className="track-duration">{formatDuration(track.duration_ms)}</div>
          <div onClick={() => handlePlayTrack(track.uri)} className="play-icon">
            <img src={Play} alt="Play" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TopTracksList;
