import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/SongPage.css';
import Play from '../../images/Circle play.png';
import Sidebar from '../Sidebar/Sidebar';
import bannerImage from '../Home/Images/Frame 148.png';
import Favorite from '../Sidebar/Чарти-01.png';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import { useTheme } from '../../services/ThemeContext';

interface Track {
    id: string;
    name: string;
    popularity: number;
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: { name: string }[];
    duration_ms: number;
    uri: string;
}

const FavoritesPage: React.FC = () => {
    const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchFavoriteTracks = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFavoriteTracks(response.data.items.map((item: any) => item.track)); // Extract track data
            } catch (err) {
                console.error('Failed to fetch favorite tracks.', err);
                setError('Failed to fetch favorite tracks.');
            }
        };

        fetchFavoriteTracks();
    }, []);

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handlePlayAllTracks = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        const trackUris = favoriteTracks.map(track => track.uri);

        try {
            await axios.put(
                'https://api.spotify.com/v1/me/player/play',
                { uris: trackUris }, // Play all track URIs
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error('Failed to play all tracks.', error);
        }
    };

    const handlePlayTrack = async (uri: string) => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            await axios.put(
                'https://api.spotify.com/v1/me/player/play',
                { uris: [uri] },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error('Failed to play track.', error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="main-container-s">
            <div className='sidebar'><Sidebar  /></div>

            <div className={`content-s ${isDarkMode ? 'dark' : 'light'}`}
            >
                <TopNavigation  />
                <div className="banner-container-user-s">
                    <img src={bannerImage} alt="Banner" className="banner-image-user" />
                </div>

                <div className='inf'>
                    <img src={Favorite} className="profile-image-s" />
                    <div className='name'>
                        <div className="profile-details-f">
                            <h3 className='title-f'>Плейліст</h3>
                            <h1 className="minmar">Треки, які сподобалися</h1>
                            <h3 className="minmar"> Кількість: {favoriteTracks.length} </h3>
                        </div>
                    </div>
                </div>

                <div className='seting-f'>
                    {/* Play all tracks when the play button is clicked */}
                    <img
                        src={Play}
                        alt="Play"
                        className="seting-img"
                        onClick={handlePlayAllTracks}
                    />
                </div>

                <div className="top-tracks-f">
                    <ul className="tracks-list-f">
                        {favoriteTracks.map((track, index) => (
                            <li className="track-item" key={`${track.id}-${index}`}>
                                <span className="track-index">{index + 1}</span>
                                <img
                                    src={track.album.images[0]?.url || 'default-album.png'}
                                    alt={track.name}
                                    className="track-image"
                                    onClick={() => handlePlayTrack(track.uri)}
                                />
                                <div className="track-info">
                                    <p className="track-name">
                                        <Link to={`/track/${track.id}`}>
                                            <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}
                                                style={{ margin: '10px 0', cursor: 'pointer' }}>
                                                {track.name}
                                            </span>
                                        </Link>
                                    </p>
                                </div>
                                <div  className={`track-album ${isDarkMode ? 'dark' : 'light'}`}
                                >{track.artists.map((artist) => artist.name).join(', ')}</div>
                                <div  className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}
                                >{formatDuration(track.duration_ms)}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default FavoritesPage;
