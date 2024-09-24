import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import PlayerControls from '../Player/PlayerControls';
import Play from '../../images/Frame 76.png';
import Seting from '../Home/Images/Frame 129 (2).png';
import bannerImage from '../Home/Images/Frame 148 (2).png';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import '../../styles/SongPage.css';
interface Device {
    id: string;
    is_active: boolean;
}
interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: { url: string }[];
        release_date: string;
        id: string;
    };
    artists: { name: string; id: string }[];
    duration_ms: number;
    popularity: number;
    uri: string;
}

interface Recommendation {
    id: string;
    name: string;
    album: { name: string; id: string; images: { url: string }[] };
    artists: { name: string; id: string }[];
    duration_ms: number;
    popularity: number;
    uri: string;
}

interface Single {
    id: string;
    name: string;
    images: { url: string }[];
    release_date: string;
    uri: string;
}

interface RelatedArtist {
    id: string;
    name: string;
    images: { url: string }[];
    popularity: number;
    uri: string;
}

const TrackPage: React.FC = () => {
    const { trackId } = useParams<{ trackId: string }>();
    const [track, setTrack] = useState<Track | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [singles, setSingles] = useState<Single[]>([]);
    const [relatedArtists, setRelatedArtists] = useState<RelatedArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [leftArrowSingles, setLeftArrowSingles] = useState(LeftGray);
    const [rightArrowSingles, setRightArrowSingles] = useState(RightGreen);
    const [leftArrowRelated, setLeftArrowRelated] = useState(LeftGray);
    const [rightArrowRelated, setRightArrowRelated] = useState(RightGreen);

    const [isTrackSaved, setIsTrackSaved] = useState(false);
    const scrollRefSingles = useRef<HTMLDivElement>(null);
    const scrollRefRelated = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const fetchTrackData = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                // Fetch track data
                const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const trackData = trackResponse.data;
                setTrack(trackData);

                // Fetch similar tracks (recommendations)
                const recommendationsResponse = await axios.get(
                    `https://api.spotify.com/v1/recommendations`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            seed_tracks: trackId,
                            limit: 5,
                        },
                    }
                );
                setRecommendations(recommendationsResponse.data.tracks);
                const savedResponse = await axios.get(
                    `https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setIsTrackSaved(savedResponse.data[0]);
                // Fetch top 5 tracks of the artist
                const topTracksResponse = await axios.get(
                    `https://api.spotify.com/v1/artists/${trackData.artists[0].id}/top-tracks?market=US`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setTopTracks(topTracksResponse.data.tracks.slice(0, 5));

                // Fetch popular singles
                const singlesResponse = await axios.get(
                    `https://api.spotify.com/v1/artists/${trackData.artists[0].id}/albums?include_groups=single&market=US`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setSingles(singlesResponse.data.items);

                // Fetch related artists
                const relatedArtistsResponse = await axios.get(
                    `https://api.spotify.com/v1/artists/${trackData.artists[0].id}/related-artists`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setRelatedArtists(relatedArtistsResponse.data.artists);

            } catch (error) {
                console.error('Failed to fetch track or related data.', error);
                setError('Failed to fetch track or related data.');
            } finally {
                setLoading(false);
            }
        };

        if (trackId) {
            fetchTrackData();
        }
    }, [trackId]);

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const handleSaveOrRemoveTrack = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            if (isTrackSaved) {
                // Remove the track from the user's library
                await axios.delete(`https://api.spotify.com/v1/me/tracks`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { ids: [trackId] },
                });
            } else {
                // Save the track to the user's library
                await axios.put(
                    `https://api.spotify.com/v1/me/tracks`,
                    { ids: [trackId] },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setIsTrackSaved(!isTrackSaved); // Toggle the saved state
        } catch (error) {
            console.error('Failed to save or remove track.', error);
        }
    };



    const handlePlayTrack = async (uri: string) => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) return;

        try {
            await axios.put(
                `https://api.spotify.com/v1/me/player/play`,
                { uris: [uri] },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error('Failed to play track.', error);
        }
    };

    if (loading) {
        return <div>Loading track data...</div>;
    }

    if (!track) {
        return <div>Track data not available.</div>;
    }
    const getActiveDeviceId = async (): Promise<string | null> => {
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
    const handlePlayAlbum = async (albumUri: string) => {
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
                    context_uri: albumUri,
                },
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
            if (error.response && error.response.status === 404) {
                // Retry logic for specific errors
                console.log('Retrying to connect player...');
                setTimeout(() => handlePlayAlbum(albumUri), 2000); // Retry after delay
            }
        }
    };
    const updateArrowsSingles = () => {
        if (scrollRefSingles.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRefSingles.current;

            if (scrollLeft === 0) {
                setLeftArrowSingles(LeftGray);
                setRightArrowSingles(RightGreen);
            } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
                setLeftArrowSingles(LeftGreen);
                setRightArrowSingles(RightGray);
            } else {
                setLeftArrowSingles(LeftGreen);
                setRightArrowSingles(RightGreen);
            }
        }
    };

    const updateArrowsRelated = () => {
        if (scrollRefRelated.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRefRelated.current;

            if (scrollLeft === 0) {
                setLeftArrowRelated(LeftGray);
                setRightArrowRelated(RightGreen);
            } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
                setLeftArrowRelated(LeftGreen);
                setRightArrowRelated(RightGray);
            } else {
                setLeftArrowRelated(LeftGreen);
                setRightArrowRelated(RightGreen);
            }
        }
    };

    const scrollLeftSingles = () => {
        if (scrollRefSingles.current) {
            scrollRefSingles.current.scrollBy({
                left: -scrollRefSingles.current.clientWidth,
                behavior: 'smooth',
            });
            setTimeout(updateArrowsSingles, 300);
        }
    };

    const scrollRightSingles = () => {
        if (scrollRefSingles.current) {
            scrollRefSingles.current.scrollBy({
                left: scrollRefSingles.current.clientWidth,
                behavior: 'smooth',
            });
            setTimeout(updateArrowsSingles, 300);
        }
    };

    const scrollLeftRelated = () => {
        if (scrollRefRelated.current) {
            scrollRefRelated.current.scrollBy({
                left: -scrollRefRelated.current.clientWidth,
                behavior: 'smooth',
            });
            setTimeout(updateArrowsRelated, 300);
        }
    };

    const scrollRightRelated = () => {
        if (scrollRefRelated.current) {
            scrollRefRelated.current.scrollBy({
                left: scrollRefRelated.current.clientWidth,
                behavior: 'smooth',
            });
            setTimeout(updateArrowsRelated, 300);
        }
    };
    const trackImageUrl = track.album.images.length > 0 ? track.album.images[0].url : 'default-track.png';

    return (
        <div className="main-container-s">
            <div className="sidebar-s">
                <Sidebar />
            </div>

            <div className="content-s">
                <TopNavigation />

                {/* Track Banner */}
                <div className="banner-container-user-s">
                    <img src={bannerImage} alt="Banner" className="banner-image-user-s" />
                </div>

                {/* Track Details */}
                <div className="inf-s">
                    <img src={trackImageUrl} alt={track.name} className="profile-image-s" />
                    <div className="name-s">
                        <div className="title-s">Трек</div>
                        <h1>{track.name}</h1>
                        <div className="profile-details-s">
                            <p className="title-s">{track.artists.map((artist) => artist.name).join(', ')}</p>
                            <p>{track.album.name}</p>
                            <p>{track.album.release_date}</p>
                            <p>{formatDuration(track.duration_ms)}</p>
                        </div>
                    </div>
                </div>
                <div className="seting-s">
                    <img src={Seting} alt="Seting" className="seting-img" />
                    {/* Save/Remove Button */}
                    <button
                        onClick={handleSaveOrRemoveTrack}
                        className={isTrackSaved ? 'subscribed-s' : 'subscribe-button-s'}
                    >
                        {isTrackSaved ? 'Видалити з улюблених' : 'Додати до улюблених'}
                    </button>

                    {/* Play/Pause Button */}

                </div>
                {/* Recommendations Section */}

                <div className="cont-a">
                    <div className="top-tracks">
                        <h2 className="popularity">Рекомендації на основі треку</h2>
                        <ul className="tracks-list">
                            {recommendations.slice(0, 5).map((rec, index) => (
                                
                                <li className="track-item"  // Play track on image click
                                key={`${rec.id}-${index}`}
                                >
                                    <span className="track-index">{index + 1}</span>
                                    <img
                                        src={rec.album.images[0]?.url || "default-album.png"}
                                        alt={rec.name}
                                        className="track-image"
                                        key={rec.id}
                                        onClick={() => handlePlayTrack(rec.uri)}
                                        style={{ margin: '10px 0', cursor: 'pointer' }}
                                    // Optionally change the cursor to indicate the image is clickable
                                    />
                                    <div className="track-info">

                                        <Link key={rec.album.id} to={`/album/${rec.album.id}`}>
                                            <span className="name-title" style={{ margin: '10px 0', cursor: 'pointer' }}>
                                                {rec.name}
                                            </span>
                                        </Link>
                                        <p className="track-artists">
                                            {rec.artists.map(artist => (
                                                <Link key={artist.id} to={`/artist/${artist.id}`}>
                                                    <span className="result-name" style={{ cursor: 'pointer' }}>
                                                        {artist.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </p>
                                    </div>
                                    <div className="track-album">{rec.popularity || 'N/A'}</div>
                                    <div className="track-duration">{rec.duration_ms ? formatDuration(rec.duration_ms) : 'Unknown'}</div>
                                    <div onClick={() => handlePlayTrack(rec.uri)} className="play-icona">
                                        <img src={Play} alt="Play" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Top Tracks Section */}
                <div className="cont-a">
                    <div className="top-tracks">
                        <h2 className="popularity">Популярні треки {track.artists.map((artist) => artist.name).join(', ')} </h2>
                        <ul className="tracks-list">
                            {topTracks.map((track, index) => (
                                <li className="track-item"  key={`${track.id}-${index}`} >
                                    <span className="track-index">{index + 1}</span>
                                    <img
                                        src={track.album.images[0]?.url || "default-album.png"}
                                        alt={track.name}
                                        className="track-image"
                                        key={track.id}
                                        onClick={() => handlePlayTrack(track.uri)}
                                    />
                                    <div className="track-info">
                                        <p className="track-name">
                                            <Link to={`/track/${track.id}`}>
                                                <span className="name-title" style={{ margin: '10px 0', cursor: 'pointer' }}>
                                                    {track.name}
                                                </span>
                                            </Link>
                                        </p>
                                    </div>
                                    <div className="track-album">{track.popularity}</div>
                                    <div className="track-duration">{formatDuration(track.duration_ms)}</div>
                                    <div onClick={() => handlePlayAlbum(track.uri)} className="play-icona">
                                        <img src={Play} alt="Play" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Singles Section with Scroll */}
                <h2 className="popularity">Сингли</h2>
                <div className="cont-sa">
                    <div style={{ position: "relative", width: "100%" }}>
                        <img
                            src={leftArrowSingles}
                            alt="Scroll Left"
                            className="img-l"
                            onClick={scrollLeftSingles}
                        />
                        <img
                            src={rightArrowSingles}
                            alt="Scroll Right"
                            className="img-r"
                            onClick={scrollRightSingles}
                        />
                        <div
                            ref={scrollRefSingles}
                            className="music-c"
                            onScroll={updateArrowsSingles}
                        >
                            {singles.map((single) => (
                                <div key={single.id} className="img-container">
                                    <div className="img-content">
                                        <img
                                            src={single.images[0]?.url || "default-single.png"}
                                            alt={single.name}
                                            className="m-5m"
                                        />
                                        <div onClick={() => handlePlayAlbum(single.uri)} className="play-icona">
                                            <img src={Play} alt="Play" />
                                        </div>
                                        <Link key={single.id} to={`/album/${single.id}`}>
                                            <span className='auth' style={{ margin: '10px 0', cursor: 'pointer' }}>
                                                {single.name.length > 16 ? `${single.name.substring(0, 12)}...` : single.name}

                                            </span>
                                        </Link>
                                        <p className="release-date">{single.release_date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <h2 className="popularity">Схожі артисти</h2>
                <div className="cont-sa">
                    <div style={{ position: "relative", width: "100%" }}>
                        <img
                            src={leftArrowRelated}
                            alt="Scroll Left"
                            className="img-l"
                            onClick={scrollLeftRelated}
                        />
                        <img
                            src={rightArrowRelated}
                            alt="Scroll Right"
                            className="img-r"
                            onClick={scrollRightRelated}
                        />
                        <div
                            ref={scrollRefRelated}
                            className="music-c"
                            onScroll={updateArrowsRelated}
                        >
                            {relatedArtists.map((artist) => (
                                <div key={artist.id} className="img-container">
                                    <div className="img-contenta">
                                        <img
                                            src={artist.images[0]?.url || "default-artist.png"}
                                            alt={artist.name}
                                            className="m5m"
                                        />
                                    </div>
                                    <Link to={`/artist/${artist.id}`}>
                                        <div className="play-iconaa" />
                                    </Link>
                                    <Link to={`/artist/${artist.id}`}>
                                        <span className="auth" style={{ margin: '10px 0', cursor: 'pointer' }}>
                                            {artist.name.length > 16 ? `${artist.name.substring(0, 12)}...` : artist.name}
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <Footer />
            </div>

            <div className="player-s">
                <PlayerControls />
            </div>
        </div>
    );
};

export default TrackPage;