import React from 'react';
import { Link } from 'react-router-dom';
import Play from '../../images/Frame 76.png'; // Replace with your play icon path
import '../../styles/ArtistPage.css'; // Assuming you have a styles file for consistent styles
import { formatDuration } from '../../utils/SpotifyPlayer'; // Utility function to format track duration
import { useTheme } from '../../services/ThemeContext';

interface Track {
    id: string;
    name: string;
    popularity: number;
    album: {
        name: string;
        images: { url: string }[];
    };
    uri: string;
    duration_ms: number;
}

interface ArtistTopTracksProps {
    tracks: Track[];
    handlePlayTrack: (uri: string) => void;
    handlePlayAlbum: (uri: string) => void;
}

const ArtistTopTracks: React.FC<ArtistTopTracksProps> = ({ tracks, handlePlayTrack, handlePlayAlbum }) => {
    const { isDarkMode } = useTheme();


    return (
        <ul className="tracks-list">
            {tracks.map((track, index) => (
                <li key={`${track.id}-${index}`}  className={` track-item ${isDarkMode ? 'dark' : 'light'}`}>
                    <span className="track-index">{index + 1}</span>
                    <img
                        onClick={() => handlePlayTrack(track.uri)}
                        src={track.album.images[0]?.url || 'default-album.png'}
                        alt={track.name}
                        className="track-image"
                    />
                    <div className="track-info">
                        <p className="track-name">
                            <Link to={`/track/${track.id}`}>
                                <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}
                                    style={{ margin: '10px 0', cursor: 'pointer' }}>
                                    {track.name.length > 16 ? `${track.name.substring(0, 16)}...` : track.name}
                                </span>
                            </Link>
                        </p>
                    </div>
                    <div  className={`track-album ${isDarkMode ? 'dark' : 'light'}`}
                    >{track.popularity}</div>
                    <div  className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>{formatDuration(track.duration_ms)}</div>
                    <div onClick={() => handlePlayAlbum(track.uri)} className="play-icona">
                        <img src={Play} alt="Play" />
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ArtistTopTracks;
