import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/Playlists.css';
import BGimage from '../../images/Vector 1.png';
import TopNavigation from '../Navigation/TopNavigation';
import SearchBar from '../Search/SearchBar';
import Default from '../Sidebar/Frame 560.png';
import { useTheme } from '../../services/ThemeContext';

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
    description: string;
    external_urls: { spotify: string };
}

const PlaylistsPage: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const { isDarkMode } = useTheme();
 
    
    useEffect(() => {
        const fetchPlaylists = async () => {
            const token = localStorage.getItem('spotifyAccessToken');
            if (!token) {
                setError('No access token found');
                return;
            }

            try {
                const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.items) {
                    setPlaylists(response.data.items);
                } else {
                    setError('Unexpected response format from Spotify API.');
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setError('Error fetching playlists.');
            }
        };

        fetchPlaylists();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleCreatePlaylist = async () => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const userIdResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userId = userIdResponse.data.id;

            const response = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name: newPlaylistName,
                    description: newPlaylistDescription,
                    public: !isPrivate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const newPlaylistId = response.data.id;

            if (uploadedImage) {
                const base64Image = await convertImageToBase64(uploadedImage);
                await axios.put(
                    `https://api.spotify.com/v1/playlists/${newPlaylistId}/images`,
                    base64Image,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'image/jpeg',
                        },
                    }
                );
            }

            setPlaylists((prevPlaylists) => [response.data, ...prevPlaylists]);
            setSuccessMessage('Playlist created successfully!');
            setNewPlaylistName('');
            setNewPlaylistDescription('');
            setIsPrivate(false);
            setUploadedImage(null);
            setShowModal(false); // Close the modal after creating the playlist
        } catch (error) {
            console.error('Error creating playlist:', error);
            setError('Failed to create playlist.');
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className='search-p'><SearchBar /></div>
            <div className='search-i'><TopNavigation  /></div>

            <div className="search-results-container-p">
                <div className="bg-img-p"><img src={BGimage} alt="background" /></div>
                <div className="results-container-p">
                    <button className='button-m' onClick={openModal}>Create Playlist</button>

                    <h2 className='margine'>Your Playlists</h2>
                    <div className="music-c-c-p" >
                        {playlists.map((playlist) => (
                            <div key={playlist.id} className="marg-c-p">
                                <img
                                    src={playlist.images?.[0]?.url || Default}
                                    alt={playlist.name}
                                    className="marg-c-p"
                                />
                                <p style={{ fontSize: 'small', color: '#666' }}>
                                    {playlist.description.length > 16 ? `${playlist.description.substring(0, 12)}...` : playlist.description}
                                </p>
                                
                                    <Link to={`/playlist/${playlist.id}`}>
                                    <p className="auth-p">
                                    {playlist.name}
                                    </p>
                                    </Link>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-modal-btn" onClick={closeModal}>✕</button>
                        <h2 >Create a New Playlist</h2>
                        <input
                            className='input-f'
                            type="text"
                            placeholder="Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                        <textarea
                            placeholder="Playlist Description"
                            value={newPlaylistDescription}
                            onChange={(e) => setNewPlaylistDescription(e.target.value)}

                        />
                        <label className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={() => setIsPrivate(!isPrivate)}
                                className="checkbox-input"
                            />
                           
                        </label>

                        <input className='button-f-f' type="file" accept="image/*" onChange={handleImageUpload} />
                        <button className='button-f' onClick={handleCreatePlaylist}>Create Playlist</button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistsPage;
