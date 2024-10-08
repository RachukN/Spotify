import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../../styles/SongPage.css';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import bannerImage from '../Home/Images/Frame 148.png';
import SearchBar from '../Search/SearchBar';
import Plus from '../../images/plus-square_svgrepo.com.png';
import Play from '../../images/Circle play.png';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: { name: string }[];
    duration_ms: number;
    popularity: number;
    uri: string;
}
interface Device {
    id: string;
    is_active: boolean;
}

const PlaylistDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Отримуємо ID плейлиста з URL
    const [playlist, setPlaylist] = useState<any>(null); // Зберігаємо деталі плейлиста
    const [tracks, setTracks] = useState<Track[]>([]); // Зберігаємо треки плейлиста
    const [popularTracks, setPopularTracks] = useState<Track[]>([]); // Зберігаємо популярні треки
    const [showDropdown, setShowDropdown] = useState(false); // Контроль відображення випадаючого списку
    const [showDropdownT, setShowDropdownT] = useState(false); // Контроль відображення випадаючого списку
    const { isDarkMode } = useTheme();
 
    const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]); // Зберігаємо рекомендовані треки
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]); // Зберігаємо вибрані для видалення треки
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { language } = useLanguage();
  
    // Отримуємо інформацію про плейлист і треки
    useEffect(() => {
        const fetchPlaylist = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPlaylist(response.data);
                setTracks(response.data.tracks.items.map((item: any) => item.track));
            } catch (err) {
                console.error('Failed to fetch playlist.', err);
                setError('Failed to fetch playlist.');
            }
        };

        fetchPlaylist();
    }, [id]);

    // Отримуємо популярні треки
    useEffect(() => {
        const fetchPopularTracks = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                // Отримуємо нові релізи (альбоми)
                const albumsResponse = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const albums = albumsResponse.data.albums.items;

                // Для кожного альбому отримуємо його треки
                const tracksPromises = albums.map(async (album: any) => {
                    const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    return tracksResponse.data.items.map((track: any) => ({
                        ...track,
                        album: {
                            name: album.name,
                            images: album.images,
                        },
                    }));
                });

                // Чекаємо, поки всі треки будуть отримані
                const tracksArrays = await Promise.all(tracksPromises);

                // Об'єднуємо всі треки в один масив
                const allTracks = tracksArrays.flat();

                setPopularTracks(allTracks);
            } catch (error) {
                console.error('Failed to fetch popular tracks', error);
            }
        };

        fetchPopularTracks();
    }, []);
    useEffect(() => {
        const fetchPopularTracks = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                // Отримуємо нові релізи (альбоми)
                const albumsResponse = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const albums = albumsResponse.data.albums.items;

                // Для кожного альбому отримуємо його треки
                const tracksPromises = albums.map(async (album: any) => {
                    const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    return tracksResponse.data.items.map((track: any) => ({
                        ...track,
                        album: {
                            name: album.name,
                            images: album.images,
                        },
                    }));
                });

                // Чекаємо, поки всі треки будуть отримані
                const tracksArrays = await Promise.all(tracksPromises);

                // Об'єднуємо всі треки в один масив
                const allTracks = tracksArrays.flat();

                setPopularTracks(allTracks);
            } catch (error) {
                console.error('Failed to fetch popular tracks', error);
            }
        };

        fetchPopularTracks();
    }, []);
    // Форматування тривалості треку в хвилини та секунди
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Додавання треку до плейлиста
    const handleAddTrack = async (trackUri: string) => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const requestData = {
                uris: [trackUri],
            };
            console.log('Request Data for adding track:', requestData);

            const response = await axios.post(
                `https://api.spotify.com/v1/playlists/${id}/tracks`,
                requestData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccessMessage('Трек додано до плейлиста');
            console.log('Track added successfully:', response.data);

            // Оновлюємо список треків після додавання
            const addedTrack = popularTracks.find(track => track.uri === trackUri);
            if (addedTrack) {
                setTracks((prevTracks) => [...prevTracks, addedTrack]);
            }

            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error response data:', error.response.data);
                setError(`Помилка: ${error.response.data.error.message}`);
            } else {
                console.error('Unexpected error:', error);
                setError('Не вдалося додати трек до плейлиста.');
            }
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const toggleDropdownT = () => {
        setShowDropdownT(!showDropdownT);
    };
    // Вибір треку для видалення
    const handleTrackSelection = (trackUri: string) => {
        setSelectedTracks((prev) =>
            prev.includes(trackUri) ? prev.filter((uri) => uri !== trackUri) : [...prev, trackUri]
        );
    };

    // Видалення вибраних треків
    const handleRemoveTracks = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            await axios.delete(
                `https://api.spotify.com/v1/playlists/${id}/tracks`, {
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    tracks: selectedTracks.map(uri => ({ uri })), // Передаємо масив URI треків для видалення
                }
            });
            setTracks(tracks.filter(track => !selectedTracks.includes(track.uri))); // Оновлення UI після видалення
            setSelectedTracks([]);
        } catch (error) {
            console.error('Failed to remove tracks from playlist.', error);
        }
    };
    const getActiveDeviceId = async (): Promise<string | null> => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            console.error('No access token found');
            setError('Please log in to continue.');
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
                setError('No available devices found. Please open Spotify on a device.');
                return null;
            }

            const activeDevice = devices.find((device: Device) => device.is_active);
            return activeDevice ? activeDevice.id : devices[0].id;
        } catch (error) {
            console.error('Error fetching devices:', error);
            setError('Failed to fetch active devices.');
            return null;
        }
    };


    const handlePlayTrack = async (trackUri: string) => {
        const token = localStorage.getItem('spotifyAccessToken');

        if (!token) {
            console.error('No access token found');
            setError('Please log in to continue.');
            return;
        }

        const deviceId = await getActiveDeviceId(); // Отримуємо активний пристрій
        if (!deviceId) {
            alert('Please open Spotify on one of your devices to start playback.');
            return;
        }

        try {
            // Запит на відтворення треку на обраному пристрої
            await axios.put(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {
                    uris: [trackUri],  // Масив з одним треком для відтворення
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Track is playing');
        } catch (error: any) {
            console.error('Error playing track:', error.response || error.message || error);
            if (error.response && error.response.status === 404) {
                // Логіка для повторної спроби підключення
                console.log('Retrying to connect player...');
                setTimeout(() => handlePlayTrack(trackUri), 2000); // Повтор через 2 секунди
            } else if (error.response && error.response.status === 400) {
                setError('Invalid request. Check the device ID or track URI.');
            }
        }
    };

    const handlePlayAllTracks = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            // Collect all track URIs from the playlist
            const trackUris = tracks.map(track => track.uri);

            if (trackUris.length === 0) {
                console.error('No tracks to play.');
                return;
            }

            // Send a request to play all the tracks
            await axios.put(
                `https://api.spotify.com/v1/me/player/play`,
                { uris: trackUris },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('All tracks are now playing.');
        } catch (error) {
            console.error('Failed to play all tracks.', error);
            setError('Failed to play all tracks.');
        }
    };

    // Отримання рекомендацій на основі треків з плейлиста
    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get(`https://api.spotify.com/v1/recommendations`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        seed_tracks: tracks.map(track => track.id).slice(0, 5).join(','), // Використовуємо перші 5 треків як seed
                    },
                });
                setRecommendedTracks(response.data.tracks.slice(0, 6)); // Відображаємо тільки перші 10 треків
            } catch (error) {
                console.error('Failed to fetch recommendations', error);
            }
        };

        if (tracks.length) fetchRecommendations();
    }, [tracks]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="main-container-s">
            <div className='sidebar'><Sidebar /></div>

            <div className={`content-s-p ${isDarkMode ? 'dark' : 'light'}`}
            >
                <div className="banner-container-user-s">
                    <img src={bannerImage} alt="Banner" className="banner-image-user" />
                </div>

                {/* Виведення інформації про плейлист */}
                <div className='inf'>
                    {playlist && (
                        <>
                            <img
                                src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : 'default-image.png'}
                                className="profile-image-s"
                                alt="Playlist"
                            />
                            <div className='name'>
                                <div className={`profile-details-f ${isDarkMode ? 'dark' : 'light'}`}>
                                    <h3 className='title-f'>{language.playlist}</h3>
                                    <h1 className="minmar">{playlist.name}</h1>
                                    <h3 className="minmar">{language.quantity}: {tracks.length} {language.tracks}</h3>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="add-track-btn">
                    <img
                        src={Play}
                        alt="Play"
                        className="seting-img"
                        onClick={handlePlayAllTracks}
                    />
                    <button className='addp' onClick={toggleDropdown}>{language.addTracks}</button>
                    {selectedTracks.length > 0 && (
                        <button className='addpp' onClick={handleRemoveTracks}>{language.removeSelectedTracks}</button>
                    )}
                </div>



                {showDropdown && (
                    <div className="dropdown">
                        <ul>

                            <div className="tracks-list-f-p">

                                <div  className={`modal-p ${isDarkMode ? 'dark' : 'light'}`}>
                                    <ul className="tracks-list-f">
                                        <h2>{language.recommendedTracks}</h2>
                                        <button onClick={toggleDropdown} className="close-dropdown-btn">
                                            ✕
                                        </button>
                                        {recommendedTracks.map((track, index) => (
                                             <li className={` track-item ${isDarkMode ? 'dark' : 'light'}`}  // Play track on image click
                                             key={`${track.id}-${index}`}
                                             >      <span className="track-index">{index + 1}</span>
                                                <img
                                                    src={track.album.images[0]?.url || "default-album.png"}
                                                    alt={track.name}
                                                    className="track-image"
                                                    onClick={() => handlePlayTrack(track.uri)}
                                                    style={{ margin: '10px 0', cursor: 'pointer' }}
                                                />
                                                <div className="track-info">
                                                    <Link to={`/track/${track.id}`}>
                                                    <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                                                    {track.album.name}</span>
                                                    </Link>
                                                    <p className="track-artists">
                                                        {track.artists.map((artist: any) => (
                                                            <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                                <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>
                                                                {artist.name}</span>
                                                            </Link>
                                                        ))}
                                                    </p>
                                                </div>
                                                <div className={`track-album ${isDarkMode ? 'dark' : 'light'}`}>{track.popularity || 'N/A'}</div>
                                                <div className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>{formatDuration(track.duration_ms)}</div>
                                                <button onClick={() => handleAddTrack(track.uri)}>
                                                    <img src={Plus} alt="Library" className="plus-p" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </ul>
                    </div>
                )}

                {/* Виведення повідомлення про успішне додавання треку */}
                <div className='success'>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </div>
                {/* Виведення треків у плейлисті */}
                <div className="top-tracks-f">
                    {(
                        <ul className="tracks-list-f">
                            {tracks.map((track, index) => (
                                <li className={` track-item ${isDarkMode ? 'dark' : 'light'}`}  // Play track on image click
                                key={`${track.id}-${index}`}
                                >       <span className="track-index">{index + 1}</span>
                                    <img
                                        src={track.album.images[0]?.url || "default-album.png"}
                                        alt={track.name}
                                        className="track-image"
                                        onClick={() => handlePlayTrack(track.uri)}
                                        style={{ margin: '10px 0', cursor: 'pointer' }}
                                    />
                                    <div className="track-info">
                                        <Link to={`/track/${track.id}`}>
                                            <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>{track.album.name}</span>
                                        </Link>
                                        <p className="track-artists">
                                            {track.artists.map((artist: any) => (
                                                <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                    <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>{artist.name}</span>
                                                </Link>
                                            ))}
                                        </p>
                                    </div>
                                    <div className={`track-album ${isDarkMode ? 'dark' : 'light'}`}>{track.popularity || 'N/A'}</div>
                                    <div className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>{formatDuration(track.duration_ms)}</div>

                                    <input
                                        type="checkbox"
                                        checked={selectedTracks.includes(track.uri)}
                                        onChange={() => handleTrackSelection(track.uri)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="seting" onClick={toggleDropdownT} >
                    <h4 className='scr'>  {language.popularRecommendedTracks} </h4>

                </div>
                {showDropdownT && (
                    <div className="dropdown">
                        <div className="top-tracks-f">

                            <ul className="tracks-list-f">
                                {popularTracks.map((track: any, index) => (
                                   <li className={` track-item ${isDarkMode ? 'dark' : 'light'}`}  // Play track on image click
                                   key={`${track.id}-${index}`}
                                   >    <span className="track-index">{index + 1}</span>
                                        <img
                                            src={track.album.images[0]?.url || "default-album.png"}
                                            alt={track.name}
                                            className="track-image"
                                            onClick={() => handlePlayTrack(track.uri)}
                                            style={{ margin: '10px 0', cursor: 'pointer' }}
                                        />
                                        <div className="track-info">
                                            <Link to={`/track/${track.id}`}>
                                            <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>{track.album.name}</span>
                                            </Link>
                                            <p className="track-artists">
                                                {track.artists.map((artist: any) => (
                                                    <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                        <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>{artist.name}</span>
                                                    </Link>
                                                ))}
                                            </p>
                                        </div>
                                        <div className={`track-album ${isDarkMode ? 'dark' : 'light'}`}>{track.popularity || 'N/A'}</div>
                                    <div className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>{formatDuration(track.duration_ms)}</div>

                                        <button onClick={() => handleAddTrack(track.uri)}>
                                            <img src={Plus} alt="Library" className="plus-p" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                <Footer/>
            </div>
            <div className='add'><SearchBar /></div>
            <div className='nav'><TopNavigation /></div>
            <div className='success'>
                {successMessage && <h4 className='success-message' >{successMessage}</h4>}
            </div>
        </div>
    );
};

export default PlaylistDetailsPage;
