import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Setting1 from '../../images/Frame 160 (1).png'; // Settings icon
import LoadingTrackAlbum from '../Loading/LoadingTrackAlbum'; // Import the loading component
import '../../styles/Music.css'; // Ensure your styles are loaded
import { handlePlayTrack, formatDuration } from '../../utils/SpotifyPlayer';
import { useTheme } from '../../services/ThemeContext';


interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: { url: string }[];
        id: string;
    };
    artists: { name: string; id: string }[];
    duration_ms: number;
    popularity: number;
    uri: string;
}

interface Playlist {
    id: string;
    name: string;
}

const TopTracks: React.FC = () => {
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isTrackSaved, setIsTrackSaved] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({});
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const { isDarkMode } = useTheme();
    useEffect(() => {
        const fetchRecommendedTracks = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                setLoading(true);
                // Fetch recommendations from Spotify API
                const response = await axios.get('https://api.spotify.com/v1/recommendations', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        limit: 10,
                        seed_tracks: '0c6xIDDpzE81m2q797ordA', // Example seed track
                    },
                });

                setRecommendations(response.data.tracks);
                
                // Fetch user's playlists
                const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlaylists(playlistsResponse.data.items);
            } catch (error: any) {
                console.error('Error fetching recommended tracks:', error);
                setError('An error occurred while fetching recommended tracks.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedTracks();
    }, []);

    // Handle playing track via Spotify Web API
 

    const handleDropdownToggle = (event: React.MouseEvent, index: number) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setDropdownPosition({
            top: rect.top + window.scrollY + 65,
            left: rect.right + window.scrollX - 1200, // Offset for positioning
        });
        setShowDropdown((prev) => ({
            ...prev,
            [index]: !prev[index], // Toggle only the clicked dropdown
        }));
    };

    const handleSaveOrRemoveTrack = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            if (isTrackSaved) {
                // Remove the track from the user's library
                await axios.delete(`https://api.spotify.com/v1/me/tracks`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { ids: recommendations.map(track => track.id) },
                });
            } else {
                // Save the track to the user's library
                await axios.put(
                    `https://api.spotify.com/v1/me/tracks`,
                    { ids: recommendations.map(track => track.id) },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setIsTrackSaved(!isTrackSaved); // Toggle the saved state
        } catch (error) {
            console.error('Failed to save or remove track.', error);
        }
    };

    const handleAddToPlaylist = async (playlistId: string, trackUri: string) => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                { uris: [trackUri] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Track added to playlist!');
        } catch (error) {
            console.error('Failed to add track to playlist.', error);
            alert('Error adding track to playlist.');
        }
    };

    if (loading) {
        return <div><LoadingTrackAlbum /></div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
       
            <div className="top-tracks">
                <ul className="tracks-list">
                    {recommendations.slice(0, 10).map((rec, index) => (
                        <li key={`${rec.id}-${index}`} className={` track-item ${isDarkMode ? 'dark' : 'light'}`}>
                                    <span className="track-index">{index + 1}</span>
                            <img
                                src={rec.album.images[0]?.url || "default-album.png"}
                                alt={rec.name}
                                className="track-image"
                                key={rec.id}
                                onClick={() => handlePlayTrack(rec.uri)}
                                style={{ margin: '10px 0', cursor: 'pointer' }}
                            />
                            <div className="track-info">
                                <Link key={rec.album.id} to={`/album/${rec.album.id}`}>
                                    <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                                        {rec.name}
                                    </span>
                                </Link>
                                <p className="track-artists">
                                    {rec.artists.map(artist => (
                                        <Link key={artist.id} to={`/artist/${artist.id}`}>
                                             <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>
                                                {artist.name}
                                            </span>
                                        </Link>
                                    ))}
                                </p>
                            </div>
                            <div className={`track-album ${isDarkMode ? 'dark' : 'light'}`}
                                    >{rec.popularity}</div>
                           <div className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>
                                <img
                                    src={Setting1}
                                    alt="Settings"
                                    className="seting-imgg"
                                    onClick={(event) => handleDropdownToggle(event, index)}
                                />
                                {rec.duration_ms ? formatDuration(rec.duration_ms) : 'Unknown'}
                            </div>
                            {showDropdown[index] && dropdownPosition && (
                                <div
                                    className="dropdown-menu"
                                    style={{
                                        position: 'absolute',
                                        top: `${dropdownPosition.top}px`,
                                        right: `${dropdownPosition.left}px`,
                                        backgroundColor: '#333',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <ul>
                                        {/* Add to Favorites */}
                                        <li onClick={() => handleSaveOrRemoveTrack()}>
                                            {isTrackSaved ? 'Видалити з улюблених' : 'Додати до улюблених'}
                                        </li>
                                        {/* Add to Playlist */}
                                        <li onClick={() => setShowPlaylists(!showPlaylists)}>
                                            Додати до плейлиста
                                            {showPlaylists && (
                                                <ul className="playlist-options">
                                                    {playlists.map((playlist) => (
                                                        <li key={playlist.id} onClick={() => handleAddToPlaylist(playlist.id, rec.uri)}>
                                                            {playlist.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                        {/* Go to Album */}
                                        <li onClick={() => window.location.href = `/album/${rec.album.id}`}>Перейти до альбому</li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        
    );
};

export default TopTracks;
